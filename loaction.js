import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import API_BASE_URl from "./contant/apiconfig";
import { useEffect } from "react";
const LOCATION_TASK_NAME = "background-location-task";


TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(" Location tracking error:", error);
    return;
  }

  if (!data || !data.locations || data.locations.length === 0) {
    console.log(" No location data received");
    return; 
  }  console.log(" Token extracted:", trimmedToken);
  console.log(" Employee ID:", decoded.employeeId);

  const { latitude, longitude } = data.locations[0].coords;
  console.log("New location:", latitude, longitude);

  try {
    const saveToken = await AsyncStorage.getItem("userToken");
    if (!saveToken) {
      console.error("🚨 No token found in AsyncStorage.");
      return;
    }

    const decoded = jwtDecode(saveToken);
    if (!decoded.employeeId) {
      console.error("🚨 Employee ID missing in token");
      return;
    }

    const formattedToken = `Bearer ${saveToken.replace(/^"|"$/g, "")}`;
    const url = `${API_BASE_URl}/employeelocation`;

    console.log("🚀 Sending location to backend:", latitude, longitude);

    await axios.post(
      url,
      {
        emId: decoded.employeeId,
        latitude: latitude,
        longitude: longitude,
      },
      {
        headers: { Authorization: formattedToken },
      }
    );

    console.log("✅ Location sent successfully via Axios");
  } catch (error) {
    console.error("❌ Failed to send location:", error);
  }
});

export const startLocationTracking = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } =
    await Location.requestBackgroundPermissionsAsync();
    

  console.log(" Foreground:", status, "ccccc:", bgStatus);

  if (status !== "granted" || bgStatus !== "granted") {
    console.log("❌ Permission to access location was denied");
    return;
  }

  const isTaskRunning = await TaskManager.isTaskRegisteredAsync(
    LOCATION_TASK_NAME
  );
  console.log("🔍 Is background task running?", isTaskRunning);

  if (!isTaskRunning) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation, // ✅ Best tracking mode
      timeInterval: 300000, // ✅ Send every 5 minutes (300,000 ms)
      distanceInterval: 50, // ✅ Send only if moved 50 meters
      deferredUpdatesInterval: 60000, // ✅ Save battery
      deferredUpdatesDistance: 10, // ✅ Only send if moved 10 meters

      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: false, // ❌ Prevent stopping updates
      startOnBoot: true, // ✅ Restart tracking after reboot

      foregroundService: {
        notificationTitle: "📍 Location Tracking Active",
        notificationBody: "Your location is being tracked in the background.",
        notificationColor: "#FF5733",
      },
    });

    console.log("✅ Background location tracking started");
  }
};

