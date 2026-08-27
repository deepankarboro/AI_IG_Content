# 🎙️ Speech & Audio AI Repositories

Open-source alternatives for automatic speech recognition (ASR), multi-language transcription, voice cloning, and audio processing.

---

### 1. [OpenAI Whisper](https://github.com/openai/whisper)
> Robust Speech Recognition via Large-Scale Weak Supervision with support for 99+ languages.

- **Replaces:** Otter.ai ($16/mo) / Descript ($24/mo) / Rev.com ($1.50/min)
- **Official Repo:** [openai/whisper](https://github.com/openai/whisper)
- **License:** MIT
- **Best For:** Accurate speech-to-text transcription and automatic subtitle (.srt / .vtt) generation.

#### 💻 One-Click Install
```bash
# Requires ffmpeg installed: (brew install ffmpeg / sudo apt install ffmpeg)
pip install -U openai-whisper
```

#### 🚀 Instant Transcription Commands
```bash
# Transcribe an audio file and output TXT, SRT, VTT
whisper audio.mp3 --model medium

# Transcribe non-English speech and translate directly to English text
whisper foreign_audio.mp3 --model base --task translate
```

---

### 2. [faster-whisper](https://github.com/SYSTRAN/faster-whisper)
> Up to 4x faster Whisper reimplementation using CTranslate2 with lower memory usage.

- **Replaces:** Heavy GPU requirements for speech transcription
- **Official Repo:** [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- **License:** MIT
- **Best For:** Ultra-fast batch transcription on standard CPUs and small GPUs.

#### 🐍 Copyable Python Snippet
```python
from faster_whisper import WhisperModel

model = WhisperModel("small", device="cpu", compute_type="int8")
segments, info = model.transcribe("meeting_recording.mp3", beam_size=5)

for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
```
