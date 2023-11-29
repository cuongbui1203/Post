import axios from "axios";

const auth =
  "Bearer " +
  (localStorage.getItem("token") ? localStorage.getItem("token") : "");

const net = axios.create({
  baseURL: import.meta.env.VITE_BE_API_ENDPOINT as string,
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
    Authorization: auth,
  },
});

// net.interceptors.

export default net;
