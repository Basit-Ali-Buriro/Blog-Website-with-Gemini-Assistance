import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'
import {postService} from '../../services/postService'
function PostCard({ post }) {
  const { _id, title, content, excerpt, thumbnail, images, author, category, createdAt, likes, comments } = post;
  const displayImage = thumbnail || images?.[0]
  
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes?.length || 0)
  
  const handleLike = async () => {
    try {
      setIsLiked(prev => !prev)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
      await postService.likePost(_id)
    } catch (error) {
      console.error('Failed to like post:', error)
      setIsLiked(prev => !prev)
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
    }
  }

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-indigo-200">
      
      {/* Image Container */}
      <Link to={`/post/${_id}`} className="relative overflow-hidden h-48 sm:h-56 lg:h-64 bg-linear-to-br from-gray-200 to-gray-300 block">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-500">
            <span className="text-white text-4xl opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500">📝</span>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg group-hover:bg-indigo-700 group-hover:scale-105 transition-all duration-300">
              {category.name || category}
            </span>
          </div>
        )}
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      </Link>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col h-auto">
        
        {/* Title */}
        <Link to={`/post/${_id}`}>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 grow">
          {excerpt || content?.substring(0, 100)}...
        </p>

        {/* Author Info & Date */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0 group-hover:scale-110 transition-transform duration-300">
            {author?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {author?.username || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>

        {/* Engagement & CTA */}
        <div className="flex items-center justify-between">
          {/* Likes & Comments */}
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
              title="Like this post"
            >
              <Heart 
                size={18}
                className={`transition-all duration-300 ${isLiked ? 'animate-pulse' : ''}`}
                fill={isLiked ? 'currentColor' : 'none'}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            {/* Comments */}
            <div className="flex items-center gap-1.5 text-gray-600">
              <MessageCircle size={18} />
              <span className="text-sm font-medium">{comments?.length || 0}</span>
            </div>
          </div>

          {/* Read More Button */}
          <Link 
            to={`/post/${_id}`}
            className="px-3 sm:px-4 py-1.5 bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PostCard
