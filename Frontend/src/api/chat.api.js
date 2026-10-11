import api from './axios';

// Send a message to AI chatbot
export const sendChatMessage = async (message) => {
  const response = await api.post('/chat', { message });
  return response.data;
};
