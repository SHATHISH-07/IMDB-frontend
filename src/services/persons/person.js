import axios from "axios";

const API_BASE_URL = "/api/person";

// Fetch popular persons
const fetchPopularPersons = async (page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/popular`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular persons:", error.message);
    throw error;
  }
};

// Fetch person details by ID
const fetchPersonById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching person details:", error.message);
    throw error;
  }
};

// Search for persons by name
const searchPersons = async (query, page = 1, language = "en-US") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query, page, language },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching for persons:", error.message);
    throw error;
  }
};

export default {
  fetchPopularPersons,
  fetchPersonById,
  searchPersons,
};
