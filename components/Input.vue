<template>
  <div class="input">
    <div class="input__wrapper">
      <input :type="type" :placeholder="placeholder" />
      <slot name="Input"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: {
    type: String,
  },
  type: {
    type: String,
    default: "textfield",
  },
});
</script>
