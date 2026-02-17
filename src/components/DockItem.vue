<script setup>
import { ref, useTemplateRef } from 'vue'
import { Motion, AnimatePresence, useSpring, useTransform, useMotionTemplate } from 'motion-v'

const props = defineProps({
  theme: { type: Object, required: true },
  mouseX: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

const BASE_SIZE = 40
const MAGNIFIED_SIZE = 70
const DISTANCE = 150

const itemRef = useTemplateRef('itemRef')
const hovered = ref(false)

const distance = useTransform(props.mouseX, (val) => {
  if (!itemRef.value) return DISTANCE + 1
  const rect = itemRef.value.getBoundingClientRect()
  return val - (rect.left + rect.width / 2)
})

const size = useSpring(
  useTransform(distance, [-DISTANCE, 0, DISTANCE], [BASE_SIZE, MAGNIFIED_SIZE, BASE_SIZE]),
  { stiffness: 300, damping: 30 },
)

const sizeWithUnit = useMotionTemplate`${size}px`
</script>

<template>
  <div ref="itemRef" class="dock-item-wrap">
    <Motion
      :style="{ width: sizeWithUnit, height: sizeWithUnit }"
      class="dock-item"
      :class="{ active: isActive }"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @click="emit('select')"
    >
      <div v-if="theme.color" class="swatch" :style="{ backgroundColor: theme.color }" />
      <svg
        v-else-if="theme.icon === 'grid'"
        class="dock-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="7" r="2.5" />
        <circle cx="7" cy="17" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
      </svg>
      <svg
        v-else-if="theme.icon === 'laser'"
        class="dock-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <line x1="3" y1="8" x2="21" y2="8" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <line x1="3" y1="16" x2="21" y2="16" />
      </svg>
      <div v-if="isActive" class="active-dot" :style="{ backgroundColor: theme.color || '#fff' }" />
    </Motion>

    <AnimatePresence>
      <Motion
        v-if="hovered"
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 8 }"
        class="dock-label"
      >
        {{ theme.label }}
      </Motion>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.dock-item-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dock-item {
  border-radius: 12px;
  background: hsla(0, 0%, 100%, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: none;
}

.dock-item:hover {
  background: hsla(0, 0%, 100%, 0.12);
}

.swatch {
  width: 60%;
  height: 60%;
  border-radius: 50%;
  transition: none;
}

.dock-icon {
  width: 55%;
  height: 55%;
  color: hsla(0, 0%, 100%, 0.7);
}

.active-dot {
  position: absolute;
  bottom: -6px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  transition: none;
}

.dock-label {
  position: absolute;
  bottom: calc(100% + 10px);
  white-space: nowrap;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  background: hsla(0, 0%, 15%, 0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.3);
  pointer-events: none;
}
</style>
