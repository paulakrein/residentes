const chefes = [
  "Supervisor Hostil",
  "Paciente Manipulador",
  "Plantão Infinito",
  "Coordenação Institucional",
  "Burocracia"
];

const botao = document.getElementById("sortear");
const resultado = document.getElementById("resultado");

botao.addEventListener("click", () => {
  const chefe = chefes[Math.floor(Math.random() * chefes.length)];

  resultado.innerHTML = `
    <h2>${chefe}</h2>
  `;
});