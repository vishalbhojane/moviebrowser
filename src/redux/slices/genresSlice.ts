import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_KEY, BASE_URL} from '../../utils/constants';

export interface GenresState {
  list: any[];
  loading: boolean;
  error: string | null;
  selectedGenres: number[];
}

const initialState: GenresState = {
  list: [],
  loading: false,
  error: null,
  selectedGenres: [],
};

export const fetchGenres = createAsyncThunk('genres/fetchGenres', async () => {
  const params = {
    api_key: API_KEY,
    language: 'en-US',
  };
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {params});
  console.log(response.data.genres);
  return response.data.genres;
});

const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    toggleGenres: (state, action) => {
      const genreId = action.payload;
      if (state.selectedGenres.includes(genreId)) {
        state.selectedGenres = state.selectedGenres.filter(
          id => id !== genreId,
        );
      } else {
        state.selectedGenres.push(genreId);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGenres.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occured';
      });
  },
});

export const {toggleGenres} = genresSlice.actions;
export default genresSlice.reducer;
