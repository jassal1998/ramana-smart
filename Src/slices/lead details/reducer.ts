import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  Data: [],
  error:null, // for error message
  loading: false,
 
};

const SendData = createSlice({
  name: "SendData",
  initialState,
  reducers: {
    apiError(state, action) {
      console.log(action.payload, "aaa");
      state.error = action.payload;
      state.loading = true;
     
    },
    Data(state, action) {
      state.Data = action.payload;
       console.log(action.payload, "fcvvv");
      state.loading = false;
      
    },
  },
});

export const { apiError, Data } = SendData.actions;

export default SendData.reducer
