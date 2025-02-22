import axios from "axios";

// Function to get tv show details by ID
const getTvById = async (id) => {
  if (!id) {
    throw new Error("Tv show ID is required");
  }
  const url = `/api/tv/search/${id}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching tv show details:", error);
    throw error;
  }
};

// Function to search tv shows by query
const searchTvShows = async (query, page = 1) => {
  if (!query) {
    throw new Error("Search query is required");
  }

  const Url = "/api/tv/search";

  try {
    const response = await axios.get(`${Url}?query=${query}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error searching for tv shows:", error);
    throw error;
  }
};

export default { getTvById, searchTvShows };
