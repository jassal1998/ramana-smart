import { configureStore } from '@reduxjs/toolkit';
import contractReducer from './slice'; // Adjust the path

// Configure your store with the contractSlice reducer
const store = configureStore({
  reducer: {
    contracts: contractReducer,
  },
});

// Define RootState type based on your store configuration
export type RootState = ReturnType<typeof store.getState>;

// Export the store to be used in the app
export default store;
