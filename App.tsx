import { NavigationContainer } from "@react-navigation/native";
import MainNavigation from "./Src/screen/navigation/mainnavigation";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./Src/slices";
import "./Textconfig"

import "./loaction";
import { useEffect } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {registerBackgroundFetch} from "./backgroundFetchTask"



export default function App() {

const LOCATION_TASK_NAME = "background-location-task";
useEffect(() => {
  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (status !== "granted" || bgStatus !== "granted") {
      console.error("Permission not granted");
      console.log("dsdsds",bgStatus)
      return;
    }

    const isTaskRegistered:any = await TaskManager.isTaskRegisteredAsync(
      LOCATION_TASK_NAME
    );
    if (!isTaskRegistered) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval:60000, // 5 minutes
        distanceInterval: 0, // Updates every 5 minutes regardless of movement
        foregroundService: {
          notificationTitle: "Tracking your location",
          notificationBody: "App is running in the background",
          notificationColor: "#FF0000",
        },
      });
    }
  };

  startLocationTracking();
  registerBackgroundFetch()
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
