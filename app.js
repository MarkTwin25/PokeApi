const typesSection = document.querySelector(".types");
const pokemons = document.querySelector(".pokemons");

// Get pokemon types from pokepi (Only first generation)
async function getTypes(){
    const response = await fetch("https://pokeapi.co/api/v2/generation/1/");
    const data = await response.json();
    const types = await data.types;
    const listTypes = [];

    types.forEach(element => {
         listTypes.push(element.name)
    });
    
    // Return a names list
    return listTypes;
}


// Create the filter buttons
async function createButtons(){
    let types = await getTypes();
    // Put them in uppercase
    types = types.map(element => element[0].toUpperCase() + element.slice(1));

    //Put them on screen
    types.forEach(element => {
        const div = createButton(element)
        typesSection.appendChild(div);
    })
}


// Function that creates a filter button
function createButton(element){
    const div = document.createElement("div");
    div.classList.add("type");
    div.classList.add(element.toLowerCase());
    div.textContent = element;

    //Returns a div that createButtons() will put in the DOM
    return div;
}


// Get pokemon links
async function getPokemonsLinks(){
    const req = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    const data = await req.json();

    var pokemonList = data.results;
    pokemonList = pokemonList.map(pokemon => pokemon.url)
    return pokemonList;
}

// use getPokemonsLinks to create all cards
async function createAllCards(){
    const links = await getPokemonsLinks();
    const promises = links.map(link => fetch(link).then(data => data.json()))
    const res = await Promise.all(promises);

    
    for(const pokemon of res){
        const newCard = createCard(pokemon);
        pokemons.appendChild(newCard)
        
    }
}

// Display pokemons by filter 
async function display(filter){
    let selectPokemons = document.querySelectorAll(".pokemon");
    if(selectPokemons.length ===0){
        await createAllCards();
        selectPokemons = document.querySelectorAll(".pokemon");
    }

    if(filter === "see all"){
        Array.from(selectPokemons).forEach(el =>{
            el.classList.remove("hidden");
    });
    }
    else{
        Array.from(selectPokemons).forEach(el =>{
            if(!el.classList.contains(`${filter}-search`)){
                el.classList.add("hidden");
            }else{
                el.classList.remove("hidden");
            }
    });
    }
}

// Create a card 
function createCard(element){
    // principal div
    const pokemon = document.createElement("div");
    pokemon.classList.add("pokemon");

    // Types (maybe more than 1)
    let types = element.types;
    types = types.map(type => type.type.name)

    types.forEach(type => {
        pokemon.classList.add(`${type}-search`)
    })
    
    const container = document.createElement("div");
    container.classList.add("container");


    container.classList.add(`${element.types[0].type.name}`)


    // Create info div
    const info = document.createElement("div");
    info.classList.add("info"); 

    const h1 = document.createElement("h1");
    h1.classList.add("name")
    h1.textContent = element.name;

    const p = document.createElement("p");
    p.classList.add("num");
    p.textContent = setNum(element.id);

    info.appendChild(p);
    info.appendChild(h1);
    
    // List type
    const typeList = document.createElement("div");
    typeList.classList.add("type-list");

    // Create all types p
    for(let type of types) {
        let p = document.createElement("p");
        p.classList.add("pokemon-type");
        p.textContent = type;
        typeList.appendChild(p);
    }
    
    const img = document.createElement("img");
    img.src = element.sprites.other.dream_world.front_default;
    
    container.appendChild(img)
    container.appendChild(info);
    container.appendChild(typeList);
    pokemon.appendChild(container);

    return pokemon;

}


// Give format to a pokem ID
function setNum(num){
    const numStr = new String(num);
    if(numStr.length ==1){
        return `#00${num}`
    }else if(numStr.length == 2){
        return `#0${num}`;
    }else{
        return "#" +numStr;
    }

}


// Event delegation to display filters
typesSection.addEventListener("click", async (e)=> {
    if(e.target.classList.contains("type")){
        const textLower = e.target.textContent.toLowerCase();
        display(textLower);
    }
})


createButtons();