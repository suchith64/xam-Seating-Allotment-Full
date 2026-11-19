import { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, Book } from 'lucide-react';

const StudentPortal = () => {
  const [roll, setRoll] = useState('');
  const [allocation, setAllocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchSeat = async (e) => {
    e.preventDefault();
    if (!roll) return;
    setLoading(true);
    setError('');
    setAllocation(null);

    try {
      // Calls our Node.js backend
      const res = await axios.get(`http://localhost:5000/api/allocations/search?roll=${roll}`);
      setAllocation(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find your seat. Please check your roll number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Find Your Exam Seat</h2>
      
      <form onSubmit={searchSeat} className="flex gap-3 mb-8">
        <input 
          type="text" 
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          placeholder="Enter Roll Number (e.g., 101)" 
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400"
        >
          <Search size={20} /> {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>}

      {allocation && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{allocation.full_name}</h3>
              <p className="text-gray-500 font-medium">{allocation.roll_number} • {allocation.branch}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-blue-600">{allocation.seat_code}</div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Seat Number</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-md"><MapPin size={20}/></div>
              <div>
                <p className="text-xs text-gray-400">Room</p>
                <p className="font-bold text-gray-700">{allocation.room_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-md"><Book size={20}/></div>
              <div>
                <p className="text-xs text-gray-400">Subject</p>
                <p className="font-bold text-gray-700">{allocation.subject_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 col-span-2">
              <div className="p-2 bg-green-100 text-green-600 rounded-md"><Calendar size={20}/></div>
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-bold text-gray-700">{new Date(allocation.exam_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;