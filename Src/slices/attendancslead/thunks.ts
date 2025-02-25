import axios from "axios";
import API_BASE_URl from "../../../contant/apiconfig";

import { Header } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lead, } from "./reducser";


export const fetchAttendanceData = (id:any) => async (dispatch: any) => {
  try {
    const savetoken = await AsyncStorage.getItem("userToken");
    if (!savetoken) {
      throw new Error("No token found in AsyncStorage.");
    }
    const newStr = savetoken?.replace(/^"|"$/g, "");
    const formattedToken = `Bearer ${newStr}`;
    const url = `${API_BASE_URl}/attendance/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: formattedToken,
      },
    });
    const data = response.data;
     console.log(data, "data")
     dispatch(Lead(data.data));
     console.log('rishm',data.data)
    return data;
  } catch (error) {
    // Dispatch action for API error
    //dispatch(apiError(error))
    console.error("Services error:", error);
    throw error; // Rethrow the error to handle it outside
  }
};