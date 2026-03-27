let listaDeLojas = [];
let listaDeOfertas = [];
const inputPesquisa = document.getElementById('search-input');
const selectOrdenacao = document.getElementById('sort-select');
const inputMaxPreco = document.getElementById('max-price');
let lojaSelecionada = 'all';
inputPesquisa.addEventListener('input', aplicarFiltros);
selectOrdenacao.addEventListener('change', aplicarFiltros);
inputMaxPreco.addEventListener('input', aplicarFiltros);

async function iniciarApp() {
    const lojasURL = "https://www.cheapshark.com/api/1.0/stores";
    const responseLojas = await fetch(lojasURL);
    const dataLojas = await responseLojas.json();
    listaDeLojas = dataLojas;

    const ofertasURL = "https://www.cheapshark.com/api/1.0/deals?onSale=1";
    const responseOfertas = await fetch(ofertasURL);
    const dataOfertas = await responseOfertas.json();
    listaDeOfertas = dataOfertas

    let listaOrganizadaPorNota = [...listaDeOfertas].sort((a, b) => {
        return Number(b.dealRating) - Number(a.dealRating);
    });

    const melhorOferta = listaOrganizadaPorNota[0];

    console.log(listaDeLojas);
    console.log(listaDeOfertas);

    renderizarHero(melhorOferta);

    renderizarOfertas(listaDeOfertas);
};

function renderizarOfertas(ofertas) {
    const skeleton = document.getElementById('skeleton-grid');
    const deals = document.getElementById('deals-grid');
    const dealsTitle = document.getElementById('deals-title');

    skeleton.classList.add('hidden');
    deals.classList.remove('hidden');
    deals.classList.add('grid');

    deals.innerHTML = '';

    if(ofertas.length === 0) {
        dealsTitle.innerText = "Nenhuma oferta encontrada";

        return;
    } else {
        dealsTitle.innerText = "Ofertas em destaque";
    }

    ofertas.forEach(oferta => {
        const lojaEncontrada = listaDeLojas.find(loja => loja.storeID === oferta.storeID);
        const imagemAltaRes = oferta.thumb.replace('capsule_sm_120', 'header');
        const nomeDaLoja = lojaEncontrada ? lojaEncontrada.storeName : "Loja Desconhecida";

        let cartaoHTML = `
        <article class="game-card rounded-2xl overflow-hidden bg-shark-800/80 border border-shark-700/50 relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.7),_0_0_30px_rgba(57,255,20,0.1)] hover:border-neon-green/30">
            
            <div class="aspect-video w-full relative bg-shark-800 overflow-hidden">
                <img src="${imagemAltaRes}" alt="Cover" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onerror="this.src=''; this.parentElement.style.background='#1e2333';" />
                
                <div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-display font-bold uppercase text-shark-950 shadow-[0_0_10px_rgba(57,255,20,0.3)]" style="background: linear-gradient(135deg, #39FF14, #22c55e);">
                    -${Math.round(oferta.savings)}%
                </div>
                
                <div class="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-white text-shark-950 text-[10px] font-bold shadow-lg border border-shark-800">
                    ${nomeDaLoja}
                </div>

                <div class="absolute inset-0 bg-shark-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <a href="https://www.cheapshark.com/redirect?dealID=${oferta.dealID}" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider text-shark-950" style="background: linear-gradient(135deg, #39FF14, #00D4FF);">
                        Ver Oferta
                    </a>
                </div>
            </div>

            <div class="p-4">
                <h3 class="font-display font-bold text-base text-white uppercase tracking-wide truncate mb-1">
                    ${oferta.title}
                </h3>
                
                <div class="flex items-end justify-between mb-3 mt-3">
                    <div>
                        <span class="text-slate-500 text-xs font-body line-through block">$${oferta.normalPrice}</span>
                        <span class="font-display font-bold text-2xl leading-none text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">$${oferta.salePrice}</span>
                    </div>
                </div>

                <div class="space-y-1 mt-2">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] text-slate-600 font-body uppercase tracking-widest">Avaliação</span>
                        <span class="text-[10px] font-display font-bold text-neon-blue">${oferta.dealRating} / 10</span>
                    </div>
                    <div class="h-1 w-full bg-shark-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full" style="width: ${oferta.dealRating * 10}%; background: linear-gradient(90deg, #39FF14, #00D4FF);"></div>
                    </div>
                </div>
            </div>
        </article>
        `;

        deals.innerHTML += cartaoHTML;
    });
}

