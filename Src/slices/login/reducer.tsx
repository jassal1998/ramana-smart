import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  success: "",
  error: "", // for error message
  loading: false,
  isUserLogout: false,
  errorMsg: false, // for error
};

const account = createSlice({
  name: "account",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload;
      state.loading = true;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.success = action.payload;
      state.loading = false;
      state.errorMsg = false;
    },
  },
});

export const { apiError, loginSuccess } = account.actions;

export default account.reducer;
