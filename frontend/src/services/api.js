import axios from "axios";

const API = axios.create({
  baseURL: "https://intelliventbackend.vercel.app/",
});

export default API;