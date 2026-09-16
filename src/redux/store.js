import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./product/productSlice";
import { apiSlice } from "./api/apiSlice";
import cartSlice from "./cart/cartSlice";
import favoriteSlice from "./favorites/favoriteSlice";

export const store = configureStore({
  reducer: {
    products: productSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    product: cartSlice,
    favorites: favoriteSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
