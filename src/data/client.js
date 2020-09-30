import axios from 'axios';
import { API_SERVER_URL } from './settings';

console.log(`API URL from env: ${API_SERVER_URL}`);

const apiClient = axios.create({
  baseURL: API_SERVER_URL,
});

export default apiClient;
