import axios from "axios";

export default axios.create({
  baseURL: process.env.SERVER_API || "http://127.0.0.1:3001",
});
