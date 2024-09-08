import  { useState } from 'react';

const CGPACalculator = () => {
  const [semesters, setSemesters] = useState([{ gpa: '' }]);
  const [totalCGPA, setTotalCGPA] = useState(null);

  // Function to add a new semester input
  const addSemester = () => {
    setSemesters([...semesters, { gpa: '' }]);
  };

  // Function to handle GPA input change
  const handleGPAChange = (index, value) => {
    const newSemesters = [...semesters];
    newSemesters[index].gpa = value;
    setSemesters(newSemesters);
  };

  // Function to calculate CGPA
  const calculateCGPA = () => {
    let totalSum = 0;
    let count = 0;

    semesters.forEach(semester => {
      const gpa = parseFloat(semester.gpa);
      if (!isNaN(gpa) && gpa >= 0 && gpa <= 5.0) {
        totalSum += gpa;
        count++;
      }
    });

    const averageCGPA = count > 0 ? (totalSum / count).toFixed(2) : 0;
    setTotalCGPA(averageCGPA);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">CGPA Calculator</h1>
        
        {semesters.map((semester, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Semester {index + 1} GPA
            </label>
            <input
              type="number"
              value={semester.gpa}
              onChange={(e) => handleGPAChange(index, e.target.value)}
              className="form-input w-full border-b border-gray-300 focus:border-blue-500"
              placeholder="Enter GPA (0 - 5.0)"
              min="0"
              max="5.0"
              step="0.01"
              required
            />
          </div>
        ))}
        
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={addSemester}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add Semester
          </button>
          <button
            onClick={calculateCGPA}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Calculate CGPA
          </button>
        </div>

        {totalCGPA !== null && (
          <div id="totalCGPASection" className="mt-10 bg-blue-100 p-4 rounded-lg text-center">
            <h2 className="text-lg font-bold text-gray-700">Your CGPA</h2>
            <p id="totalCGPA" className="text-2xl font-extrabold text-blue-600">
              {totalCGPA}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CGPACalculator;
