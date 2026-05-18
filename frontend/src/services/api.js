import axios from "axios";

const API = axios.create({
  // baseURL: "https://intelliventbackend.vercel.app/api", // For Global deployment
  baseURL:
    "https://intellivent-git-features-piyush112007s-projects.vercel.app/", // For Feature deployment
  // baseURL: "http://localhost:5000/api", //For Local Testing
  withCredentials: true,
});

export default API;
