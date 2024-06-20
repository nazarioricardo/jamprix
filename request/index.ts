import axios from "axios";

export const spotifyRequest = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
    timeout: 1000,
  },
});

export const dbRequest = axios.create();
