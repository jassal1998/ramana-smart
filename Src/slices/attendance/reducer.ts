import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  Attendance:"",
  error:null, // for error message
  loading: false,
 
};

const AttendanceData = createSlice({
  name: "AttendanceData",
  initialState,
  reducers: {
    apiError(state, action) {
      console.log(action.payload, "aaa");
      state.error = action.payload;
      state.loading = true;
     
    },
    Attendance(state, action) {
      state.Attendance = action.payload;
       console.log(action.payload, "fcvvv");
      state.loading = false;
      
    },
  },
});

export const { apiError, Attendance } = AttendanceData.actions;

export default AttendanceData.reducer
