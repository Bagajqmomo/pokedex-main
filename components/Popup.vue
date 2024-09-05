<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger class="Button grass"> Edit profile </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="modal__overlay" />
      <DialogContent class="modal__content">
        <DialogClose class="modal__close" aria-label="Close">
          <img src="/assets/image/close-icon.png" />
        </DialogClose>
        <img
          class="pokedex__img"
          :src="data.sprites.other?.['official-artwork']?.front_default"
        />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup>
const props = defineProps({
  data: {
    required: true,
  },
});

const open = defineModel();
</script>
