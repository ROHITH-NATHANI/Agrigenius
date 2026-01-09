from flask import Flask, request, send_file
from flask_cors import CORS
from gtts import gTTS
import io
import re
from collections import OrderedDict
import os
import json

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    # Optional; only needed for local dev
    pass

try:
    import google.generativeai as genai
except Exception:
    genai = None

app = Flask(__name__)
CORS(app)

# Simple in-memory LRU cache (best-effort; resets on restart)
_AUDIO_CACHE: "OrderedDict[tuple[str, str], bytes]" = OrderedDict()
_AUDIO_CACHE_MAX = 64


def _get_gemini_api_key() -> str | None:
    return os.environ.get("AGRIGENIUS_TOKEN")


def _prompt_from_history(system_instruction: str, history: list, message: str) -> str:
    parts: list[str] = []
    if system_instruction:
        parts.append(system_instruction.strip())

    for item in history or []:
        try:
            role = str(item.get("role", "")).strip().lower()
            content = str(item.get("content", "")).strip()
        except Exception:
            continue

        if not content:
            continue

        if role == "assistant":
            role_label = "ASSISTANT"
        elif role == "system":
            role_label = "SYSTEM"
        else:
            role_label = "USER"

        parts.append(f"{role_label}: {content}")

    parts.append(f"USER: {message.strip()}")
    parts.append("ASSISTANT:")
    return "\n\n".join(parts)


def _extract_json_object(text: str) -> dict | None:
    if not text:
        return None

    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if len(lines) >= 3:
            cleaned = "\n".join(lines[1:-1]).strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    candidate = cleaned[start : end + 1]
    try:
        value = json.loads(candidate)
        return value if isinstance(value, dict) else None
    except Exception:
        return None


def _normalize_references(refs: object) -> list[dict]:
    if not isinstance(refs, list):
        return []

    normalized: list[dict] = []
    for item in refs:
        if not isinstance(item, dict):
            continue
        title = str(item.get("title") or "").strip()
        url = str(item.get("url") or "").strip()
        if not title and not url:
            continue
        normalized.append({"title": title, "url": url})
    return normalized[:8]


@app.route('/api/gemini', methods=['POST'])
def gemini_endpoint():
    data = request.get_json(silent=True) or {}
    message = (data.get('message') or '').strip()
    system_instruction = (data.get('systemInstruction') or '').strip()
    history = data.get('history') or []

    if not message:
        return {"error": "No message provided"}, 400

    api_key = _get_gemini_api_key()
    if not api_key:
        return {"error": "AGRIGENIUS_TOKEN is not set on the server"}, 500

    if genai is None:
        return {"error": "Server is missing google-generativeai dependency"}, 500

    try:
        genai.configure(api_key=api_key)
        model_name = (data.get('model') or 'gemini-2.5-flash').strip()
        temperature = data.get('temperature')
        try:
            temperature = float(temperature) if temperature is not None else 0.6
        except Exception:
            temperature = 0.6

        prompt = _prompt_from_history(system_instruction, history, message)
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(
            prompt,
            generation_config={"temperature": temperature},
        )

        raw_text = getattr(response, 'text', None) or ''

        parsed = _extract_json_object(raw_text)
        if parsed and isinstance(parsed.get("answer"), str):
            answer = parsed.get("answer")
            references = _normalize_references(parsed.get("references"))
            return {"text": answer, "references": references}

        return {"text": raw_text, "references": []}
    except Exception as e:
        print(f"Gemini error: {e}")
        return {"error": str(e)}, 500

def clean_text(text):
    # Remove markdown bold/italic (** or *)
    text = re.sub(r'\*\*|__|\*|_', '', text)
    # Remove headers (##)
    text = re.sub(r'#+\s', '', text)
    # Remove links [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    # Remove code blocks
    text = re.sub(r'`[^`]*`', '', text)
    return text

def detect_language(text):
    # Check for Telugu Unicode range (0C00–0C7F)
    if re.search(r'[\u0C00-\u0C7F]', text):
        return 'te'
    return 'en'

@app.route('/tts', methods=['POST'])
@app.route('/api/tts', methods=['POST'])
def tts_endpoint():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '')

    requested_lang = (data.get('lang') or '').strip() or None
    
    # Auto-detect language if not strictly provided or if mixed
    # We prioritize Telugu if any characters are present because 
    # the Telugu voice can usually read English words too.
    lang = requested_lang or detect_language(text)
    
    # Cleaning
    clean_content = clean_text(text)
    
    cache_key = (lang, clean_content)
    if cache_key in _AUDIO_CACHE:
        _AUDIO_CACHE.move_to_end(cache_key)
        mp3_bytes = _AUDIO_CACHE[cache_key]
        mp3_fp = io.BytesIO(mp3_bytes)
        mp3_fp.seek(0)
        return send_file(
            mp3_fp,
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name="tts.mp3"
        )

    print(f"Generating TTS for: {clean_content[:20]}... | Lang: {lang}")
    
    try:
        if not clean_content:
            return "No text provided", 400
            
        # Generate audio using Google Text-to-Speech
        tts = gTTS(text=clean_content, lang=lang)
        
        # Save to memory buffer
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_bytes = mp3_fp.getvalue()

        _AUDIO_CACHE[cache_key] = mp3_bytes
        _AUDIO_CACHE.move_to_end(cache_key)
        while len(_AUDIO_CACHE) > _AUDIO_CACHE_MAX:
            _AUDIO_CACHE.popitem(last=False)

        mp3_fp = io.BytesIO(mp3_bytes)
        mp3_fp.seek(0)
        
        return send_file(
            mp3_fp,
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name="tts.mp3"
        )
    except Exception as e:
        print(f"Error: {e}")
        return str(e), 500

if __name__ == '__main__':
    print("TTS Server running on http://localhost:5000")
    app.run(port=5000, debug=True)
