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
            v-for="(element, index) in elements"
            :key="index"
            @click="toggleElementFilter(element.type)"
            :class="{
              'element__slide--active': selectedElements.includes(element.type),
            }"
          >
            <img :src="element.image" :alt="element.type" />
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
      <Loader v-if="loading" />
      <div v-else-if="error">{{ error }}</div>
      <div class="pokedex__container" v-else>
        <div
          v-for="pokemon in paginatedPokemonList"
          :key="pokemon.id"
          class="pokedex__card"
          @click="openPokemonCard(pokemon)"
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
  <Popup
    v-model="pokemonCard"
    :data="selectedPokemon"
    :evoData="evolutionChain"
    :loading="isLoading"
  />
</template>

<script setup>
useHead({
  title: "Pokédex - Gotta Catch 'Em All",
});

import { ref, onMounted, computed } from "vue";
import { register } from "swiper/element/bundle";

const pokemonCard = ref(false);
const selectedPokemon = ref(null); // To store the clicked Pokémon's data
const evolutionChain = ref(null);
const allPokemonList = ref([]); // Store all Pokémon names and URLs
const pokemonList = ref([]); // Store the current page's Pokémon details
const searchTerm = ref("");
const loading = ref(false);
const error = ref(null);
const currentIndex = ref(1); // Start with Pokémon index 1
const limit = 15; // Number of Pokémon to show per page
const isLoading = ref(false);
const selectedElements = ref([]);

register(); //swiper

const elements = [
  { type: "normal", image: "/images/element/normal.svg" },
  { type: "fighting", image: "/images/element/fighting.svg" },
  { type: "flying", image: "/images/element/flying.svg" },
  { type: "poison", image: "/images/element/poison.svg" },
  { type: "ground", image: "/images/element/ground.svg" },
  { type: "rock", image: "/images/element/rock.svg" },
  { type: "bug", image: "/images/element/bug.svg" },
  { type: "ghost", image: "/images/element/ghost.svg" },
  { type: "steel", image: "/images/element/steel.svg" },
  { type: "fire", image: "/images/element/fire.svg" },
  { type: "water", image: "/images/element/water.svg" },
  { type: "grass", image: "/images/element/grass.svg" },
  { type: "electric", image: "/images/element/electric.svg" },
  { type: "psychic", image: "/images/element/psychic.svg" },
  { type: "ice", image: "/images/element/ice.svg" },
  { type: "dragon", image: "/images/element/dragon.svg" },
  { type: "dark", image: "/images/element/dark.svg" },
  { type: "fairy", image: "/images/element/fairy.svg" },
];

// Toggle element filter function
const toggleElementFilter = (elementType) => {
  const index = selectedElements.value.indexOf(elementType);
  if (index === -1) {
    selectedElements.value.push(elementType);
  } else {
    selectedElements.value.splice(index, 1);
  }
  currentIndex.value = 1; // Reset to first page when filter changes
  loadPokemonList();
};

const openPokemonCard = async (pokemon) => {
  selectedPokemon.value = pokemon;
  pokemonCard.value = true;
  isLoading.value = true;
  // Fetch Pokémon species data to get the evolution chain URL
  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
  );
  const speciesData = await speciesResponse.json();

  const evolutionChainUrl = speciesData.evolution_chain.url;

  getEvolutionChain(evolutionChainUrl);
  isLoading.value = false;
};

const getEvolutionChain = async (url) => {
  loading.value = true;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to load Evolution Chain");

    const data = await response.json();
    evolutionChain.value = parseEvolutionChain(data.chain);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const parseEvolutionChain = (chain) => {
  const chainInfo = [];

  function traverseEvolution(evolution) {
    const speciesName = evolution.species.name;
    const speciesUrl = evolution.species.url;
    const pokemonId = getPokemonIdFromUrl(speciesUrl);

    const minLevel = evolution.evolution_details.length
      ? evolution.evolution_details[0].min_level || "?"
      : "?";

    chainInfo.push({
      name: speciesName,
      url: speciesUrl,
      minLevel,
      id: pokemonId,
    });

    if (evolution.evolves_to.length > 0) {
      evolution.evolves_to.forEach(traverseEvolution);
    }
  }

  traverseEvolution(chain);
  return chainInfo;
};

const getPokemonIdFromUrl = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 2];
};

