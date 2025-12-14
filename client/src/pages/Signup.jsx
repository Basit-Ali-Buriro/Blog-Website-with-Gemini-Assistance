import React from 'react'
import Navbar from '../components/layout/Navbar'
import SignupForm from '../components/auth/SignupForm'
import Footer from '../components/layout/Footer'


function Signup() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SignupForm />
      <Footer />
    </div>
  )
}

export default Signup
