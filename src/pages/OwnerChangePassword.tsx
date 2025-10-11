import React from 'react';
import { motion } from 'framer-motion';

const OwnerChangePassword: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-purple-50">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6">Changer le mot de passe</h1>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Mot de passe actuel</label>
              <input type="password" className="w-full p-3 rounded-lg border" />
            </div>
            <div>
              <label className="block mb-2">Nouveau mot de passe</label>
              <input type="password" className="w-full p-3 rounded-lg border" />
            </div>
            <div>
              <label className="block mb-2">Confirmer le mot de passe</label>
              <input type="password" className="w-full p-3 rounded-lg border" />
            </div>
            <button type="submit" className="w-full p-3 rounded-lg bg-purple-600 text-white font-bold">
              Mettre à jour
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerChangePassword;
