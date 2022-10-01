let opener = document.querySelector("#fil");
let select = document.querySelector("#select");
const nameFilter = document.querySelector('#nameFilter');
const gen = document.querySelector('#gen');
const filter = document.querySelector('#filter');
const container = document.querySelector('#container');
const type = document.querySelectorAll('input[name="type"]');
opener.addEventListener('click', () => {
    if (opener.classList == ('opener openerClose')) {
        opener.classList.remove('openerClose')
        nameFilter.classList.remove('filterInputOpen')
    }
    else {
        opener.classList.add('openerClose')
        nameFilter.classList.add('filterInputOpen')
    }
    if (select.classList == ('open open2')) {
        select.classList.remove('open2')
    }
    else {
        select.classList.add('open2')
    }
})

const ap1 = (l, q, w, e, r, t, y) => {
    l.innerHTML = `
    <div class="card">
    <div class="side">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${w}.png"  alt="as" class="imgCard">
    </div>
    <div class="padingL">
        <h2 class="main">${q} ${w}</h2>
        <h3 class="secu">type: ${e}</h3>
        <h3 class="secu">Hp: ${r}</h3>
        <h3 class="secu">Attack: ${t}</h3>
        <h3 class="secu">Speed: ${y}</h3>
    </div>
    </div>
    `
}
const ap2 = (l, q, w, e, r, t, y, k) => {
    l.innerHTML = `
    <div class="card">
    <div class="side">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${w}.png"  alt="as" class="imgCard">
    </div>
    <div class="padingL">
        <h2 class="main">${q} ${w}</h2>
        <h3 class="secu">type: ${e}, ${k}</h3>
        <h3 class="secu">Hp: ${r}</h3>
        <h3 class="secu">Attack: ${t}</h3>
        <h3 class="secu">Speed: ${y}</h3>
    </div>
    </div>
    `
}
const pokemonEspe = async (a) => {
    const pokeIn = await fetch(`https://pokeapi.co/api/v2/pokemon/${a.name}`);
    const data1 = await pokeIn.json()
    const newPokemon = document.createElement("div");
    if (data1.types.length == 2) {
        ap2(newPokemon, data1.name, data1.id, data1.types[0].type.name, data1.stats[0].base_stat, data1.stats[1].base_stat, data1.stats[5].base_stat, data1.types[1].type.name)
    }
    else {
        ap1(newPokemon, data1.name, data1.id, data1.types[0].type.name, data1.stats[0].base_stat, data1.stats[1].base_stat, data1.stats[5].base_stat)
    }
    container.append(newPokemon);
}
const pokePerGen = async (gen) => {
    const genlist = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    const data0 = await genlist.json()
    data0.pokemon_species.forEach(pokemon => {
        pokemonEspe(pokemon);
    });
}
const pokePerGenName = async (gen) => {
    const genlist = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    const data0 = await genlist.json()
    data0.pokemon_species.forEach(pokemon => {
        (pokemon.name.toLowerCase().includes(nameFilter.value.toLowerCase())) && pokemonEspe(pokemon);
    });
}
const pokePerType = async (gen, type) => {
    const genlist = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    const data0 = await genlist.json()
    data0.pokemon_species.forEach(pokemon => {
        pokePerType2(pokemon, type);
    });
}
const pokePerType2 = async (a, type) => {
    const pokeIn = await fetch(`https://pokeapi.co/api/v2/pokemon/${a.name}`);
    const data1 = await pokeIn.json()
    if (data1.types.length == 2) {
        if (data1.types[0].type.name == type || data1.types[1].type.name == type) {
            const newPokemon = document.createElement("div");
            ap2(newPokemon, data1.name, data1.id, data1.types[0].type.name, data1.stats[0].base_stat, data1.stats[1].base_stat, data1.stats[5].base_stat, data1.types[1].type.name)
            container.append(newPokemon);
        }
    }
    else {
        if (data1.types[0].type.name == type) {
            const newPokemon = document.createElement("div");
            ap1(newPokemon, data1.name, data1.id, data1.types[0].type.name, data1.stats[0].base_stat, data1.stats[1].base_stat, data1.stats[5].base_stat)
            container.append(newPokemon);
        }
    }
}
filter.addEventListener('click', () => {
    container.innerHTML = ''
    if (isNaN(gen.value)) {
        gen.value = 1;
    }
    let selected = 'all'
    for (const option of type) { // mira cada radio y cuando encuentra el que esta seleccionado le da su valor a "selected" y rompe el ciclo
        if (option.checked) {
            selected = option.value;
            break;
        }
    }
    if (selected === 'all') {
        pokePerGen(gen.value);
    }
    else if (selected !== 'all') {
        pokePerType(gen.value, selected)
    }
})
pokePerGen(1)
nameFilter.addEventListener('keyup', () => {
    if (isNaN(gen.value)) {
        gen.value = 1
    }
    container.innerHTML = '';
    const nameFilter = document.querySelector('#nameFilter');
    if (nameFilter.value != '') {
        pokePerGenName(gen.value)
    }
    else {
        pokePerGen(gen.value)
    }
})