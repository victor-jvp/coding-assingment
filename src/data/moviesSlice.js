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
    next: true,
  },
  reducers: {
    setPage: (state, page) => {
      state.page = page.payload;
    },
    setMovies: (state, movies) => {
      state.movies = movies.payload;
    },
    setNext: (state, next) => {
      state.next = next.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { results, page, total_pages } = action.payload;
        if (results.length > 0) {
          if (page === 1) {
            state.movies = results;
          } else {
            state.movies = [...new Set([...state.movies, ...results])];
          }
          state.next = page < total_pages;
          state.page = page;
        }
        state.fetchStatus = "success";
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
