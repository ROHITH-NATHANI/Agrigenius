<div align="center">
  
  
  # AgriGenius
  
  <h3>Intelligent Agricultural Guidance System</h3>

  <p>
    <strong>Real-world farming advice, scientifically backed, and voice-enabled for the field.</strong>
  </p>
</div>

---

## 🌾 Overview

**AgriGenius** is a state-of-the-art agricultural support platform designed to bridge the gap between scientific knowledge and field application. Built for farmers, agronomists, and researchers, it provides accurate, location-specific guidance on crop management, pest control, soil health, and weather patterns.

Unlike generic chatbots, AgriGenius focuses on **verified, actionable advice**, citing reputable sources like ICAR and State Agricultural Universities to ensure trust and reliability.

## ✨ Key Features

### 🗣️ Voice-First Interface
Designed for accessibility in the field:
- **Speech-to-Text (STT):** Ask questions naturally in your native language.
- **Text-to-Speech (TTS):** Listen to answers while working, with support for local dialects.

### 🌏 Multilingual Support
Breaking language barriers with full support for 10+ Indian languages:
- **English, Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்)**
- **Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi**

### 📚 Verified References
Every piece of advice comes with credibility. AgriGenius aggregates and displays **citations from trusted agricultural institutions** (ICAR, TNAU, PJTSAU, etc.) alongside its answers, ensuring you can verify the information.

### 🛡️ Real-World Reliability
- **Crop Diagnostics:** Identify pests and diseases with detailed descriptions.
- **Soil & Fertilizer Logic:** Get calculated recommendations based on soil type.
- **Weather Integration:** Planning advice based on local conditions.

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **AI Engine:** Google Gemini Models (Server-side integration)
- **Backend:** Python (Flask/Serverless)
- **Voice Services:** Web Speech API (STT) & gTTS (TTS) with LRU Caching
- **Deployment:** Vercel / Edge Ready

## 🚀 Getting Started

Follow these steps to set up AgriGenius locally.

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Gemini API Key** (from Google AI Studio)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HVVSATHWIK/AgriGenius.git
   cd AgriGenius
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   Create a `.env` file or set the environment variable directly:
   ```bash
   # Linux/Mac
   export AGRIGENIUS_TOKEN="your_gemini_api_key_here"
   
   # Windows (PowerShell)
   $env:AGRIGENIUS_TOKEN="your_gemini_api_key_here"
   ```

5. **Start the Application**
   You need to run both the backend server and the frontend client.

   **Terminal 1 (Backend):**
   ```bash
   python tts_server.py
   ```

   **Terminal 2 (Frontend):**
   ```bash
   npm run dev
   ```

6. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📸 Screenshots

| Chat Interface | Voice Interaction |
|:---:|:---:|
| *Real-time guidance with references* | *Hands-free voice commands* |
| ![Chat Interface](https://via.placeholder.com/400x200?text=Chat+Interface+Preview) | ![Voice Mode](https://via.placeholder.com/400x200?text=Voice+Mode+Preview) |

---

<div align="center">
  <p>Developed with ❤️ for the Farming Community</p>
</div>
