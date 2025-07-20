import axios from "axios";

const baseUrl = "https://imdb-backend-rore.onrender.com/api/tv/top_rated";

const getTopRatedTv = async (page = 1) => {
  try {
    const response = await axios.get(`${baseUrl}?page=${page}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response from server:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

export default getTopRatedTv;
