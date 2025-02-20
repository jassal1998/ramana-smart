import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URl from "../../../contant/apiconfig";
import axios from "axios";
import { self } from "./reducer";




export const selfpost = (formData: any) => async (dispatch: any) => {
  try {
    
    if (!formData || Object.keys(formData).length === 0) {
      throw new Error("Request data cannot be empty");
    }

    console.log("Request Data being sent:", formData);

 
    const savetoken = await AsyncStorage.getItem("userToken");
    if (!savetoken) {
      throw new Error("No token found in AsyncStorage.");
    }

  
    const formattedToken = `Bearer ${savetoken.replace(/^"|"$/g, "")}`;
    console.log("Formatted Token Sent to Backend:", formattedToken);

   
    const url = `${API_BASE_URl}/createlead`;
    console.log("API URL:", url);

    const response = await axios.post(
      url,formData,
    
      {
        headers: {
          Authorization: formattedToken,
          "Content-Type":  "application/json",
        },
        // timeout: 2000, 
      }
    );


    const data = response.data;
    console.log("Full Backend Response:", data);

    if (data) {
     dispatch(self(data)); 
      return data;
    } else {
      throw new Error(data.message || "Unknown backend error.");
    }
  } catch (error: any) {
  
    console.error("Error:", error);

    if (error.response) {
      console.error("Backend Error Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received from the backend:", error.request);
    } else {
      console.error("General Error:", error.message);
    }

    
    // dispatch(apiError(error.response ? error.response.data : error.message));
    throw error.response ? error.response.data : error.message;
  }
};