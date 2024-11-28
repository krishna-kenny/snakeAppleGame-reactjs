import React, { useState, useEffect } from "react";
import "./SnakeGame.css";

const SnakeGame = () => {
  // Initialize game state
  const [snake, setSnake] = useState([[10, 10]]);
  const [direction, setDirection] = useState(Math.floor(Math.random() * 4) + 1);
  const [apple, setApple] = useState([15, 15]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  // Cell size (px)
  const cellSize = 30;

  // Calculate rows and cols based on browser height
  useEffect(() => {
    const height = window.innerHeight - 150;
    const width = window.innerWidth - 50;
    const rows = Math.floor((height < width ? height : width) / cellSize);
    const cols = rows;
    setRows(rows);
    setCols(cols);
  }, []);

  // Movement logic
  const moveSnake = () => {
    // Get current snake head position
    const head = snake[0];
    let newHead;

    // Calculate new head position based on direction
    switch (direction) {
      case 4:
        newHead = [head[0], head[1] + 1];
        break;
      case 3:
        newHead = [head[0], head[1] - 1];
        break;
      case 1:
        newHead = [head[0] - 1, head[1]];
        break;
      case 2:
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
    let d;
    const oppositeDirection = {
      1: 2,
      2: 1,
      3: 4,
      4: 3,
    };
    switch (e.key) {
      case "ArrowRight":
        d = 4;
        break;
      case "ArrowLeft":
        d = 3;
        break;
      case "ArrowUp":
        d = 1;
        break;
      case "ArrowDown":
        d = 2;
        break;
      default:
        break;
    }

    if (oppositeDirection[direction] === d) {
      //backwards movement
    } else {
      setDirection(d);
    }
  };

  // Handle reset
  const handleReset = () => {
    setSnake([[Math.floor(rows / 2), Math.floor(cols / 2)]]);
    setDirection(Math.floor(Math.random() * 4) + 1);
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
      <div className="signature">by: Krishna Kenny</div>
      <div className="game-container">
        <h2 className="game-over">Score: {score}</h2>
        {gameOver ? (
          <button className="reset" onClick={handleReset}>
            reset
          </button>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
