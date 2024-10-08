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

export const getColor = (type) => {
  return colours[type] || "rgba(255, 255, 255, 0.2)"; // Default to white if type is not found
};

export const getTypeColor = (type) => {
  return typeColours[type] || "rgba(255, 255, 255, 0.2)"; // Default to white if type is not found
};
