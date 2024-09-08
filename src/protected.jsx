import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Please login to access this page.');
        navigate('/login'); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [navigate]);

  return children; 
};

export default ProtectedRoute;