import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, X, Image as ImageIcon, FileText, Tag, Folder, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { categoryService } from '../services/categoryService'
import { postService } from '../services/postService'
import { useAuth } from '../hooks/useAuth'

function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, loading: authLoading } = useAuth()
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])
  
  // UI state
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  // Fetch post data
  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return
    
    if (!currentUser) {
      toast.error('Please login to edit posts')
      navigate('/login')
      return
    }
    
    const fetchPost = async () => {
      try {
        setFetchLoading(true)
        const data = await postService.getPost(id)
        const post = data.post || data

        const currentUserId = currentUser?._id || currentUser?.id
        const postAuthorId = post.author._id || post.author.id

        // Check if current user is the author or admin
        if (postAuthorId !== currentUserId && currentUser?.role !== 'admin') {
          toast.error('You can only edit your own posts')
          navigate('/')
          return
        }

        // Pre-fill form
        setTitle(post.title)
        setContent(post.content)
        setExcerpt(post.excerpt || '')
        setCategory(post.category._id)
        setTags(post.tags?.join(', ') || '')
        setExistingImages(post.images || [])
      } catch (err) {
        toast.error('Failed to fetch post')
        navigate('/')
      } finally {
        setFetchLoading(false)
      }
    }

    fetchPost()
  }, [id, currentUser, authLoading, navigate])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data.categories || data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files)
    setNewImages(prevImages => [...prevImages, ...files])

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setNewImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews])
  }

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!content.trim()) {
      toast.error('Content is required')
      return
    }
    if (!category) {
      toast.error('Please select a category')
      return
    }

    try {
      setLoading(true)
      const loadingToast = toast.loading('Updating post...')

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('excerpt', excerpt || content.substring(0, 150))
      formData.append('category', category)

      if (tags.trim()) {
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)
        tagsArray.forEach(tag => formData.append('tags[]', tag))
      }

      // Add existing images to keep
      existingImages.forEach(img => formData.append('existingImages[]', img))

      // Add new images
      newImages.forEach(image => formData.append('images', image))

      const response = await postService.updatePost(id, formData)
      
      toast.dismiss(loadingToast)
      toast.success('Post updated successfully! 🎉')
      navigate(`/post/${response.post._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Edit Post ✏️
          </h1>
          <p className="text-gray-600">Update your post details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <FileText className="w-5 h-5 text-indigo-600" />
              Post Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <Folder className="w-5 h-5 text-indigo-600" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 bg-white cursor-pointer transition-colors"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <FileText className="w-5 h-5 text-indigo-600" />
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here... (Markdown supported)"
              rows="12"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 resize-y transition-colors font-mono text-sm"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <FileText className="w-5 h-5 text-indigo-600" />
              Excerpt (Optional)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for post previews..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 resize-y transition-colors"
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <Tag className="w-5 h-5 text-indigo-600" />
              Tags (Optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="javascript, react, web-development"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              Images
            </label>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-all group"
              >
                <Upload className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="text-indigo-700 font-semibold">
                  Add new images
                </span>
              </label>
            </div>

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">New Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                'Update Post'
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}

export default EditPost
