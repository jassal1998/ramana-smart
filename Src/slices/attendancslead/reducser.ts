import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  Lead: [], // Store the actual card data
  error: null, // for error message
  loading: false,
  headers: {} // Only store necessary headers, or omit it completely
};

const AttendanceLead = createSlice({
  name: "AttendanceLead",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload;
      state.loading = true;
    },
    Lead(state, action) {
      // Destructure the payload to extract only the necessary fields
      const { headers, ...LeadData } = action.payload; 

      // Optionally extract relevant headers if needed
      const { "access-control-allow-origin": allowOrigin } = headers || {};

      // Store the relevant data only
      state.Lead = LeadData; // Store card data only (not the headers)
      state.headers = { allowOrigin };
      state.loading = false;
    },
  },
});

export const { apiError, Lead } = AttendanceLead.actions;

export default AttendanceLead.reducer;
