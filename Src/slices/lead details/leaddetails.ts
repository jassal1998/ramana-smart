import axios from "axios";
import API_BASE_URl from "../../../contant/apiconfig";
import {apiError, Data,} from "./reducer"
import AsyncStorage from "@react-native-async-storage/async-storage";

// export const postData = async (dispatch:any,requestData: any) => {
//   const url = 'https://api.ramanamachines.com:4000/userprofile'; 

//   console.log('Request Data being sent:', requestData);

//   if (!requestData || Object.keys(requestData).length === 0) {
//     throw new Error('Request data cannot be empty');
//   }

//   try {
//     const response = await axios.post(url, requestData, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer YOUR_TOKEN_HERE`, 
//       },
//       timeout: 10000, 
//     });
//     console.log('Response Data:', response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error('Error:', error);
//     if (error.response) {
//       console.error('Response error:', error.response.data);
//     } else if (error.request) {
//       console.error('Request error:', error.request);
//     } else {
//       console.error('General error:', error.message);
//     }
//     throw error.response ? error.response.data : error.message;
//   }
// };





export const postData = (fromData: any) => async (dispatch: any) => {
  try {
    // Step 1: Validate the requestData
    if (!fromData || Object.keys(fromData).length === 0) {
      throw new Error("Request data cannot be empty");
    }

    console.log("Request uni being sent:", fromData);

   
    const savetoken = await AsyncStorage.getItem("userToken");
    if (!savetoken) {
      throw new Error("No token found in AsyncStorage.");
    }

   
    const formattedToken = `Bearer ${savetoken.replace(/^"|"$/g, "")}`;
    console.log("Formatted Token:", formattedToken);
    const url = `${API_BASE_URl}/userprofile`;
    console.log("API URL:", url);
    const response = await axios.post(
      url,
      fromData, 
      {
        headers: {
          Authorization: formattedToken,
          "Content-Type": "multipart/form-data",
        },
       
      }
    );
console.log(response, "Jaiiii")
   
    const data = response.data;
    console.log("Response Data:", data);

    dispatch(Data(data)); 
    return data; 
  } catch (error: any) {
    
    console.error("Error:", error);

    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }

  
    dispatch(apiError(error.response ? error.response.data : error.message));
    throw error.response ? error.response.data : error.message;
  }
};




