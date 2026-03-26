const films = document.getElementById('filmes');
const botoes = document.querySelectorAll('.tab-btn');
const filmeBusca = document.getElementById('input-field');
let todosOsFilmes = [];



function renderizarFilmes(listaDeFilmes) {
    films.innerHTML = '';

    listaDeFilmes.forEach(filme => {
        let newHtml =
            `<div class="space-y-1 bg-[#B5CEA6]/30 p-8 rounded-[40px] hover:-translate-y-1 transition-all">
        <div class="relative inline-block">
        <img class="h-96 shadow-xl/30 rounded-[40px]" src="${filme.image}">
        <div class="absolute top-4 right-4 bg-[#F2F1E5] text-[#53684A] px-3 py-1 rounded-full text-sm font-bold shadow-md">
        ${filme.release_date}
        </div>
        </div>
        <h3 class="text-[#223519] italic font-semibold">${filme.title}</h3>
        <span class="text-xs text-[#9AB28C]">${filme.original_title}</span>
        <div class="pt-2 space-y-1">
        <p class="font-medium text-[#636037]">${filme.director} • <span class="text-[#636037]/80">${filme.running_time} minutos</span></p>
        
        
        <p class="font-medium text-[#53684A]">IMDB Score: <span class="text-[#53684A]/80">${filme.rt_score}</span></p>
        </div>
        </div>`

        films.innerHTML += newHtml;
    });
};

async function buscarDadosAPI() {
    const URL = "https://ghibliapi.vercel.app/films";
    const response = await fetch(URL);
    todosOsFilmes = await response.json();

    renderizarFilmes(todosOsFilmes);
};

filmeBusca.addEventListener('input', (event) => {
    const textoDigitado = event.target.value.toLowerCase();

    const filmesFiltrados = todosOsFilmes.filter(filme => {
        return filme.title.toLowerCase().includes(textoDigitado);
    });

    renderizarFilmes(filmesFiltrados);
});

botoes.forEach(btn => {
    btn.addEventListener('click', () => {
        botoes.forEach(b => {
            b.classList.remove('bg-[#B5CEA6]')
        });

        const diretorEscolhido = btn.textContent.toLowerCase().trim();
        btn.classList.add('bg-[#B5CEA6]');

        if (diretorEscolhido == 'todos os filmes') {
            renderizarFilmes(todosOsFilmes);
        }

        else {
            const filtroDiretor = todosOsFilmes.filter(filme => {
                return filme.director.toLowerCase().includes(diretorEscolhido);
            })

            renderizarFilmes(filtroDiretor);
        };
    });
});



buscarDadosAPI();