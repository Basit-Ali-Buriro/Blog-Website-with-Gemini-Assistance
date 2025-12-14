import React from 'react'
import Navbar from '../components/layout/Navbar'
import LoginForm from '../components/auth/LoginForm'
import Footer from '../components/layout/Footer'

function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <LoginForm />
      </div>
      <Footer />
    </div>
  )
}

export default Login
