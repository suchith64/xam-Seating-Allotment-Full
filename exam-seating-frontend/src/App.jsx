import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import StudentPortal from './components/StudentPortal';
import VisualLayout from './components/VisualLayout';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Navbar />
        <div className="container mx-auto p-4 max-w-5xl mt-6">
          <Routes>
            <Route path="/" element={<StudentPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/layout" element={<VisualLayout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;