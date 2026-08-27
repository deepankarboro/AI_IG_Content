#!/usr/bin/env python3
"""
⚡ Byte-Sized AI & Open-Source Hub - Local Extractor Script
Extract AI repositories, tools, and prompts from Instagram / YouTube URLs or raw text.
Supports: Local Ollama (100% Free / Offline), Google Gemini API, or OpenAI API.
"""

import sys
import os
import json
import urllib.request
import re

SYSTEM_PROMPT = """You are an expert AI & Open-Source Content Curator. 
Analyze the provided content (from an Instagram/YouTube post) and extract all featured GitHub repositories, AI tools, libraries, or prompt templates.

Convert each item into our standardized copy-paste-ready Markdown card schema:

### 🛠️ [Tool Name](https://github.com/owner/repo)
> **Tagline / 1-Sentence Purpose**

- **Category:** Local LLMs | Image Gen | Audio/Speech | Automation | Dev Tools | Prompts
- **Replaces:** [Paid tool it replaces, e.g. Midjourney / Zapier / OpenAI]
- **Official Repo:** [owner/repo](https://github.com/owner/repo)

#### 💻 One-Click Install / Run
```bash
# exact CLI install / run command
```

#### 📌 Quick Usage Snippet
```text
# quick starter snippet or prompt
```

---
Ensure the output is clean Markdown without chat fluff.
"""

def extract_metadata(url):
    print(f"[*] Fetching metadata from: {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            desc = re.search(r'<meta\s+(?:property|name)=["\'](?:og:description|description)["\']\s+content=["\'](.*?)["\']', html, re.I)
            title = re.search(r'<meta\s+(?:property|name)=["\'](?:og:title|title)["\']\s+content=["\'](.*?)["\']', html, re.I)
            meta = ""
            if title: meta += f"Title: {title.group(1)}\n"
            if desc: meta += f"Description: {desc.group(1)}\n"
            return meta
    except Exception as e:
        print(f"[!] Warning: Could not fetch URL automatically ({e}).")
        return ""

def query_gemini(content, api_key):
    print("[*] Processing with Google Gemini Flash...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": f"{SYSTEM_PROMPT}\n\nInput Content:\n{content}"}]}]
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        return data['candidates'][0]['content']['parts'][0]['text']

def query_ollama(content, model="llama3.1"):
    print(f"[*] Processing locally with Ollama ({model})...")
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": f"{SYSTEM_PROMPT}\n\nInput Content:\n{content}",
        "stream": False
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        return data['response']

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python scripts/extract.py <URL_or_Text>")
        print("\nExamples:")
        print('  python scripts/extract.py "https://www.instagram.com/p/DcazvEFDUl0/"')
        print('  python scripts/extract.py "10 best github repos for local AI: Ollama, Fooocus, Whisper..."')
        sys.exit(1)

    input_data = sys.argv[1]
    content = ""
    if input_data.startswith("http://") or input_data.startswith("https://"):
        meta = extract_metadata(input_data)
        content = f"Source URL: {input_data}\n{meta}"
    else:
        content = input_data

    # Check available backend
    gemini_key = os.environ.get("GEMINI_API_KEY")
    result = ""

    if gemini_key:
        result = query_gemini(content, gemini_key)
    else:
        try:
            # Default to local Ollama if no API key is provided
            result = query_ollama(content)
        except Exception as e:
            print("[!] Ollama is not running locally. Please set GEMINI_API_KEY or start Ollama:")
            print("    export GEMINI_API_KEY=\"your-free-key\"")
            print("    or run: ollama run llama3.1")
            sys.exit(1)

    print("\n" + "="*50)
    print("✨ EXTRACTED COPY-PASTE MARKDOWN CARDS:")
    print("="*50 + "\n")
    print(result)

if __name__ == "__main__":
    main()
