import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import { supabase } from '../supabase';
import CGPAOverlay from '../pages/overlay';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showCgpaOverlay, setShowCgpaOverlay] = useState(false);
  const [userId, setUserId] = useState(null); // Store the user ID
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    // Log in with Supabase
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      console.error('Login error:', loginError.message);
      return;
    }

    if (loginData) {
      // Store the user ID
      setUserId(loginData.user.id);

      // Fetch user role from the 'users' table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', loginData.user.id)
        .single();

      if (userError) {
        setError(userError.message);
        console.error('User role fetch error:', userError.message);
        return;
      }

      // Check if the student has any CGPA data
      const { data: cgpaData, error: cgpaError } = await supabase
        .from('user_cgpa')
        .select('user_id')
        .eq('user_id', loginData.user.id);

      if (cgpaError) {
        setError(cgpaError.message);
        console.error('CGPA data fetch error:', cgpaError.message);
        return;
      }

      console.log('CGPA Data:', cgpaData); // Log to check CGPA data

      // If the CGPA data is empty, it means the user hasn't filled their CGPA yet
      if (cgpaData.length === 0) {
        setShowCgpaOverlay(true); // Show overlay to prompt for CGPA input
        console.log('CGPA not found, showing overlay');
      } else {
        // Redirect based on user role if CGPA is already filled
        if (userData.role === 'students') {
          navigate('/');
        } else if (userData.role === 'doctor') {
          navigate('/message-list');
        } else {
          setError('Role not recognized.');
        }
      }
    } else {
      console.error('Login data not available');
    }
  };

  const handleCgpaSubmit = async (cgpaDetails) => {
    if (!userId) {
      console.error('User ID is not available for CGPA submission');
      return;
    }

    // Insert or update the CGPA details into Supabase
    const { error: insertError } = await supabase
      .from('user_cgpa')
      .upsert([{ user_id: userId, ...cgpaDetails }], { onConflict: ['user_id'] });

    if (insertError) {
      setError(insertError.message);
      console.error('CGPA insert error:', insertError.message);
      return;
    }

    // Close the overlay after CGPA submission and redirect
    setShowCgpaOverlay(false);
    navigate('/');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don’t have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
            </p>
          </form>
        </div>
      </main>

      {/* Show the CGPA overlay if needed */}
      {showCgpaOverlay && <CGPAOverlay userId={userId} onSubmit={handleCgpaSubmit} onClose={() => setShowCgpaOverlay(false)} />}
    </div>
  );
};

export default LoginPage;
