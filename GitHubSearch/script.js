let card = document.getElementById('card-usuario');
let usuarioBuscado = document.getElementById('perfil-digitado');


async function buscarUsuario() {
    try {
        let usuarioEncontrado = usuarioBuscado.value;
        const URL = `https://api.github.com/users/${usuarioEncontrado}`
        const response = await fetch(URL);
        const data = await response.json();

        const obj = {
            avatarUrl: data.avatar_url,
            name: data.name,
            bio: data.bio,
            publicRepos: data.public_repos
        };

        let cardAtt = `<div class="bg-[#1e2532] border-2 border-indigo-500 rounded-xl p-6 flex flex-col items-center w-72 shadow-2xl">
    
    <img src="${obj.avatarUrl}" alt="Avatar de ${obj.name}" class="w-24 h-24 rounded-full object-cover mb-4 shadow-md">
    
    <h2 class="text-indigo-400 font-bold text-xl text-center">${obj.name || 'Sem nome'}</h2>
    <p class="text-gray-400 text-sm mt-1 text-center font-medium">${obj.bio || 'Usuário do GitHub'}</p>
    
    <div class="flex gap-3 w-full mt-6">
        <a href="#" class="bg-indigo-500 hover:bg-indigo-600 text-white flex-1 py-2 rounded-full text-center text-sm font-semibold transition-colors">
            Repo's públicos: ${obj.publicRepos}
        </a>
    </div>

</div>
`
        
        card.innerHTML = cardAtt;
    }

    catch (error) {
        console.error("Erro:", error)
    }
};

function buscarPerfil() {
    buscarUsuario();
};