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
          placeholder="Enter Pokémon name"
        />
        <img src="/assets/image/search.svg" />
      </div>
    </div>

    <div class="pokedex__content">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div class="pokedex__container" v-else>
        <div
          v-for="pokemon in pokemonList"
          :key="pokemon.id"
          class="pokedex__card"
          :style="{
            borderColor: getColor(pokemon.types[0].type.name),
            background: `radial-gradient(80% 80% at 50% bottom, ${getTypeColor(
              pokemon.types[0].type.name
            )}, rgba(6, 14, 32, 0.8))`,
            boxShadow: `${getTypeColor(
              pokemon.types[0].type.name
            )} 0px 3px 12px`,
          }"
        >
          <img
            class="pokedex__img"
            :src="pokemon.sprites.other?.['official-artwork']?.front_default"
            :alt="pokemon.name"
          />
          <h2 class="pokedex__name">{{ pokemon.name }}</h2>
          <ul class="pokedex__type">
            <li
              v-for="type in pokemon.types"
              :key="type.type.name"
              :style="{
                backgroundColor: getTypeColor(type.type.name),
              }"
            >
              <img :src="`/images/icon/${type.type.name}.svg`" />
              {{ type.type.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button @click="previousPage" :disabled="currentIndex.value <= 1">
        <
      </button>
      <button @click="nextPage">></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { register } from "swiper/element/bundle";

const pokemonList = ref([]);
const searchTerm = ref("");
const loading = ref(false);
const error = ref(null);
const currentIndex = ref(1); // Start with Pokémon index 1
const limit = 9; // Number of Pokémon to show per page
const offset = ref(0); // Pagination offset

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

const fetchPokemonList = async () => {
  loading.value = true;
  error.value = null;
  pokemonList.value = [];
  try {
    const offsetValue = (currentIndex.value - 1) * limit;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offsetValue}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to load Pokémon");
    }
    const data = await response.json();
    const pokemonPromises = data.results.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json())
    );
    pokemonList.value = await Promise.all(pokemonPromises);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const searchPokemon = () => {
  if (searchTerm.value.trim()) {
    fetchPokemonList();
  }
};

const nextPage = () => {
  currentIndex.value += 1;
  fetchPokemonList();
};

const previousPage = () => {
  if (currentIndex.value > 1) {
    currentIndex.value -= 1;
    fetchPokemonList();
  }
};

const colours = {
  normal: "rgba(168, 167, 122, 0.2)", // #A8A77A
  fire: "rgba(238, 129, 48, 0.2)", // #EE8130
  water: "rgba(99, 144, 240, 0.2)", // #6390F0
  electric: "rgba(247, 208, 44, 0.2)", // #F7D02C
  grass: "rgba(122, 199, 76, 0.2)", // #7AC74C
  ice: "rgba(150, 217, 214, 0.2)", // #96D9D6
  fighting: "rgba(194, 46, 40, 0.2)", // #C22E28
  poison: "rgba(163, 62, 161, 0.2)", // #A33EA1
  ground: "rgba(226, 191, 101, 0.2)", // #E2BF65
  flying: "rgba(169, 143, 243, 0.2)", // #A98FF3
  psychic: "rgba(249, 85, 135, 0.2)", // #F95587
  bug: "rgba(166, 185, 26, 0.2)", // #A6B91A
  rock: "rgba(182, 161, 54, 0.2)", // #B6A136
  ghost: "rgba(115, 87, 151, 0.2)", // #735797
  dragon: "rgba(111, 53, 252, 0.2)", // #6F35FC
  dark: "rgba(112, 87, 70, 0.2)", // #705746
  steel: "rgba(183, 183, 206, 0.2)", // #B7B7CE
  fairy: "rgba(214, 133, 173, 0.2)", // #D685AD
};

const typeColours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const getColor = (type) => {
  return colours[type] || "rgba(255, 255, 255, 0.2)"; // Default to white if type is not found
};

const getTypeColor = (type) => {
  return typeColours[type] || "rgba(255, 255, 255, 0.2)"; // Default to white if type is not found
};

onMounted(() => {
  fetchPokemonList(); // Load the first 9 Pokémon on mount
});
</script>
