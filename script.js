/* script.js */
const residentes = Array.from({ length: 32 }, (_, i) => `Residente ${i + 1}`);

let jogador = {
  nome: "",
  pontuacao: 0,
  residentesSorteados: []
};

const inputNome = document.getElementById("nomeJogador");
const botaoCriarJogador = document.getElementById("criarJogador");
const botaoIniciarJogo = document.getElementById("iniciarJogo");
const painelJogo = document.getElementById("painelJogo");
const tituloJogador = document.getElementById("tituloJogador");
const pontuacao = document.getElementById("pontuacao");
const botaoSortearResidentes = document.getElementById("sortearResidentes");
const residentesSorteados = document.getElementById("residentesSorteados");

botaoCriarJogador.addEventListener("click", () => {
  const nome = inputNome.value.trim();

  if (!nome) {
    alert("Digite o nome do jogador.");
    return;
  }

  jogador.nome = nome;
  jogador.pontuacao = 0;
  jogador.residentesSorteados = [];

  tituloJogador.textContent = jogador.nome;
  pontuacao.textContent = jogador.pontuacao;
  residentesSorteados.innerHTML = "";

  botaoIniciarJogo.disabled = false;
});

botaoIniciarJogo.addEventListener("click", () => {
  painelJogo.classList.remove("hidden");
});

botaoSortearResidentes.addEventListener("click", () => {
  jogador.residentesSorteados = sortearSemRepetir(residentes, 3);
  mostrarResidentes(jogador.residentesSorteados);
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
  residentesSorteados.innerHTML = `
    <h3>Escolha 1 residente</h3>
    ${lista
      .map(
        residente => `
          <div class="residente">
            ${residente}
          </div>
        `
      )
      .join("")}
  `;
}
