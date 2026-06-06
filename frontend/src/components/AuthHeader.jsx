import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AuthHeader = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-400 font-bold text-xl hover:text-indigo-300 transition">
              <Activity className="h-6 w-6" />
              <span>Pipeline RCA Bot</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthHeader;
