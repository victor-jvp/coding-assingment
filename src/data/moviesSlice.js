import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk("fetch-movies", async (apiUrl) => {
  const response = await fetch(apiUrl);
  return response.json();
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    fetchStatus: "",
    page: 1,
    total_pages: 1,
  },
  reducers: {
    setPage: (state, page) => {
      state.page = page.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        state.page = action.payload.page;
        state.total_pages = action.payload.total_pages;
        if (action.payload.page === 1) {
          state.movies = action.payload.results;
        } else {
          state.movies = [
            ...new Set([...state.movies, ...action.payload.results]),
          ];
        }
      })
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.fetchStatus = "error";
      });
  },
});

export default moviesSlice;
