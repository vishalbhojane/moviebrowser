import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_KEY, BASE_URL} from '../../utils/constants';

interface SearchState {
  results: any[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const searchMovies = createAsyncThunk(
  'search/searchMovies',
  async ({query, page}: {query: string; page: number}) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          include_adult: false,
          language: 'en-US',
          page: page,
        },
        headers: {
          accept: 'application/json',
        },
      });

      return {
        results: response.data.results,
        totalPages: response.data.total_pages,
        page: response.data.page,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.status_message || 'Failed to fetch movies',
        );
      }
      throw error;
    }
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: state => {
      state.results = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchMovies.pending, state => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.results = action.payload.results;
        } else {
          state.results = [...state.results, ...action.payload.results];
        }
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const {clearSearch} = searchSlice.actions;
export default searchSlice.reducer;
