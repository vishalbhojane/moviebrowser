import {combineReducers} from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import genresReducer from './slices/genresSlice';
import searchReducer from './slices/searchSlice';

const rootReducer = combineReducers({
  movies: moviesReducer,
  genres: genresReducer,
  search: searchReducer,
});

export default rootReducer;
