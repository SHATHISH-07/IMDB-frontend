import axios from "axios";

const baseUrl = "/api/movie/genres";

const getAllGenresMovie = async () => {
  try {
    const response = await axios.get(baseUrl);
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

const getMovieByGenre = async (genreId, page = 1) => {
  if (!genreId) {
    throw new Error("Genre ID is required");
  }
  const url = `${baseUrl}/${genreId}?page=${page}`;
  try {
    const response = await axios.get(url);
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

export default { getAllGenresMovie, getMovieByGenre };
