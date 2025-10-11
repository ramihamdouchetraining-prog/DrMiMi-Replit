import React from 'react';
import { Heart } from 'lucide-react';

const AboutMimiDonation: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart size={64} className="mx-auto mb-4 text-pink-500" />
          <h1 className="text-4xl font-bold mb-4">À propos de Dr.MiMi</h1>
          <p className="text-xl">Votre compagne d'apprentissage médical</p>
        </div>
        
        <div className="space-y-6 mb-12">
          <p className="text-lg">
            Dr.MiMi est une plateforme d'apprentissage médical interactive conçue pour accompagner 
            les étudiants en médecine tout au long de leur parcours.
          </p>
          <p className="text-lg">
            Notre mission est de rendre l'apprentissage de la médecine plus accessible, ludique et efficace.
          </p>
        </div>

        <div className="bg-pink-100 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Soutenez Dr.MiMi</h2>
          <p className="mb-4">
            Votre soutien nous aide à améliorer continuellement la plateforme et à la rendre accessible 
            au plus grand nombre d'étudiants.
          </p>
          <button className="px-6 py-3 bg-pink-500 text-white rounded-lg font-bold">
            Faire un don
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutMimiDonation;
