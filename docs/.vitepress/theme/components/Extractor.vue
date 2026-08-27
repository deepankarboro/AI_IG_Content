<template>
  <div class="extractor-container">
    <div class="extractor-card">
      <div class="header-section">
        <h2>⚡ Social Media AI Extractor</h2>
        <p class="subtitle">
          Paste an Instagram post or YouTube video URL. We'll extract the hidden GitHub repos, tools, and prompts into copy-pasteable Markdown cards.
        </p>
      </div>

      <!-- Star Banner -->
      <div class="star-callout">
        <span>⭐ Finding this hub helpful? Support our open-source ranking:</span>
        <a href="https://github.com/deepankarboro/AI_IG_Content" target="_blank" rel="noopener noreferrer" class="star-link-btn">
          ⭐ Star on GitHub
        </a>
      </div>

      <div class="form-group">
        <label for="url-input">🔗 Instagram / YouTube URL:</label>
        <input 
          id="url-input"
          v-model="url" 
          type="url" 
          placeholder="https://www.instagram.com/p/DcazvEFDUl0/ or YouTube Link"
          class="custom-input"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="text-input">📝 Post Caption / Notes (Optional or Fallback for images):</label>
        <textarea 
          id="text-input"
          v-model="rawText" 
          rows="3" 
          placeholder="If the post is a private carousel or photo, paste any captions, comments, or OCR text here..."
          class="custom-textarea"
          :disabled="loading"
        ></textarea>
      </div>

      <!-- BYOK Collapsible -->
      <details class="byok-details">
        <summary>⚙️ Custom API Key Settings (Optional)</summary>
        <div class="byok-body">
          <p class="byok-hint">
            By default, we use the host's free Gemini quota. If you'd like to use your own free key (from <a href="https://aistudio.google.com/" target="_blank">Google AI Studio</a>), enter it here. It is saved only in your browser.
          </p>
          <input 
            v-model="userApiKey" 
            type="password" 
            placeholder="AIzaSy..." 
            class="custom-input key-input"
            @change="saveApiKey"
          />
        </div>
      </details>

      <button 
        class="extract-btn" 
        :disabled="loading || (!url && !rawText)" 
        @click="handleExtract"
      >
        <span v-if="loading">⏳ Extracting & Formatting...</span>
        <span v-else>🚀 Extract Copy-Ready Cards</span>
      </button>

      <!-- Quota Exceeded Modal / Alert -->
      <div v-if="quotaExceeded" class="quota-banner">
        <h3>⚠️ Host's Daily Free Limit Reached</h3>
        <p>
          The host's daily free Gemini quota has reached its limit for today. You can still use this tool in two easy ways:
        </p>

        <div class="quota-options">
          <div class="quota-option-card">
            <h4>1️⃣ Enter Your Free Gemini Key</h4>
            <p>Get a 100% free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a> and paste it above in <b>Custom API Key Settings</b>.</p>
          </div>

          <div class="quota-option-card">
            <h4>2️⃣ Clone & Run Locally (Zero Cost)</h4>
            <p>Clone the repository and run the extractor locally using Python with your own LLM or Ollama:</p>
            <div class="code-box">
              <code>git clone https://github.com/deepankarboro/AI_IG_Content.git</code>
            </div>
          </div>
        </div>

        <div class="star-prompt">
          <p>🌟 If you enjoy this open-source tool, please leave a star on GitHub—it helps us keep the free tier running!</p>
          <a href="https://github.com/deepankarboro/AI_IG_Content" target="_blank" rel="noopener noreferrer" class="star-link-btn large">
            ⭐ Star deepankarboro/AI_IG_Content
          </a>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage && !quotaExceeded" class="error-banner">
        ❌ {{ errorMessage }}
      </div>

      <!-- Result Output Section -->
      <div v-if="resultMarkdown" class="result-section">
        <div class="result-header">
          <h3>📋 Extracted Markdown Result</h3>
          <button class="copy-btn" @click="copyResult">
            {{ copied ? '✅ Copied!' : '📋 Copy All Markdown' }}
          </button>
        </div>
        <pre class="markdown-preview"><code>{{ resultMarkdown }}</code></pre>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const url = ref('')
const rawText = ref('')
const userApiKey = ref('')
const loading = ref(false)
const errorMessage = ref('')
const quotaExceeded = ref(false)
const resultMarkdown = ref('')
const copied = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    userApiKey.value = localStorage.getItem('user_gemini_api_key') || ''
  }
})

function saveApiKey() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_gemini_api_key', userApiKey.value.trim())
  }
}

async function handleExtract() {
  loading.value = true
  errorMessage.value = ''
  quotaExceeded.value = false
  resultMarkdown.value = ''

  try {
    const res = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url.value.trim(),
        rawText: rawText.value.trim(),
        userApiKey: userApiKey.value.trim() || undefined
      })
    })

    const data = await res.json()

    if (res.status === 429 || data.quotaExceeded) {
      quotaExceeded.value = true
      return
    }

    if (!res.ok || data.error) {
      errorMessage.value = data.error || 'Failed to extract content.'
      return
    }

    resultMarkdown.value = data.markdown
  } catch (err) {
    errorMessage.value = 'Failed to connect to the extraction service: ' + err.message
  } finally {
    loading.value = false
  }
}

function copyResult() {
  if (!resultMarkdown.value) return
  navigator.clipboard.writeText(resultMarkdown.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2500)
}
</script>

<style scoped>
.extractor-container {
  margin: 2rem 0;
}

.extractor-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.header-section h2 {
  margin-top: 0;
  color: var(--vp-c-brand-1);
}

.subtitle {
  color: var(--vp-c-text-2);
  margin-bottom: 1.25rem;
}

.star-callout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.star-link-btn {
  background: #eab308;
  color: #000 !important;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none !important;
  transition: opacity 0.2s;
}

.star-link-btn:hover {
  opacity: 0.9;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.custom-input, .custom-textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  box-sizing: border-box;
}

.custom-input:focus, .custom-textarea:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.byok-details {
  margin: 1rem 0;
  background: var(--vp-c-bg-mute);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.byok-body {
  margin-top: 0.5rem;
}

.byok-hint {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.extract-btn {
  width: 100%;
  background: var(--vp-c-brand-1);
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: filter 0.2s;
  margin-top: 0.5rem;
}

.extract-btn:hover:not(:disabled) {
  filter: brightness(1.1);
}

.extract-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.quota-banner {
  margin-top: 1.5rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 1.25rem;
  border-radius: 8px;
}

.quota-banner h3 {
  color: #ef4444;
  margin-top: 0;
}

.quota-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

@media (max-width: 640px) {
  .quota-options {
    grid-template-columns: 1fr;
  }
}

.quota-option-card {
  background: var(--vp-c-bg);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
}

.quota-option-card h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.code-box {
  background: var(--vp-c-bg-mute);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  overflow-x: auto;
}

.star-prompt {
  text-align: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed rgba(239, 68, 68, 0.3);
}

.star-link-btn.large {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.error-banner {
  margin-top: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

.result-section {
  margin-top: 1.5rem;
  border-top: 1px solid var(--vp-c-border);
  padding-top: 1.25rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.result-header h3 {
  margin: 0;
}

.copy-btn {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.markdown-preview {
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
}
</style>
