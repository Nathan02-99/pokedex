const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const savedQueries = [];
let pokemon = [];

let originalPokemon = [];

const fetchPokemon = () => {
  const promises = [];
  for (let i = 1; i <= 1010; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }
  Promise.all(promises).then((results) => {
    pokemon = results.map((result) => ({
      name: result.name,
      image: result.sprites['front_default'],
      type: result.types.map((type) => type.type.name).join(', '),
      id: result.id,
    }));
    originalPokemon = [...pokemon]; // Save the original pokemon array
    displayPokemon(pokemon);
  });
};


const typeColors = {
  rock: [182, 158, 49],
  ghost: [112, 85, 155],
  steel: [183, 185, 208],
  water: [100, 147, 235],
  grass: [116, 203, 72],
  psychic: [251, 85, 132],
  ice: [154, 214, 223],
  dark: [117, 87, 76],
  fairy: [230, 158, 172],
  normal: [170, 166, 127],
  fighting: [193, 34, 57],
  flying: [168, 145, 236],
  poison: [164, 62, 158],
  ground: [222, 193, 107],
  bug: [167, 183, 35],
  fire: [245, 125, 49],
  electric: [249, 207, 48],
  dragon: [112, 55, 255],
};

const displayPokemon = (pokemonList) => {
  const pokemonHTMLString = pokemonList
    .map(
      (pokemon) => `
      <li class="card">
        <div class="card-header">
          <h2 class="card-title">#${String(pokemon.id).padStart(4, '0')}</h2>
          <h2 class="card-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        </div>
        <div class="card-placeholder">
          <img class="card-image" style="transform: translateY(-5.5rem);" src="${pokemon.image}" />
          <p class="card-subtitle">
            ${pokemon.type
              .split(', ')
              .map(
                (type) =>
                  `<span style="background-color: rgb(${typeColors[type]})">${type}</span>`
              )
              .join(', ')}
          </p>
        </div>
      </li>
    `
    )
    .join('');

  pokedex.innerHTML = pokemonHTMLString;
  updateCardBackgroundColors(pokemonList);
};


const updateCardBackgroundColors = (pokemon) => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    const types = pokemon[index].type.split(", ");
    const firstType = types[0];
    const backgroundColors = types.map((type) => typeColors[firstType]);
    const averageColor = calculateAverageColor(backgroundColors);
    card.style.backgroundColor = `rgb(${averageColor[0]}, ${averageColor[1]}, ${averageColor[2]})`;
  });
};

const calculateAverageColor = (colors) => {
  const totalColors = colors.length;
  let sumRed = 0;
  let sumGreen = 0;
  let sumBlue = 0;

  colors.forEach((color) => {
    sumRed += color[0];
    sumGreen += color[1];
    sumBlue += color[2];
  });

  const averageRed = Math.round(sumRed / totalColors);
  const averageGreen = Math.round(sumGreen / totalColors);
  const averageBlue = Math.round(sumBlue / totalColors);

  return [averageRed, averageGreen, averageBlue];
};

const saveSearchQuery = (query) => {
  savedQueries.push(query);
  console.log('Saved queries:', savedQueries);

  if (query.trim() === '') {
    pokemon = [...originalPokemon]; // Reset the pokemon array to its original state
  } else {
    // Compare the query with the Pokémon data
    const matchingPokemon = originalPokemon.filter((p) => {
      return (
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toString() === query
      );
    });

    pokemon = matchingPokemon;
  }

  // Display the matching Pokémon
  displayPokemon(pokemon);
};


const searchPokemon = () => {
  const query = searchInput.value;

  if (query.trim() === '') {
    pokemon = [...originalPokemon]; // Reset the pokemon array to its original state
    displayPokemon(pokemon);
  } else {
    saveSearchQuery(query);
  }
};

searchButton.addEventListener('click', searchPokemon);
searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    searchPokemon();
  }
});

fetchPokemon();
