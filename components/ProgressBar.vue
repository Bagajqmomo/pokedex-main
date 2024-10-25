<template>
  <ProgressRoot class="progress__root">
    <ProgressIndicator
      class="progress__indicator"
      :style="{ width: progress + '%' }"
    />
  </ProgressRoot>
</template>

<script setup>
// @see https://www.radix-vue.com/components/progress.html

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
});

const progress = computed(() => props.value);
</script>
