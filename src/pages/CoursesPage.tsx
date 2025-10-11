import React from 'react';
import { motion } from 'framer-motion';

const CoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Cours de Médecine
        </motion.h1>
        <p className="text-lg">Explorez nos cours organisés par modules et années d'études...</p>
      </div>
    </div>
  );
};

export default CoursesPage;
