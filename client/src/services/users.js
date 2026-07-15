import axios from "axios";
const baseUrl = import.meta.env.PROD
  ? "/api/users"
  : "http://localhost:3003/api/users";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const get = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, get };
