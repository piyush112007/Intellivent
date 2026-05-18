import axios from "axios";

const API = axios.create({

  baseURL: "https://intelliventbackend.vercel.app/api", // For Global deployment
  // baseURL:"https://intellivent-git-features-piyush112007s-projects.vercel.app/api", // For Feature deployment
  // baseURL: "http://localhost:5000/api", //For Local Testing
  
  // withCredentials: true,

});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;