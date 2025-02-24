export const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

// Returns the default grid
export const gridDefault = () => {
    const rows = 18
    const cols = 10
    const array = []
  
    for (let row = 0; row < rows; row++) {
        array.push([])
        for (let col = 0; col < cols; col++) {
          array[row].push(0)
        }
    }
    return array
  }

  // Define block shapes and their rotations as arrays.
export const shapes = [
  // none
  [[[0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]]],

  // I
  [[[0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]],

   [[0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0]]],

  // T
  [[[0,0,0,0],
    [1,1,1,0],
    [0,1,0,0],
    [0,0,0,0]],

   [[0,1,0,0],
    [1,1,0,0],
    [0,1,0,0],
    [0,0,0,0]],

   [[0,1,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]],

   [[0,1,0,0],
    [0,1,1,0],
    [0,1,0,0],
    [0,0,0,0]]],

  // L
  [[[0,0,0,0],
    [1,1,1,0],
    [1,0,0,0],
    [0,0,0,0]],

   [[1,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,0,0,0]],

   [[0,0,1,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]],

   [[0,1,0,0],
    [0,1,0,0],
    [0,1,1,0],
    [0,0,0,0]]],

  // J
  [[[1,0,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]],

   [[0,1,1,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,0,0,0]],

   [[0,0,0,0],
    [1,1,1,0],
    [0,0,1,0],
    [0,0,0,0]],

   [[0,1,0,0],
    [0,1,0,0],
    [1,1,0,0],
    [0,0,0,0]]],

  // Z
  [[[0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0]],

   [[0,0,1,0],
    [0,1,1,0],
    [0,1,0,0],
    [0,0,0,0]]],

  // S
  [[[0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0]],

   [[0,1,0,0],
    [0,1,1,0],
    [0,0,1,0],
    [0,0,0,0]]],

  // O
  [[[0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]]]
];

// Returns the next rotation for a shape
// rotation can't exceed the last index of the the rotations for the given shape.
export const nextRotation = (shape, rotation) => {
  return (rotation + 1) % shapes[shape].length
}

export const canMoveTo = (shape, grid, x, y, rotation) => {
  const currentShape = shapes[shape][rotation]
  // Loop through all rows and cols of the **shape**
  for (let row = 0; row < currentShape.length; row++) {
      for (let col = 0; col < currentShape[row].length; col++) {
          // Look for a 1 here
          if (currentShape[row][col] !== 0) {
              // x offset on grid
              const proposedX = col + x
              // y offset on grid
              const proposedY = row + y
              if (proposedY < 0) {
                  continue
              }
              // Get the row on the grid
              const possibleRow = grid[proposedY]
              // Check row exists
              if (possibleRow) {
                  // Check if this column in the row is undefined, if it's off the edges, 0, and empty
                  if (possibleRow[proposedX] === undefined || possibleRow[proposedX] !== 0) {
                      // undefined or not 0 and it's occupied we can't move here.
                      return false
                  }
              } else {
                  return false
              }
          }
      }
  }
  return true
}
  // Return the index of a random shape from 1 to the number of items in `shapes`
// We don't want the first item, which is an empty shape
export const randomShape = () => {
  return Math.floor(Math.random() * (shapes.length - 1)) + 1;
};

// Power-up types and their effects
export const POWER_UPS = {
  TIME_SLOW: {
    id: 'TIME_SLOW',
    name: 'Time Slow',
    duration: 10000 // 10 seconds
  },
  GHOST_BLOCK: {
    id: 'GHOST_BLOCK',
    name: 'Ghost Block',
    duration: 15000 // 15 seconds
  },
  BLOCK_SWAP: {
    id: 'BLOCK_SWAP',
    name: 'Block Swap',
    duration: 0 // instant effect
  },
  LINE_CLEAR: {
    id: 'LINE_CLEAR',
    name: 'Line Clear Bomb',
    duration: 0 // instant effect
  }
};

