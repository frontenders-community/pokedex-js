const API_URL = "https://pokeapi.co/api/v2/pokemon";

const searchBtn = document.querySelector('#searchBtn');
const searchInput = document.querySelector('#searchInput');

const pokemonName = document.querySelector('#pokemonName');
const pokemonWeight = document.querySelector('#pokemonWeight');
const pokemonHeight = document.querySelector('#pokemonHeight');
const pokemonImage = document.querySelector('#pokemonImage');
const resultText = document.querySelector('#resultText');

const pokemonStats = document.querySelector('#pokemonStats');

const defaultImageBtn = document.querySelector('#defaultImageBtn');
const shinyImageBtn = document.querySelector('#shinyImageBtn');
const addToPokedexBtn = document.querySelector('#addToPokedexBtn');

const pokedexContainer = document.querySelector('#pokedex');

let pokemon = null;
let pokedex = [];

async function searchPokemon(name) {
    // API_URL + "/" + name
    const response = await fetch(`${API_URL}/${name}`);
    const result = await response.json();
    pokemon = result;
    renderDetail();
    /*
    fetch(`${API_URL}/${name}`)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
    })
    */
    
    // Genero le statistiche
    pokemonStats.innerHTML = "";
    for(let i=0; i<pokemon.stats.length; i++) {
        const item = pokemon.stats[i];

        const div = document.createElement('div');
        const label = document.createElement('label');
        const progress = document.createElement('progress');

        label.innerText = item.stat.name;
        progress.value = item.base_stat;
        progress.max = 100;

        div.appendChild(label);
        div.appendChild(progress);
        pokemonStats.appendChild(div);
    }
}

function renderDetail() {
    pokemonName.innerHTML = `Nome: ${pokemon.name}`;
    pokemonWeight.innerHTML = `Peso: ${pokemon.weight}`;
    pokemonHeight.innerHTML = `Altezza: ${pokemon.height}`;
    pokemonImage.src = pokemon.sprites.front_default;
    resultText.innerHTML = `Ecco i tuoi risultati per [${pokemon.name}]`;
}

function renderPokedex() {
    pokedexContainer.innerHTML = "";
    for(let i=0; i<pokedex.length; i++) {
        pokedexContainer.innerHTML += `
            <div class="pokedex__item">
                <h3>${pokedex[i].name}</h3>
                <img src="${pokedex[i].sprites.front_default}"></img>
                <button class="small-btn" onclick="showPokemon(${i})">Mostra</button>
                <button class="small-btn button-outline" onclick="deletePokemon(${i})">Elimina</button>
            </div>
        `;
    }
}

function showPokemon(index) {
    pokemon = pokedex[index];
    renderDetail();
}

function deletePokemon(index) {
    /*
    const newPokedex = [];
    for(let i=0; i<pokedex.length; i++) {
        if (i !== index) {
            newPokedex.push(pokedex[i]);
        }
    }
    pokedex = newPokedex;
    renderPokedex();
    */

    pokedex = pokedex.filter((_, i) => i !== index);
    renderPokedex();
}

searchInput.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        const value = searchInput.value;
        if (value !== "") {
            searchPokemon(value);
        }
    }
});

searchBtn.addEventListener('click', function() {
    const value = searchInput.value;
    if (value !== "") {
        searchPokemon(value);
    }
});

defaultImageBtn.addEventListener('click', function() {
    if (pokemon !== null) {
        pokemonImage.src = pokemon.sprites.front_default;
    }
});

shinyImageBtn.addEventListener('click', function() {
    if (pokemon !== null) {
        pokemonImage.src = pokemon.sprites.front_shiny;
    }
});

addToPokedexBtn.addEventListener('click', function() {
    const find = pokedex.find(item => item.name === pokemon.name);

    if (pokemon !== null && pokedex.length < 10 && find === undefined) {
        pokedex.push(pokemon);
        renderPokedex();
        localStorage.setItem('pokedex', JSON.stringify(pokedex));
    }
});

function loadData() {
    const storage = localStorage.getItem('pokedex');
    pokedex = JSON.parse(storage);
    renderPokedex();
}

searchPokemon('bulbasaur');