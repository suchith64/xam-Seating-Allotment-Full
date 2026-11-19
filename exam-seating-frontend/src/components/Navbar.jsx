import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex justify-between items-center max-w-5xl">
        <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <BookOpen size={28} />
          <span>ExamSeat</span>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Student Portal
          </Link>
          <Link 
            to="/admin" 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/admin' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Admin Setup
          </Link>
          <Link 
  to="/layout" 
  className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/layout' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
>
  View Layout Map
</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;