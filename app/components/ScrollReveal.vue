<template>
  <div
    ref="el"
    class="reveal"
    :class="{ 'reveal--in': visible }"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ delay?: number }>()
const delay = props.delay ?? 0

const el = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  if (!el.value) return

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          visible.value = true
          io.disconnect()
          break
        }
      }
    },
    { threshold: 0.12 }
  )

  io.observe(el.value)

  onBeforeUnmount(() => io.disconnect())
})
</script>

<style scoped>
.reveal {
  transform: translateY(14px);
  opacity: 0;
  transition: transform 700ms ease, opacity 700ms ease;
  will-change: transform, opacity;
}
.reveal--in {
  transform: translateY(0px);
  opacity: 1;
}
</style>