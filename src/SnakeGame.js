import React, { useState, useEffect } from "react";
import "./SnakeGame.css";

// Snake Game component
const SnakeGame = () => {
  // Initialize game state
  const [snake, setSnake] = useState([[10, 10]]);
  const [direction, setDirection] = useState("right");
  const [apple, setApple] = useState([15, 15]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Grid size
  const rows = 30;
  const cols = 30;

  // Movement logic
  const moveSnake = () => {
    // Get current snake head position
    const head = snake[0];
    let newHead;

    // Calculate new head position based on direction
    switch (direction) {
      case "right":
        newHead = [head[0], head[1] + 1];
        break;
      case "left":
        newHead = [head[0], head[1] - 1];
        break;
      case "up":
        newHead = [head[0] - 1, head[1]];
        break;
      case "down":
        newHead = [head[0] + 1, head[1]];
        break;
      default:
        break;
    }

    // Check collision with wall or self
    if (
      newHead[0] < 0 ||
      newHead[0] >= rows ||
      newHead[1] < 0 ||
      newHead[1] >= cols ||
      snake.some(([x, y]) => x === newHead[0] && y === newHead[1])
    ) {
      // Game over
      setGameOver(true);
    } else {
      // Move snake
      let grow = false;

      // Check if snake eats apple
      if (newHead[0] === apple[0] && newHead[1] === apple[1]) {
        // Increase score and generate new apple
        setScore(score + 1);
        let newApple;
        do {
          newApple = [
            Math.floor(Math.random() * rows),
            Math.floor(Math.random() * cols),
          ];
        } while (
          snake.some(([x, y]) => x === newApple[0] && y === newApple[1])
        );
        setApple(newApple);
        grow = true;
      }

      let newSnake = [newHead, ...snake];
      if (!grow) {
        newSnake = newSnake.slice(0, -1);
      }

      setSnake(newSnake);
    }
  };

  // Handle key presses
  const handleKeyPress = (e) => {
    switch (e.key) {
      case "ArrowRight":
        setDirection("right");
        break;
      case "ArrowLeft":
        setDirection("left");
        break;
      case "ArrowUp":
        setDirection("up");
        break;
      case "ArrowDown":
        setDirection("down");
        break;
      default:
        break;
    }
  };

  // Handle reset
  const handleReset = () => {
    setSnake([[10, 10]]);
    setDirection("right");
    setApple([15, 15]);
    setScore(0);
    setGameOver(false);
  };

  // Set up game loop and event listeners
  useEffect(() => {
    if (gameOver) return;

    document.addEventListener("keydown", handleKeyPress);
    const interval = setInterval(moveSnake, 200);
    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [snake, direction, gameOver]);

  return (
    <div className="container">
      <div className="details">
        <h1>Snake Game</h1>
        <button
          className="reset"
          onClick={() => {
            handleReset();
          }}
        >
          reset
        </button>

        <h2>Score: {score}</h2>
      </div>
      <div style={{ height: "100" }}></div>
      <div className="game-container">
        {gameOver ? (
          <h2 className="game-over">Game Over! Score: {score}</h2>
        ) : (
          <div>
            <div className="game-grid">
              {Array(rows)
                .fill()
                .map((_, i) => (
                  <div key={i} className="row">
                    {Array(cols)
                      .fill()
                      .map((_, j) => (
                        <div
                          key={`${i}-${j}`}
                          className={`cell ${
                            snake.some(([x, y]) => x === i && y === j)
                              ? "snake"
                              : ""
                          } ${apple[0] === i && apple[1] === j ? "apple" : ""}`}
                        />
                      ))}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
