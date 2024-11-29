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
  const [AI, setAI] = useState(false);

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
    const head = snake[0];
    let newHead;

    // Updated movement logic
    switch (direction) {
      case 4: // Right
        newHead = [head[0], head[1] + 1];
        break;
      case 3: // Left
        newHead = [head[0], head[1] - 1];
        break;
      case 1: // Up (decrease row index)
        newHead = [head[0] - 1, head[1]];
        break;
      case 2: // Down (increase row index)
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
      setGameOver(true);
    } else {
      let grow = false;

      // Check if snake eats apple
      if (newHead[0] === apple[0] && newHead[1] === apple[1]) {
        setScore(score + 1);

        // Generate new apple
        let newApple;
        do {
          newApple = [
            Math.floor(Math.random() * rows),
            Math.floor(Math.random() * cols),
          ];
        } while (snake.some(([x, y]) => x === newApple[0] && y === newApple[1]));
        setApple(newApple);
        grow = true;
      }

      // Update snake position
      let newSnake = [newHead, ...snake];
      if (!grow) {
        newSnake = newSnake.slice(0, -1);
      }

      setSnake(newSnake);
    }
  };

  const handleKeyPress = (e) => {
    let d;
    const validDirection = {
      1: [3, 4], // Up
      2: [3, 4], // Down
      3: [1, 2], // Left
      4: [1, 2], // Right
    };

    // Map keys to directions
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

    if (
      d === validDirection[direction][0] ||
      d === validDirection[direction][1]
    ) {
      setDirection(d);
      moveSnake();
    }
  };

  const handleReset = () => {
    setSnake([[Math.floor(rows / 2), Math.floor(cols / 2)]]);
    setDirection(Math.floor(Math.random() * 4) + 1);
    setApple([15, 15]);
    setScore(0);
    setGameOver(false);
  };

  const getReckoning = (head, apple) => {
    const directions = {
      1: 0, // Up (decrease row index)
      2: 0, // Down (increase row index)
      3: 0, // Left
      4: 0, // Right
    };

    // Vertical reckoning
    if (apple[0] < head[0]) {
      directions[1] = head[0] - apple[0]; // Up
    } else if (apple[0] > head[0]) {
      directions[2] = apple[0] - head[0]; // Down
    }

    // Horizontal reckoning
    if (apple[1] < head[1]) {
      directions[3] = head[1] - apple[1]; // Left
    } else if (apple[1] > head[1]) {
      directions[4] = apple[1] - head[1]; // Right
    }

    return directions;
  };

  const aiSnake = () => {
    document.removeEventListener("keydown", handleKeyPress);
    handleReset();
    let head;
    let deadReckoning;
    while (true) {
      head = snake[0];
      deadReckoning = getReckoning(head, apple);
      for (let i = 1; i < 5; i++) {
        setDirection(i);
        while (deadReckoning[i] > 0) {
          moveSnake();
        }
      }
    }
  };

  const easterEgg = () => {
    setAI(true);
    aiSnake();
  };

  useEffect(() => {
    if (gameOver) return;

    document.addEventListener("keydown", handleKeyPress);
    const interval = setInterval(moveSnake, 100);
    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [snake, direction, gameOver]);

  return (
    <div className="container">
      <button className="signature" onClick={easterEgg}>
        by: Krishna Kenny
      </button>
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
