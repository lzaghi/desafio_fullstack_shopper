import axios from "axios";
import { jsonData } from "../interfaces/interfaces";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const postRequest = async (endpoint: string, body: jsonData[]) => {
  const { data } = await api.post(endpoint, body);
  return data;
}