// Fetch basic info for all Pokémon
const fetchAllPokemon = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=10000"
    );
    if (!response.ok) {
      throw new Error("Failed to load Pokémon list");
    }
    const data = await response.json();
    allPokemonList.value = data.results; // Store all Pokémon names and URLs
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Fetch Pokémon details by URL
const fetchPokemonDetails = async (url) => {
  const response = await fetch(url);
  return response.json();
};

// Modify the loadPokemonList function to handle element filtering
const loadPokemonList = async () => {
  loading.value = true;
  error.value = null;
  pokemonList.value = [];

  try {
    const offsetValue = (currentIndex.value - 1) * limit;
    const pokemonToFetch = filteredPokemonList.value.slice(
      offsetValue,
      offsetValue + limit * 2 // Fetch more Pokemon to account for filtering
    );

    const fetchedPokemon = await Promise.all(
      pokemonToFetch.map((pokemon) => fetchPokemonDetails(pokemon.url))
    );

    // Apply element type filtering after fetching the details
    let filteredPokemon = fetchedPokemon;
    if (selectedElements.value.length > 0) {
      filteredPokemon = fetchedPokemon.filter((pokemon) =>
        pokemon.types.some((type) =>
          selectedElements.value.includes(type.type.name)
        )
      );
    }

    // Take only the number of Pokemon we need for the current page
    pokemonList.value = filteredPokemon.slice(0, limit);

    // If we don't have enough Pokemon after filtering, fetch more
    if (
      pokemonList.value.length < limit &&
      offsetValue + limit * 2 < filteredPokemonList.value.length
    ) {
      const nextBatch = await loadMorePokemon(offsetValue + limit * 2);
      pokemonList.value = [...pokemonList.value, ...nextBatch].slice(0, limit);
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Helper function to load more Pokemon if needed
const loadMorePokemon = async (offset) => {
  const nextPokemonBatch = filteredPokemonList.value.slice(
    offset,
    offset + limit
  );
  const morePokemon = await Promise.all(
    nextPokemonBatch.map((pokemon) => fetchPokemonDetails(pokemon.url))
  );
  return morePokemon.filter(
    (pokemon) =>
      selectedElements.value.length === 0 ||
      pokemon.types.some((type) =>
        selectedElements.value.includes(type.type.name)
      )
  );
};

// Watch for changes in selected elements
watch(selectedElements, () => {
  loadPokemonList();
});

// Modified filtered Pokemon list computed property
const filteredPokemonList = computed(() => {
  let filtered = allPokemonList.value;

  // Apply name search filter
  if (searchTerm.value) {
    filtered = filtered.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  return filtered;
});

// Paginate the filtered list
const paginatedPokemonList = computed(() => {
  return pokemonList.value;
});

// Search Pokémon as the user types
const searchPokemon = () => {
  currentIndex.value = 1; // Reset to first page of filtered results
  loadPokemonList();
};
const nextPage = () => {
  currentIndex.value += 1;
  loadPokemonList();
};

const previousPage = () => {
  if (currentIndex.value > 1) {
    currentIndex.value -= 1;
    loadPokemonList();
  }
};

watch(searchTerm, (newVal) => {
  if (!newVal.trim()) {
    loadPokemonList(); // Reset to default list when search term is cleared
  }
});

onMounted(async () => {
  await fetchAllPokemon(); // Load all Pokémon names and URLs on mount
  loadPokemonList(); // Load the first set of Pokémon based on pagination
});
</script>
