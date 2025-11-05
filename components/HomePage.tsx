
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './icons/Logo';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden text-center p-8 space-y-8">
        <header className="space-y-4">
          <Logo className="w-48 h-auto mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">
            by Sunil Sir
          </h1>
          <h2 className="text-3xl font-extrabold text-primary">
            HSC IT MOCK Online Exam
          </h2>
        </header>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/student')}
            className="w-full sm:w-auto flex-1 bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-primary-hover transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-light"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="w-full sm:w-auto flex-1 bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
