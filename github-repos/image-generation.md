# 🎨 Image & Media Generation Repositories

Curated open-source repositories for local AI image synthesis, photo editing, and media downloading tools that replace expensive monthly subscriptions.

---

### 1. [Fooocus](https://github.com/lllyasviel/Fooocus)
> Offline AI image generation software based on SDXL, combining the simplicity of Midjourney with the offline power of Stable Diffusion.

- **Replaces:** Midjourney ($10-$60/mo) / DALL-E 3
- **Official Repo:** [lllyasviel/Fooocus](https://github.com/lllyasviel/Fooocus)
- **License:** GPL-3.0
- **Best For:** High quality photorealistic & anime AI image generation with zero complex prompting required.

#### 💻 One-Click Setup
```bash
# Clone the repository
git clone https://github.com/lllyasviel/Fooocus.git
cd Fooocus

# Create environment & install dependencies
conda create -n fooocus python=3.10 -y
conda activate fooocus
pip install -r requirements_versions.txt

# Launch web interface
python entry_with_update.py
```

---

### 2. [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
> The most powerful and modular visual node-based GUI for Stable Diffusion, Flux, and SDXL.

- **Replaces:** Proprietary AI studio suites
- **Official Repo:** [comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI)
- **License:** GPL-3.0
- **Best For:** Advanced workflows (ControlNet, Inpainting, Flux.1, Video Generation via Animatediff).

#### 💻 One-Click Setup
```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
python main.py
```

---

### 3. [yt-dlp](https://github.com/yt-dlp/yt-dlp)
> Feature-rich command-line audio/video downloader for YouTube and hundreds of other sites.

- **Replaces:** Paid video downloaders & converter software
- **Official Repo:** [yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp)
- **License:** Unlicense
- **Best For:** Extracting datasets, video clips, and audio for AI training or offline viewing.

#### 💻 Quick Commands
```bash
# Install via pip or brew
pip install yt-dlp
# or: brew install yt-dlp

# Download best quality video
yt-dlp "https://www.youtube.com/watch?v=VIDEO_ID"

# Extract audio only as MP3 (ideal for Whisper AI transcribing)
yt-dlp -x --audio-format mp3 "https://www.youtube.com/watch?v=VIDEO_ID"
```
