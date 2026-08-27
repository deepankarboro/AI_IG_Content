# 🦙 Local LLMs & Inference Engines

Curated open-source repositories to run large language models locally on your CPU, Apple Silicon, or NVIDIA GPUs without subscriptions or sending data to third parties.

---

### 1. [Ollama](https://github.com/ollama/ollama)
> Get up and running with large language models locally (Llama 3, Mistral, DeepSeek, Gemma, Phi-3).

- **Replaces:** OpenAI API / Anthropic Subscriptions
- **Official Repo:** [ollama/ollama](https://github.com/ollama/ollama)
- **License:** MIT
- **Best For:** Quickest way to run local LLMs on macOS, Linux, and Windows with a single CLI command.

#### 💻 One-Click Install
```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows (Powershell)
# Download installer from https://ollama.com/download
```

#### 🚀 Instant Run Commands
```bash
# Run Llama 3.1 8B instantly
ollama run llama3.1

# Run DeepSeek-Coder for coding assistance
ollama run deepseek-coder

# Run lightweight model for low-spec laptops
ollama run phi3
```

#### 🐍 Python Integration
```python
import ollama

response = ollama.chat(model='llama3.1', messages=[
  {'role': 'user', 'content': 'Explain quantum computing in 2 sentences.'}
])
print(response['message']['content'])
```

---

### 2. [Open WebUI](https://github.com/open-webui/open-webui)
> User-friendly, self-hosted AI interface for Ollama, OpenAI-compatible APIs, and local models.

- **Replaces:** ChatGPT Plus ($20/mo) / Claude Pro Web UI
- **Official Repo:** [open-webui/open-webui](https://github.com/open-webui/open-webui)
- **License:** MIT
- **Best For:** Full ChatGPT-like interface running in your browser with RAG (document uploads), voice chat, and model switching.

#### 💻 One-Click Run (Docker)
```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```
> Access in browser at `http://localhost:3000`

---

### 3. [vLLM](https://github.com/vllm-project/vllm)
> High-throughput and memory-efficient LLM serving engine.

- **Replaces:** Together AI / Fireworks AI / High-cost hosted inference endpoints
- **Official Repo:** [vllm-project/vllm](https://github.com/vllm-project/vllm)
- **License:** Apache-2.0
- **Best For:** Serving LLMs at scale with PagedAttention (up to 24x higher throughput than HuggingFace).

#### 💻 One-Click Install & Serve
```bash
pip install vllm

# Start an OpenAI-compatible API server
vllm serve meta-llama/Meta-Llama-3-8B-Instruct --port 8000
```
