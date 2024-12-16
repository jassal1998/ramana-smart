// otpService.ts (or wherever the function is defined)
import axios from "axios";

export const requestOTP = async (email: string) => {
  try {
    const response = await axios.post("https://api.ramanamachines.com:4000 /forgetpassword", {
      email,
    });
    console.log("OTP sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in requestOTP:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while requesting OTP"
    );
  }
};

const API_BASE_URL = "http://192.168.1.20:3000/reset"



export const verifyOtp = async (otp:any, emailOrPhone:any) => {
  try {
    const response = await axios.post("http://192.168.1.20:3000//reset", {
      otp,
      emailOrPhone,
    });
    return response.data;
  } catch (error:any) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};

