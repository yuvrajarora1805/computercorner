import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "tcc_cart_items";

const getInitialItems = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to read cart from localStorage", e);
    }
  }
  return [];
};

const saveItemsToStorage = (items) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }
};

const initialState = {
  items: getInitialItems(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      state.items = getInitialItems();
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.cartQuantity += 1;
      } else {
        state.items.push({ ...action.payload, cartQuantity: 1 });
      }
      saveItemsToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      saveItemsToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item && quantity > 0) {
        item.cartQuantity = quantity;
      }
      saveItemsToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveItemsToStorage(state.items);
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, hydrateCart } = cartSlice.actions;

export default cartSlice.reducer;
