import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  assignData: [], // Store the actual card data
  error: null, // for error message
  loading: false,
  headers: {} // Only store necessary headers, or omit it completely
};

const Assign = createSlice({
  name: "Assign",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload;
      state.loading = true;
    },
    assignData(state, action) {
      // Destructure the payload to extract only the necessary fields
      const { headers, ...assign } = action.payload; 

      // Optionally extract relevant headers if needed
      const { "access-control-allow-origin": allowOrigin } = headers || {};

      // Store the relevant data only
      state.assignData = assign; // Store card data only (not the headers)
      state.headers = { allowOrigin };
      state.loading = false;
    },
  },
});

export const { apiError, assignData } = Assign.actions;

export default Assign.reducer;
