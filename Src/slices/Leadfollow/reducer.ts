import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  Card: [], // Store the actual card data
  error: null, // for error message
  loading: false,
  headers: {} // Only store necessary headers, or omit it completely
};

const Follow = createSlice({
  name: "Follow",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload;
      state.loading = true;
    },
    Card(state, action) {
      // Destructure the payload to extract only the necessary fields
      const { headers, ...cardData } = action.payload; 

      // Optionally extract relevant headers if needed
      const { "access-control-allow-origin": allowOrigin } = headers || {};

      // Store the relevant data only
      state.Card = cardData; // Store card data only (not the headers)
      state.headers = { allowOrigin };
      state.loading = false;
    },
  },
});

export const { apiError, Card } = Follow.actions;

export default Follow.reducer;
