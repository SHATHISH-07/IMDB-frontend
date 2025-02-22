import axios from "axios";

// Function to get movie details by ID
const getMovieById = async (id) => {
  if (!id) {
    throw new Error("Movie ID is required");
  }
  const url = `/api/movie/search/${id}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

// Function to search movies by query
const searchMovies = async (query, page = 1) => {
  if (!query) {
    throw new Error("Search query is required");
  }

  const Url = "/api/movie/search";

  try {
    const response = await axios.get(`${Url}?query=${query}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error searching for movies:", error);
    throw error;
  }
};

export default { getMovieById, searchMovies };
