import axios from "axios";
import { Alert } from "react-native";
import { loginSuccess, apiError } from "./reducer";
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