function aplicarFiltros() {
    const textoBusca = inputPesquisa.value.toLowerCase();

    const regraOrdenacao = selectOrdenacao.value;
    const precoMax = inputMaxPreco.value;
    
    let ofertasFiltradas = listaDeOfertas.filter(oferta => {
        const passaNoTexto = oferta.title.toLowerCase().includes(textoBusca);
        
        let passaNoPreco = true; 
        if (precoMax !== "") {
            passaNoPreco = Number(oferta.salePrice) <= Number(precoMaximo);
        }

        let passaNoFiltroDeLoja = true; 
        
        if (lojaSelecionada !== 'all') {
            passaNoFiltroDeLoja = oferta.storeID === lojaSelecionada;
        }

        return passaNoTexto && passaNoPreco && passaNoFiltroDeLoja;
    });


    if (regraOrdenacao === 'Price') {
        ofertasFiltradas.sort((a, b) => Number(a.salePrice) - Number(b.salePrice));
    }

    else if (regraOrdenacao === 'Savings') {
        ofertasFiltradas.sort((a, b) => Number(a.savings) - Number(b.savings));
    }

    else if (regraOrdenacao === 'DealRating') {
        ofertasFiltradas.sort((a, b) => Number(a.dealRating) - Number(b.dealRating));
    }

    else if (regraOrdenacao === 'Release') {
        ofertasFiltradas.sort((a, b) => Number(a.releaseDate) - Number(b.releaseDate))
    };

    renderizarOfertas(ofertasFiltradas);
};

function renderizarHero(ofertaDestaque) {
    const titleEl = document.getElementById('hero-title');
    const discountEl = document.getElementById('hero-discount');
    const normalPriceEl = document.getElementById('hero-normal-price');
    const salePriceEl = document.getElementById('hero-sale-price');
    const imgEl = document.getElementById('hero-img');
    const ctaEl = document.getElementById('hero-cta');

    let imagemDestaque;
    if (ofertaDestaque.thumb.includes('steamstatic')) {
        imagemDestaque = ofertaDestaque.thumb.replace('capsule_sm_120', 'header');
    } else {
        imagemDestaque = ofertaDestaque.thumb;
    }

    titleEl.innerText = ofertaDestaque.title;
    discountEl.innerText = `-${Math.round(ofertaDestaque.savings)}% OFF`;
    normalPriceEl.innerText = `$${ofertaDestaque.normalPrice}`;
    salePriceEl.innerText = `$${ofertaDestaque.salePrice}`;
    
    imgEl.src = imagemDestaque;
    ctaEl.href = `https://www.cheapshark.com/redirect?dealID=${ofertaDestaque.dealID}`;
}

const botoesLojas = document.querySelectorAll('.store-pill');

botoesLojas.forEach(botao => {
    botao.addEventListener('click', function() {
        const idDaLojaClicada = this.getAttribute('data-store');
        
        lojaSelecionada = idDaLojaClicada;

        botoesLojas.forEach(b => {
            b.classList.remove('active', 'bg-neon-green/10', 'text-neon-green', 'border-neon-green/50');
            b.classList.add('text-slate-400', 'border-shark-600');
        });

        this.classList.add('active', 'bg-neon-green/10', 'text-neon-green', 'border-neon-green/50');
        this.classList.remove('text-slate-400', 'border-shark-600');

        aplicarFiltros();
    });
});

iniciarApp();