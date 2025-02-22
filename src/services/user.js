import axios from "axios";

const baseUrl = "/api/users";
let token = null;

// Set the token for authorization
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

// Fetch all watchlist items
const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(baseUrl, config);
  return response.data; // Return all watchlist items
};

// Add a new item to the watchlist
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data; // Return the created watchlist item
};

// Remove an item from the watchlist
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data; // Return the response after deletion
};

export default { getAll, create, remove, setToken };
