import { NavigationContainer } from "@react-navigation/native";
import MainNavigation from "./Src/screen/navigation/mainnavigation";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./Src/slices";
import "./Textconfig"

import { startLocationTracking } from "./loaction";
import { useEffect } from "react";
import { Alert } from "react-native";





export default function App() {

useEffect(() => {
  console.log("useEffect triggered - Attempting to start location tracking");
  // Alert.alert("Debug", "useEffect ran, starting tracking");
  startLocationTracking(); 
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
