import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API_BASE_URl from "./contant/apiconfig";
import { jwtDecode } from "jwt-decode";

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

    // Remove any extra quotes from token and add "Bearer " prefix
    const formattedToken = `Bearer ${saveToken.replace(/^"|"$/g, "")}`;

    // Extract latitude and longitude from the first location object
    const { latitude, longitude } = data.locations[0].coords;
    const currentTime = new Date().toLocaleTimeString();
    console.log(`New location at ${currentTime}:`, latitude, longitude);
 console.log("ffffff",currentTime);
    // 🔹 Save last location in AsyncStorage (optional)
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
