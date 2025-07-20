import axios from "axios";

const baseUrl = "/api/movie/trending";

// Function to get trending movies by day
const getTrendingMovieByDay = async (page = 1) => {
  try {
    const response = await axios.get(`${baseUrl}/day?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies for day:", error);
    throw error;
  }
};

// Function to get trending movies by week
const getTrendingMovieByWeek = async (page = 1) => {
  try {
    const response = await axios.get(`${baseUrl}/week?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies for week:", error);
    throw error;
  }
};

export default { getTrendingMovieByDay, getTrendingMovieByWeek };
