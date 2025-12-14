import { useState } from "react"
import toast from 'react-hot-toast'
import { useAuth } from "../../hooks/useAuth"
import { useNavigate, Link } from "react-router-dom"

const LoginForm = () => {

    const {login} = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email :'',
        password : ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData(prev=>({...prev, [name] : value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const loadingToast = toast.loading('Logging in...')
        
        try {
            await login(formData.email, formData.password)
            toast.dismiss(loadingToast)
            toast.success('Welcome back! 👋')
            navigate('/')
        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="w-full max-w-md text-center border border-gray-300/60 rounded-2xl px-6 sm:px-8 bg-white shadow-lg transition-all hover:shadow-xl" onSubmit={handleSubmit}>
            <h1 className="text-gray-900 text-2xl sm:text-3xl mt-8 sm:mt-10 font-medium">Login</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">Please sign in to continue</p>
            
            <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-11 sm:h-12 rounded-full overflow-hidden pl-4 sm:pl-6 pr-4 gap-2 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail shrink-0">
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email id" 
                    className="border-none outline-none ring-0 w-full text-sm sm:text-base" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                />
            </div>

            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-11 sm:h-12 rounded-full overflow-hidden pl-4 sm:pl-6 pr-4 gap-2 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock shrink-0">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className="border-none outline-none ring-0 w-full text-sm sm:text-base" 
                    value={formData.password}
                    onChange={handleChange}
                    required 
                />
            </div>

            <div className="mt-4 text-left text-indigo-500">
                <button className="text-xs sm:text-sm hover:underline transition-all" type="button">Forgot password?</button>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="mt-2 w-full h-11 sm:h-12 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium shadow-lg hover:shadow-xl active:scale-95"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Logging in...
                    </span>
                ) : (
                    'Login'
                )}
            </button>

            <p className="text-gray-500 text-sm mt-3 mb-11">
                Don't have an account? <Link to="/signup" className="text-indigo-500 hover:underline transition-all">Sign up</Link>
            </p>
        </form>
    )
}

export default LoginForm
