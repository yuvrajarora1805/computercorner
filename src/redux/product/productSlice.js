import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sumRating: 0,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    avarageRating: (state, actions) => {
      const payloadLength = actions.payload?.length || 0;
      if (payloadLength === 0) {
        state.sumRating = 0;
        return;
      }
      const sumRate = actions.payload
        .map((productRate) => parseInt(productRate.rating))
        .reduce((a, b) => a + b, 0);
      state.sumRating = (sumRate / payloadLength).toFixed(1);
    },
  },
});

export const { avarageRating } = productSlice.actions;

export default productSlice.reducer;
