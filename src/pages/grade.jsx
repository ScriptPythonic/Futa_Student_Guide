import  { useState } from 'react';
import Navbar from '../components/navbar';
import CGPACalculator from './cgpa';

const GpaCalculator = () => {
  const [rows, setRows] = useState([{ courseUnit: '', score: '', grade: '' }]);
  const [gpa, setGpa] = useState(null);

  const addRow = () => {
    setRows([...rows, { courseUnit: '', score: '', grade: '' }]);
  };

  const handleInputChange = (index, event) => {
    const values = [...rows];
    values[index][event.target.name] = event.target.value;
    setRows(values);
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let weightedSum = 0;

    const updatedRows = rows.map(row => {
      const courseUnit = parseFloat(row.courseUnit);
      const score = parseFloat(row.score);
      let gradePoint;

      if (score >= 70) {
        gradePoint = 5;
      } else if (score >= 60) {
        gradePoint = 4;
      } else if (score >= 50) {
        gradePoint = 3;
      } else if (score >= 45) {
        gradePoint = 2;
      } else {
        gradePoint = 0;
      }

      if (!isNaN(courseUnit) && !isNaN(score) && courseUnit >= 1) {
        weightedSum += courseUnit * gradePoint;
        totalCredits += courseUnit;
      }

      return { ...row, grade: gradePoint };
    });

    setRows(updatedRows);

    if (totalCredits > 0) {
      const calculatedGPA = (weightedSum / totalCredits).toFixed(2);
      setGpa(calculatedGPA);
    } else {
      alert('Please enter valid course units (min: 1) and scores.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
          GPA Calculator
        </h1>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4">Course Units</th>
              <th className="py-2 px-4">Score</th>
              <th className="py-2 px-4">Grade</th>
            </tr>
          </thead>
          <tbody id="gpaTableBody">
            {rows.map((row, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">
                  <input
                    type="number"
                    name="courseUnit"
                    value={row.courseUnit}
                    onChange={event => handleInputChange(index, event)}
                    className="form-input w-full border-gray-300 focus:border-blue-500"
                    placeholder="Course Units"
                    min="1"
                    step="1"
                    required
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    name="score"
                    value={row.score}
                    onChange={event => handleInputChange(index, event)}
                    className="form-input w-full border-gray-300 focus:border-blue-500"
                    placeholder="Score"
                    min="0"
                    max="100"
                    required
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="text"
                    name="grade"
                    value={row.grade}
                    className="form-input w-full border-gray-300 focus:border-blue-500"
                    placeholder="Grade"
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-6">
          <button
            onClick={addRow}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Add Course
          </button>
          <button
            onClick={calculateGPA}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Calculate GPA
          </button>
        </div>
        {gpa && (
          <div id="gpaResult" className="mt-8 text-center">
            <p id="gpaValue" className="text-2xl font-bold text-gray-900">
              GPA: {gpa}
            </p>
          </div>
        )}
      </div>
      <CGPACalculator/>
    </div>
  );
};

export default GpaCalculator;
