import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

interface CountdownDisplayProps {
  remainingLifeSeconds: number;
  habitData: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
  };
}

export default function CountdownDisplay({ remainingLifeSeconds, habitData }: CountdownDisplayProps) {
  const [currentSeconds, setCurrentSeconds] = useState(remainingLifeSeconds);

  useEffect(() => {
    setCurrentSeconds(remainingLifeSeconds);
    
    const interval = setInterval(() => {
      setCurrentSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingLifeSeconds]);

  const days = Math.floor(currentSeconds / (24 * 60 * 60));
  const hours = Math.floor((currentSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((currentSeconds % (60 * 60)) / 60);
  const seconds = currentSeconds % 60;

  const years = Math.floor(days / 365);
  const remainingDays = days % 365;

  // Calculate time lost to habits per day
  const dailyHabitHours = habitData.sleeping + habitData.scrolling + habitData.eating + habitData.working;
  const dailyFreeHours = 24 - dailyHabitHours;
  const freeTimePercentage = (dailyFreeHours / 24) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-gray rounded-3xl p-8 text-white space-y-6"
    >
      <div className="text-center space-y-4">
        <h2 className="font-outfit font-bold text-2xl text-yellow-gold">
          Your Life Clock ⏰
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-deep-plum rounded-2xl p-4 text-center">
            <div className="text-2xl font-outfit font-bold countdown-digit text-coral-pink">
              {years}
            </div>
            <div className="text-sm font-dm-sans text-white/80">Years</div>
          </div>
          <div className="bg-deep-plum rounded-2xl p-4 text-center">
            <div className="text-2xl font-outfit font-bold countdown-digit text-coral-pink">
              {remainingDays}
            </div>
            <div className="text-sm font-dm-sans text-white/80">Days</div>
          </div>
          <div className="bg-deep-plum rounded-2xl p-4 text-center">
            <div className="text-2xl font-outfit font-bold countdown-digit text-coral-pink">
              {hours}
            </div>
            <div className="text-sm font-dm-sans text-white/80">Hours</div>
          </div>
          <div className="bg-deep-plum rounded-2xl p-4 text-center">
            <div className="text-2xl font-outfit font-bold countdown-digit text-coral-pink">
              {minutes}
            </div>
            <div className="text-sm font-dm-sans text-white/80">Minutes</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-outfit font-bold text-lg text-yellow-gold text-center">
          Daily Time Breakdown
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-dm-sans text-sm">😴 Sleeping</span>
            <span className="font-bold text-coral-pink">{habitData.sleeping}h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-dm-sans text-sm">📱 Scrolling</span>
            <span className="font-bold text-coral-pink">{habitData.scrolling}h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-dm-sans text-sm">🍽️ Eating</span>
            <span className="font-bold text-coral-pink">{habitData.eating}h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-dm-sans text-sm">💼 Working</span>
            <span className="font-bold text-coral-pink">{habitData.working}h</span>
          </div>
          <div className="border-t border-white/20 pt-3 flex justify-between items-center">
            <span className="font-dm-sans font-bold">🌟 Free Time</span>
            <span className="font-bold text-yellow-gold">{dailyFreeHours}h ({freeTimePercentage.toFixed(1)}%)</span>
          </div>
        </div>

        {freeTimePercentage < 30 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-coral-pink/20 border border-coral-pink rounded-xl p-4 text-center"
          >
            <p className="font-dm-sans text-sm text-coral-pink">
              ⚠️ You're spending {(100 - freeTimePercentage).toFixed(1)}% of your day on habits. 
              Consider optimizing for more free time!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}