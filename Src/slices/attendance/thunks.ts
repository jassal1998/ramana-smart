import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URl from "../../../contant/apiconfig";
import axios from "axios";
import { apiError, Attendance } from "./reducer";


export const postAttendance = (formData: any) => async (dispatch: any) => {
  try {
    // Step 1: Validate the requestData
    if (!formData || Object.keys(formData).length === 0) {
      throw new Error("Request data cannot be empty");
    }

    console.log("Request Data being sent:", formData);

    // Step 2: Retrieve the token from AsyncStorage
    const savetoken = await AsyncStorage.getItem("userToken");
    if (!savetoken) {
      throw new Error("No token found in AsyncStorage.");
    }

    // Step 3: Format the token
    const formattedToken = `Bearer ${savetoken.replace(/^"|"$/g, "")}`;
    console.log("Formatted Token Sent to Backend:", formattedToken);

    // Step 4: Build the API URL
    const url = `${API_BASE_URl}/attendance`;
    console.log("API URL:", url);

    // Step 5: Make the POST request using axios
    const response = await axios.post(
      url,formData,
    
      {
        headers: {
          Authorization: formattedToken,
          "Content-Type":  "multipart/form-data",
        },
        // timeout: 2000, // Timeout for handling slow networks
      }
    );

    // Step 6: Handle success response
    const data = response.data;
    console.log("Full Backend Response:", data);

    if (data.success || data.message?.toLowerCase() === "attendance recorded") {
      dispatch(Attendance(data)); // Dispatch the success action with data
      return data;
    } else {
      throw new Error(data.message || "Unknown backend error.");
    }
  } catch (error: any) {
    // Step 7: Handle errors
    console.error("Error:", error);

    if (error.response) {
      console.error("Backend Error Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received from the backend:", error.request);
    } else {
      console.error("General Error:", error.message);
    }

    // Dispatch the error action with a descriptive message
    dispatch(apiError(error.response ? error.response.data : error.message));
    throw error.response ? error.response.data : error.message;
  }
};