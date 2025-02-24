// Re-export actions from the game slice
export {
  moveRight,
  moveLeft,
  rotate,
  moveDown,
  pause,
  resume,
  restart,
  gameOver,
  clearRows,
  updatePowerUps
} from '../reducers/game_reducer';
