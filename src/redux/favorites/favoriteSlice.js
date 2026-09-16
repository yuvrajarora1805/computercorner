import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        state.items = state.items.filter(item => item._id !== action.payload._id);
      } else {
        state.items.push(action.payload);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    }
  },
});

export const { toggleFavorite, clearFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;
