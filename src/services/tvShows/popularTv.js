import axios from "axios";

const baseUrl = "https://imdb-backend-rore.onrender.com/api/tv/popular";

const getPopularTv = async (page = 1) => {
  try {
    const response = await axios.get(baseUrl, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
    throw error;
  }
};

export default getPopularTv;
