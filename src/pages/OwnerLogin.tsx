import React from 'react';
import { motion } from 'framer-motion';

const OwnerLogin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-900">
      <motion.div 
        className="max-w-md w-full bg-purple-800 p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Owner Access</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-2 text-white">Owner Email</label>
            <input type="email" className="w-full p-3 rounded-lg bg-purple-700 text-white" />
          </div>
          <div>
            <label className="block mb-2 text-white">Password</label>
            <input type="password" className="w-full p-3 rounded-lg bg-purple-700 text-white" />
          </div>
          <button type="submit" className="w-full p-3 rounded-lg bg-purple-600 text-white font-bold">
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OwnerLogin;
