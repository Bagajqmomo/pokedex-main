<template>
  <div class="container">
    <div class="pokedex__header">
      <client-only>
        <swiper-container
          class="element__container"
          :slidesPerView="'auto'"
          :spaceBetween="16"
          :autoplay="{
            delay: 4000,
          }"
        >
          <swiper-slide
            class="element__slide"
            v-for="(image, index) in elementImages"
            :key="index"
          >
            <img :src="image" :alt="'Slide ' + (index + 1)" />
          </swiper-slide>
        </swiper-container>
      </client-only>
      <div class="input__wrapper">
        <input
          v-model="searchTerm"
          @keyup.enter="searchPokemon"
          placeholder="Enter Pokemon name"
        />
        <img src="/assets/image/search.svg" />
      </div>
    </div>
    <div>
      <h1>Pokemon Searcher</h1>
      <button @click="searchPokemon">Search</button>

      <div v-if="loading">Loading...</div>

      <div v-else-if="error">{{ error }}</div>

      <div v-else-if="pokemonData">
        <div class="pokedex__card">
          <h2>{{ pokemonData.name }}</h2>
          <img
            :src="pokemonData.sprites.front_default"
            :alt="pokemonData.name"
          />
          <p>Height: {{ pokemonData.height }} dm</p>
          <p>Weight: {{ pokemonData.weight }} hg</p>
          <h3>Abilities:</h3>
          <ul>
            <li
              v-for="ability in pokemonData.abilities"
              :key="ability.ability.name"
            >
              {{ ability.ability.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { register } from "swiper/element/bundle";
const pokemonData = ref(null);
const searchTerm = ref("");
const loading = ref(false);
const error = ref(null);

register(); //swiper

const elementImages = [
  "/images/element/normal.svg",
  "/images/element/fighting.svg",
  "/images/element/flying.svg",
  "/images/element/poison.svg",
  "/images/element/ground.svg",
  "/images/element/rock.svg",
  "/images/element/bug.svg",
  "/images/element/ghost.svg",
  "/images/element/steel.svg",
  "/images/element/fire.svg",
  "/images/element/water.svg",
  "/images/element/grass.svg",
  "/images/element/electric.svg",
  "/images/element/psychic.svg",
  "/images/element/ice.svg",
  "/images/element/dragon.svg",
  "/images/element/dark.svg",
  "/images/element/fairy.svg",
];

const fetchPokemon = async (pokemonName) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
    );
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }
    pokemonData.value = await response.json();
  } catch (err) {
    error.value = err.message;
    pokemonData.value = null;
  } finally {
    loading.value = false;
  }
};

const searchPokemon = () => {
  console.log("byebye");
  console.log(searchTerm.value);
  if (searchTerm.value.trim()) {
    fetchPokemon(searchTerm.value);
  }
};

onMounted(() => {
  fetchPokemon("pikachu");
});
</script>
