import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Trophy, Target } from 'lucide-react';
import { useTheme, useMedicalEmojis } from '../contexts/ThemeContext';
import { QuizComponent } from '../components/QuizComponent';
import { cardiologyQuiz, neurologyQuiz, anatomyQuiz, medicalModules, getQuizByModule } from '../data/medicalContent';

export function AdvancedQuizPage() {
  const { isFeminine } = useTheme();
  const emojis = useMedicalEmojis();
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'facile' | 'moyen' | 'difficile' | 'all'>('all');

  const availableModules = medicalModules.filter(module => module.quizCount > 0);

  const getQuizQuestions = () => {
    if (!selectedModule) return [];
    
    const questions = getQuizByModule(selectedModule);
    
    if (selectedDifficulty === 'all') {
      return questions;
    }
    
    return questions.filter(q => q.difficulty === selectedDifficulty);
  };

  const handleQuizComplete = (score: number, results: any[]) => {
    console.log('Quiz completed:', { score, results });
    // Here you would typically save the results to the database
  };

  if (selectedModule) {
    const module = medicalModules.find(m => m.id === selectedModule);
    const questions = getQuizQuestions();
    
    return (
      <motion.div
        className="min-h-screen p-8"
        style={{ backgroundColor: 'var(--color-background)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.button
            onClick={() => setSelectedModule(null)}
            className="mb-6 px-4 py-2 rounded-lg border-2"
            style={{ 
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-background)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Retour aux modules
          </motion.button>
          
          {questions.length > 0 ? (
            <QuizComponent
              questions={questions}
              title={`Quiz ${module?.name} - ${selectedDifficulty === 'all' ? 'Tous niveaux' : selectedDifficulty}`}
              onComplete={handleQuizComplete}
            />
          ) : (
            <div className="text-center p-8">
              <p style={{ color: 'var(--color-textSecondary)' }}>
                Aucune question disponible pour ce niveau de difficulté.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--color-background)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Quiz Médicaux Interactifs {emojis.brain}
          </h1>
          <p className="text-xl" style={{ color: 'var(--color-textSecondary)' }}>
            Testez vos connaissances avec nos QCM avancés et explications détaillées
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
            <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {availableModules.length}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
              Modules disponibles
            </div>
          </div>
          
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
            <Target className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {cardiologyQuiz.length + neurologyQuiz.length + anatomyQuiz.length}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
              Questions totales
            </div>
          </div>
          
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
            <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              15-30
            </div>
            <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
              Minutes par quiz
            </div>
          </div>
          
          <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
            <Trophy className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              3
            </div>
            <div className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
              Niveaux de difficulté
            </div>
          </div>
        </motion.div>

        {/* Difficulty Filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
            Niveau de difficulté :
          </h3>
          <div className="flex flex-wrap gap-3">
            {(['all', 'facile', 'moyen', 'difficile'] as const).map((difficulty) => (
              <motion.button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className="px-4 py-2 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: selectedDifficulty === difficulty ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: selectedDifficulty === difficulty ? 'white' : 'var(--color-text)',
                  border: `2px solid ${selectedDifficulty === difficulty ? 'var(--color-primary)' : 'var(--color-border)'}`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {difficulty === 'all' ? 'Tous niveaux' : difficulty}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {availableModules.map((module, index) => {
            const questionsCount = getQuizByModule(module.id).filter(q => 
              selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
            ).length;
            
            return (
              <motion.div
                key={module.id}
                className="p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  borderColor: 'var(--color-primary)',
                  boxShadow: isFeminine 
                    ? '0 10px 25px -5px rgba(236, 72, 153, 0.2)'
                    : '0 10px 25px -5px rgba(15, 163, 177, 0.2)'
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedModule(module.id)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{module.icon}</span>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                    {module.name}
                  </h3>
                </div>
                
                <p className="text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                  {module.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: 'var(--color-textSecondary)' }}>Questions: </span>
                    <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {questionsCount}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-textSecondary)' }}>Difficulté: </span>
                    <span 
                      className="font-medium"
                      style={{ color: module.color }}
                    >
                      {module.difficulty}
                    </span>
                  </div>
                </div>
                
                <motion.div
                  className="mt-4 w-full py-2 text-center rounded-lg font-medium text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  whileHover={{ backgroundColor: 'var(--color-accent)' }}
                >
                  Commencer le quiz {isFeminine ? '💕' : '🩺'}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AdvancedQuizPage;