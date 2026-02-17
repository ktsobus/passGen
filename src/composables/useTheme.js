import { ref, computed } from 'vue'

const THEMES = [
  {
    id: 'neon-green',
    label: 'Neon Green',
    color: '#27FF64',
    vars: {
      '--color-accent': '#27FF64',
      '--color-accent-h': '142',
      '--color-accent-s': '100%',
      '--color-accent-l': '58%',
    },
  },
  {
    id: 'neon-blue',
    label: 'Neon Blue',
    color: '#27C0FF',
    vars: {
      '--color-accent': '#27C0FF',
      '--color-accent-h': '197',
      '--color-accent-s': '100%',
      '--color-accent-l': '58%',
    },
  },
  {
    id: 'neon-purple',
    label: 'Neon Purple',
    color: '#BB27FF',
    vars: {
      '--color-accent': '#BB27FF',
      '--color-accent-h': '276',
      '--color-accent-s': '100%',
      '--color-accent-l': '58%',
    },
  },
  {
    id: 'warm-orange',
    label: 'Warm Orange',
    color: '#FF8C27',
    vars: {
      '--color-accent': '#FF8C27',
      '--color-accent-h': '28',
      '--color-accent-s': '100%',
      '--color-accent-l': '58%',
    },
  },
]

const BACKGROUNDS = [
  { id: 'dot-grid', label: 'Dot Grid', icon: 'grid' },
  { id: 'laser-flow', label: 'Laser Flow', icon: 'laser' },
]

// Module-level shared state
const activeThemeId = ref('neon-green')
const activeBackgroundId = ref('dot-grid')

const setCookie = (name, value, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function applyTheme(id) {
  const theme = THEMES.find((t) => t.id === id)
  if (!theme) return
  const el = document.documentElement.style
  for (const [key, val] of Object.entries(theme.vars)) {
    el.setProperty(key, val)
  }
}

function setTheme(id) {
  activeThemeId.value = id
  applyTheme(id)
  setCookie('pg_theme', id)
}

function setBackground(id) {
  if (BACKGROUNDS.find((b) => b.id === id)) {
    activeBackgroundId.value = id
    setCookie('pg_background', id)
  }
}

function loadPersistedTheme() {
  const saved = getCookie('pg_theme')
  if (saved && THEMES.find((t) => t.id === saved)) {
    activeThemeId.value = saved
    applyTheme(saved)
  } else {
    applyTheme('neon-green')
  }

  const savedBg = getCookie('pg_background')
  if (savedBg && BACKGROUNDS.find((b) => b.id === savedBg)) {
    activeBackgroundId.value = savedBg
  }
}

export function useTheme() {
  const activeTheme = computed(() => THEMES.find((t) => t.id === activeThemeId.value))

  return {
    THEMES,
    activeThemeId,
    activeTheme,
    setTheme,
    loadPersistedTheme,
    BACKGROUNDS,
    activeBackgroundId,
    setBackground,
  }
}
