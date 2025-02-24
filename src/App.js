import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { moveDown, updatePowerUps, clearRows } from './actions';
import Controls from './components/controls';
import GridSquare from './components/grid-square';
import { shapes } from './utils';
import './App.css';

// Colors for different tetromino shapes
const colors = [
  'transparent',  // 0 is empty
  '#00f0f0',     // I - Cyan
  '#9900ff',     // T - Purple
  '#f0a500',     // L - Orange
  '#0000f0',     // J - Blue
  '#f00000',     // Z - Red
  '#00f000',     // S - Green
  '#f0f000'      // O - Yellow
];

function App() {
  const dispatch = useDispatch();
  const game = useSelector(state => state.game);
  const { 
    grid, 
    score, 
    isRunning, 
    gameOver,
    isClearing,
    speed, 
    activePowerUps,
    level,
    combo,
    shape,
    rotation,
    x,
    y
  } = game;

  // Game loop
  useEffect(() => {
    let gameLoop;
    if (isRunning && !gameOver && !isClearing) {
      gameLoop = setInterval(() => {
        dispatch(moveDown());
        dispatch(updatePowerUps());
      }, speed);
    }
    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
    };
  }, [isRunning, gameOver, isClearing, speed, dispatch]);

  // Handle row clearing animation
  useEffect(() => {
    if (isClearing) {
      const timer = setTimeout(() => {
        dispatch(clearRows());
      }, 500); // Match this with CSS animation duration
      return () => clearTimeout(timer);
    }
  }, [isClearing, dispatch]);

  // Create a copy of the grid to add the current piece
  const gridWithCurrentPiece = grid ? grid.map(row => [...row]) : Array(20).fill().map(() => Array(10).fill(0));
  
  // Add current piece to the grid copy
  if (shape !== undefined && !gameOver && gridWithCurrentPiece) {
    const block = shapes[shape][rotation];
    for (let row = 0; row < block.length; row++) {
      for (let col = 0; col < block[row].length; col++) {
        if (block[row][col]) {
          const gridY = y + row;
          const gridX = x + col;
          if (gridY >= 0 && gridY < gridWithCurrentPiece.length && gridX >= 0 && gridX < gridWithCurrentPiece[0].length) {
            gridWithCurrentPiece[gridY][gridX] = shape;
          }
        }
      }
    }
  }

  // Map grid cells to components
  const gridSquares = gridWithCurrentPiece.map((rowArray, row) => {
    return rowArray.map((square, col) => {
      const backgroundColor = colors[square] || 'transparent';
      const isClearing = square === -1; // Special value for clearing animation
      
      return <GridSquare 
        key={`${row}${col}`}
        color={backgroundColor}
        isClearing={isClearing}
      />;
    });
  });

  // Render active power-ups
  const powerUpElements = activePowerUps.map((powerUp, index) => {
    const timeLeft = Math.ceil((powerUp.type.duration - (Date.now() - powerUp.startTime)) / 1000);
    return (
      <motion.div
        key={index}
        className="power-up-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <span>{powerUp.type.name}</span>
        {timeLeft > 0 && <span>{timeLeft}s</span>}
      </motion.div>
    );
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tetris Redux</h1>
      </header>
      
      <div className="game-container">
        <div className="grid-board">
          {gridSquares}
        </div>

        <div className="game-info">
          <div className="game-stats">
            <div>Score: {score}</div>
            <div>Level: {level}</div>
          </div>
          <Controls />
        </div>

        <AnimatePresence>
          {combo > 1 && (
            <motion.div 
              className="combo-indicator"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              Combo x{combo}!
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activePowerUps.length > 0 && (
            <motion.div 
              className="power-ups-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {powerUpElements}
            </motion.div>
          )}
        </AnimatePresence>

        {gameOver && (
          <motion.div 
            className="game-over"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h2>Game Over</h2>
            <p>Final Score: {score}</p>
            <p>Level Reached: {level}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;