import axios from "axios";

const baseUrl = "/api/tv/on_air";

const getOnAirTv = async (page = 1) => {
  try {
    const response = await axios.get(baseUrl, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching on-air TV shows:", error);
    throw error;
  }
};

export default getOnAirTv;
