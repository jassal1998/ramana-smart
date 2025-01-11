import { NavigationContainer } from "@react-navigation/native";
import MainNavigation from "./Src/screen/navigation/mainnavigation";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./Src/slices";
export default function App() {
  const store = configureStore({ reducer: rootReducer, devTools: true });
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </Provider>
  );
}
