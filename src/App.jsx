import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home'; 
import LoginPage from './authentication/login';
import SignupPage from './authentication/signup';
import CourseRegistrationPage from './pages/registration';
import GpaCalculator from './pages/grade';
import MedicalsPage from './pages/medicals';
import ChatWithDoctor from './pages/doctor-chat';
import UpdateMedicalDetails from './Doctor/record';
import MessageList from './Doctor/message-list';
import MessageRoom from './Doctor/message-room';
import ProtectedRoute from './protected';
function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/course-registration" element={<ProtectedRoute><CourseRegistrationPage /></ProtectedRoute>} />
            <Route path="/grade-tracking" element={<ProtectedRoute><GpaCalculator /></ProtectedRoute>} />
            <Route path="/medicals" element={<ProtectedRoute><MedicalsPage /></ProtectedRoute>} />
            <Route path="/chat-with-doctor" element={<ProtectedRoute><ChatWithDoctor /></ProtectedRoute>} />
            <Route path="/update-medical-details" element={<ProtectedRoute><UpdateMedicalDetails /></ProtectedRoute>} />
            <Route path="/message-list" element={<ProtectedRoute><MessageList /></ProtectedRoute>} />
            <Route path="/message-room/:userId" element={<ProtectedRoute><MessageRoom /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
