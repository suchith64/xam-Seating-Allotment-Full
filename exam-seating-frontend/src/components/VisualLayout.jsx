import { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutGrid, Users } from 'lucide-react';

const VisualLayout = () => {
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/allocations/all');
        
        // Group students by room
        const grouped = res.data.reduce((acc, student) => {
          if (!acc[student.room_number]) acc[student.room_number] = [];
          acc[student.room_number].push(student);
          return acc;
        }, {});
        
        setRooms(grouped);
      } catch (err) {
        setError('Failed to load seating arrangement. Run the algorithm first.');
      } finally {
        setLoading(false);
      }
    };
    fetchLayout();
  }, []);

  // Assign colors to different branches to visually prove alternation
  const getBranchColor = (branch) => {
    const b = branch.toUpperCase();
    if (b.includes('CSE')) return 'bg-blue-100 border-blue-400 text-blue-800';
    if (b.includes('IT')) return 'bg-emerald-100 border-emerald-400 text-emerald-800';
    if (b.includes('ECE')) return 'bg-purple-100 border-purple-400 text-purple-800';
    if (b.includes('MECH')) return 'bg-orange-100 border-orange-400 text-orange-800';
    return 'bg-gray-100 border-gray-400 text-gray-800';
  };

  if (loading) return <div className="text-center mt-20 text-gray-500 font-medium">Loading 2D Map...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <LayoutGrid className="text-blue-600" size={32} /> Visual Seating Map
        </h2>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2 font-bold text-gray-700">
          <Users size={20} className="text-blue-600" />
          {Object.values(rooms).flat().length} Total Students Seated
        </div>
      </div>

      <div className="space-y-10">
        {Object.entries(rooms).map(([roomNumber, students]) => (
          <div key={roomNumber} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="border-b pb-4 mb-6 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-800">{roomNumber}</h3>
              <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {students.length} Seats Filled
              </span>
            </div>
            
            {/* The Grid: Adjusts automatically based on screen size */}
            <div className="flex flex-wrap gap-3">
              {students.map((student, idx) => (
                <div 
                  key={idx} 
                  title={`${student.full_name} (${student.roll_number})`}
                  className={`w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center p-2 text-center shadow-sm cursor-help transition hover:scale-105 ${getBranchColor(student.branch)}`}
                >
                  <span className="text-xs font-black opacity-60 mb-1">{student.seat_code}</span>
                  <span className="text-sm font-bold truncate w-full">{student.roll_number}</span>
                  <span className="text-xs font-semibold mt-1">{student.branch}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(rooms).length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl border border-gray-200 text-gray-500">
            No seating data found. Please run the allocation algorithm in the Admin Setup first.
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualLayout;