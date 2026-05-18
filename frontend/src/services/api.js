import axios from "axios";

const API = axios.create({
  baseURL: "https://intelliventbackend.vercel.app/api/",
});

export default API;