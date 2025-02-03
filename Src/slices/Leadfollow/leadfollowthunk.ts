import axios from "axios";
import API_BASE_URl from "../../../contant/apiconfig";
import { apiError, Card } from "./reducer";
import { Header } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// export const fetchData = async (dispatch:any) => {
//   try {
//     console.log('Attempting to fetch data...');
//     const response = await axios.get(`${API_BASE_URl}/leads/12`);
//     dispatch(Card(response))
//     console.log('data',response)
//     console.log('API Response:', response.data);
//     return response.data;
//   } catch (error:any) {
//     console.error('Error fetching data:', error);
//     if (error.response) {
//       console.log('Response error:', error.response.data);
//     } else if (error.request) {
//       console.log('No response received:', error.request);
//     } else {
//       console.log('Error setting up request:', error.message);
//     }
//     throw error;
//   }
// };2

export const fetchData = (id:any ) => async (dispatch: any) => {
  try {
    const savetoken = await AsyncStorage.getItem("userToken");
    if (!savetoken) {
      throw new Error("No token found in AsyncStorage.");
    }
    const newStr = savetoken?.replace(/^"|"$/g, "");
    const formattedToken = `Bearer ${newStr}`;
    const url = `${API_BASE_URl}/leads/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: formattedToken,
      },
    });
    const data = response.data;
   
    dispatch(Card(response.data));
    return response.data;
  } catch (error) {
    // Dispatch action for API error
    //dispatch(apiError(error))
    console.error("Services error:", error);
    throw error; // Rethrow the error to handle it outside
  }
};

// export const fetchData = () => async (dispatch: any) => {
//   try {
//     const savetoken = await AsyncStorage.getItem("userToken");
//     if (!savetoken) {
//       throw new Error("No token found in AsyncStorage.");
//     }

//     const newStr = savetoken.replace(/^"|"$/g, ""); // Remove quotes if present
//     const formattedToken = `Bearer ${newStr}`;

//     const url = `${API_BASE_URl}/leads/12`;
//     console.log(url, "URL");
//     console.log(formattedToken, "Formatted Token");

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: formattedToken,
//       },
//     });

//     console.log(response.status, "Status");
//     console.log(response.data, "Response Data");

//     // Dispatch an action for the fetched data
//     // dispatch(Card(response.data));
//     return response.data;
//   } catch (error: any) {
//     console.error("Error in fetchData:", error.response || error.message);
//     // Dispatch action for API error
//     dispatch(apiError(error));
//     throw error; // Optionally rethrow to handle further
//   }
// };
