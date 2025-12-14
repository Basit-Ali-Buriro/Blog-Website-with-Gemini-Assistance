import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-yellow-200 to-pink-200">
              Blog Website
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100 max-w-3xl mx-auto mb-8 px-4">
            Discover amazing stories, share your thoughts, and connect with writers from around the world
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
                >
                  ✍️ Write a Story
                </Link>
                <Link
                  to="#posts"
                  className="w-full sm:w-auto px-8 py-3 bg-indigo-500 bg-opacity-30 backdrop-blur-sm border-2 border-white border-opacity-50 rounded-full font-semibold hover:bg-opacity-40 transition-all"
                >
                  📖 Explore Posts
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3 bg-indigo-500 bg-opacity-30 backdrop-blur-sm border-2 border-white border-opacity-50 rounded-full font-semibold hover:bg-opacity-40 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold">1000+</div>
              <div className="text-indigo-200 text-sm sm:text-base mt-1">Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold">500+</div>
              <div className="text-indigo-200 text-sm sm:text-base mt-1">Writers</div>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <div className="text-3xl sm:text-4xl font-bold">10k+</div>
              <div className="text-indigo-200 text-sm sm:text-base mt-1">Readers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
