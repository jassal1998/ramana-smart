import axios from "axios";
import { Alert } from "react-native";
import { loginSuccess, apiError } from "./reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const requestLogin =
  (email: string, password: string, navigation: any) =>
  async (dispatch: any) => {
    // Added dispatch back for error handling
    try {
      const response = await axios.post(
        "https://api.ramanamachines.com:4000/signin",
        {
          email,
          password,
        }
      );

      if (response?.data) {
        const token =response.data.token
        if (token) {
          await AsyncStorage.setItem("userToken", token); 
          console.log("Token saved:", token); 
        } else {
          console.error("No token received in the response.");
        }
        dispatch(loginSuccess(response));
        navigation.navigate("Mydrawer", { screen: "LeadFollow" });
        return response.data;
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error: any) {
      // Dispatch an action for API error if using Redux
      dispatch(apiError(error.message || "An error occurred"));
      console.error("Login error:", error.message || error);
      throw error; // Rethrow the error for further handling if needed
    }
  };
  
