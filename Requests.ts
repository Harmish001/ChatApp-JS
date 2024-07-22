import axios from "axios";

const typeJSON = "application/json"
export const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_URL}/`,
    headers: {
      Accept: typeJSON,
      'Content-Type': typeJSON,
    },
  });