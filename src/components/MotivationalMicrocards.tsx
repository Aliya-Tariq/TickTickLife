import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, TrendingUp } from 'lucide-react';

interface MotivationalMicrocardsProps {
  consciousYears: number;
  totalRemainingYears: number;
}

const motivationalCards = [
  {
    id: 1,
    title: 'Start Gym',
    subtitle: '+2 years added to life',
    frontIcon: '💪',
    backQuote: '"The groundwork for all happiness is good health." - Leigh Hunt',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 2,
    title: 'Read Daily',
    subtitle: '+1.5 years of wisdom',
    frontIcon: '📚',
    backQuote: '"Reading is to the mind what exercise is to the body." - Joseph Addison',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 3,
    title: 'Meditate',
    subtitle: '+3 years of peace',
    frontIcon: '🧘',
    backQuote: '"Peace comes from within. Do not seek it without." - Buddha',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 4,
    title: 'Learn Skills',
    subtitle: '+2.5 years of growth',
    frontIcon: '🎯',
    backQuote: '"Live as if you were to die tomorrow. Learn as if you were to live forever." - Gandhi',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5,
    title: 'Travel More',
    subtitle: '+4 years of memories',
    frontIcon: '✈️',
    backQuote: '"Travel makes one modest. You see what a tiny place you occupy in the world." - Flaubert',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 6,
    title: 'Build Relationships',
    subtitle: '+5 years of joy',
    frontIcon: '❤️',
    backQuote: '"The greatest gift of life is friendship, and I have received it." - Hubert Humphrey',
    color: 'from-pink-500 to-rose-600'
  }
];

export default function MotivationalMicrocards({ consciousYears, totalRemainingYears }: MotivationalMicrocardsProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const handleCardFlip = (cardId: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const resetAllCards = () => {
    setFlippedCards(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
            Life Enhancement Cards
          </h3>
          <p className="font-inter text-body-sm text-snow-white/80">
            Tap cards to reveal inspirational quotes and life-extending habits
          </p>
        </div>
        <motion.button
          onClick={resetAllCards}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-soft-purple-gray text-snow-white px-4 py-2 rounded-xl hover:bg-soft-purple-gray/80 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="font-inter text-sm">Reset</span>
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {motivationalCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative h-32 cursor-pointer"
            onClick={() => handleCardFlip(card.id)}
          >
            <motion.div
              className="relative w-full h-full preserve-3d"
              animate={{ rotateY: flippedCards.has(card.id) ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <div 
                className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br ${card.color} p-4 flex flex-col justify-between shadow-lg`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{card.frontIcon}</span>
                  <TrendingUp className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <h4 className="font-space-grotesk font-bold text-lg text-white">
                    {card.title}
                  </h4>
                  <p className="font-inter text-sm text-white/90">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Back of card */}
              <div 
                className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-dark-charcoal border border-electric-orange p-4 flex flex-col justify-center"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center space-y-3">
                  <Sparkles className="h-6 w-6 text-electric-orange mx-auto" />
                  <p className="font-inter text-sm text-snow-white/90 italic leading-relaxed">
                    {card.backQuote}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Summary insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-digital-teal/20 to-electric-orange/20 rounded-2xl p-6 border border-digital-teal"
      >
        <div className="text-center space-y-3">
          <div className="text-3xl">💡</div>
          <h4 className="font-space-grotesk font-bold text-lg text-snow-white">
            Small Changes, Big Impact
          </h4>
          <p className="font-inter text-sm text-snow-white/90">
            Implementing just 3 of these habits could add up to{' '}
            <span className="font-bold text-digital-teal">8+ years</span> to your conscious living time.
            That's more than doubling your current {consciousYears.toFixed(1)} years!
          </p>
        </div>
      </motion.div>
    </div>
  );
}