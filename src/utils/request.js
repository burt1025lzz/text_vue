import axios from "axios";

const instance = axios.create({
  // baseURL: "http://47.241.71.114:5000/",
  baseURL: "http://127.0.0.1:5000/",
  timeout: 60000,
});

instance.interceptors.request.use(
  (config) => {
    config.method === "post" &&
      (config.headers = {
        "Content-Type": "application/json",
      });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
