function numeroDoArquivo(n) {
  return String(n).padStart(2, "0");
}

const residentes = Array.from({ length: 31 }, (_, i) => {
  const n = numeroDoArquivo(i + 1);

  return {
    id: i + 1,
    nome: `Residente ${i + 1}`,
    imagem: `assets/cartas/residentes/residente-${n}.png`
  };
});

const chefes = Array.from({ length: 36 }, (_, i) => {
  const n = numeroDoArquivo(i + 1);

  return {
    id: i + 1,
    tipo: "chefe",
    nome: `Chefe ${i + 1}`,
    imagem: `assets/cartas/chefes/chefe-${n}.png`
  };
});

const locais = Array.from({ length: 39 }, (_, i) => {
  const n = numeroDoArquivo(i + 1);

  return {
    id: `local-${n}`,
    tipo: "local",
    nome: `Local ${i + 1}`,
    imagem: `assets/cartas/tatica/local/local-${n}.png`
  };
});

const itens = Array.from({ length: 30 }, (_, i) => {
  const n = numeroDoArquivo(i + 1);

  return {
    id: `item-${n}`,
    tipo: "item",
    nome: `Item ${i + 1}`,
    imagem: `assets/cartas/tatica/item/item-${n}.png`
  };
});

const eventos = Array.from({ length: 38 }, (_, i) => {
  const n = numeroDoArquivo(i + 1);

  return {
    id: `evento-${n}`,
    tipo: "evento",
    nome: `Evento ${i + 1}`,
    imagem: `assets/cartas/tatica/evento/evento-${n}.png`
  };
});

let baralhoChefes = [...chefes];
let baralhoTaticas = [...locais, ...itens, ...eventos];

let jogador = {
  nome: "",
  pontuacao: 0,
  energia: 7,
  residentesSorteados: [],
  residenteEscolhido: null,
  chefes: [],
  taticas: []
};

const telaInicial = document.getElementById("telaInicial");
const telaEscolhaResidente = document.getElementById("telaEscolhaResidente");
const telaJogo = document.getElementById("telaJogo");

const inputNome = document.getElementById("nomeJogador");
const botaoCriarJogador = document.getElementById("criarJogador");
const botaoIniciarJogo = document.getElementById("iniciarJogo");
const botaoSortearResidentes = document.getElementById("sortearResidentes");

const tituloJogador = document.getElementById("tituloJogador");
const pontuacaoEscolha = document.getElementById("pontuacaoEscolha");
const residentesSorteados = document.getElementById("residentesSorteados");

const nomeJogadorAtivo = document.getElementById("nomeJogadorAtivo");
const pontuacaoJogo = document.getElementById("pontuacaoJogo");
const energiaJogo = document.getElementById("energiaJogo");
const residenteAtivo = document.getElementById("residenteAtivo");

const botaoComprarChefes = document.getElementById("comprarChefes");
const botaoComprarTaticas = document.getElementById("comprarTaticas");

const chefesComprados = document.getElementById("chefesComprados");
const taticasCompradas = document.getElementById("taticasCompradas");

botaoCriarJogador.addEventListener("click", () => {
  const nome = inputNome.value.trim();

  if (!nome) {
    alert("Digite o nome do jogador.");
    return;
  }

  jogador.nome = nome;
  jogador.pontuacao = 0;
  jogador.energia = 7;

  tituloJogador.textContent = jogador.nome;
  pontuacaoEscolha.textContent = jogador.pontuacao;

  botaoIniciarJogo.disabled = false;
});

botaoIniciarJogo.addEventListener("click", () => {
  telaEscolhaResidente.classList.remove("hidden");
});

botaoSortearResidentes.addEventListener("click", () => {
  jogador.residentesSorteados = sortearSemRepetir([...residentes], 3);
  mostrarResidentes(jogador.residentesSorteados);
});

botaoComprarChefes.addEventListener("click", () => {
  const cartas = comprarDoBaralho("chefes", 2);
  jogador.chefes.push(...cartas);

  mostrarCartas(jogador.chefes, chefesComprados);
  botaoComprarChefes.disabled = true;
});

