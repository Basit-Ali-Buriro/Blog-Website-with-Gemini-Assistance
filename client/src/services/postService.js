import api from './api';

export const postService = {
  // Get all posts with pagination and filters
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Get single post by ID
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Get trending posts
  getTrending: async (params = {}) => {
    const response = await api.get('/posts/trending', { params });
    return response.data;
  },

  // Get posts by specific author
  getPostsByAuthor: async (authorId, params = {}) => {
    const response = await api.get(`/posts/author/${authorId}`, { params });
    return response.data;
  },

  // Get related posts for a specific post
  getRelatedPosts: async (postId) => {
    const response = await api.get(`/posts/${postId}/related`);
    return response.data;
  },

  // Create new post (with images)
  createPost: async (formData) => {
    const response = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update post
  updatePost: async (id, formData) => {
    const response = await api.put(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Like/Unlike post
  toggleLike: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  }
};