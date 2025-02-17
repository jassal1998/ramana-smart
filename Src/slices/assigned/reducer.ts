import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  Followupdate:[],
  error:null, // for error message
  loading: false,
 
};

const Update = createSlice({
  name: "Update",
  initialState,
  reducers: {
    apiError(state, action) {
      console.log(action.payload, "aaa");
      state.error = action.payload;
      state.loading = true;
     
    },
    Followupdate(state, action) {
      state.Followupdate = action.payload;
       console.log(action.payload, "fcvvv");
      state.loading = false;
      
    },
  },
});

export const { apiError, Followupdate } = Update.actions;

export default Update.reducer
