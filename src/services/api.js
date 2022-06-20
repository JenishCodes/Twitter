import axios from "axios";
import { getJwt } from "./user";

axios.defaults.headers.common["x-auth-token"] = getJwt();

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("Logging the error", error);
    alert("An unexpected error occured.");
  }

  return Promise.reject(error);
});

axios.defaults.baseURL =
  /*process.env.REACT_APP_SERVER_API ||*/ "http://127.0.0.1:3001";

export default axios;
