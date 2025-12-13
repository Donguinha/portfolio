// Jogo da Cobrinha
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('snakeGame');
  if (!canvas) return; // Sai se o canvas não existir

  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('score');
  const restartBtn = document.getElementById('restartBtn');

  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 15 };
  let dx = 0;
  let dy = 0;
  let score = 0;
  let gameLoop;
  let gameRunning = false;
  let isGameOver = false;

  // Controles do teclado
  document.addEventListener('keydown', changeDirection);
  restartBtn.addEventListener('click', restartGame);

  function changeDirection(event) {
    const key = event.key;

    // Previne o comportamento padrão das setas (rolar a página)
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault();
    }

    // Se o jogo terminou, reinicia ao pressionar qualquer seta
    if (isGameOver && (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight')) {
      restartGame();
      return;
    }

    if (!gameRunning && (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight')) {
      gameRunning = true;
      gameLoop = setInterval(update, 100);
    }

    if (key === 'ArrowUp' && dy === 0) {
      dx = 0;
      dy = -1;
    } else if (key === 'ArrowDown' && dy === 0) {
      dx = 0;
      dy = 1;
    } else if (key === 'ArrowLeft' && dx === 0) {
      dx = -1;
      dy = 0;
    } else if (key === 'ArrowRight' && dx === 0) {
      dx = 1;
      dy = 0;
    }
  }

  function update() {
    // Move a cobra
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verifica colisão com paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      gameOver();
      return;
    }

    // Verifica colisão consigo mesma
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
        return;
      }
    }

    snake.unshift(head);

    // Verifica se comeu a comida
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreElement.textContent = score;
      generateFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    // Limpa o canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a grade
    ctx.strokeStyle = '#16213e';
    for (let i = 0; i < tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }

    // Desenha a cobra
    ctx.fillStyle = '#0f3460';
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#e94560';
      } else {
        ctx.fillStyle = '#0f3460';
      }
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Desenha a comida
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  }

  function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Verifica se a comida não está na cobra
    for (let segment of snake) {
      if (food.x === segment.x && food.y === segment.y) {
        generateFood();
        return;
      }
    }
  }

  function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    isGameOver = true;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Pontuação: ' + score, canvas.width / 2, canvas.height / 2 + 40);
  }

  function restartGame() {
    clearInterval(gameLoop);
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameRunning = false;
    isGameOver = false;
    generateFood();
    draw();
  }

  // Inicia o jogo
  draw();
});
