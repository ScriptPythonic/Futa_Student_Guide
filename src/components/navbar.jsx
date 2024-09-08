import { useState } from 'react';
import logo from '../assets/logo.jpeg'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/">
              <img src={logo} alt="Logo" className="h-10" />
            </a>
          </div>
          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
          {/* Centered Links for Large Screens */}
          <div className="hidden md:flex justify-center space-x-8 font-semibold">
            
            <a href="/course-registration" className="text-gray-800 hover:text-blue-600 transition duration-300">
                 Registration
            </a>
            <a href="/grade-tracking" className="text-gray-800 hover:text-blue-600 transition duration-300">
              Grade Tracking
            </a>
            <a href="/medicals" className="text-gray-800 hover:text-blue-600 transition duration-300">
              Medicals
            </a>
            <a href="https://firstwaybookshop.com" className="text-gray-800 hover:text-blue-600 transition duration-300">
               Library
            </a>
          </div>
          {/* Login Link */}
          <div className="hidden md:block">
            <a href="/login" className="text-gray-800 hover:text-blue-600 font-semibold transition duration-300">
              Login
            </a>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            
            <a href="/course-registration" className="block text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
               Registration
            </a>
            <a href="/grade-tracking" className="block text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Grade Tracking
            </a>
            <a href="/medicals" className="block text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Medicals
            </a>
            <a href="https://firstwaybookshop.com" className="block text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
               Library
            </a>
            <a href="/login" className="block text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Login
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
