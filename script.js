const residentes = Array.from({ length: 31 }, (_, i) => {
  const numero = String(i + 1).padStart(2, "0");

  return {
    id: i + 1,
    nome: `Residente ${i + 1}`,
    imagem: `assets/cartas/residentes/residente-${numero}.png`
  };
});

let jogador = {
  nome: "",
  pontuacao: 0,
  residentesSorteados: [],
  residenteEscolhido: null
};

const inputNome = document.getElementById("nomeJogador");
const botaoCriarJogador = document.getElementById("criarJogador");
const botaoIniciarJogo = document.getElementById("iniciarJogo");
const painelJogo = document.getElementById("painelJogo");
const tituloJogador = document.getElementById("tituloJogador");
const pontuacao = document.getElementById("pontuacao");
const botaoSortearResidentes = document.getElementById("sortearResidentes");
const residentesSorteados = document.getElementById("residentesSorteados");
const residenteEscolhido = document.getElementById("residenteEscolhido");

botaoCriarJogador.addEventListener("click", () => {
  const nome = inputNome.value.trim();

  if (!nome) {
    alert("Digite o nome do jogador.");
    return;
  }

  jogador = {
    nome,
    pontuacao: 0,
    residentesSorteados: [],
    residenteEscolhido: null
  };

  tituloJogador.textContent = jogador.nome;
  pontuacao.textContent = jogador.pontuacao;
  residentesSorteados.innerHTML = "";
  residenteEscolhido.innerHTML = "";

  botaoIniciarJogo.disabled = false;
});

botaoIniciarJogo.addEventListener("click", () => {
  painelJogo.classList.remove("hidden");
});

botaoSortearResidentes.addEventListener("click", () => {
  jogador.residentesSorteados = sortearSemRepetir(residentes, 3);
  jogador.residenteEscolhido = null;

  mostrarResidentes(jogador.residentesSorteados);
  residenteEscolhido.innerHTML = "";
});

function sortearSemRepetir(lista, quantidade) {
  const copia = [...lista];
  const sorteados = [];

  for (let i = 0; i < quantidade; i++) {
    const indice = Math.floor(Math.random() * copia.length);
    sorteados.push(copia[indice]);
    copia.splice(indice, 1);
  }

  return sorteados;
}

function mostrarResidentes(lista) {
  residentesSorteados.innerHTML = lista
    .map(
      residente => `
        <article class="carta" data-id="${residente.id}">
          <img src="${residente.imagem}" alt="${residente.nome}" />
          <h3>${residente.nome}</h3>
          <button onclick="escolherResidente(${residente.id})">
            Escolher
          </button>
        </article>
      `
    )
    .join("");
}

function escolherResidente(id) {
  const residente = jogador.residentesSorteados.find(r => r.id === id);

  jogador.residenteEscolhido = residente;

  residenteEscolhido.innerHTML = `
    <h3>Residente escolhido</h3>
    <div class="carta carta-escolhida">
      <img src="${residente.imagem}" alt="${residente.nome}" />
      <h3>${residente.nome}</h3>
    </div>
  `;
}