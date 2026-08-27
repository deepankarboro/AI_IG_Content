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
          <span v-else-if="isBannedForUnstar" class="banned-text">🚫 Daily Host Quota Suspended (Star Rollback Detected)</span>
          <span v-else>
            🎟️ Daily Quota: <b>{{ remainingQuota }} / {{ maxDailyLimit }}</b> extractions remaining today
            <span v-if="hasStarBonus" class="star-badge">⭐ Star Bonus Active (+3)</span>
          </span>
        </div>

        <div class="top-actions">
          <button 
            v-if="!hasStarBonus && !userApiKey.trim() && !isBannedForUnstar" 
            class="claim-star-btn"
            @click="showStarModal = true"
          >
            ⭐ Get +3 More Credits
          </button>
          <a 
            href="https://github.com/deepankarboro/AI_IG_Content" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="star-link-btn"
          >
            ⭐ View GitHub
          </a>
        </div>
      </div>

      <!-- Banned Banner for Unstarring -->
      <div v-if="isBannedForUnstar" class="banned-banner">
        <h3>🚫 Free Access Suspended (Star Removed)</h3>
        <p>
          Our system detected that the GitHub repository was <b>unstarred</b> after claiming bonus credits. To prevent gaming, host free credits are disabled for this device.
        </p>
        <div class="banned-options">
          <button class="verify-btn" @click="showStarModal = true">
            🔄 Restore Star & Re-Verify Account
          </button>
          <span class="or-text">or use your own Free Gemini API Key below</span>
        </div>
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
      <details class="byok-details" :open="isHostQuotaExhausted || isBannedForUnstar">
        <summary>⚙️ Custom API Key Settings (Unlimited Extractions)</summary>
        <div class="byok-body">
          <p class="byok-hint">
            Get a 100% free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>. Keys entered here are stored <b>only in your browser</b> and bypass all device rate limits.
          </p>
          <input 
            v-model="userApiKey" 
            type="password" 
            placeholder="Paste your Gemini Key (AIzaSy...)" 
            class="custom-input key-input"
            @input="saveApiKey"
          />
          <div class="debug-bar">
            <button class="reset-quota-btn" @click="resetLocalQuota">🔄 Reset Today's Quota Count (Dev Test)</button>
          </div>
        </div>
      </details>

      <button 
        class="extract-btn" 
        :disabled="loading || (!url && !rawText) || (isHostQuotaExhausted && !userApiKey.trim()) || (isBannedForUnstar && !userApiKey.trim())" 
        @click="handleExtract"
      >
        <span v-if="loading">⏳ Extracting & Formatting with AI...</span>
        <span v-else-if="isBannedForUnstar && !userApiKey.trim()">🛑 Host Quota Suspended (Use Your API Key)</span>
        <span v-else-if="isHostQuotaExhausted && !userApiKey.trim()">🛑 Daily {{ maxDailyLimit }}/{{ maxDailyLimit }} Limit Reached (See Below)</span>
        <span v-else>🚀 Extract Copy-Ready Cards</span>
      </button>

      <!-- Quota Exceeded Modal / Alert -->
      <div v-if="isHostQuotaExhausted && !userApiKey.trim() && !isBannedForUnstar" class="quota-banner">
        <h3>🛑 Daily Limit Reached ({{ maxDailyLimit }} / {{ maxDailyLimit }} Used)</h3>
        <p>
          You've used all <b>{{ maxDailyLimit }} free extractions</b> for today on this device. You can unlock more extractions immediately:
        </p>

        <div class="quota-options">
          <div v-if="!hasStarBonus" class="quota-option-card star-card">
            <h4>⭐ Option 1: Star on GitHub (+3 Bonus)</h4>
            <p>Star our repository on GitHub and verify your username to instantly get <b>3 more free credits</b> today!</p>
            <button class="claim-star-btn-large" @click="showStarModal = true">
              ⭐ Star & Unlock +3 Extra
            </button>
          </div>

          <div class="quota-option-card">
            <h4>🔑 Option 2: Enter Your Free Key</h4>
            <p>Get a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a> and paste it above for <b>unlimited extractions</b>.</p>
          </div>

          <div class="quota-option-card">
            <h4>💻 Option 3: Clone & Run Locally</h4>
            <p>Run the extractor locally with Python and your own LLM / Ollama:</p>
            <div class="code-box">
              <code>git clone https://github.com/deepankarboro/AI_IG_Content.git</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Star Verification Modal -->
      <div v-if="showStarModal" class="modal-backdrop" @click.self="showStarModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <h3>⭐ Claim +3 Free Daily Extractions</h3>
            <button class="close-btn" @click="showStarModal = false">✕</button>
          </div>

          <p class="modal-instructions">
            Follow 2 quick steps to unlock <b>+3 extra extractions</b> every day:
          </p>

          <div class="modal-step">
            <span class="step-num">1</span>
            <div class="step-content">
              <p>Star our repository on GitHub:</p>
              <a 
                href="https://github.com/deepankarboro/AI_IG_Content" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="star-link-btn"
              >
                ⭐ Star deepankarboro/AI_IG_Content
              </a>
            </div>
          </div>

          <div class="modal-step">
            <span class="step-num">2</span>
            <div class="step-content">
              <label for="gh-username">Enter your GitHub Username:</label>
              <input 
                id="gh-username"
                v-model="githubUsername" 
                type="text" 
                placeholder="e.g. your-github-username" 
                class="custom-input"
                :disabled="verifyingStar"
              />
            </div>
          </div>

          <div v-if="starVerifyMessage" :class="starVerifySuccess ? 'success-msg' : 'error-msg'">
            {{ starVerifyMessage }}
          </div>

          <div class="modal-actions">
            <button 
              class="verify-btn" 
              :disabled="verifyingStar || !githubUsername.trim()"
              @click="verifyGithubStar"
            >
              <span v-if="verifyingStar">🔍 Verifying on GitHub...</span>
              <span v-else>✅ Verify Star & Unlock +3</span>
            </button>
          </div>
          
          <p class="anti-abuse-note">
            ⚠️ <i>Note: Anti-abuse checks verify that stars are retained. Accounts that unstar after claiming credits are permanently blocked from host quota.</i>
          </p>
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