// Apply power-up effect
export const applyPowerUpEffect = (state, powerUpId) => {
  switch (powerUpId) {
    case 'TIME_SLOW':
      return {
        ...state,
        speed: state.speed * 1.5
      };
    case 'GHOST_BLOCK':
      return {
        ...state,
        showGhostPiece: true
      };
    case 'BLOCK_SWAP':
      return {
        ...state,
        shape: state.nextShape,
        nextShape: Math.floor(Math.random() * 7)
      };
    case 'LINE_CLEAR':
      const newGrid = [...state.grid];
      const rows = newGrid.length;
      // Clear bottom 3 rows
      for (let i = rows - 3; i < rows; i++) {
        newGrid[i] = Array(10).fill(0);
      }
      return {
        ...state,
        grid: newGrid,
        score: state.score + 300
      };
    default:
      return state;
  }
};

// Chance of power-up appearing (out of 100)
export const POWER_UP_CHANCE = 15;

// Check if we should spawn a power-up
export const shouldSpawnPowerUp = () => {
  return random(1, 100) <= POWER_UP_CHANCE;
};

// Get a random power-up
export const getRandomPowerUp = () => {
  const powerUps = Object.values(POWER_UPS);
  return powerUps[random(0, powerUps.length - 1)];
};

// Return the default state for the game
export const defaultState = () => {
  return {
    // Create an empty grid
    grid: gridDefault(),
    // Get a new random shape
    shape: randomShape(),
    // set rotation of the shape to 0
    rotation: 0,
    // set the 'x' position of the shape to 5 and y to -4, which puts the shape in the center of the grid, above the top
    x: 5,
    y: -4,
    // set the index of the next shape to a new random shape
    nextShape: randomShape(),
    // Tell the game that it's currently running
    isRunning: true,
    // Set the score to 0
    score: 0,
    // Set the default speed
    speed: 1000,
    // Game isn't over yet
    gameOver: false,
    // No active power-ups
    activePowerUps: [],
    // Start at level 1
    level: 1,
    // No combo yet
    combo: 0,
    // No ghost piece by default
    showGhostPiece: false,
    shapes: shapes
  };
};

// Adds current shape to grid
export const addBlockToGrid = (shape, grid, x, y, rotation) => {
  // Get the block array
  const block = shapes[shape][rotation];
  // Deep copy the grid
  const newGrid = grid.map(row => [...row]);
  let blockOffGrid = false;
  
  for (let row = 0; row < block.length; row++) {
    for (let col = 0; col < block[row].length; col++) {
      if (block[row][col]) {
        const yIndex = row + y;
        const xIndex = col + x;
        
        // Check if block is off the top
        if (yIndex < 0) {
          blockOffGrid = true;
          continue;
        }
        
        // Check if we're within grid bounds
        if (yIndex >= 0 && yIndex < grid.length && xIndex >= 0 && xIndex < grid[0].length) {
          newGrid[yIndex][xIndex] = shape;
        }
      }
    }
  }
  
  return {
    grid: newGrid,
    gameOver: blockOffGrid
  };
};

// Checks for completed rows and scores points
export const checkRows = (grid) => {
  const points = [0, 40, 100, 300, 1200];
  const completedRows = [];
  
  // Check each row for completed lines
  for (let row = 0; row < grid.length; row++) {
    if (grid[row].every(cell => cell > 0)) {
      completedRows.push(row);
    }
  }

  if (completedRows.length === 0) {
    return { grid, score: 0, completedRows: [] };
  }

  // Create a deep copy of the grid
  const newGrid = grid.map(row => [...row]);

  // First mark completed rows for animation
  completedRows.forEach(row => {
    newGrid[row] = newGrid[row].map(() => -1);
  });

  // Return immediately with marked rows
  return {
    grid: newGrid,
    score: points[completedRows.length],
    completedRows
  };
};
