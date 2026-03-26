let cardPersonagem = document.getElementById('card-por-id');
let filtro = document.getElementById('buscar-id');
let cardTodos = document.getElementById('card-todos');


async function buscarPorId() {
    try {

        let idBuscado = filtro.value;

        const URL = `https://rickandmortyapi.com/api/character/${idBuscado}`;
        const response = await fetch(URL);
        const data = await response.json();

        const obj = {
            name: data.name,
            status: data.status,
            species: data.species,
            image: data.image
        };


        let card = `<img src="${obj.image}">
                <h2>${obj.name}</h2>
                <p>${obj.status}</p>
                <p>${obj.species}</p>`


        cardPersonagem.innerHTML = card

        console.log("Dados da API: ", data);
    }

    catch (error) {
        console.error("Erro: ", error);
    };
};

async function listarTodos() {
    try {
        const URL = `https://rickandmortyapi.com/api/character`
        const response = await fetch(URL);
        const data = await response.json();

        let htmlFinal = "";

        data.results.forEach(personagem => {

            const obj = {
                name: personagem.name,
                status: personagem.status,
                species: personagem.species,
                image: personagem.image
            };


            let card = `<img src="${obj.image}">
                <h2>${obj.name}</h2>
                <p>${obj.status}</p>
                <p>${obj.species}</p>`

            htmlFinal += card;

        });
        cardTodos.innerHTML += htmlFinal
    }

    catch (error) {
        console.error("Erro: ", error);
    }
}

function listarPersonagens() {
    listarTodos();
}

function encontrarPersonagem() {
    buscarPorId();
}