import { createSlice } from "@reduxjs/toolkit";

const FAV_STORAGE_KEY = "tcc_favorite_items";

const getInitialFavorites = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(FAV_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to read favorites from localStorage", e);
    }
  }
  return [];
};

const saveFavoritesToStorage = (items) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save favorites to localStorage", e);
    }
  }
};

const initialState = {
  items: getInitialFavorites(),
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    hydrateFavorites: (state) => {
      state.items = getInitialFavorites();
    },
    toggleFavorite: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        state.items = state.items.filter(item => item._id !== action.payload._id);
      } else {
        state.items.push(action.payload);
      }
      saveFavoritesToStorage(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveFavoritesToStorage(state.items);
    }
  },
});

export const { toggleFavorite, clearFavorites, hydrateFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;
