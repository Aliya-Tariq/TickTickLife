import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, BookOpen, Plane, Dumbbell, Heart, Palette, Shuffle } from 'lucide-react';

interface ActionSuggestionsProps {
  timeReclaimed: number;
}

const suggestionCategories = [
  {
    id: 'learning',
    icon: BookOpen,
    color: '#2196F3',
    title: 'Learning & Growth',
    suggestions: [
      { activity: 'Learn 3 new languages', time: '2-3 years', impact: 'Expand your worldview' },
      { activity: 'Master a musical instrument', time: '1-2 years', impact: 'Boost creativity & brain health' },
      { activity: 'Get a professional certification', time: '6 months', impact: 'Advance your career' },
      { activity: 'Read 100 classic books', time: '2 years', impact: 'Gain timeless wisdom' }
    ]
  },
  {
    id: 'adventure',
    icon: Plane,
    color: '#FF9800',
    title: 'Travel & Adventure',
    suggestions: [
      { activity: 'Visit all 7 continents', time: '3-4 years', impact: 'Create lifelong memories' },
      { activity: 'Hike major mountain ranges', time: '2 years', impact: 'Build resilience & strength' },
      { activity: 'Learn to surf in 5 countries', time: '1 year', impact: 'Connect with nature' },
      { activity: 'Take a year-long sabbatical', time: '1 year', impact: 'Reset and recharge' }
    ]
  },
  {
    id: 'health',
    icon: Dumbbell,
    color: '#4CAF50',
    title: 'Health & Fitness',
    suggestions: [
      { activity: 'Train for a marathon', time: '6 months', impact: 'Improve cardiovascular health' },
      { activity: 'Learn martial arts', time: '2 years', impact: 'Build discipline & confidence' },
      { activity: 'Practice yoga daily', time: 'Ongoing', impact: 'Reduce stress & increase flexibility' },
      { activity: 'Complete a triathlon', time: '1 year', impact: 'Push your limits' }
    ]
  },
  {
    id: 'relationships',
    icon: Heart,
    color: '#E91E63',
    title: 'Relationships & Community',
    suggestions: [
      { activity: 'Volunteer for meaningful causes', time: 'Ongoing', impact: 'Make a difference' },
      { activity: 'Mentor young professionals', time: '1-2 years', impact: 'Share your wisdom' },
      { activity: 'Strengthen family bonds', time: 'Ongoing', impact: 'Create lasting connections' },
      { activity: 'Build a supportive community', time: '6 months', impact: 'Enhance well-being' }
    ]
  },
  {
    id: 'creative',
    icon: Palette,
    color: '#9C27B0',
    title: 'Creative Expression',
    suggestions: [
      { activity: 'Write and publish a book', time: '1-2 years', impact: 'Leave a legacy' },
      { activity: 'Learn photography', time: '6 months', impact: 'Capture beautiful moments' },
      { activity: 'Start a creative business', time: '1 year', impact: 'Turn passion into profit' },
      { activity: 'Master a new art form', time: '1-2 years', impact: 'Express your creativity' }
    ]
  }
];

export default function ActionSuggestions({ timeReclaimed }: ActionSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState(suggestionCategories[0]);
  const [currentSuggestions, setCurrentSuggestions] = useState(selectedCategory.suggestions);

  const shuffleSuggestions = () => {
    const allSuggestions = suggestionCategories.flatMap(cat => 
      cat.suggestions.map(s => ({ ...s, category: cat.title, color: cat.color }))
    );
    const shuffled = allSuggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
    setCurrentSuggestions(shuffled);
    setSelectedCategory({ 
      id: 'mixed', 
      icon: Shuffle, 
      color: '#FFA500', 
      title: 'Mixed Ideas',
      suggestions: shuffled 
    });
  };

  const getTimeMessage = () => {
    if (timeReclaimed < 1) return "Even small amounts of time can create meaningful change.";
    if (timeReclaimed < 2) return "You have over a year of extra time to invest in yourself!";
    if (timeReclaimed < 5) return "Multiple years of opportunity await you!";
    return "You've unlocked incredible potential with all this extra time!";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Lightbulb className="h-8 w-8 text-electric-orange" />
          <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
            What to Do With Your Time
          </h3>
        </div>
        <div className="space-y-2">
          <p className="font-inter text-body-sm text-snow-white/80">
            {getTimeMessage()}
          </p>
          <div className="font-space-grotesk font-bold text-xl text-electric-orange">
            {timeReclaimed.toFixed(1)} years = {(timeReclaimed * 365).toFixed(0)} days = {(timeReclaimed * 8760).toFixed(0)} hours
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap justify-center gap-3">
        {suggestionCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentSuggestions(category.suggestions);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                selectedCategory.id === category.id
                  ? 'text-dark-charcoal'
                  : 'bg-soft-purple-gray text-snow-white hover:bg-soft-purple-gray/80'
              }`}
              style={{
                backgroundColor: selectedCategory.id === category.id ? category.color : undefined
              }}
            >
              <IconComponent className="h-4 w-4" />
              <span className="font-space-grotesk font-semibold text-sm">
                {category.title}
              </span>
            </motion.button>
          );
        })}
        <motion.button
          onClick={shuffleSuggestions}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-electric-orange to-warm-gold text-dark-charcoal transition-all duration-200"
        >
          <Shuffle className="h-4 w-4" />
          <span className="font-space-grotesk font-semibold text-sm">
            Surprise Me
          </span>
        </motion.button>
      </div>

      {/* Suggestions Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {currentSuggestions.map((suggestion, index) => (
            <motion.div
              key={`${suggestion.activity}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="card-feature relative overflow-hidden cursor-pointer group"
            >
              {/* Background gradient */}
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${
                    suggestion.color || selectedCategory.color
                  }40, transparent)`
                }}
              />

              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-space-grotesk font-bold text-lg text-snow-white mb-2">
                      {suggestion.activity}
                    </h4>
                    <p className="font-inter text-sm text-snow-white/80 mb-3">
                      {suggestion.impact}
                    </p>
                  </div>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: suggestion.color || selectedCategory.color }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${suggestion.color || selectedCategory.color}20` }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: suggestion.color || selectedCategory.color }}
                      />
                    </div>
                    <span className="font-inter text-sm text-snow-white/70">
                      Time needed: {suggestion.time}
                    </span>
                  </div>
                  
                  {timeReclaimed >= 1 && (
                    <div className="text-digital-teal text-sm font-semibold">
                      ✓ Achievable
                    </div>
                  )}
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Motivational Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-electric-orange/20 to-warm-gold/20 rounded-2xl p-6 text-center border border-electric-orange"
      >
        <div className="space-y-3">
          <div className="text-3xl">🚀</div>
          <h4 className="font-space-grotesk font-bold text-lg text-snow-white">
            Your Time, Your Choice
          </h4>
          <p className="font-inter text-sm text-snow-white/90 max-w-2xl mx-auto">
            {timeReclaimed > 0 ? (
              <>
                You've reclaimed {timeReclaimed.toFixed(1)} years of your life! This isn't just time—it's 
                opportunity, growth, and the chance to become the person you've always wanted to be. 
                What will you choose to do with this precious gift?
              </>
            ) : (
              <>
                Every minute matters. Even small changes in your daily habits can compound into 
                significant life improvements. Start with one small change today and build momentum 
                toward the life you want to live.
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}