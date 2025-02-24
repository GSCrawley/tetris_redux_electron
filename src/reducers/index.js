import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './game_reducer';

// The state handled by `gameReducer` will be stored with the property name `game` on the Redux store.
const store = configureStore({
  reducer: {
    game: gameReducer
  }
});

export default store;