const showStarModal = ref(false)
const githubUsername = ref('')
const verifyingStar = ref(false)
const starVerifyMessage = ref('')
const starVerifySuccess = ref(false)
const hasStarBonus = ref(false)
const isBannedForUnstar = ref(false)

const BASE_DAILY_FREE = 3
const STAR_BONUS = 3

const maxDailyLimit = computed(() => {
  return hasStarBonus.value ? (BASE_DAILY_FREE + STAR_BONUS) : BASE_DAILY_FREE
})

const remainingQuota = computed(() => {
  return Math.max(0, maxDailyLimit.value - dailyCount.value)
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

  const savedStarUser = localStorage.getItem('ai_starred_username')
  const savedBan = localStorage.getItem('ai_user_banned_unstar') === 'true'
  
  if (savedBan) {
    isBannedForUnstar.value = true
  } else if (savedStarUser) {
    githubUsername.value = savedStarUser
    hasStarBonus.value = true
    verifyPersistentStar(savedStarUser)
  }
}

function resetLocalQuota() {
  if (typeof window === 'undefined') return
  localStorage.setItem('ai_extract_count', '0')
  localStorage.removeItem('ai_user_banned_unstar')
  dailyCount.value = 0
  isBannedForUnstar.value = false
  errorMessage.value = ''
}

async function verifyPersistentStar(username) {
  try {
    const res = await fetch('/api/verify-star', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, deviceFingerprint: deviceFingerprint.value, checkOnly: true })
    })
    const text = await res.text()
    let data = {}
    try { data = JSON.parse(text) } catch (err) { return }

    if (res.ok && !data.isStarred) {
      isBannedForUnstar.value = true
      hasStarBonus.value = false
      localStorage.setItem('ai_user_banned_unstar', 'true')
    }
  } catch (e) {
    console.warn("Star background check failed:", e)
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

async function verifyGithubStar() {
  if (!githubUsername.value.trim()) return
  verifyingStar.value = true
  starVerifyMessage.value = ''
  starVerifySuccess.value = false

  try {
    const res = await fetch('/api/verify-star', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: githubUsername.value.trim(),
        deviceFingerprint: deviceFingerprint.value
      })
    })

    const text = await res.text()
    let data = {}
    try {
      data = JSON.parse(text)
    } catch (err) {
      throw new Error(`Server returned unexpected response (${res.status}).`)
    }

    if (data.isStarred) {
      starVerifySuccess.value = true
      starVerifyMessage.value = data.message || `🎉 Star verified for @${githubUsername.value}! +3 extractions added.`
      hasStarBonus.value = true
      isBannedForUnstar.value = false
      localStorage.setItem('ai_starred_username', githubUsername.value.trim())
      localStorage.removeItem('ai_user_banned_unstar')
      setTimeout(() => {
        showStarModal.value = false
      }, 1800)
    } else {
      starVerifySuccess.value = false
      starVerifyMessage.value = data.message || 'Star not found. Please click Star on GitHub first, then verify.'
    }
  } catch (err) {
    starVerifySuccess.value = false
    starVerifyMessage.value = 'Failed to verify star: ' + err.message
  } finally {
    verifyingStar.value = false
  }
}

