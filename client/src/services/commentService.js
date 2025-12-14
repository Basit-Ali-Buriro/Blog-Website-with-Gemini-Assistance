import api from './api';

export const commentService = {
  // Get all comments for a specific post
  getCommentsByPost: async (postId, params = {}) => {
    const response = await api.get(`/comments/post/${postId}`, { params });
    return response.data;
  },

  // Get all comments by a specific user
  getCommentsByUser: async (userId, params = {}) => {
    const response = await api.get(`/comments/user/${userId}`, { params });
    return response.data;
  },

  // Get single comment by ID
  getComment: async (id) => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  // Add comment to a post
  addComment: async (postId, commentData) => {
    const response = await api.post(`/comments/post/${postId}`, commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};