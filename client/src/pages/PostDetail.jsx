import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Edit, Trash2, Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { formatDate } from '../utils/formatDate'
import { postService } from '../services/postService'
import { commentService } from '../services/commentService'
import { useAuth } from '../hooks/useAuth'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  // Post state
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Like state
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  // Comment state
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const data = await postService.getPost(id)
        setPost(data.post || data)
        setLikeCount(data.post?.likes?.length || 0)
        setIsLiked(data.post?.likes?.includes(currentUser?._id))

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post')
      }finally{
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  useEffect(() => {
    
    const fetchComments = async () => {
      try {
        const data = await commentService.getCommentsByPost(id)
        setComments(data.comments || data)
      } catch (err) {
        console.error('Failed to fetch comments:', err)
      }
    }
    if (post) fetchComments()
  
  }, [id, post])
  
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await postService.getRelatedPosts(id)
        setRelatedPosts(data.posts || data)
      } catch (error) {
        console.error('Failed to fetch related posts:', error)
      }
    }
    if(post?.category) fetchRelated()
  }, [id, post])
  

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    try {
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      await postService.toggleLike(id)
    } catch (error) {
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount + 1 : likeCount -1)
      console.error('Failed to like post:', error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      navigate('/login')
      return
    }
    if(!newComment.trim()) return
    
    try {
      setCommentLoading(true)
      console.log('Submitting comment for post:', id)
      const data = await commentService.addComment(id, {content : newComment})
      console.log('Comment created:', data)
      setComments([data.comment, ...comments])
      setNewComment('')
    } catch (error) {
      console.error('Failed to post comment:', error)
      console.error('Error response:', error.response?.data)
      alert(`Failed to post comment: ${error.response?.data?.message || error.message}`)
    }finally{
      setCommentLoading(false)
    }
  }

  const handleDelete = async () => {
    if(!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await postService.deletePost(id)
      navigate('/')
    } catch (error) {
      alert('Failed to delete post')
    }
    
  }



  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">Post Not Found</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Link to="/" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Post Header */}
            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Category Badge */}
              <div className="px-6 sm:px-8 pt-6">
                <span className="inline-block px-4 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full">
                  {post?.category?.name || 'Uncategorized'}
                </span>
              </div>

              {/* Title */}
              <div className="px-6 sm:px-8 pt-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {post?.title || 'Sample Post Title'}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <img
                    src={post?.author?.profilePic || 'https://ui-avatars.com/api/?name=Author'}
                    alt={post?.author?.username}
                    className="w-12 h-12 rounded-full border-2 border-indigo-200"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{post?.author?.username || 'Author Name'}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post?.createdAt ? formatDate(post.createdAt) : 'Jan 1, 2025'}
                      </span>
                      <span>5 min read</span>
                    </div>
                  </div>

                  {/* Author Actions (Edit/Delete) */}
                  {currentUser && ((currentUser._id || currentUser.id) === (post?.author?._id || post?.author?.id) || currentUser.role === 'admin') && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/edit/${id}`)}
                      className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-semibold"
                      title="Edit post"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-semibold"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {post?.thumbnail && (
                <div className="px-6 sm:px-8 pt-6">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-64 sm:h-96 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="px-6 sm:px-8 py-8">
                <div className="prose prose-lg max-w-none">
                  {/* TODO: Use react-markdown for proper rendering */}
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {post?.content || 'Post content goes here...'}
                  </p>
                </div>

                {/* Tags */}
                {post?.tags && post.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 sm:px-8 pb-6 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        isLiked
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{likeCount || 0}</span>
                    </button>

                    {/* Comments Count */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                      <MessageCircle className="w-5 h-5" />
                      <span>{comments?.length || 0}</span>
                    </div>
                  </div>

                  {/* Share Button */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Comments ({comments?.length || 0})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={currentUser ? "Share your thoughts..." : "Login to comment..."}
                  rows="4"
                  disabled={!currentUser}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-900 placeholder:text-gray-400 resize-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                ></textarea>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments?.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                      <img
                        src={comment.author?.profilePic || 'https://ui-avatars.com/api/?name=User'}
                        alt={comment.author?.username}
                        className="w-10 h-10 rounded-full shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{comment.author?.username}</span>
                          <span className="text-sm text-gray-500">
                            {comment.createdAt ? formatDate(comment.createdAt) : 'Just now'}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No comments yet. Be the first to share your thoughts! 💬
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Related Posts */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Related Posts</h3>
              <div className="space-y-4">
                {relatedPosts?.length > 0 ? (
                  relatedPosts.slice(0, 4).map((relatedPost) => (
                    <Link
                      key={relatedPost._id}
                      to={`/post/${relatedPost._id}`}
                      className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      {relatedPost.thumbnail && (
                        <img
                          src={relatedPost.thumbnail}
                          alt={relatedPost.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {relatedPost.createdAt ? formatDate(relatedPost.createdAt) : 'Recent'}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No related posts found</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PostDetail
