import { Link } from 'react-router-dom';
import { 
  FiGithub, 
  FiTwitter, 
  FiFacebook, 
  FiInstagram,
  FiMail,
  FiHeart
} from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-lg sm:text-xl px-3 py-1 rounded-lg">
                Blog
              </div>
              <span className="text-lg sm:text-xl font-semibold text-white">
                Website
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-4 max-w-md">
              Discover amazing stories, insights, and ideas from writers around the world. 
              Share your thoughts and connect with a community of passionate readers and creators.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/?trending=true" className="text-gray-400 hover:text-white transition">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-400 hover:text-white transition">
                  Write a Post
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@blogwebsite.com" 
                  className="text-gray-400 hover:text-white transition flex items-center space-x-1"
                >
                  <FiMail size={16} />
                  <span>Contact Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Blog Website. All rights reserved.
            </p>
            
            <p className="text-gray-400 text-sm flex items-center space-x-1">
              <span>Made with</span>
              <FiHeart className="text-red-500" size={16} />
              <span>by Your Name</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;