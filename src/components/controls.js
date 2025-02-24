import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveLeft, moveRight, moveDown, rotate, pause, resume, restart } from '../actions';

function Controls() {
  const dispatch = useDispatch();
  const isRunning = useSelector(state => state.game.isRunning);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isRunning) return;

      switch (e.keyCode) {
        case 37: // Left
          dispatch(moveLeft());
          break;
        case 39: // Right
          dispatch(moveRight());
          break;
        case 40: // Down
          dispatch(moveDown());
          break;
        case 38: // Up
          dispatch(rotate());
          break;
        default:
          break;
      }
    };

    const handleKeyPress = (e) => {
      switch (e.key.toLowerCase()) {
        case 'p':
          if (isRunning) {
            dispatch(pause());
          } else {
            dispatch(resume());
          }
          break;
        case 'r':
          dispatch(restart());
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [dispatch, isRunning]);

  return (
    <div className="controls">
      <button 
        className={`control-icon ${!isRunning ? 'active' : ''}`}
        onClick={() => isRunning ? dispatch(pause()) : dispatch(resume())}
        title={isRunning ? 'Pause' : 'Resume'}
      >
        <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'}`}></i>
      </button>
      <button 
        className="control-icon"
        onClick={() => dispatch(restart())}
        title="Restart"
      >
        <i className="fas fa-redo"></i>
      </button>
    </div>
  );
}

export default Controls;