async function handleExtract() {
  if ((isHostQuotaExhausted.value || isBannedForUnstar.value) && !userApiKey.value.trim()) {
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

    const rawResponseText = await res.text()
    let data = {}
    try {
      data = JSON.parse(rawResponseText)
    } catch (err) {
      throw new Error(`Server returned status ${res.status}: ${rawResponseText.substring(0, 120)}`)
    }

    if (!data.success) {
      if (data.quotaExceeded) {
        dailyCount.value = maxDailyLimit.value
        localStorage.setItem('ai_extract_count', maxDailyLimit.value.toString())
      }
      errorMessage.value = data.message || data.error || 'Failed to extract content.'
      return
    }

    resultMarkdown.value = data.markdown

    // ONLY increment count when extraction was a genuine success!
    if (!userApiKey.value.trim()) {
      incrementDailyQuota()
    }

  } catch (err) {
    errorMessage.value = 'Extraction error: ' + err.message
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

.top-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.quota-pill {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.quota-pill.quota-exhausted {
  color: #ef4444;
}

.banned-text {
  color: #ef4444;
  font-weight: 600;
}

.star-badge {
  background: rgba(234, 179, 8, 0.2);
  color: #ca8a04;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.claim-star-btn {
  background: rgba(234, 179, 8, 0.15);
  color: #ca8a04;
  border: 1px solid #ca8a04;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.claim-star-btn:hover {
  background: #eab308;
  color: #000;
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

.banned-banner {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.banned-banner h3 {
  color: #ef4444;
  margin-top: 0;
}

.banned-options {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.or-text {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
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

.debug-bar {
  margin-top: 0.75rem;
  display: flex;
  justify-content: flex-end;
}

.reset-quota-btn {
  background: transparent;
  border: 1px dashed var(--vp-c-border);
  color: var(--vp-c-text-2);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.reset-quota-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

@media (max-width: 768px) {
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

.quota-option-card.star-card {
  border-color: rgba(234, 179, 8, 0.5);
  background: rgba(234, 179, 8, 0.05);
}

.claim-star-btn-large {
  background: #eab308;
  color: #000;
  border: none;
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

.code-box {
  background: var(--vp-c-bg-mute);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  overflow-x: auto;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--vp-c-brand-1);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.modal-step {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.step-num {
  background: var(--vp-c-brand-1);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex-grow: 1;
}

.step-content p {
  margin: 0 0 0.4rem 0;
  font-size: 0.9rem;
}

.verify-btn {
  background: var(--vp-c-brand-1);
  color: white;
  width: 100%;
  padding: 0.65rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.verify-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #16a34a;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  margin: 0.75rem 0;
  font-size: 0.85rem;
}

.error-msg {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  margin: 0.75rem 0;
  font-size: 0.85rem;
}

.anti-abuse-note {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 1rem;
  margin-bottom: 0;
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
