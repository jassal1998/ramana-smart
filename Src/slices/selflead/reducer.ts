import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  self:[],
  error:null, // for error message
  loading: false,
 
};

const selflead = createSlice({
  name: "selflead",
  initialState,
  reducers: {
    apiError(state, action) {
      console.log(action.payload, "aaa");
      state.error = action.payload;
      state.loading = true;
     
    },
    self(state, action) {
      state.self = action.payload;
       console.log(action.payload, "fcvvv");
      state.loading = false;
      
    },
  },
});

export const { apiError, self } = selflead.actions;

export default selflead.reducer
