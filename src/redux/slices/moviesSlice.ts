import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_KEY, BASE_URL} from '../../utils/constants';

type fetchMoviesParams = {
  year: number;
  page: number;
  genres?: string;
};

interface MoviesList {
  list: {[year: number]: any[]};
  loading: boolean;
  error: string | null;
}

const initialState: MoviesList = {
  list: {},
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({year, page, genres}: fetchMoviesParams) => {
    const params = {
      api_key: API_KEY,
      sort_by: 'popularity.desc',
      primary_release_year: year,
      include_adult: false,
      page: page,
      'vote_count.gte': 100,
      ...(genres && {with_genres: genres}),
    };
    const response = await axios.get(`${BASE_URL}/discover/movie`, {params});
    return {year, movies: response.data.results};
  },
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearMovies: state => {
      state.list = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchMovies.fulfilled,
        (state, action: PayloadAction<{year: number; movies: any[]}>) => {
          state.loading = false;
          state.list[action.payload.year] = action.payload.movies;
        },
      )
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const {clearMovies} = movieSlice.actions;
export default movieSlice.reducer;
