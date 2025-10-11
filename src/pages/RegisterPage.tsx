import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div 
        className="max-w-md w-full glass p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Inscription</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-2">Nom complet</label>
            <input type="text" className="w-full p-3 rounded-lg border" placeholder="Votre nom" />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input type="email" className="w-full p-3 rounded-lg border" placeholder="votre@email.com" />
          </div>
          <div>
            <label className="block mb-2">Mot de passe</label>
            <input type="password" className="w-full p-3 rounded-lg border" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full p-3 rounded-lg bg-pink-500 text-white font-bold">
            S'inscrire
          </button>
        </form>
        <p className="text-center mt-4">
          Déjà un compte ? <Link to="/login" className="text-pink-500">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
