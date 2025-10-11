import React from 'react';
import { motion } from 'framer-motion';

const AdminLogin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div 
        className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Admin Login</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-2 text-white">Admin Email</label>
            <input type="email" className="w-full p-3 rounded-lg bg-gray-700 text-white border-gray-600" />
          </div>
          <div>
            <label className="block mb-2 text-white">Password</label>
            <input type="password" className="w-full p-3 rounded-lg bg-gray-700 text-white border-gray-600" />
          </div>
          <button type="submit" className="w-full p-3 rounded-lg bg-blue-600 text-white font-bold">
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
