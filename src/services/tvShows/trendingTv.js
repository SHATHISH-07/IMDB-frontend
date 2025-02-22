import axios from "axios";

const baseUrl = "/api/tv/trending";

// Function to get trending tv show by day
const getTrendingTvByDay = async (page = 1) => {
  try {
    const response = await axios.get(`${baseUrl}/day?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending tv show for day:", error);
    throw error;
  }
};

// Function to get trending tv show by week
const getTrendingTvByWeek = async (page = 1) => {
  try {
    const response = await axios.get(`${baseUrl}/week?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending tv show for week:", error);
    throw error;
  }
};

export default { getTrendingTvByDay, getTrendingTvByWeek };
