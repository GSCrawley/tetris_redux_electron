import { createSlice } from '@reduxjs/toolkit';
import { defaultState, canMoveTo, nextRotation, addBlockToGrid, checkRows, randomShape } from '../utils';

const gameSlice = createSlice({
  name: 'game',
  initialState: defaultState(),
  reducers: {
    moveRight: (state) => {
      if (canMoveTo(state.shape, state.grid, state.x + 1, state.y, state.rotation)) {
        state.x += 1;
      }
    },
    moveLeft: (state) => {
      if (canMoveTo(state.shape, state.grid, state.x - 1, state.y, state.rotation)) {
        state.x -= 1;
      }
    },
    moveDown: (state) => {
      // If game is over or not running, don't do anything
      if (!state.isRunning || state.gameOver) {
        return;
      }

      const canMove = canMoveTo(state.shape, state.grid, state.x, state.y + 1, state.rotation);
      
      if (canMove) {
        state.y += 1;
        return;
      }

      // If can't move down, place the piece
      const blockResult = addBlockToGrid(state.shape, state.grid, state.x, state.y, state.rotation);
      
      if (blockResult.gameOver) {
        state.gameOver = true;
        state.isRunning = false;
        return;
      }

      // Check for completed rows
      const { grid: clearedGrid, score: points, completedRows } = checkRows(blockResult.grid);

      // Update state with marked rows first
      state.grid = clearedGrid;
      state.score += points;
      state.combo = points > 0 ? state.combo + 1 : 0;

      // If we have completed rows, set a flag to handle the clearing
      if (completedRows.length > 0) {
        state.completedRows = completedRows;
        state.isClearing = true;
        
        // We'll handle the actual row removal and new piece spawn after animation
        return;
      }

      // If no completed rows, continue with new piece
      state.shape = state.nextShape;
      state.nextShape = randomShape();
      state.x = 3;
      state.y = -4;
      state.rotation = 0;

      // Update level and speed
      const newLevel = Math.floor(state.score / 1000) + 1;
      if (newLevel !== state.level) {
        state.level = newLevel;
        state.speed = Math.max(100, 1000 - (newLevel - 1) * 100);
      }
    },
    clearRows: (state) => {
      if (!state.isClearing || !state.completedRows) return;

      // Remove completed rows
      const gridWithoutCompleted = state.grid.filter((_, index) => !state.completedRows.includes(index));
      
      // Add new empty rows at the top
      const emptyRows = Array(state.completedRows.length).fill().map(() => Array(10).fill(0));
      state.grid = [...emptyRows, ...gridWithoutCompleted];

      // Reset clearing state
      state.isClearing = false;
      state.completedRows = [];

      // Spawn new piece
      state.shape = state.nextShape;
      state.nextShape = randomShape();
      state.x = 3;
      state.y = -4;
      state.rotation = 0;

      // Update level and speed
      const newLevel = Math.floor(state.score / 1000) + 1;
      if (newLevel !== state.level) {
        state.level = newLevel;
        state.speed = Math.max(100, 1000 - (newLevel - 1) * 100);
      }
    },
    rotate: (state) => {
      const newRotation = nextRotation(state.shape, state.rotation);
      if (canMoveTo(state.shape, state.grid, state.x, state.y, newRotation)) {
        state.rotation = newRotation;
      }
    },
    gameOver: (state) => {
      state.gameOver = true;
      state.isRunning = false;
    },
    pause: (state) => {
      state.isRunning = false;
    },
    resume: (state) => {
      state.isRunning = true;
    },
    restart: () => defaultState(),
    updatePowerUps: (state) => {
      state.activePowerUps = state.activePowerUps.filter(powerUp => {
        return Date.now() - powerUp.startTime < powerUp.type.duration;
      });
    }
  }
});

export const { 
  moveRight, 
  moveLeft, 
  moveDown, 
  rotate, 
  pause, 
  resume, 
  restart,
  gameOver,
  clearRows,
  updatePowerUps
} = gameSlice.actions;

export default gameSlice.reducer;