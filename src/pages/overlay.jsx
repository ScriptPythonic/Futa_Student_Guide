import { useState } from 'react';
import { supabase } from '../supabase'; // Ensure supabase is correctly imported

const CGPAOverlay = ({ userId, onSubmit, onClose }) => {
  const [cgpaDetails, setCgpaDetails] = useState({
    semester_1: '',
    semester_2: '',
    semester_3: '',
    semester_4: '',
    semester_5: '',
    semester_6: '',
    semester_7: '',
    semester_8: '',
    semester_9: '',
    semester_10: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCgpaDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging: Check userId
    console.log('User ID in CGPAOverlay:', userId);

    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    // Prepare the data for submission, converting empty strings to null
    const cgpaData = {
      user_id: userId,  // Ensure userId is included
      ...Object.fromEntries(
        Object.entries(cgpaDetails).map(([key, value]) => [key, value === '' ? null : parseFloat(value)])
      ),
    };

    console.log('Submitting CGPA data:', cgpaData); // Debugging line

    // Insert or update the CGPA details into Supabase
    const { error } = await supabase
      .from('user_cgpa')
      .upsert([cgpaData], { onConflict: ['user_id'] });

    if (error) {
      console.error('Error inserting CGPA data:', error.message);
      return;
    }

    // Call the onSubmit callback to close the overlay and navigate
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Enter Your CGPA</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="flex flex-col">
                <label htmlFor={`semester_${i + 1}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Semester {i + 1} CGPA
                </label>
                <input
                  type="number"
                  id={`semester_${i + 1}`}
                  name={`semester_${i + 1}`}
                  value={cgpaDetails[`semester_${i + 1}`]}
                  onChange={handleChange}
                  placeholder={`CGPA for Semester ${i + 1}`}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 sm:mb-0"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CGPAOverlay;
