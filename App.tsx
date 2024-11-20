
import { NavigationContainer } from "@react-navigation/native";
import MainNavigation from './Src/screen/navigation/mainnavigation';
import { StatusBar } from "expo-status-bar";

import { Provider } from 'react-redux';
import store from "./Src/screen/redux/store";
export default function App() {
  return (
    <Provider store={store}>
   <NavigationContainer independent={true}>
    <MainNavigation/>
   </NavigationContainer>
   </Provider>
  );
}
