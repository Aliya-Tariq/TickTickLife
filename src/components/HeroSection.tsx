import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ClockLogo from './ClockLogo';

interface HeroSectionProps {
  onGetStarted: () => void;
  isReturningUser?: boolean;
}

export default function HeroSection({ onGetStarted, isReturningUser = false }: HeroSectionProps) {
  return (
    <section className="gradient-hero min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-center mb-6">
            <ClockLogo size="xl" animated={true} />
          </div>
          
          <h1 className="font-outfit font-black text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
            {isReturningUser 
              ? "Welcome Back, Time Warrior!" 
              : "How Much Time Do You Have Left?"
            }
          </h1>
          
          <p className="font-dm-sans text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {isReturningUser
              ? "Continue your journey to conscious living. Your goals and insights are waiting for you."
              : "Discover how your habits are stealing your time — and how to win it back. Every scroll, every snooze, every mindless moment adds up."
            }
          </p>
          
          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-gold text-charcoal px-8 py-4 rounded-3xl font-outfit font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 mx-auto group animate-pulse-glow"
          >
            <span>
              {isReturningUser 
                ? "LET'S HEAD BACK TO OUR GOALS" 
                : "REVEAL MY LIFE CLOCK"
              }
            </span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <div className="flex items-center justify-center space-x-8 text-white/80 text-sm font-dm-sans mt-12">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⏳</span>
              <span>Time is finite</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📱</span>
              <span>Habits matter</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌈</span>
              <span>Life is precious</span>
            </div>
          </div>

          {isReturningUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 max-w-2xl mx-auto"
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-outfit font-bold text-xl text-white mb-2">
                Your Journey Continues
              </h3>
              <p className="font-dm-sans text-white/90">
                You've already taken the first step towards conscious living. 
                Access all your tools and insights through the navigation menu above.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}