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
            @click="filterByElement(elementTypes[index])"
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
    :loading="loadingEvolution"
  />
</template>

<script setup>
useHead({
  title: "Pokédex - Gotta Catch 'Em All",
});

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

const selectElement = ref(null);
const loadingEvolution = ref(false); // Separate loading state for evolution chain images
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

const elementTypes = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

const waitForImages = async (imageUrls) => {
  const imagePromises = imageUrls.map((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = resolve; // Resolve when image loads
      img.onerror = resolve; // Resolve even if image fails to load
    });
  });
  await Promise.all(imagePromises); // Wait for all images to load
};

// Function to handle element icon click
const filterByElement = async (element) => {
  selectElement.value = element; // Set selected element

  loading.value = true; // Start loading
  error.value = null; // Clear any previous errors

  try {
    // Fetch Pokémon of the selected element type from the API
    const response = await fetch(`https://pokeapi.co/api/v2/type/${element}/`);
    if (!response.ok) {
      throw new Error("Failed to load Pokémon by type");
    }

    const data = await response.json();
    const filteredPokemon = data.pokemon.map((p) => p.pokemon); // Extract Pokémon details

    allPokemonList.value = filteredPokemon; // Update the list with filtered Pokémon
    currentIndex.value = 1; // Reset to the first page
    loadPokemonList(); // Load the first page of the filtered list
  } catch (err) {
    error.value = err.message; // Display error message
  } finally {
    loading.value = false; // Hide loader
  }
};

const openPokemonCard = async (pokemon) => {
  selectedPokemon.value = pokemon;
  pokemonCard.value = true;
  loadingEvolution.value = true;

  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
  );
  const speciesData = await speciesResponse.json();

  const evolutionChainUrl = speciesData.evolution_chain.url;

  await getEvolutionChain(evolutionChainUrl);
  loadingEvolution.value = false;
};

const getEvolutionChain = async (url) => {
  loadingEvolution.value = true;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to load Evolution Chain");

    const data = await response.json();
    evolutionChain.value = parseEvolutionChain(data.chain);

    // Collect image URLs for the evolution chain and wait for them to load
    const evolutionImageUrls = evolutionChain.value.map(
      (evo) =>
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`
    );
    await waitForImages(evolutionImageUrls);
  } catch (err) {
    error.value = err.message;
  } finally {
    loadingEvolution.value = false; // Finish evolution image loading
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
      id: pokemonId, // Keep id to construct image URL
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

const loadPokemonList = async () => {
  loading.value = true; // Show loader
  error.value = null;
  pokemonList.value = [];
  try {
    const offsetValue = (currentIndex.value - 1) * limit;
    const pokemonToFetch = filteredPokemonList.value.slice(
      offsetValue,
      offsetValue + limit
    );

    const pokemonPromises = pokemonToFetch.map((pokemon) =>
      fetchPokemonDetails(pokemon.url)
    );
    pokemonList.value = await Promise.all(pokemonPromises);

    // Get image URLs from fetched Pokémon data
    const pokemonImageUrls = pokemonList.value.map(
      (pokemon) => pokemon.sprites.other?.["official-artwork"]?.front_default
    );

    // Wait for all images to load before hiding the loader
    await waitForImages(pokemonImageUrls);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false; // Hide loader only after images have loaded
  }
};

// Computed property to filter the Pokémon list based on the search term
const filteredPokemonList = computed(() => {
  if (!searchTerm.value) {
    return allPokemonList.value;
  }
  return allPokemonList.value.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
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
