let opener = document.querySelector("#fil"); //es el boton para abrir el filtro
let select = document.querySelector("#select"); // 
const nameFilter = document.querySelector('#nameFilter'); // El input donde se escribira el nombre del pokemon
const gen = document.querySelector('#gen'); //El selector de lista en donde se muestran las generaciones
const filter = document.querySelector('#filter'); //boton que se oprime para aplicar filtros
const container = document.querySelector('#container'); // Ahi es donde se pondran las trajetas
const type = document.querySelectorAll('input[name="type"]'); //traigo todos los tipos de pokemon para filtrarlos
//-----------------------------------------primero creo el funcionamiento del boton, para que se muestre el menu cuando este cerrado----------------------------------------------
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
// Creo las funciones con las que se crean las cards, la primera es cuado el pokemon solo es de un tipo, el otro es para los que tienen 2 tipos
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
} //ahora creo una funcion asincronica, para que el sitio web funcione aunque no se haya llevado a cabo el proceso
const pokemonEspe = async (a) => {
    const pokeIn = await fetch(`https://pokeapi.co/api/v2/pokemon/${a.name}`); //al objeto 'pokeIn' le doy el valor que me da la pokeapi el pokemon con el nombre solicitado en la siguiente funcion
    const data1 = await pokeIn.json()
    const newPokemon = document.createElement("div"); //creo el div 'new pokemon'
    if (data1.types.length == 2) { //divido a los pokemones que tiene 1 o 2 tipos.
        ap2(newPokemon, data1.name, data1.id, data1.types[0].type.name, data1.stats[0].base_stat, data1.stats[1].base_stat, data1.stats[5].base_stat, data1.types[1].type.name) //le paso a la card los datos que se encuentran en la api que se esta usando 
    }
    else {
        ap1(newPokemon, data1.name, data1.id, data1.types[0].type.name, data1.stats[0].base_stat, data1.stats[1].base_stat, data1.stats[5].base_stat)
    }
    container.append(newPokemon); //agrego en nuevo pokemon a l apagina web
}
const pokePerGen = async (gen) => { //creo la funcion que solicita informacion a la api dependiendo de que generacion de pokemones se requiera. (es asinconica)
    const genlist = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    const data0 = await genlist.json()
    data0.pokemon_species.forEach(pokemon => {
        pokemonEspe(pokemon); //cuando termina de traer la api, hace que por cada pokemon que aparece ahi, ejecuete la funcion en donde se crea ese pokemon, entre mas rapido carge mas rapido se vera en la pagina web
    });
}
const pokePerGenName = async (gen) => { //creo otra funcion que filtra el pokemon por generacion y nombre
    const genlist = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    const data0 = await genlist.json()
    data0.pokemon_species.forEach(pokemon => {
        (pokemon.name.toLowerCase().includes(nameFilter.value.toLowerCase())) && pokemonEspe(pokemon); // si el nombre el pokemon cumple con el requisito, se solisitara que se cree una card con ese pokemon
    });
}
const pokePerType = async (gen, type) => { //esta funcion es para filtrar los pokemones por generacion y tipo
    const genlist = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    const data0 = await genlist.json()
    data0.pokemon_species.forEach(pokemon => {
        pokePerType2(pokemon, type); //por cada pokemon de la lista inicial se hara otra funcion la cual los filtrara de manera asincronica
    });
}
const pokePerType2 = async (a, type) => {
    const pokeIn = await fetch(`https://pokeapi.co/api/v2/pokemon/${a.name}`); //se trae la informacion de cada pokemon
    const data1 = await pokeIn.json()
    if (data1.types.length == 2) { //primero divide a los pokemones que tiene 1 o 2 tipos
        if (data1.types[0].type.name == type || data1.types[1].type.name == type) { //ahora revisa si el tipo de pokemones que se esta pidiendo cumple con alguno de los tipos que el pokemon posee. si es falso no pasara nada con ese pokemon (no se mostrara)
            const newPokemon = document.createElement("div"); 
            ap2(newPokemon, data1.name, data1.id, data1.types[0].type.name, data1.stats[0].base_stat, data1.stats[1].base_stat, data1.stats[5].base_stat, data1.types[1].type.name) //si cumple el filtro se crea card para el pokemon y se muestra en la pagina
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
filter.addEventListener('click', () => { //creo el evento que cuando se cliquee el boton filter revise que es lo que se pide
    container.innerHTML = '' //primero borra todas la cards que estan en la pagina 
    if (isNaN(gen.value)) { //si la generacion de pokemon no esta definida se le dara en valor de 1
        gen.value = 1;
    }
    let selected = 'all' // crea una variable con el valor all (para el filtro de tipos), para que si no se define te muestre todo
    for (const option of type) { // mira cada radio y cuando encuentra el que esta seleccionado le da su valor a "selected" y rompe el ciclo
        if (option.checked) {
            selected = option.value;
            break;
        }
    }
    if (selected === 'all') { //si en tipo de pokemon esta seleccionado "all", solo dividira a los pokemones por generacion
        pokePerGen(gen.value);
    }
    else if (selected !== 'all') { // sino, lo filtrara por tipos revisando que tipo es el que se esta pidiendo. 
        pokePerType(gen.value, selected)
    }
})
pokePerGen(1) // efectuo la primera funcion para que muestre a todos los pokemones de primera generacion al recargar la pagina
nameFilter.addEventListener('keyup', () => { //creo el evendo que se efectua cada ves que se escribe algo en el filtro por nombre
    if (isNaN(gen.value)) {
        gen.value = 1
    }
    container.innerHTML = '';
    const nameFilter = document.querySelector('#nameFilter');
    if (nameFilter.value != '') { 
        pokePerGenName(gen.value) // si el buscador tiene un valor distinto a vacio buscara que pokemones tiene en su nombre la palabra escrita ahi
    }
    else {//si el buscador esta vacio te mostrara todos los pokemones de la generacion seleccionada
        pokePerGen(gen.value)
    }
})