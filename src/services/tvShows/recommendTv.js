import axios from "axios";

const baseUrl = "https://imdb-backend-rore.onrender.com/api/tv/recommend";

const getRecommendTv = async (id, page = 1) => {
  if (!id) {
    throw new Error("Tv ID is required to fetch recommendations");
  }
  const url = `${baseUrl}/${id}?page=${page}`;

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

export default getRecommendTv;
