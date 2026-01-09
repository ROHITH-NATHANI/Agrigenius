let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
let currentAbortController: AbortController | null = null;
let currentRequestId = 0;

export const stopTTS = () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
    }

    if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
    }
};

export const playTTS = async (text: string, langCode?: string): Promise<void> => {
    // Stop any currently playing audio first
    stopTTS();

    const requestId = ++currentRequestId;
    currentAbortController = new AbortController();

    // Use relative path - standard for Vercel deployments (and proxied locally)
    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, lang: langCode }),
            signal: currentAbortController.signal,
        });

        // A newer request started while this one was in-flight.
        if (requestId !== currentRequestId) return;

        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(details || `TTS Server Error (${response.status})`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('audio/')) {
            const details = await response.text().catch(() => '');
            throw new Error(details || 'TTS Server did not return audio');
        }

        const blob = await response.blob();

        // A newer request started while we were downloading.
        if (requestId !== currentRequestId) return;

        currentObjectUrl = URL.createObjectURL(blob);
        currentAudio = new Audio(currentObjectUrl);

        // Clean up when done
        currentAudio.onended = () => {
            stopTTS();
        };

        await currentAudio.play();
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            // Expected when user clicks speaker multiple times quickly.
            return;
        }
        console.error('TTS Failed:', error);
        alert('Failed to play audio. Make sure "python tts_server.py" is running (port 5000).');
    }
};
