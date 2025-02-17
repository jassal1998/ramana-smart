import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API_BASE_URl from "./contant/apiconfig";

const LOCATION_TASK_NAME = "background-location-task";

// Define Background Location Task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("❌ Location tracking error:", error);
    return;
  }

  if (!data || !data.locations || data.locations.length === 0) {
    console.log("⚠️ No location data received");
    return;
  }
  const currentHour = new Date().getHours();
  if (currentHour >= 20) {
    console.log(
      `🕗 Location updates paused after 8 PM. Current hour: ${currentHour}`
    );
    return;
  }
  try {
    // 🔹 Get token from AsyncStorage
    const saveToken = await AsyncStorage.getItem("userToken");
    if (!saveToken) {
      console.error("🚨 No token found in AsyncStorage.");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(saveToken);
      console.log("✅ Decoded Token:", decoded);
    } catch (decodeError) {
      console.error("❌ Error decoding JWT:", decodeError);
      return;
    }

    if (!decoded?.employeeId) {
      console.error("🚨 Employee ID missing in decoded token.");
      return;
    }

    const formattedToken = `Bearer ${saveToken.replace(/^"|"$/g, "")}`;
    const { latitude, longitude } = data.locations[0].coords;
    const currentTime = new Date().toLocaleTimeString();
    console.log("New location ${currentTime}:", latitude, longitude);
    console.log("dssd", currentTime);
    // 🔹 Save last location in AsyncStorage
    await AsyncStorage.setItem(
      "lastLocation",
      JSON.stringify({ latitude, longitude })
    );

    // 🔹 Send location to API immediately
    try {
      console.log("📡 Sending location to backend...");

      const response = await axios.post(
        `${API_BASE_URl}/employeelocation`,
        {
          empId: decoded.employeeId,
          latitude,
          longitude,
        },
        {
          headers: { Authorization: formattedToken },
        }
      );

      console.log("✅ Location sent successfully:", response.data);
    } catch (apiError) {
      console.error("❌ Failed to send location:", apiError);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
});

// Start Background Location Tracking
export const startLocationTracking = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } =
    await Location.requestBackgroundPermissionsAsync();

  console.log("Foreground:", status, "Background:", bgStatus);

  if (status !== "granted" || bgStatus !== "granted") {
    console.log("Permission to access location was denied");
    return;
  }

  const isTaskRunning = await TaskManager.isTaskRegisteredAsync(
    LOCATION_TASK_NAME
  );
  console.log("Is background task running?", isTaskRunning);

  if (!isTaskRunning) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 300000,
      distanceInterval: 10,
      deferredUpdatesInterval: 60000,
      deferredUpdatesDistance: 10,
      showsBackgroundLocationIndicator: true,
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: false,
      startOnBoot: true,

      // foregroundService: {
      //   notificationTitle: "📍 Location Tracking Active",
      //   notificationBody: "Your location is being tracked in the background.",
      //   notificationColor: "#FF5733",
      // }
    });

    if (Platform.OS === "android") {
      options = {
        ...options,
        timeInterval: 300000, // 5 minutes
        deferredUpdatesInterval: 60000,
        deferredUpdatesDistance: 10,
      };
    } else if (Platform.OS === "ios") {
      // iOS does not support timeInterval or deferredUpdates options
      // You can add any iOS-specific options if needed here
      options = { ...options };
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, options);
    console.log("✅ Background location tracking started");
  }
};
