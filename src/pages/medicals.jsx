import { useState } from 'react';
import jsPDF from 'jspdf';
import { supabase } from '../supabase';
import Navbar from '../components/navbar';
import doctor from '../assets/doctor.jpg';
import { useNavigate } from 'react-router-dom';

const MedicalsPage = () => {
  const [medicalId, setMedicalId] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleViewReport = async () => {
    try {
      const { data, error } = await supabase
        .from('health_details')
        .select('*')
        .ilike('matric_number', medicalId);

      if (error) throw error;

      if (data.length > 0) {
        setShowReport(true);
        generatePDF(data[0]);
      } else {
        setShowReport(false);
        alert('Medical ID not found.');
      }
    } catch (error) {
      console.error('Error fetching medical report:', error);
      setError('Failed to fetch medical report. Please try again.');
    }
  };

  const generatePDF = (reportData) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Federal University of Technology Akure (FUTA)', 105, 20, { align: 'center' });
    doc.setFontSize(18);
    doc.text('Medical Report', 105, 30, { align: 'center' });

    doc.setFontSize(16);
    doc.text(`Matric Number: ${reportData.matric_number}`, 10, 50);
    doc.text(`Blood Group: ${reportData.blood_group}`, 10, 60);
    doc.text(`Genotype: ${reportData.genotype}`, 10, 70);
    doc.text(`Allergies: ${reportData.allergies || 'None'}`, 10, 80);
    doc.text(`Underlying Conditions: ${reportData.underlying_conditions || 'None'}`, 10, 90);
    doc.text(`Height: ${reportData.height} cm`, 10, 100);
    doc.text(`Weight: ${reportData.weight} kg`, 10, 110);
    doc.text(`BMI: ${reportData.bmi}`, 10, 120);
    doc.text(`Student Level: ${reportData.level}`, 10, 130);

    doc.save('Medical_Report.pdf');
  };

  const redirectHome = () => {
    navigate('/chat-with-doctor');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Chat with Doctor Section */}
        <section className="container my-12 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row pt-1 p">
            <div className="md:w-1/2 md:pr-6">
              <h1 className="text-3xl font-bold mb-4">Book an Appointment</h1>
              <p className="mb-4">
                We offer a range of health services to help you stay healthy.
                Schedule an appointment with our healthcare professionals at your
                convenience. Choose a date and time that works for you and let
                us know if you have any additional notes or special requests.
              </p>
              <p className="mb-4">
                Our team is dedicated to providing you with the best care
                possible. We look forward to assisting you with your health
                needs.
              </p>
              <button
                onClick={redirectHome}
                className="bg-blue-400 text-white p-2 rounded hover:bg-blue-600"
              >
                Chat Doctor
              </button>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <img
                src={doctor}
                alt="Healthcare"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>

        <hr className="my-10" />

        {/* Print Medical Report Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Print Your Medical Report
          </h2>
          <div className="mb-4">
            <label
              htmlFor="medicalId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Enter Your Medical ID:
            </label>
            <input
              type="text"
              id="medicalId"
              value={medicalId}
              onChange={(e) => setMedicalId(e.target.value)}
              className="form-input w-full border-gray-300 focus:border-blue-500"
              placeholder="Medical ID"
            />
          </div>
          <button
            onClick={handleViewReport}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            View Report
          </button>

          {showReport && (
            <div className="mt-10 border border-gray-300 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Your Medical Report</h3>
              <p>
                Here you can display the details of the medical report based on
                the entered Medical ID.
              </p>
              <button
                onClick={() => generatePDF(reportData)}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Print Report
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MedicalsPage;
