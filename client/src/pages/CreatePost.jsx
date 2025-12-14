import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Image as ImageIcon, FileText, Tag, Folder, Sparkles, Loader2, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { categoryService } from '../services/categoryService'
import { postService } from '../services/postService'
import { aiService } from '../services/aiService'

function CreatePost() {
  const navigate = useNavigate()
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  
  // UI state
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiType, setAiType] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data.categories || data)
      } catch (err) {
        console.error('Failed to fetch Categories:', err)
      }
      
    }
  fetchCategories()
  }, [])
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(prevImages => [...prevImages, ...files])

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews])
  }


  const removeImage = (index) =>{
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
    URL.revokeObjectURL(imagePreviews[index])
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !==  index))
  }
  
  const handleAiAssist = async (type, input) => {
    if (!input?.trim()) {
      toast.error('Please enter some content first')
      return
    }

    try {
      setAiLoading(true)
      setAiType(type)
      const response = await aiService.getAssistance(type, input)
      setAiSuggestion(response.result)
      setShowAiModal(true)
      toast.success('AI suggestions generated! ✨')
    } catch (error) {
      console.error('AI Error:', error)
      toast.error(error.response?.data?.message || 'Failed to generate suggestions')
    } finally {
      setAiLoading(false)
    }
  }

  const applyAiSuggestion = () => {
    if (aiType === 'generate-title') {
      setTitle(aiSuggestion)
    } else if (aiType === 'improve' || aiType === 'expand' || aiType === 'continue' || aiType === 'simplify') {
      setContent(aiSuggestion)
    } else if (aiType === 'generate-excerpt') {
      setExcerpt(aiSuggestion)
    } else if (aiType === 'suggest-tags') {
      setTags(aiSuggestion)
    }
    setShowAiModal(false)
    toast.success('Applied AI suggestion! 🎉')
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setError('')

    if(!title.trim()){
      setError('Title is required')
      return
    }
    if(!content.trim()){
      setError('Content is required')
      return;
    }

    if(!category){
      setError('Please select a category')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('title', title);
      formData.append('content', content);
      formData.append('excerpt', excerpt || content.substring(0, 150));
      formData.append('category', category)

      if (tags.trim()) {
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)
        tagsArray.forEach(tag => formData.append('tags[]', tag))
      }

      images.forEach(image =>{
        formData.append('images', image)
      })

      const response = await postService.createPost(formData)

      toast.success('Post published successfully! 🎉')
      navigate(`/post/${response.post._id}`)
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create post'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
       setLoading(false)
    }
  }





  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create New Post ✨
          </h1>
          <p className="text-gray-600">Share your thoughts with the world</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <FileText className="w-5 h-5 text-indigo-600" />
                Post Title
              </label>
              <button
                type="button"
                onClick={() => handleAiAssist('generate-title', content)}
                disabled={aiLoading || !content.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading && aiType === 'generate-title' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Generate Title
              </button>
            </div>
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
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <FileText className="w-5 h-5 text-indigo-600" />
                Content
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAiAssist('improve', content)}
                  disabled={aiLoading || !content.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading && aiType === 'improve' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Improve
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAssist('expand', content)}
                  disabled={aiLoading || !content.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading && aiType === 'expand' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Expand
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAssist('continue', content)}
                  disabled={aiLoading || !content.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading && aiType === 'continue' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAssist('simplify', content)}
                  disabled={aiLoading || !content.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-violet-500 to-purple-500 text-white text-xs font-semibold rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading && aiType === 'simplify' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Simplify
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here... (Markdown supported)"
              rows="12"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 resize-y transition-colors font-mono text-sm"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              💡 Tip: You can use Markdown for formatting (e.g., **bold**, *italic*, # headers)
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <FileText className="w-5 h-5 text-indigo-600" />
                Excerpt (Optional)
              </label>
              <button
                type="button"
                onClick={() => handleAiAssist('generate-excerpt', content)}
                disabled={aiLoading || !content.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading && aiType === 'generate-excerpt' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Generate Excerpt
              </button>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for post previews..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 resize-y transition-colors"
            />
            <p className="mt-2 text-xs text-gray-500">
              If empty, the first 150 characters of content will be used
            </p>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Tag className="w-5 h-5 text-indigo-600" />
                Tags (Optional)
              </label>
              <button
                type="button"
                onClick={() => handleAiAssist('suggest-tags', content)}
                disabled={aiLoading || !content.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading && aiType === 'suggest-tags' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Suggest Tags
              </button>
            </div>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="javascript, react, web-development"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 transition-colors"
            />
            <p className="mt-2 text-xs text-gray-500">
              Separate tags with commas
            </p>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              Images (Optional)
            </label>
            
            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-all group"
              >
                <Upload className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="text-indigo-700 font-semibold">
                  Click to upload images
                </span>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {removeImage(index)}} // TODO: Implement removeImage(index)
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
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
                  Publishing...
                </span>
              ) : (
                'Publish Post'
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />

      {/* AI Suggestion Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">
                  AI Suggestion
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">
                  {aiSuggestion}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAiModal(false)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyAiSuggestion}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Apply Suggestion ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatePost
