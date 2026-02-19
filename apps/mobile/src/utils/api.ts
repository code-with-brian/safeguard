import axios from 'axios';

const API_URL = 'http://localhost:3001/v1'; // Update with your API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contentApi = {
  submitMessage: async (data: {
    childId: string;
    content: string;
    sourceApp: string;
    senderId: string;
    senderName: string;
    conversationId: string;
  }) => {
    try {
      const response = await api.post('/content/message', data);
      return response.data;
    } catch (error) {
      console.error('Failed to submit message:', error);
      throw error;
    }
  },
  
  submitLocation: async (data: {
    childId: string;
    latitude: number;
    longitude: number;
  }) => {
    try {
      const response = await api.post('/content/location', data);
      return response.data;
    } catch (error) {
      console.error('Failed to submit location:', error);
    }
  },
};

export default api;
