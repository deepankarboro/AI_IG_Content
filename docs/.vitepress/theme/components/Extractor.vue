<template>
  <div class="extractor-container">
    <div class="extractor-card">
      <div class="header-section">
        <h2>⚡ Social Media AI Extractor</h2>
        <p class="subtitle">
          Extract hidden GitHub repos, tools, and prompts from Instagram carousels & YouTube videos into copy-pasteable Markdown cards.
        </p>
      </div>

      <!-- Top Quota & Star Banner -->
      <div class="top-status-bar">
        <div class="quota-pill" :class="{ 'quota-exhausted': isHostQuotaExhausted }">
          <span v-if="userApiKey.trim()">⚡ Unlimited Extractions (Using Your API Key)</span>
          <span v-else>🎟️ Daily Quota: <b>{{ remainingQuota }} / 3</b> extractions remaining today</span>
        </div>

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
          placeholder="If the post is a private carousel or image post, paste any caption text or OCR notes here..."
          class="custom-textarea"
          :disabled="loading"
        ></textarea>
      </div>

      <!-- BYOK Collapsible -->
      <details class="byok-details" :open="isHostQuotaExhausted">
        <summary>⚙️ Custom API Key Settings (Unlimited Extractions)</summary>
        <div class="byok-body">
          <p class="byok-hint">
            Get a 100% free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>. Keys entered here are stored <b>only in your browser</b> and bypass the 3/day device limit.
          </p>
          <input 
            v-model="userApiKey" 
            type="password" 
            placeholder="Paste your Gemini Key (AIzaSy...)" 
            class="custom-input key-input"
            @input="saveApiKey"
          />
        </div>
      </details>

      <button 
        class="extract-btn" 
        :disabled="loading || (!url && !rawText) || (isHostQuotaExhausted && !userApiKey.trim())" 
        @click="handleExtract"
      >
        <span v-if="loading">⏳ Extracting & Formatting with AI...</span>
        <span v-else-if="isHostQuotaExhausted && !userApiKey.trim()">🛑 Daily 3/3 Limit Reached (See Below)</span>
        <span v-else>🚀 Extract Copy-Ready Cards</span>
      </button>

      <!-- Quota Exceeded Modal / Alert -->
      <div v-if="isHostQuotaExhausted && !userApiKey.trim()" class="quota-banner">
        <h3>🛑 Daily Limit Reached (3 / 3 Used)</h3>
        <p>
          You've used all <b>3 free extractions</b> for today on this device. You can keep extracting immediately using one of these options:
        </p>

        <div class="quota-options">
          <div class="quota-option-card">
            <h4>1️⃣ Enter Your Free Gemini Key (Instant)</h4>
            <p>Get your free key in 30 seconds from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a> and paste it above to unlock <b>unlimited extractions</b>.</p>
          </div>

          <div class="quota-option-card">
            <h4>2️⃣ Clone & Run Locally (Zero Cost)</h4>
            <p>Run the extractor locally with Python and your own LLM or Ollama:</p>
            <div class="code-box">
              <code>git clone https://github.com/deepankarboro/AI_IG_Content.git</code>
            </div>
          </div>
        </div>

        <div class="star-prompt">
          <p>🌟 <b>Enjoying this tool?</b> Please leave a star on GitHub — every star boosts our ranking and helps us keep this free for everyone!</p>
          <a href="https://github.com/deepankarboro/AI_IG_Content" target="_blank" rel="noopener noreferrer" class="star-link-btn large">
            ⭐ Star deepankarboro/AI_IG_Content
          </a>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-banner">
        ❌ {{ errorMessage }}
      </div>

      <!-- Result Output Section -->
      <div v-if="resultMarkdown" class="result-section">
        <div class="result-header">
          <h3>📋 Extracted Markdown Result</h3>
          <button class="copy-btn" @click="copyResult">
            {{ copied ? '✅ Copied to Clipboard!' : '📋 Copy All Markdown' }}
          </button>
        </div>
        <pre class="markdown-preview"><code>{{ resultMarkdown }}</code></pre>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const url = ref('')
