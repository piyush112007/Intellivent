import axios from "axios";

const API = axios.create({
  baseURL: "https://intelliventbackend.vercel.app/api/",  // For Global deployment 
    // baseURL: "http://localhost:5000/api", //For Local Testing
});

export default API;