botaoComprarTaticas.addEventListener("click", () => {
  const cartas = comprarDoBaralho("taticas", 3);
  jogador.taticas.push(...cartas);

  mostrarCartas(jogador.taticas, taticasCompradas);
  botaoComprarTaticas.disabled = true;
});

function escolherResidente(id) {
  const residente = jogador.residentesSorteados.find(r => r.id === id);

  jogador.residenteEscolhido = residente;

  telaInicial.classList.add("hidden");
  telaEscolhaResidente.classList.add("hidden");
  telaJogo.classList.remove("hidden");

  atualizarTelaJogo();
}

function atualizarTelaJogo() {
  nomeJogadorAtivo.textContent = jogador.nome;
  pontuacaoJogo.textContent = jogador.pontuacao;
  energiaJogo.textContent = jogador.energia;

  residenteAtivo.innerHTML = `
    <img src="${jogador.residenteEscolhido.imagem}" alt="${jogador.residenteEscolhido.nome}" />
    <p>${jogador.residenteEscolhido.nome}</p>
  `;
}

function comprarDoBaralho(tipo, quantidade) {
  const baralho = tipo === "chefes" ? baralhoChefes : baralhoTaticas;
  const compradas = [];

  for (let i = 0; i < quantidade; i++) {
    if (baralho.length === 0) break;

    const indice = Math.floor(Math.random() * baralho.length);
    compradas.push(baralho[indice]);
    baralho.splice(indice, 1);
  }

  return compradas;
}

function sortearSemRepetir(lista, quantidade) {
  const sorteados = [];

  for (let i = 0; i < quantidade; i++) {
    const indice = Math.floor(Math.random() * lista.length);
    sorteados.push(lista[indice]);
    lista.splice(indice, 1);
  }

  return sorteados;
}

function mostrarResidentes(lista) {
  residentesSorteados.innerHTML = lista
    .map(
      residente => `
        <article class="carta">
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

function mostrarCartas(lista, elemento) {
  elemento.innerHTML = lista
    .map(
      carta => `
        <article class="carta">
          <img src="${carta.imagem}" alt="${carta.nome}" />
          <h3>${carta.nome}</h3>
          <span class="tag">${carta.tipo}</span>
        </article>
      `
    )
    .join("");
}

let dadosSelecionados = [];
let resultadosDados = [];

function adicionarDado(lados) {
  dadosSelecionados.push(lados);
  resultadosDados.push(null);
  renderizarDados();
}

function rolarDados() {
  resultadosDados = dadosSelecionados.map(lados => {
    return Math.floor(Math.random() * lados) + 1;
  });

  renderizarDados();
}

function limparDados() {
  dadosSelecionados = [];
  resultadosDados = [];
  renderizarDados();
}

function renderizarDados() {
  const areaDados = document.getElementById("areaDados");
  const totalDados = document.getElementById("totalDados");

  if (!areaDados || !totalDados) return;

  if (dadosSelecionados.length === 0) {
    areaDados.innerHTML = `<p class="placeholder-dados">Escolha dados e clique em rolar.</p>`;
    totalDados.textContent = "0";
    return;
  }

  const total = resultadosDados.reduce((soma, valor) => soma + (valor || 0), 0);
  totalDados.textContent = total;

  areaDados.innerHTML = dadosSelecionados
    .map((lados, index) => {
      const resultado = resultadosDados[index];
      const texto = resultado === null ? `d${lados}` : resultado;

      return `
        <div class="dado dado-d${lados}" onclick="rerrolarDado(${index})">
          <span>${texto}</span>
        </div>
      `;
    })
    .join("");
}

function rerrolarDado(index) {
  const areaDados = document.getElementById("areaDados");
  const dadoEl = areaDados.children[index];

  if (!dadoEl) return;

  dadoEl.classList.add("rolando");

  setTimeout(() => {
    const lados = dadosSelecionados[index];
    resultadosDados[index] = Math.floor(Math.random() * lados) + 1;

    renderizarDados();
  }, 450);
}