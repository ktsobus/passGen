<script setup>
import { computed } from 'vue'
import { AnimatePresence, Motion, LayoutGroup } from 'motion-v'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  maxItems: {
    type: Number,
    default: 10,
  },
  animationType: {
    type: String,
    default: 'slide',
    validator: (v) => ['slide', 'fade', 'scale', 'bounce', 'blur'].includes(v),
  },
  enterFrom: {
    type: String,
    default: 'top',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v),
  },
  hoverEffect: {
    type: String,
    default: 'none',
    validator: (v) => ['none', 'scale'].includes(v),
  },
  fadeEdges: {
    type: Boolean,
    default: false,
  },
  fadeEdgeSize: {
    type: Number,
    default: 40,
  },
  fadeColor: {
    type: String,
    default: 'transparent',
  },
  itemGap: {
    type: Number,
    default: 12,
  },
  height: {
    type: String,
    default: 'auto',
  },
  duration: {
    type: Number,
    default: 0.4,
  },
  easing: {
    type: Array,
    default: () => [0.25, 0.46, 0.45, 0.94],
  },
})

defineEmits(['itemClick'])

const visibleItems = computed(() => props.items.slice(0, props.maxItems))

const getDirectionOffset = () => {
  const distance = 40
  switch (props.enterFrom) {
    case 'top':
      return { y: -distance }
    case 'bottom':
      return { y: distance }
    case 'left':
      return { x: -distance }
    case 'right':
      return { x: distance }
    default:
      return { y: -distance }
  }
}

const getTypeInitial = () => {
  switch (props.animationType) {
    case 'scale':
      return { scale: 0.85 }
    case 'blur':
      return { filter: 'blur(8px)' }
    default:
      return {}
  }
}

const getTypeAnimate = () => {
  switch (props.animationType) {
    case 'scale':
      return { scale: 1 }
    case 'blur':
      return { filter: 'blur(0px)' }
    default:
      return {}
  }
}

const getTypeExit = () => {
  switch (props.animationType) {
    case 'scale':
      return { scale: 0.85 }
    case 'blur':
      return { filter: 'blur(8px)' }
    default:
      return {}
  }
}

const initial = computed(() => ({
  opacity: 0,
  ...getDirectionOffset(),
  ...getTypeInitial(),
}))

const animate = computed(() => ({
  opacity: 1,
  x: 0,
  y: 0,
  ...getTypeAnimate(),
}))

const exit = computed(() => ({
  opacity: 0,
  y: 20,
  ...getTypeExit(),
}))

const transition = computed(() => {
  if (props.animationType === 'bounce') {
    return { type: 'spring', stiffness: 350, damping: 25 }
  }
  return {
    duration: props.duration,
    ease: props.easing,
  }
})

const whileHover = computed(() => (props.hoverEffect === 'scale' ? { scale: 1.02 } : undefined))
</script>

<template>
  <div class="animated-list" :style="{ height }">
    <div
      v-if="fadeEdges"
      class="animated-list__fade animated-list__fade--top"
      :style="{
        height: fadeEdgeSize + 'px',
        background: `linear-gradient(to bottom, ${fadeColor}, transparent)`,
      }"
    />
    <div class="animated-list__scroll">
      <LayoutGroup>
        <ul class="animated-list__ul" :style="{ gap: itemGap + 'px' }">
          <AnimatePresence :multiple="true">
            <Motion
              v-for="item in visibleItems"
              :key="item.id"
              tag="li"
              layout
              :initial="initial"
              :animate="animate"
              :exit="exit"
              :transition="transition"
              :while-hover="whileHover"
              class="animated-list__item"
              @click="$emit('itemClick', item)"
            >
              <slot :item="item">{{ item.content }}</slot>
            </Motion>
          </AnimatePresence>
        </ul>
      </LayoutGroup>
    </div>
    <div
      v-if="fadeEdges"
      class="animated-list__fade animated-list__fade--bottom"
      :style="{
        height: fadeEdgeSize + 'px',
        background: `linear-gradient(to top, ${fadeColor}, transparent)`,
      }"
    />
  </div>
</template>

<style scoped>
.animated-list {
  position: relative;
  overflow: hidden;
}

.animated-list__scroll {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.animated-list__scroll::-webkit-scrollbar {
  display: none;
}

.animated-list__ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
}

.animated-list__item {
  list-style: none;
  overflow: hidden;
}

.animated-list__fade {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;
}

.animated-list__fade--top {
  top: 0;
}

.animated-list__fade--bottom {
  bottom: 0;
}
</style>
