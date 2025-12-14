import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


api.interceptors.request.use((config)=>{ 
    // Don't attach token for login/register requests
    const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/register')
    
    if (!isAuthRequest) {
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
            console.log('🔐 Token attached to request:', token.substring(0, 20) + '...')
        } else {
            console.warn('⚠️ No token found in localStorage')
        }
    }
    return config;
}, (error)=>{
    return Promise.reject(error)
})


api.interceptors.response.use((response)=>response, (error)=>{
    if(error.response?.status === 401){
        console.error('❌ 401 Unauthorized:', error.response?.data)
        
        // Only logout if it's a token verification error
        const message = error.response?.data?.message?.toLowerCase() || ''
        if (message.includes('token') || message.includes('authorization')) {
            console.log('🚪 Logging out due to invalid token')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            
            // Only redirect if not already on login/signup page
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                window.location.href = '/login'
            }
        }
    }
    return Promise.reject(error)
})

export default api;