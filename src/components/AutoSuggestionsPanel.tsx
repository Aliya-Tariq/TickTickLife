import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Plus, Shuffle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AutoSuggestionsPanelProps {
  currentAge: number;
  consciousYears: number;
  onSuggestionSelect: (suggestion: any) => void;
}

const suggestionCategories = {
  health: {
    icon: '💪',
    color: '#4CAF50',
    suggestions: [
      { title: 'Run a 5K', timeframe: 'before 30', impact: '+1.5 years' },
      { title: 'Learn to cook healthy meals', timeframe: 'this year', impact: '+2 years' },
      { title: 'Quit smoking', timeframe: 'within 6 months', impact: '+10 years' },
      { title: 'Practice yoga daily', timeframe: 'starting now', impact: '+3 years' }
    ]
  },
  learning: {
    icon: '📚',
    color: '#2196F3',
    suggestions: [
      { title: 'Read 50 books', timeframe: 'before 35', impact: '+2 years wisdom' },
      { title: 'Learn a new language', timeframe: 'in 2 years', impact: '+1.5 years' },
      { title: 'Master a musical instrument', timeframe: 'before 40', impact: '+3 years joy' },
      { title: 'Get a professional certification', timeframe: 'this year', impact: '+5 years career' }
    ]
  },
  relationships: {
    icon: '❤️',
    color: '#E91E63',
    suggestions: [
      { title: 'Call parents weekly', timeframe: 'starting today', impact: '+4 years happiness' },
      { title: 'Make 5 new close friends', timeframe: 'before 30', impact: '+6 years joy' },
      { title: 'Find your life partner', timeframe: 'before 35', impact: '+8 years fulfillment' },
      { title: 'Mentor someone younger', timeframe: 'this year', impact: '+3 years purpose' }
    ]
  },
  adventure: {
    icon: '🌍',
    color: '#FF9800',
    suggestions: [
      { title: 'Visit 20 countries', timeframe: 'before 40', impact: '+5 years memories' },
      { title: 'Learn to surf', timeframe: 'this summer', impact: '+2 years adventure' },
      { title: 'Hike a major mountain', timeframe: 'before 35', impact: '+1 year achievement' },
      { title: 'Take a solo trip', timeframe: 'this year', impact: '+2 years self-discovery' }
    ]
  },
  creative: {
    icon: '🎨',
    color: '#9C27B0',
    suggestions: [
      { title: 'Write a book', timeframe: 'before 40', impact: '+3 years legacy' },
      { title: 'Start a YouTube channel', timeframe: 'this month', impact: '+2 years creativity' },
      { title: 'Learn photography', timeframe: 'this year', impact: '+4 years perspective' },
      { title: 'Paint 100 paintings', timeframe: 'before 50', impact: '+5 years expression' }
    ]
  },
  financial: {
    icon: '💰',
    color: '#FFA500',
    suggestions: [
      { title: 'Save $100,000', timeframe: 'before 35', impact: '+10 years freedom' },
      { title: 'Start investing', timeframe: 'this month', impact: '+15 years security' },
      { title: 'Buy your dream home', timeframe: 'before 40', impact: '+5 years stability' },
      { title: 'Achieve financial independence', timeframe: 'before 50', impact: '+20 years choice' }
    ]
  }
};

export default function AutoSuggestionsPanel({ currentAge, consciousYears, onSuggestionSelect }: AutoSuggestionsPanelProps) {
  const [currentSuggestions, setCurrentSuggestions] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateRandomSuggestions = () => {
    const categories = Object.keys(suggestionCategories);
    const selectedCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const suggestions = selectedCategories.map(categoryKey => {
      const category = suggestionCategories[categoryKey as keyof typeof suggestionCategories];
      const randomSuggestion = category.suggestions[Math.floor(Math.random() * category.suggestions.length)];
      
      return {
        ...randomSuggestion,
        category: categoryKey,
        icon: category.icon,
        color: category.color,
        id: Math.random()
      };
    });

    return suggestions;
  };

  const refreshSuggestions = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSuggestions(generateRandomSuggestions());
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    setCurrentSuggestions(generateRandomSuggestions());
  }, []);

  const getAgeBasedMessage = () => {
    if (currentAge < 25) return "You're young! Dream big and start early.";
    if (currentAge < 35) return "Perfect time to build foundations.";
    if (currentAge < 45) return "Focus on meaningful achievements.";
    if (currentAge < 55) return "Make every year count.";
    return "It's never too late to start something amazing.";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Lightbulb className="h-8 w-8 text-electric-orange" />
          </motion.div>
          <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
            Stuck on What to Add?
          </h3>
        </div>
        
        <div className="space-y-2">
          <p className="font-inter text-body-sm text-snow-white/80">
            {getAgeBasedMessage()}
          </p>
          <p className="font-inter text-sm text-electric-orange">
            With only {consciousYears.toFixed(1)} conscious years left, every goal matters!
          </p>
        </div>
      </div>

      {/* Suggestion Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSuggestions.map(s => s.id).join('-')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {currentSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="relative overflow-hidden rounded-2xl cursor-pointer group"
              style={{ 
                background: `linear-gradient(135deg, ${suggestion.color}20, ${suggestion.color}10)`
              }}
              onClick={() => onSuggestionSelect(suggestion)}
            >
              {/* Animated pulse background */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20"
                style={{ backgroundColor: suggestion.color }}
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <div className="relative p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{suggestion.icon}</span>
                  <Plus className="h-5 w-5 text-snow-white/60 group-hover:text-snow-white transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-space-grotesk font-bold text-lg text-snow-white">
                    {suggestion.title}
                  </h4>
                  <p className="font-inter text-sm text-snow-white/80">
                    {suggestion.timeframe}
                  </p>
                  <div 
                    className="font-inter text-sm font-bold"
                    style={{ color: suggestion.color }}
                  >
                    {suggestion.impact}
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Refresh Button */}
      <div className="text-center">
        <Button
          onClick={refreshSuggestions}
          disabled={isAnimating}
          className="btn-secondary"
        >
          <motion.div
            animate={isAnimating ? { rotate: 360 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Shuffle className="mr-2 h-4 w-4" />
          </motion.div>
          {isAnimating ? 'Generating...' : 'Get New Suggestions'}
        </Button>
      </div>

      {/* Motivational Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-gradient-to-r from-electric-orange/20 to-warm-gold/20 rounded-2xl p-6 text-center border border-electric-orange"
      >
        <Sparkles className="h-6 w-6 text-electric-orange mx-auto mb-3" />
        <h4 className="font-space-grotesk font-bold text-lg text-snow-white mb-2">
          Every Goal Adds Meaning
        </h4>
        <p className="font-inter text-sm text-snow-white/90">
          Research shows that people with clear goals live longer, happier lives. 
          What legacy will you create with your remaining time?
        </p>
      </motion.div>
    </div>
  );
}