import axios from "axios";

const getTvReview = async (id) => {
  if (!id) {
    console.log("Movie ID is required");
  }

  const url = `https://imdb-backend-rore.onrender.com/api/tv/review/${id}`;
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

export default getTvReview;
