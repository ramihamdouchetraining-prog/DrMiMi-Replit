import React from 'react';

const OwnerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-purple-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-purple-900">Owner Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-2">Revenus</h3>
            <p className="text-3xl text-purple-600">$0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-2">Utilisateurs</h3>
            <p className="text-3xl text-purple-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-2">Cours</h3>
            <p className="text-3xl text-purple-600">0</p>
          </div>
        </div>
        <p className="mt-8 text-lg">Tableau de bord propriétaire en cours de développement...</p>
      </div>
    </div>
  );
};

export default OwnerDashboard;
