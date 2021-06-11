import React, { Component } from 'react'
import GridSquare from './grid-square'
import { connect } from 'react-redux'
import { moveDown } from '../actions'

// Get Shapes from utils
import { shapes } from '../utils'

// Represents a 10 x 18 grid of grid squares
class GridBoard extends Component {
  constructor(props) {
    super(props)

    this.lastUpdateTime = 0 // the time of last update
    this.progressTime = 0 // amount of time since the last update.
  }

  // generates an array of 18 rows, each containing 10 GridSquares.
  makeGrid() {
    // collect properties mapped to props from state.
    const { grid, shape, rotation, x, y } = this.props
    // get the block which is the current shape the player is controlling
    const block = shapes[shape][rotation]
    const blockColor = shape
    // map rows
    return grid.map((rowArray, row) => {
      // map columns
      return rowArray.map((square, col) => {
        // Find the block x and y on the shape grid
        // By subtracting the x and y from the col and the row we get the position of the upper left corner of the block array as if it was superimposed over the main grid
        const blockX = col - x
        const blockY = row - y
        let color = square
        // Map current falling block to grid.
        // For any squares that fall on the grid we need to look at the block array and see if there is a 1 in this case we use the block color.
        if (blockX >= 0 && blockX < block.length && blockY >= 0 && blockY < block.length) {
          color = block[blockY][blockX] === 0 ? color : blockColor
        }
        // Generate a unique key for every block
        const k = row * grid[0].length + col;
        // Generate a grid square
        return <GridSquare
                key={k}
                square={square}
                color={color}>{square}
              </GridSquare>
      })
    })
  }

  // Handle game updates
  update(time) {
    // If the game is is running we want to request a callback at the next animation frame.
    window.requestAnimationFrame(this.update.bind(this))
    if (!this.props.isRunning) {
      return
    }

    // If lastUpdateTime not been set, set it to the current time.
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = time
    }

    // Calculate delta time and progress time
    const deltaTime = time - this.lastUpdateTime
    this.progressTime += deltaTime

    // If the progress time is greater than speed move the block down
    if (this.progressTime > this.props.speed) {
      this.props.moveDown()
      this.progressTime = 0
    }

    // set the last update time.
    this.lastUpdateTime = time
  }

  // requestAnimationFrame() takes a callback and only calls it once. 
  // So you need to make the first call to requestAnimationFrame() in componentDidMount().
  componentDidMount() {
    window.requestAnimationFrame(this.update.bind(this))
  }

  // The components generated in makeGrid are rendered in div.grid-board
  render () {
    return (
      <div className='grid-board'>
        {this.makeGrid()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    grid: state.game.grid,
    shape: state.game.shape,
    rotation: state.game.rotation,
    x: state.game.x,
    y: state.game.y,
    speed: state.game.speed,
    isRunning: state.game.isRunning
  }
}

// Map Dipatch to Props
const mapDispatchToProps = () => {
  return {
    moveDown
  }
}

// Connect the component to redux
export default connect(mapStateToProps, mapDispatchToProps())(GridBoard)
// export default GridBoard