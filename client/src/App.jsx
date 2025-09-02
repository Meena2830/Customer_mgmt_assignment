import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import CustomerDetailPage from './pages/CustomerDetailPage';

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-800">

      {/* Floating Blobs with Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full filter blur-3xl animate-blob bg-gradient-to-tr from-purple-400 via-purple-500 to-pink-400 shadow-[0_0_60px_rgba(255,192,203,0.6)] opacity-80"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full filter blur-3xl animate-blob animation-delay-2000 bg-gradient-to-tr from-pink-400 via-red-400 to-pink-500 shadow-[0_0_60px_rgba(255,105,180,0.6)] opacity-80"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full filter blur-2xl animate-blob animation-delay-4000 bg-gradient-to-tr from-blue-400 via-blue-500 to-purple-400 shadow-[0_0_60px_rgba(135,206,250,0.5)] opacity-70"></div>

      {/* Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-full animate-pulse shadow-white"
          style={{
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 75%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}

      {/* Header */}
      <header className="relative z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0
                        rounded-b-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                        text-white shadow-xl backdrop-blur-lg animate-gradient-x-header">
          <h1 className="text-3xl sm:text-5xl font-extrabold cursor-pointer hover:scale-105 transition-transform">
            Customer Management
          </h1>
          <nav className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <Link
              to="/"
              className="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/40 font-semibold transition shadow-md hover:shadow-lg text-white"
            >
              Customers
            </Link>
            <Link
              to="/create"
              className="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/40 font-semibold transition shadow-md hover:shadow-lg text-white"
            >
              Create
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-10 space-y-10">
        <Routes>
          <Route path="/" element={<CustomerListPage />} />
          <Route path="/create" element={<CustomerFormPage />} />
          <Route path="/edit/:id" element={<CustomerFormPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="max-w-7xl mx-auto px-8 py-6 text-center text-white font-medium
                        rounded-t-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
                        shadow-xl backdrop-blur-lg animate-gradient-x-footer">
          &copy; {new Date().getFullYear()} Customer Management. All rights reserved.
        </div>
      </footer>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 12s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 25s ease infinite; }
        .animate-gradient-x-header { background-size: 300% 300%; animation: gradient-x 18s ease infinite; }
        .animate-gradient-x-footer { background-size: 300% 300%; animation: gradient-x 20s ease infinite; }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .animate-pulse { animation: pulse 4s infinite; }
      `}</style>
    </div>
  );
}
