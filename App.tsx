import { NavigationContainer } from "@react-navigation/native";
import MainNavigation from "./Src/screen/navigation/mainnavigation";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./Src/slices";
import "./Textconfig"

import { startLocationTracking } from "./loaction";
import { useEffect } from "react";





export default function App() {

useEffect(() => {
  startLocationTracking(); // Start tracking when the app loads
}, []);



  const store = configureStore({ reducer: rootReducer, devTools: true });
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </Provider>
  );
}
