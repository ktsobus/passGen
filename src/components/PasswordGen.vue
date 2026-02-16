<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ElasticSlider from './ElasticSlider.vue'
import DecryptedText from './DecryptedText.vue'
import AnimatedList from './AnimatedList.vue'

// Cookie helpers
const setCookie = (name, value, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

// Load saved preferences from cookies
const loadPreferences = () => {
  const uppercase = getCookie('pg_uppercase')
  const numbers = getCookie('pg_numbers')
  const special = getCookie('pg_special')
  const noNumFirstLast = getCookie('pg_noNumFirstLast')
  const length = getCookie('pg_length')

  if (uppercase !== null) includeUppercase.value = uppercase === 'true'
  if (numbers !== null) includeNumbers.value = numbers === 'true'
  if (special !== null) includeSpecialChars.value = special === 'true'
  if (noNumFirstLast !== null) noNumberFirstLast.value = noNumFirstLast === 'true'
  if (length !== null) passwordLength.value = parseInt(length, 10)
}

// Save preferences to cookies
const savePreferences = () => {
  setCookie('pg_uppercase', includeUppercase.value)
  setCookie('pg_numbers', includeNumbers.value)
  setCookie('pg_special', includeSpecialChars.value)
  setCookie('pg_noNumFirstLast', noNumberFirstLast.value)
  setCookie('pg_length', passwordLength.value)
}

// Options
const includeUppercase = ref(true)
const includeNumbers = ref(true)
const includeSpecialChars = ref(false)
const noNumberFirstLast = ref(true)
const passwordLength = ref(16)

// Watch for option changes and save to cookies
watch(
  [includeUppercase, includeNumbers, includeSpecialChars, noNumberFirstLast, passwordLength],
  savePreferences,
)

// Load preferences on mount
onMounted(() => {
  loadPreferences()
})

// Password state
const password = ref('')
const copied = ref(false)
const passwordHistory = ref([])
const historyOpen = ref(false)
const historyIdCounter = ref(0)

// Character sets
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numberChars = '0123456789'
const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

// Build character pool based on options
const charPool = computed(() => {
  let pool = lowercaseChars
  if (includeUppercase.value) pool += uppercaseChars
  if (includeNumbers.value) pool += numberChars
  if (includeSpecialChars.value) pool += specialChars
  return pool
})

// Non-number characters for first/last position
const nonNumberPool = computed(() => {
  let pool = lowercaseChars
  if (includeUppercase.value) pool += uppercaseChars
  if (includeSpecialChars.value) pool += specialChars
  return pool
})

// Generate random character from a pool (cryptographically secure)
const getRandomChar = (pool) => {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return pool[array[0] % pool.length]
}

// Generate password
const generatePassword = () => {
  copied.value = false
  let newPassword = ''
  const length = passwordLength.value

  if (noNumberFirstLast.value && length >= 2) {
    // First character (no number)
    newPassword += getRandomChar(nonNumberPool.value)

    // Middle characters
    for (let i = 1; i < length - 1; i++) {
      newPassword += getRandomChar(charPool.value)
    }

    // Last character (no number)
    newPassword += getRandomChar(nonNumberPool.value)
  } else {
    for (let i = 0; i < length; i++) {
      newPassword += getRandomChar(charPool.value)
    }
  }

  if (password.value) {
    historyIdCounter.value++
    passwordHistory.value.unshift({ id: historyIdCounter.value, content: password.value })
    if (passwordHistory.value.length > 20) passwordHistory.value.pop()
  }

  password.value = newPassword
}

// Copy to clipboard
const copyToClipboard = async () => {
  if (!password.value) return

  try {
    await navigator.clipboard.writeText(password.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Password strength indicator
const passwordStrength = computed(() => {
  const pw = password.value
  if (!pw) return { label: '', color: '', percent: 0 }

  let score = 0

  // Length scoring
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (pw.length >= 16) score++
  if (pw.length >= 20) score++

  // Character diversity scoring
  if (/[a-z]/.test(pw)) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++

  // Map score (0-8) to levels
  if (score <= 2) return { label: 'Weak', color: '#ef4444', percent: 25 }
  if (score <= 4) return { label: 'Fair', color: '#f97316', percent: 50 }
  if (score <= 6) return { label: 'Good', color: '#eab308', percent: 75 }
  return { label: 'Strong', color: '#27ff64', percent: 100 }
})

// Copy a history entry to clipboard
const copyHistoryToClipboard = async (pw) => {
  try {
    await navigator.clipboard.writeText(pw)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Generate initial password
generatePassword()
</script>

<template>
  <div class="password-gen">
    <h1 class="title text-6xl font-extrabold mb-10 text-center">PassGen</h1>

    <!-- Password Display -->
    <div @click="copyToClipboard" class="glass-panel password-display">
      <DecryptedText
        :key="password"
        :text="password || 'Click Generate'"
        :speed="30"
        :max-iterations="15"
        :sequential="true"
        reveal-direction="start"
        animate-on="view"
        class="password-text"
      />
      <span class="copy-hint" :class="{ copied: copied }">
        {{ copied ? 'Copied!' : 'Click to copy' }}
      </span>
    </div>

    <!-- Strength Indicator -->
    <div v-if="password" class="strength-container glass-panel">
      <div class="strength-bar-track">
        <div
          class="strength-bar-fill"
          :style="{
            width: passwordStrength.percent + '%',
            backgroundColor: passwordStrength.color,
          }"
        />
      </div>
      <span class="strength-label" :style="{ color: passwordStrength.color }">
        {{ passwordStrength.label }}
      </span>
    </div>

    <!-- Generate Button -->
    <button @click="generatePassword" class="glass-button">Generate Password</button>

    <!-- Options -->
    <div class="options-container">
      <!-- Length Slider -->
      <div class="glass-panel">
        <label class="option-label">Password Length</label>
        <ElasticSlider
          v-model:defaultValue="passwordLength"
          :starting-value="13"
          :max-value="24"
          :is-stepped="true"
          :step-size="1"
          class="mx-auto"
        />
      </div>

      <!-- Checkboxes -->
      <div class="glass-panel checkbox-group">
        <label class="checkbox-label">
          <input v-model="includeUppercase" type="checkbox" class="checkbox-input" />
          <span>Include Uppercase Letters</span>
        </label>

        <label class="checkbox-label">
          <input v-model="includeNumbers" type="checkbox" class="checkbox-input" />
          <span>Include Numbers</span>
        </label>

        <label class="checkbox-label">
          <input v-model="includeSpecialChars" type="checkbox" class="checkbox-input" />
          <span>Include Special Characters</span>
        </label>

        <label class="checkbox-label">
          <input v-model="noNumberFirstLast" type="checkbox" class="checkbox-input" />
          <span>First & Last Character Can't Be a Number</span>
        </label>
      </div>
    </div>

    <!-- Password History -->
    <div v-if="passwordHistory.length" class="history-section">
      <button @click="historyOpen = !historyOpen" class="history-toggle">
        History ({{ passwordHistory.length }})
        <span class="history-chevron" :class="{ open: historyOpen }">&#9662;</span>
      </button>
      <AnimatedList
        v-if="historyOpen"
        :items="passwordHistory"
        :max-items="20"
        animation-type="scale"
        enter-from="top"
        hover-effect="scale"
        :fade-edges="true"
        :fade-edge-size="40"
        fade-color="transparent"
        height="14rem"
        :item-gap="4"
        @item-click="(item) => copyHistoryToClipboard(item.content)"
      >
        <template #default="{ item }">
          <div class="history-item">
            <span class="password-text history-password">{{ item.content }}</span>
            <span class="history-copy-hint">copy</span>
          </div>
        </template>
      </AnimatedList>
    </div>
  </div>
</template>

<style scoped>
.password-gen {
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  padding: 1.5rem;
  font-weight: 600;
}

.title {
  color: #ffffff;
  font-family: 'Tanker-Regular', sans-serif;
}

/* Glass panel base style */
.glass-panel {
  background: hsla(0, 0%, 100%, 0.1);
  backdrop-filter: blur(0.75em);
  -webkit-backdrop-filter: blur(0.75em);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow:
    0 0 0 1px hsla(0, 0%, 100%, 0.2) inset,
    0 8px 32px hsla(0, 0%, 0%, 0.2);
  transition: all 0.3s ease;
}

.glass-panel:hover {
  background: hsla(0, 0%, 100%, 0.15);
  box-shadow:
    0 0 0 1px hsla(0, 0%, 100%, 0.3) inset,
    0 8px 32px hsla(0, 0%, 0%, 0.25);
}

/* Password display */
.password-display {
  position: relative;
  margin-bottom: 1rem;
  cursor: pointer;
  user-select: none;
}

.password-text {
  font-size: 1.25rem;
  font-family: monospace;
  text-align: center;
  color: #ffffff;
  word-break: break-all;
}

.copy-hint {
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: hsla(0, 0%, 100%, 0.6);
  transition: color 0.3s ease;
}

.copy-hint.copied {
  color: #27ff64;
}

/* Generate button */
.glass-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, hsla(142, 100%, 58%, 0.3), hsla(142, 100%, 58%, 0.15));
  backdrop-filter: blur(0.75em);
  -webkit-backdrop-filter: blur(0.75em);
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  box-shadow:
    0 0 0 1px hsla(142, 100%, 58%, 0.4) inset,
    0 8px 32px hsla(0, 0%, 0%, 0.2);
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: linear-gradient(135deg, hsla(142, 100%, 58%, 0.4), hsla(142, 100%, 58%, 0.25));
  box-shadow:
    0 0 0 1px hsla(142, 100%, 58%, 0.6) inset,
    0 8px 32px hsla(0, 0%, 0%, 0.3);
  transform: translateY(-2px);
}

/* Options container */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-label {
  display: block;
  text-align: center;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

/* Checkbox group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: hsla(0, 0%, 100%, 0.9);
  transition: color 0.2s ease;
}

.checkbox-label:hover {
  color: #ffffff;
}

.checkbox-input {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #27ff64;
  cursor: pointer;
}

/* Strength indicator */
.strength-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
}

.strength-bar-track {
  flex: 1;
  height: 6px;
  background: hsla(0, 0%, 100%, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.strength-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition:
    width 0.4s ease,
    background-color 0.4s ease;
}

.strength-label {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.4s ease;
}

/* History section */
.history-section {
  margin-top: 1rem;
}

.history-toggle {
  width: 100%;
  padding: 0.625rem 1rem;
  background: hsla(0, 0%, 100%, 0.08);
  backdrop-filter: blur(0.75em);
  -webkit-backdrop-filter: blur(0.75em);
  border: none;
  border-radius: 0.75rem;
  color: hsla(0, 0%, 100%, 0.7);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.history-toggle:hover {
  background: hsla(0, 0%, 100%, 0.12);
  color: #ffffff;
}

.history-chevron {
  display: inline-block;
  transition: transform 0.3s ease;
  font-size: 0.75rem;
}

.history-chevron.open {
  transform: rotate(180deg);
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.history-item:hover {
  background: hsla(0, 0%, 100%, 0.1);
}

.history-password {
  font-size: 0.85rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-copy-hint {
  font-size: 0.7rem;
  color: hsla(0, 0%, 100%, 0.4);
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.history-item:hover .history-copy-hint {
  color: #27ff64;
}
</style>
