import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, Edit3, Key, Upload, Loader2, Heart, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PostCard from '../components/post/PostCard'
import { useAuth } from '../hooks/useAuth'
import { postService } from '../services/postService'
import { authService } from '../services/authService'
import { formatDate } from '../utils/formatDate'

function Profile() {
  const navigate = useNavigate()
  const { currentUser, setUser, loading: authLoading } = useAuth()
  
  
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts') // 'posts', 'edit', 'password'
  
  // Edit Profile State
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [profilePicPreview, setProfilePicPreview] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  
  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0
  })

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return
    
    if (!currentUser) {
      toast.error('Please login to access your profile')
      navigate('/login')
      return
    }

    // Set initial form values
    setUsername(currentUser.username || '')
    setEmail(currentUser.email || '')
    setBio(currentUser.bio || '')
    setProfilePicPreview(currentUser.profilePic || '')

    fetchUserPosts()
  }, [currentUser, authLoading, navigate])

  const fetchUserPosts = async () => {
    const userId = currentUser?._id || currentUser?.id
    if (!userId) return
    
    try {
      setLoading(true)
      const response = await postService.getPostsByAuthor(userId)
      const posts = response.posts || response
      setUserPosts(posts)
      
      // Calculate stats
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)
      const totalComments = posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0)
      
      setStats({
        totalPosts: posts.length,
        totalLikes,
        totalComments
      })
    } catch (err) {
      toast.error('Failed to fetch your posts')
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      setProfilePicPreview(URL.createObjectURL(file))
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast.error('Username is required')
      return
    }
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }

    try {
      setEditLoading(true)
      const loadingToast = toast.loading('Updating profile...')

      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('bio', bio)
      if (profilePic) {
        formData.append('profilePic', profilePic)
      }

      const response = await authService.updateProfile(formData)
      
      // Update context
      setUser(response.user)
      
      toast.dismiss(loadingToast)
      toast.success('Profile updated successfully! 🎉')
      setActiveTab('posts')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setEditLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required')
      return
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setPasswordLoading(true)
      const loadingToast = toast.loading('Changing password...')

      await authService.changePassword({
        currentPassword,
        newPassword
      })

      toast.dismiss(loadingToast)
      toast.success('Password changed successfully! 🔐')
      
      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setActiveTab('posts')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="shrink-0">
              <img
                src={currentUser.profilePic || 'https://via.placeholder.com/150'}
                alt={currentUser.username}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {currentUser.username}
              </h1>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Mail className="w-4 h-4" />
                {currentUser.email}
              </p>
              <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                Joined {formatDate(currentUser.createdAt)}
              </p>
              {currentUser.bio && (
                <p className="mt-4 text-gray-700 max-w-2xl">{currentUser.bio}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
                  {stats.totalPosts}
                </div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-pink-600 flex items-center gap-1">
                  <Heart className="w-6 h-6 fill-current" />
                  {stats.totalLikes}
                </div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 flex items-center gap-1">
                  <MessageSquare className="w-6 h-6" />
                  {stats.totalComments}
                </div>
                <div className="text-sm text-gray-600">Comments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-8">
          <div className="flex border-b-2 border-gray-100">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'edit'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'password'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                ) : userPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">You haven't created any posts yet</p>
                    <button
                      onClick={() => navigate('/create')}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Create Your First Post
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPosts.map(post => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === 'edit' && (
              <form onSubmit={handleUpdateProfile} className="max-w-2xl mx-auto space-y-6">
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <img
                      src={profilePicPreview || 'https://via.placeholder.com/150'}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                        id="profile-pic-upload"
                      />
                      <label
                        htmlFor="profile-pic-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload New Photo
                      </label>
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <User className="w-5 h-5 text-indigo-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900"
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 resize-y"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={editLoading}
                  className="w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Key className="w-5 h-5 text-indigo-600" />
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Key className="w-5 h-5 text-indigo-600" />
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900"
                    required
                    minLength={6}
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Key className="w-5 h-5 text-indigo-600" />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Changing Password...
                    </span>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile
