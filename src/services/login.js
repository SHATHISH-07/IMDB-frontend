import axios from "axios";

const baseUrl = "/api/login";

const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials);
    return response.data; // Return the token or user data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Invalid username or password");
    } else {
      throw new Error("An error occurred while logging in");
    }
  }
};

export default login;
