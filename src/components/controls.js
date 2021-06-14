import React, { Component } from 'react'
import { connect } from 'react-redux'
import { moveDown, moveLeft, moveRight, rotate } from '../actions'

class Controls extends Component {
  constructor(props) {
    super(props) 
    window.addEventListener('keydown', (e) => {
      this.checkKey(e)
      console.log("it's working!")
    })    
  }

  checkKey(e) {
    console.log(e.keyCode)
    
        e = e || window.event;
    
        if (e.keyCode === 38) {
          this.props.rotate()
            }
        else if (e.keyCode === 40) {
          this.props.moveDown()
        }
        else if (e.keyCode === 37) {
          this.props.moveLeft()
        }
        else if (e.keyCode === 39) {
          this.props.moveRight()
        }
    
    }
  render() {
    const { isRunning, gameOver } = this.props
    return (
    <div className="controls">
    {/* left */}
    <button className="control-button" onClick={(e) => {
        console.log(isRunning, gameOver)
        if (!isRunning || gameOver) { return }
        this.props.moveLeft()
    }}>Left</button>

    {/* right */}
    <button className="control-button" onClick={(e) => {
        if (!isRunning || gameOver) { return }
        this.props.moveRight()
    }}>Right</button>

    {/* rotate */}
    <button className="control-button" onClick={(e) => {
        if (!isRunning || gameOver) { return }
        this.props.rotate()
    }}>Rotate</button>

    {/* down */}
    <button className="control-button" onClick={(e) => {
        if (!isRunning || gameOver) { return }
        this.props.moveDown()
    }}>Down</button>
  </div>
  )
  }
  }
  const mapStateToProps = (state) => {
    return {
      isRunning: state.game.isRunning,
      gameOver: state.game.gameOver
    }
  }
  const mapDispatchToProps = () => {
    return {
        moveRight,
        moveLeft,
        moveDown,
        rotate
  }
}
export default connect(mapStateToProps, mapDispatchToProps())(Controls)