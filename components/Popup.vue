<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger class="Button grass"> Edit profile </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="modal__overlay" />
      <DialogContent
        class="modal__content"
        :style="{
          borderColor: getColor(data?.types[0].type.name),
          background: `radial-gradient(80% 80% at 50% bottom, ${getTypeColor(
            data?.types[0].type.name
          )}, rgba(6, 14, 32, 0.8))`,
          boxShadow: `${getTypeColor(data?.types[0].type.name)} 0px 3px 12px`,
        }"
      >
        <DialogClose class="modal__close" aria-label="Close">
          <img src="/assets/image/close-icon.png" />
        </DialogClose>
        <img
          class="pokedex__img"
          :src="data.sprites.other?.['official-artwork']?.front_default"
        />
        <h2 class="pokedex__name">
          {{ data.name }}
        </h2>
        <div class="pokedex__info">
          <p>
            <img src="/assets/image/weight-icon.png" />
            {{ data.weight / 10 }} KG
          </p>
          <ul class="pokedex__type">
            <li v-for="type in data.types" :key="type.type.name">
              <img :src="`/images/element/${type.type.name}.svg`" />
            </li>
          </ul>
          <p>
            <img src="/assets/image/height-icon.png" />
            {{ data.height / 10 }} M
          </p>
        </div>
        <div class="pokedex__stat">
          <h3>Stats</h3>
          <div v-for="(stat, index) in data.stats" :key="stat.stat.name">
            <span v-if="stat.stat.name == 'hp'">HP</span>
            <span v-else-if="stat.stat.name == 'attack'">ATK</span>
            <span v-else-if="stat.stat.name == 'defense'">DEF</span>
            <span v-else-if="stat.stat.name == 'special-attack'">SpA</span>
            <span v-else-if="stat.stat.name == 'special-defense'">Spd</span>
            <span v-else-if="stat.stat.name == 'speed'">SPD</span>
            <ProgressBar :value="stat.base_stat / 2" />
          </div>
        </div>
        <div class="pokedex__chain" v-if="evoData">
          <h3>Evolution Chain</h3>
          <div class="pokedex__evo">
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoData[0].id}.png`"
            />
            <span>LV.{{ evoData[1].minLevel }}</span>
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoData[1].id}.png`"
            />
            <span>LV.{{ evoData[2].minLevel }}</span>
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoData[2].id}.png`"
            />
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup>
const props = defineProps({
  data: {
    required: true,
  },
  evoData: {
    required: true,
  },
});

const open = defineModel();
</script>
