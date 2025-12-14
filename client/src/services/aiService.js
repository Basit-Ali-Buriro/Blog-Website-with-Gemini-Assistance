import api from './api';

export const aiService = {
  // Get AI assistance for blog writing
  getAssistance: async (type, input) => {
    const response = await api.post('/ai/assist', { type, input });
    return response.data;
  },

  // Generate blog ideas
  generateIdeas: async (category, keywords) => {
    const response = await api.post('/ai/ideas', { category, keywords });
    return response.data;
  }
};
