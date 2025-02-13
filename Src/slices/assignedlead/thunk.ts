import axios from "axios";
import API_BASE_URl from "../../../contant/apiconfig";

import { Header } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { assignData } from "./reducer";



export const fetchAssigned = (id:any) => async (dispatch: any) => {
  try {
    const savetoken = await AsyncStorage.getItem("userToken");
    if (!savetoken) {
      throw new Error("No token found in AsyncStorage.");
    }
    const newStr = savetoken?.replace(/^"|"$/g, "");
    const formattedToken = `Bearer ${newStr}`;
    console.log("Sdsdsd",formattedToken)
    const url = `${API_BASE_URl}/getassignedleads/${id}`
    const response = await axios.get(url, {
      headers: {
        Authorization: formattedToken,
      },
    });
    const data = response.data;
     console.log(data, "data")
     dispatch(assignData(data.data));
     console.log('rishm',data.data)
    return data;
  } catch (error) {
    // Dispatch action for API error
    //dispatch(apiError(error))
    console.error("Services error:", error);
    throw error; // Rethrow the error to handle it outside
  }
};