import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '../supabase';

const UpdateMedicalDetails = () => {
  const [matricNumber, setMatricNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [genotype, setGenotype] = useState('');
  const [allergies, setAllergies] = useState('');
  const [underlyingConditions, setUnderlyingConditions] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [level, setLevel] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      setError('Unable to log out.');
    } else {
      navigate('/login');
    }
  };

  const handleUpdateDetails = async () => {
    setLoading(true);
    setError(null);

    // Basic validation
    if (!matricNumber || !bloodGroup || !genotype || !height || !weight || !bmi || !level) {
      setError('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('health_details')
        .upsert({
          matric_number: matricNumber,
          blood_group: bloodGroup,
          genotype: genotype,
          allergies: allergies,
          underlying_conditions: underlyingConditions,
          height: parseFloat(height),
          weight: parseFloat(weight),
          bmi: parseFloat(bmi),
          level: level,
          updated_at: new Date().toISOString()
        }, {
          onConflict: ['matric_number']
        });

      if (error) throw error;

      alert('Medical details updated successfully!');
      // Clear the form after successful update
      setMatricNumber('');
      setBloodGroup('');
      setGenotype('');
      setAllergies('');
      setUnderlyingConditions('');
      setHeight('');
      setWeight('');
      setBmi('');
      setLevel('');
    } catch (error) {
      console.error('Error updating medical details:', error);
      setError('Failed to update medical details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-blue-600 text-white p-4 text-center font-bold text-lg">
        Doctor's Dashboard
      </div>

      {/* Update Medical Details Form */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Update Student Medical Details</h1>
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="matricNumber" className="block text-gray-700 font-bold mb-2">Matric Number</label>
            <input
              type="text"
              id="matricNumber"
              className="form-input w-full border border-gray-300 rounded-lg p-2"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
              placeholder="Enter Matric Number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bloodGroup" className="block text-gray-700 font-bold mb-2">Blood Group</label>
            <input
              type="text"
              id="bloodGroup"
              className="form-input w-full border border-gray-300 rounded-lg p-2"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="Enter Blood Group"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="genotype" className="block text-gray-700 font-bold mb-2">Genotype</label>
            <input
              type="text"
              id="genotype"
              className="form-input w-full border border-gray-300 rounded-lg p-2"
              value={genotype}
              onChange={(e) => setGenotype(e.target.value)}
              placeholder="Enter Genotype"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="allergies" className="block text-gray-700 font-bold mb-2">Allergies</label>
            <textarea
              id="allergies"
              className="form-textarea w-full border border-gray-300 rounded-lg p-2"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Enter Allergies"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="underlyingConditions" className="block text-gray-700 font-bold mb-2">Underlying Conditions</label>
            <textarea
              id="underlyingConditions"
              className="form-textarea w-full border border-gray-300 rounded-lg p-2"
              value={underlyingConditions}
              onChange={(e) => setUnderlyingConditions(e.target.value)}
              placeholder="Enter Underlying Conditions"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="height" className="block text-gray-700 font-bold mb-2">Height (cm)</label>
            <input
              type="number"
              id="height"
              className="form-input w-full border border-gray-300 rounded-lg p-2"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter Height in cm"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="weight" className="block text-gray-700 font-bold mb-2">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              className="form-input w-full border border-gray-300 rounded-lg p-2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter Weight in kg"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bmi" className="block text-gray-700 font-bold mb-2">BMI</label>
            <input
              type="number"
              step="0.1"
              id="bmi"
              className="form-input w-full border border-gray-300 rounded-lg p-2"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              placeholder="Enter BMI"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="level" className="block text-gray-700 font-bold mb-2">Student Level</label>
            <input
              type="text"
              id="level"
              className="form-input w-full border border-gray-300 rounded-lg p-2"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Enter Student Level"
            />
          </div>
          <button
            className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleUpdateDetails}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white p-4 flex justify-around shadow-inner">
        <Link to="/message-list" className="text-gray-600 hover:text-blue-600">
          <FaHome size={24} />
        </Link>
        <Link to="/update-medical-details" className="text-gray-600 hover:text-blue-600">
          <FaUserEdit size={24} />
        </Link>
        <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600">
          <FaSignOutAlt size={24} />
        </button>
      </div>
    </div>
  );
};

export default UpdateMedicalDetails;
