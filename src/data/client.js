import axios from 'axios';
import { API_SERVER_URL } from './settings';

const apiClient = axios.create({
  baseURL: API_SERVER_URL,
});

export default apiClient;
