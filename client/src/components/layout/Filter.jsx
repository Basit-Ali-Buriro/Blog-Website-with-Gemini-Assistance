import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { categoryService } from "../../services/categoryService";

function Filter({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data.categories || data);
      } catch (error) {
        console.error("Failed to fetch categories : ", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0 sm:top-16 z-10 shadow-md backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-5">
        <div className="flex flex-col gap-3 sm:gap-4">
          
          {/* Search Bar - Full Width on Mobile */}
          <div className="w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                value={searchTerm}
                onChange={handleSearch}
                type="text"
                placeholder="Search stories..."
                className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-500 text-sm bg-white shadow-sm hover:shadow-md transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Category Filters & Sort - Flex Container */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            
            {/* Category Filters - Scrollable on Mobile */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* All Categories Button */}
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`flex-shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-sm ${
                    selectedCategory === ""
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  ✨ All Posts
                </button>

                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`flex-shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-sm ${
                      selectedCategory === category._id
                        ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown - Fixed Width on Desktop */}
            <div className="w-full sm:w-auto flex-shrink-0">
              <select className="w-full sm:w-auto sm:min-w-[160px] px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-0 focus:border-indigo-500 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer font-medium text-gray-700">
                <option value="latest">🔥 Latest First</option>
                <option value="oldest">📅 Oldest First</option>
                <option value="popular">⭐ Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS to hide scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Filter;
