import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, FileText, Users, FolderPlus, Trash2, Edit3, Eye, Plus, Search, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../hooks/useAuth'
import { postService } from '../services/postService'
import { categoryService } from '../services/categoryService'
import { formatDate } from '../utils/formatDate'

function Dashboard() {
  const navigate = useNavigate()
  const { currentUser, loading: authLoading } = useAuth()
  
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'posts', 'categories'
  const [loading, setLoading] = useState(true)
  
  // Stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0
  })
  
  // Posts Management
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // Categories Management
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDesc, setNewCategoryDesc] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryLoading, setCategoryLoading] = useState(false)

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      console.log('⏳ Waiting for auth to load...')
      return
    }
    
    if (!currentUser) {
      console.log('❌ No current user, redirecting to login')
      toast.error('Please login to access dashboard')
      navigate('/login')
      return
    }
    
    console.log('✅ Current user loaded:', currentUser)
    fetchDashboardData()
  }, [currentUser, authLoading, navigate])

  const fetchDashboardData = async () => {
    const userId = currentUser?._id || currentUser?.id
    
    if (!userId) {
      console.log('⚠️ Cannot fetch dashboard data: no user ID found')
      return
    }
    
    try {
      setLoading(true)
      
      console.log('📊 Fetching dashboard data for user:', userId)
      console.log('👤 User role:', currentUser?.role)
      
      // Admin sees ALL posts, regular users see only their own
      let postsResponse
      if (currentUser?.role === 'admin') {
        console.log('👑 Admin user - fetching ALL posts (including drafts)')
        // Fetch all posts without status filter for admin
        postsResponse = await postService.getPosts({ status: '', limit: 1000 })
      } else {
        console.log('👤 Regular user - fetching user posts')
        postsResponse = await postService.getPostsByAuthor(userId)
      }
      
      console.log('📝 Posts response:', postsResponse)
      const allPosts = postsResponse.posts || postsResponse
      console.log('📝 All posts:', allPosts)
      
      // Fetch categories
      const categoriesResponse = await categoryService.getCategories()
      console.log('📁 Categories response:', categoriesResponse)
      const allCategories = categoriesResponse.categories || categoriesResponse
      console.log('📁 All categories:', allCategories)
      
      setPosts(Array.isArray(allPosts) ? allPosts : [])
      setCategories(Array.isArray(allCategories) ? allCategories : [])
      
      // Calculate stats
      const published = allPosts.filter(p => p.status === 'published').length
      const drafts = allPosts.filter(p => p.status === 'draft').length
      
      setStats({
        totalPosts: allPosts.length,
        publishedPosts: published,
        draftPosts: drafts,
        totalCategories: allCategories.length
      })
      
      console.log('✅ Dashboard data loaded successfully')
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err)
      console.error('Error details:', err.response?.data)
      toast.error(err.response?.data?.message || 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const loadingToast = toast.loading('Deleting post...')
      await postService.deletePost(postId)
      
      setPosts(prev => prev.filter(p => p._id !== postId))
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }))
      
      toast.dismiss(loadingToast)
      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    
    if (!newCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }
    
    try {
      setCategoryLoading(true)
      const loadingToast = toast.loading('Creating category...')
      
      const response = await categoryService.createCategory({
        name: newCategoryName,
        description: newCategoryDesc
      })
      
      setCategories(prev => [...prev, response.category || response])
      setStats(prev => ({ ...prev, totalCategories: prev.totalCategories + 1 }))
      
      // Clear form
      setNewCategoryName('')
      setNewCategoryDesc('')
      
      toast.dismiss(loadingToast)
      toast.success('Category created successfully! 🎉')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category')
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleUpdateCategory = async (categoryId) => {
    if (!editingCategory) return
    
    try {
      setCategoryLoading(true)
      const loadingToast = toast.loading('Updating category...')
      
      const response = await categoryService.updateCategory(categoryId, {
        name: editingCategory.name,
        description: editingCategory.description
      })
      
      setCategories(prev => prev.map(c => 
        c._id === categoryId ? (response.category || response) : c
      ))
      
      setEditingCategory(null)
      
      toast.dismiss(loadingToast)
      toast.success('Category updated successfully!')
    } catch (error) {
      toast.error('Failed to update category')
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure? This will affect all posts in this category.')) return
    
    try {
      const loadingToast = toast.loading('Deleting category...')
      await categoryService.deleteCategory(categoryId)
      
      setCategories(prev => prev.filter(c => c._id !== categoryId))
      setStats(prev => ({ ...prev, totalCategories: prev.totalCategories - 1 }))
      
      toast.dismiss(loadingToast)
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Dashboard 📊
          </h1>
          <p className="text-gray-600">Manage your content and settings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-8">
          <div className="flex border-b-2 border-gray-100">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'overview'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'posts'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Posts ({stats.totalPosts})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'categories'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              Categories ({stats.totalCategories})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <FileText className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">{stats.totalPosts}</span>
                      </div>
                      <h3 className="text-lg font-semibold opacity-90">Total Posts</h3>
                    </div>

                    <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Eye className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">{stats.publishedPosts}</span>
                      </div>
                      <h3 className="text-lg font-semibold opacity-90">Published</h3>
                    </div>

                    <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Edit3 className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">{stats.draftPosts}</span>
                      </div>
                      <h3 className="text-lg font-semibold opacity-90">Drafts</h3>
                    </div>

                    <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <FolderPlus className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">{stats.totalCategories}</span>
                      </div>
                      <h3 className="text-lg font-semibold opacity-90">Categories</h3>
                    </div>
                  </div>
                )}

                {/* Posts Tab */}
                {activeTab === 'posts' && (
                  <div>
                    {/* Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search posts..."
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Posts Table */}
                    {filteredPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No posts found</p>
                        <button
                          onClick={() => navigate('/create')}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                        >
                          Create Post
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Title</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Category</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Date</th>
                              <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredPosts.map(post => (
                              <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="font-medium text-gray-900">{post.title}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                    {post.category?.name || 'Uncategorized'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    post.status === 'published' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-orange-100 text-orange-700'
                                  }`}>
                                    {post.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {formatDate(post.createdAt)}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => navigate(`/post/${post._id}`)}
                                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                      title="View"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => navigate(`/edit/${post._id}`)}
                                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePost(post._id)}
                                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                  <div className="space-y-6">
                    {/* Create Category Form */}
                    <form onSubmit={handleCreateCategory} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Category</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Category name"
                          className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          value={newCategoryDesc}
                          onChange={(e) => setNewCategoryDesc(e.target.value)}
                          placeholder="Description (optional)"
                          className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={categoryLoading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Category
                      </button>
                    </form>

                    {/* Categories List */}
                    <div className="space-y-3">
                      {categories.map(category => (
                        <div key={category._id} className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-indigo-300 transition-colors">
                          {editingCategory?._id === category._id ? (
                            <div className="flex-1 flex items-center gap-3">
                              <input
                                type="text"
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 flex-1"
                              />
                              <input
                                type="text"
                                value={editingCategory.description || ''}
                                onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                                placeholder="Description"
                                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 flex-1"
                              />
                              <button
                                onClick={() => handleUpdateCategory(category._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCategory(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{category.name}</h4>
                                {category.description && (
                                  <p className="text-sm text-gray-600">{category.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingCategory(category)}
                                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category._id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard
