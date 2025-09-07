// Seleciona os elementos das estrelas
const stars1 = document.getElementById("stars1");
const stars2 = document.getElementById("stars2");
const stars3 = document.getElementById("stars3");

// Variáveis para guardar a posição do mouse (o desvio do parallax)
let mouseX = 0;
let mouseY = 0;

// Variável para guardar a posição base da "viagem" vertical
let travelY = 0;

// // "Ouvinte" que atualiza as coordenadas do mouse sempre que ele se move
// window.addEventListener("mousemove", function (e) {
//   // Calcula a posição em relação ao centro da tela
//   mouseX = e.clientX - window.innerWidth / 2;
//   mouseY = e.clientY - window.innerHeight / 2;
// });

// A função principal da animação, que rodará em loop
function animateStars() {
  // 1. ANIMAÇÃO DE VIAGEM CONSTANTE
  // Incrementa a posição da viagem a cada frame. Ajuste o valor para mudar a velocidade.
  travelY -= 0.1;

  // Reinicia a animação quando as estrelas saem da tela, criando um loop infinito
  if (travelY < -2000) {
    travelY = 0;
  }

  // 2. CÁLCULO DO PARALLAX + VIAGEM
  // Para cada camada, calculamos o desvio do mouse e somamos à posição da viagem.

  // Camada 1 (mais distante, mais lenta)
  const x1 = mouseX / 50;
  const y1 = travelY * 0.4 + mouseY / 50; // A viagem é mais lenta aqui (0.8x)
  stars1.style.transform = `translateX(${x1}px) translateY(${y1}px)`;

  // Camada 2 (intermediária)
  const x2 = mouseX / 25;
  const y2 = travelY * 0.5 + mouseY / 25; // Velocidade de viagem padrão (1x)
  stars2.style.transform = `translateX(${x2}px) translateY(${y2}px)`;

  // Camada 3 (mais próxima, mais rápida)
  const x3 = mouseX / 10;
  const y3 = travelY * 1 + mouseY / 10; // A viagem é mais rápida aqui (1.5x)
  stars3.style.transform = `translateX(${x3}px) translateY(${y3}px)`;

  // Pede ao navegador para chamar esta função novamente no próximo frame
  requestAnimationFrame(animateStars);
}

// Inicia o loop da animação
animateStars();
