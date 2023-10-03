// Game variables
let canvas;
let ctx;
let gameLoop;
const snake = [{ top: 250, left: 250 }];
let direction = 'right';
let apples = [];
let score = 0;

// Function to start the game
function startGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  // Start the game loop
  gameLoop = setInterval(game, 100);

  // Generate 5 apples
  for(let i = 0; i < 5; i++) {
    generateApple();
  }
}

// Function to generate a new apple
function generateApple() {
  apple = {
    top: Math.floor(Math.random() * 20) * 25,
    left: Math.floor(Math.random() * 20) * 25,
  };
  apples.push(apple); // Add the new apple to the array of apples
}

// Function to check if the snake has eaten an apple
function checkAppleCollision() {
  for (let i = 0; i < apples.length; i++) {
    if (apples[i].top === snake[0].top && apples[i].left === snake[0].left) {
      apples.splice(i, 1); // Remove the apple from the array
      generateApple(); // Generate a new apple
      score++;
      return true;
    }
  }
  return false;
}

// Function to check if the snake has collided with itself
function checkSelfCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].top === snake[0].top && snake[i].left === snake[0].left) {
      return true;
    }
  }
  return false;
}

// Function to update the game state
function game() {
  // Update the snake's position
  switch (direction) {
    case 'up':
      snake.unshift({ top: (snake[0].top - 25 + 600) % 600, left: snake[0].left });
      break;
    case 'down':
      snake.unshift({ top: (snake[0].top + 25) % 600, left: snake[0].left });
      break;
    case 'left':
      snake.unshift({ top: snake[0].top, left: (snake[0].left - 25 + 600) % 600 });
      break;
    case 'right':
      snake.unshift({ top: snake[0].top, left: (snake[0].left + 25) % 600 });
      break;
  }

  // Check if the snake has eaten the apple
  if (!checkAppleCollision()) {
    snake.pop();
  }

  // Check if the snake has collided with itself
  if (checkSelfCollision()) {
    clearInterval(gameLoop);

    let highScore = localStorage.getItem('highScore');
    if (!highScore) {
      highScore = 0;
    }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      document.getElementById('highScore').textContent = 'High Score: ' + highScore;
    }

    // Draw game over screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '25px Arial';
    ctx.fillText('Game Over. Your score: ' + score, 10, 30);
    ctx.fillText('Highscore: ' + highScore, 10, 60);
    return;
  }

  // Draw the game
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  snake.forEach(function (part) {
    ctx.fillRect(part.left, part.top, 25, 25);
  });

  // Draw the apples
  ctx.fillStyle = 'red';
  apples.forEach(apple => ctx.fillRect(apple.left, apple.top, 25, 25));
}

// Event listener for key presses
function changeDirection(key) {
  let newDirection;
  switch (key) {
    case 'ArrowUp':
      newDirection = 'up';
      break;
    case 'ArrowDown':
      newDirection = 'down';
      break;
    case 'ArrowLeft':
      newDirection = 'left';
      break;
    case 'ArrowRight':
      newDirection = 'right';
      break;
  }

  const isOpposite = (dir1, dir2) => {
    return (dir1 === 'up' && dir2 === 'down') ||
           (dir1 === 'down' && dir2 === 'up') ||
           (dir1 === 'left' && dir2 === 'right') ||
           (dir1 === 'right' && dir2 === 'left');
  };

  if (!isOpposite(direction, newDirection)) {
    direction = newDirection;
  }
}

window.addEventListener('keydown', function (e) {
  changeDirection(e.key);
  e.preventDefault();
});
document.addEventListener('DOMContentLoaded', (event) => {
  const buttons = document.querySelectorAll('.button-container button');

  buttons.forEach((button, index) => {
      const handleButtonClick = (event) => {
          switch(index) {
              case 1: // Button 2
                  window.dispatchEvent(new KeyboardEvent('keydown', {'key':'ArrowUp'}));
                  break;
              case 3: // Button 4
                  window.dispatchEvent(new KeyboardEvent('keydown', {'key':'ArrowLeft'}));
                  break;
              case 5: // Button 6
                  window.dispatchEvent(new KeyboardEvent('keydown', {'key':'ArrowRight'}));
                  break;
              case 7: // Button 8
                  window.dispatchEvent(new KeyboardEvent('keydown', {'key':'ArrowDown'}));
                  break;
          }
      };

      button.addEventListener('click', handleButtonClick);
      button.addEventListener('touchstart', handleButtonClick);
  });
});
// Start the game when the window loads
window.addEventListener('load', startGame);