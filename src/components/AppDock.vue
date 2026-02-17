<script setup>
import { useMotionValue } from 'motion-v'
import DockItem from './DockItem.vue'
import { useTheme } from '@/composables/useTheme.js'

const { THEMES, activeThemeId, setTheme, BACKGROUNDS, activeBackgroundId, setBackground } =
  useTheme()

const mouseX = useMotionValue(Infinity)

const handleMouseMove = (e) => {
  mouseX.set(e.pageX)
}

const handleMouseLeave = () => {
  mouseX.set(Infinity)
}
</script>

<template>
  <div class="dock-wrapper" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <div class="dock-container">
      <DockItem
        v-for="theme in THEMES"
        :key="theme.id"
        :theme="theme"
        :mouse-x="mouseX"
        :is-active="activeThemeId === theme.id"
        @select="setTheme(theme.id)"
      />

      <div class="dock-divider" />

      <DockItem
        v-for="bg in BACKGROUNDS"
        :key="bg.id"
        :theme="{ id: bg.id, label: bg.label, icon: bg.icon }"
        :mouse-x="mouseX"
        :is-active="activeBackgroundId === bg.id"
        @select="setBackground(bg.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.dock-wrapper {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
}

.dock-divider {
  width: 1px;
  height: 24px;
  background: hsla(0, 0%, 100%, 0.2);
  align-self: center;
  flex-shrink: 0;
}

.dock-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background: hsla(0, 0%, 100%, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 18px;
  box-shadow:
    0 0 0 1px hsla(0, 0%, 100%, 0.15) inset,
    0 8px 32px hsla(0, 0%, 0%, 0.3);
}
</style>