const rawText = ref('')
const userApiKey = ref('')
const loading = ref(false)
const errorMessage = ref('')
const resultMarkdown = ref('')
const copied = ref(false)
const dailyCount = ref(0)
const deviceFingerprint = ref('')

const MAX_DAILY_FREE = 3

const remainingQuota = computed(() => {
  return Math.max(0, MAX_DAILY_FREE - dailyCount.value)
})

const isHostQuotaExhausted = computed(() => {
  return !userApiKey.value.trim() && remainingQuota.value <= 0
})

function getTodayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function generateDeviceFingerprint() {
  if (typeof window === 'undefined') return 'server'
  try {
    const nav = window.navigator
    const screen = window.screen
    const raw = [
      nav.userAgent,
      nav.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      nav.hardwareConcurrency || 'unk',
      nav.deviceMemory || 'unk'
    ].join('###')

    // Simple robust hash
    let hash = 0
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i)
      hash |= 0
    }
    return 'dev_' + Math.abs(hash).toString(36)
  } catch (e) {
    return 'dev_fallback_' + Math.random().toString(36).substring(2, 9)
  }
}

function loadDailyQuota() {
  if (typeof window === 'undefined') return
  const today = getTodayString()
  const savedDate = localStorage.getItem('ai_extract_date')
  const savedCount = parseInt(localStorage.getItem('ai_extract_count') || '0', 10)

  if (savedDate !== today) {
    localStorage.setItem('ai_extract_date', today)
    localStorage.setItem('ai_extract_count', '0')
    dailyCount.value = 0
  } else {
    dailyCount.value = savedCount
  }
}

function incrementDailyQuota() {
  if (typeof window === 'undefined') return
  const today = getTodayString()
  const current = parseInt(localStorage.getItem('ai_extract_count') || '0', 10) + 1
  localStorage.setItem('ai_extract_date', today)
  localStorage.setItem('ai_extract_count', current.toString())
  dailyCount.value = current
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    userApiKey.value = localStorage.getItem('user_gemini_api_key') || ''
    deviceFingerprint.value = generateDeviceFingerprint()
    loadDailyQuota()
  }
})

function saveApiKey() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_gemini_api_key', userApiKey.value.trim())
  }
}

async function handleExtract() {
  if (isHostQuotaExhausted.value && !userApiKey.value.trim()) {
    return
  }

  loading.value = true
  errorMessage.value = ''
  resultMarkdown.value = ''

  try {
    const res = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url.value.trim(),
        rawText: rawText.value.trim(),
        userApiKey: userApiKey.value.trim() || undefined,
        deviceFingerprint: deviceFingerprint.value
      })
    })

    const data = await res.json()

    if (res.status === 429 || data.quotaExceeded) {
      dailyCount.value = MAX_DAILY_FREE
      localStorage.setItem('ai_extract_count', MAX_DAILY_FREE.toString())
      errorMessage.value = data.message || 'Daily free extraction limit reached.'
      return
    }

    if (!res.ok || data.error) {
      errorMessage.value = data.error || 'Failed to extract content.'
      return
    }

    resultMarkdown.value = data.markdown

    // Only increment host free count if user didn't use their own key
    if (!userApiKey.value.trim()) {
      incrementDailyQuota()
    }

  } catch (err) {
    errorMessage.value = 'Failed to connect to extraction service: ' + err.message
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
  margin: 1.5rem 0;
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

.top-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-border);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.quota-pill {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.quota-pill.quota-exhausted {
  color: #ef4444;
}

.star-link-btn {
  background: #eab308;
  color: #000 !important;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none !important;
  transition: opacity 0.2s;
  display: inline-flex;
  align-items: center;
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
