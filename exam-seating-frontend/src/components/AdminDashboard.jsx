import { useState } from 'react';
import axios from 'axios';
import { Upload, Users, Building, Play } from 'lucide-react';

const AdminDashboard = () => {
  const [studentFile, setStudentFile] = useState(null);
  const [roomFile, setRoomFile] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

 const handleUpload = async (file, type) => {
    if (!file) {
      setStatus({ message: 'Please select a file first.', type: 'error' });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setStatus({ message: 'Uploading...', type: 'info' });
      await axios.post(`http://localhost:5000/api/${type}/upload`, formData);
      setStatus({ message: `${type === 'students' ? 'Students' : 'Rooms'} uploaded successfully!`, type: 'success' });
    } catch (err) {
      // This will pull the EXACT technical error from the backend and show it on screen
      const backendError = err.response?.data?.details || err.response?.data?.error || err.message;
      setStatus({ message: `Upload Failed: ${backendError}`, type: 'error' });
    }
  };

  const generateSeats = async () => {
    setLoading(true);
    setStatus({ message: 'Running branch-alternation algorithm...', type: 'info' });
    
    try {
      const res = await axios.post('http://localhost:5000/api/allocations/generate', {
        subject_name: 'Midterm Examination',
        exam_date: new Date().toISOString().split('T')[0]
      });
      setStatus({ message: `Success! ${res.data.total_allocated} seats allocated.`, type: 'success' });
    } catch (err) {
      setStatus({ message: err.response?.data?.error || 'Allocation failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Admin Setup Dashboard</h2>
      
      {status.message && (
        <div className={`mb-6 p-4 rounded-lg border font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
          {status.message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Upload Students */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users /></div>
            <h3 className="text-xl font-semibold">1. Upload Students</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">CSV format: roll_number, full_name, branch, semester</p>
          <input type="file" accept=".csv" onChange={(e) => setStudentFile(e.target.files[0])} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <button onClick={() => handleUpload(studentFile, 'students')} className="w-full bg-white border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 flex items-center justify-center gap-2">
            <Upload size={18} /> Upload Students
          </button>
        </div>

        {/* Upload Rooms */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Building /></div>
            <h3 className="text-xl font-semibold">2. Upload Rooms</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">CSV format: room_number, capacity, rows_count, cols_count</p>
          <input type="file" accept=".csv" onChange={(e) => setRoomFile(e.target.files[0])} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
          <button onClick={() => handleUpload(roomFile, 'rooms')} className="w-full bg-white border-2 border-purple-600 text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-50 flex items-center justify-center gap-2">
            <Upload size={18} /> Upload Rooms
          </button>
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-gray-800 rounded-xl p-8 text-center text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-2">3. Run Allocation Algorithm</h3>
        <p className="text-gray-400 mb-6">This will group students by branch and seat them alternatively in available rooms.</p>
        <button onClick={generateSeats} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 mx-auto disabled:opacity-50">
          <Play fill="currentColor" size={24} /> {loading ? 'Processing...' : 'Generate Seating Arrangement'}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;