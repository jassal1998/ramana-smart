import axios from "axios";

export const fetchData = async () => {
  try {
    console.log('Attempting to fetch data...');
    const response = await axios.get('https://api.ramanamachines.com:4000 /leads/2');
    console.log('API Response:', response.data);
    return response.data;
  } catch (error:any) {
    console.error('Error fetching data:', error);
    if (error.response) {
      console.log('Response error:', error.response.data);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
    throw error;
  }
};2