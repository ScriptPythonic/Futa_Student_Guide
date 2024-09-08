import Navbar from "../components/navbar";
import heroImage from '../assets/hero-image.jpg'; // Adjust the path if necessary

const LandingPage = () => {
  return (
    <div className="bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-6">
              Welcome to the Student Guide App
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl mb-10">
              Your ultimate tool for managing registration, grades, medicals, and more.
            </p>
            <a
              href="/course-registration"
              className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </a>
          </div>
          {/* Hero Image */}
          <div className="lg:w-2/5 mt-10 lg:mt-0">
            <img
              src={heroImage}
              alt="Student using the app"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:scale-[1.05]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Registration</h3>
              <p className="text-gray-600">Easily manage your course registration with a few clicks.</p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:scale-[1.05]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Grade Tracking</h3>
              <p className="text-gray-600">Keep track of your grades and monitor your academic progress.</p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:scale-[1.05]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Medicals</h3>
              <p className="text-gray-600">Stay on top of your medical requirements and appointments.</p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:scale-[1.05]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Campus Resources</h3>
              <p className="text-gray-600">Access important campus resources quickly and easily.</p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:scale-[1.05]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">User-Friendly Interface</h3>
              <p className="text-gray-600">Navigate through the app with ease, thanks to a clean UI.</p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:scale-[1.05]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Secure Login</h3>
              <p className="text-gray-600">Your data is safe with our secure login and authentication process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl sm:text-2xl mb-10">
            Sign up now and take control of your academic journey.
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow hover:bg-gray-100 transition duration-300"
          >
            Sign Up
          </a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
