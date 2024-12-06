import axios from "axios";
import { Alert } from "react-native";

export const requestLogin = async (
  email: string,
  password: string,
  navigateToPage: (page: string) => void
): Promise<void> => {
  console.log(email, 'gggttt')
  try {
    const response = await axios.post('http://192.168.1.16:3000/signin', {
      email,
      password,
    });
console.log(response, 'hjhjhj')
    console.log('Making login request with email:', email, 'and password:', password);
    console.log('API Response Status:', response.status); // Log the status code
    console.log('API Response Body:', response.data); // Log the response body

    if (response.headers['content-type'].includes('application/json')) {
      const responseData = response.data;

      console.log('Response Data:', responseData);

      // Check if fetchedUser and token exist
      if (responseData.fetchedUser && responseData.token) {
        console.log('Login successful:', responseData.message || 'Login successful');
        navigateToPage('LeadFollow'); // Navigate to Home or Dashboard page
      } else {
        console.error('Login Failed:', responseData.message || 'Invalid email or password');
        throw new Error(responseData.message || 'Failed to login.');
      }
    } else {
      throw new Error('Failed to login.');
    }
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 200
     // console.error('Response Data:', error.response.data);
      //console.error('Response Status:', error.response.status);
    } else if (error.request) {
      // No response from the server
    //  console.error('No response received:', error.request);
    } else {
      // Error setting up the request
      //console.error('Error Message:', error.message);
    }
    Alert.alert('Error', error.message || 'An error occurred while logging in');
  }
};
