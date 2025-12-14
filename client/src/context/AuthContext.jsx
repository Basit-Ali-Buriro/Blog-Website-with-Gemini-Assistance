import {createContext, useState, useEffect} from 'react'
import {authService}  from '../services/authService'


export const AuthContext = createContext()

export const AuthProvider = ({children})=>{
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if(token && savedUser){
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])
  
  const login = async (email, password)=>{
    const data = await authService.login({ email, password });
    console.log('✅ Login successful, saving token:', data.token?.substring(0, 20) + '...')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    setUser(data.user)
    console.log('✅ User set in context:', data.user)
    return data;
  }

  const register = async(userData)=>{
    const data = await authService.register(userData);
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data;
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const value = {
    user, 
    currentUser: user, // Add currentUser alias for compatibility
    setUser, // Add setUser for profile updates
    login,
    register,
    logout,
    loading, 
    isAuthenticated : !!user, 
    isAdmin : user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};