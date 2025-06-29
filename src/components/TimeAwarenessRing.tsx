import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimeAwarenessRingProps {
  consciousYears: number;
  totalRemainingYears: number;
  isOptimized?: boolean;
}

export default function TimeAwarenessRing({ 
  consciousYears, 
  totalRemainingYears, 
  isOptimized = false 
}: TimeAwarenessRingProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [shockLevel, setShockLevel] = useState(0);

  const percentage = Math.min(100, (consciousYears / totalRemainingYears) * 100);
  const circumference = 2 * Math.PI * 90; // radius of 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    // Animate the counter
    const duration = 2000;
    const steps = 60;
    const increment = consciousYears / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= consciousYears) {
        current = consciousYears;
        clearInterval(timer);
        
        // Determine shock level after animation completes
        if (percentage < 15) setShockLevel(3); // 😱
        else if (percentage < 25) setShockLevel(2); // 😰
        else if (percentage < 40) setShockLevel(1); // 😐
        else setShockLevel(0); // 😊
      }
      setDisplayValue(current);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [consciousYears, percentage]);

  const getShockEmoji = () => {
    switch (shockLevel) {
      case 3: return '😱';
      case 2: return '😰';
      case 1: return '😐';
      default: return '😊';
    }
  };

  const getShockMessage = () => {
    switch (shockLevel) {
      case 3: return 'WAKE UP CALL! Your habits are stealing your life!';
      case 2: return 'Time to make some changes!';
      case 1: return 'You could optimize your time better';
      default: return 'Great time management!';
    }
  };

  const getShockColor = () => {
    switch (shockLevel) {
      case 3: return '#FF4444';
      case 2: return '#FF8800';
      case 1: return '#FFAA00';
      default: return '#4CAF50';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          {isOptimized ? 'Optimized ' : ''}Conscious Time Meter
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          How much of your remaining life will you actually live?
        </p>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative">
        <svg
          className="transform -rotate-90 w-48 h-48"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#2D2B4A"
            strokeWidth="12"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            stroke={getShockColor()}
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${getShockColor()})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5, type: "spring" }}
            className="text-center space-y-2"
          >
            <div className="font-space-grotesk font-black text-4xl text-snow-white">
              {displayValue.toFixed(1)}
            </div>
            <div className="font-inter text-sm text-snow-white/80">
              years left
            </div>
            <div className="font-space-grotesk font-bold text-lg" style={{ color: getShockColor() }}>
              {percentage.toFixed(1)}%
            </div>
          </motion.div>
        </div>
      </div>

      {/* Shock Reaction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ 
            scale: shockLevel > 1 ? [1, 1.2, 1] : 1,
            rotate: shockLevel > 2 ? [0, -5, 5, 0] : 0
          }}
          transition={{ 
            duration: 0.6,
            repeat: shockLevel > 1 ? 2 : 0
          }}
          className="text-6xl"
        >
          {getShockEmoji()}
        </motion.div>

        <div 
          className="card-feature max-w-md mx-auto"
          style={{ 
            backgroundColor: shockLevel > 1 ? `${getShockColor()}20` : undefined,
            borderColor: shockLevel > 1 ? getShockColor() : undefined
          }}
        >
          <h4 className="font-space-grotesk font-bold text-lg text-snow-white mb-2">
            Reality Check
          </h4>
          <p className="font-inter text-sm text-snow-white/90">
            {getShockMessage()}
          </p>
          
          {shockLevel > 1 && (
            <div className="mt-4 p-3 bg-dark-charcoal rounded-xl">
              <p className="font-inter text-xs text-snow-white/80">
                💡 <strong>Quick Fix:</strong> Reduce screen time by just 2 hours daily to reclaim{' '}
                <span className="text-digital-teal font-bold">
                  {((2 * 365 * (totalRemainingYears)) / (24 * 365)).toFixed(1)} years
                </span> of your life!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Live countdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
        className="bg-dark-charcoal rounded-xl p-4 border border-electric-orange"
      >
        <div className="text-center space-y-2">
          <div className="font-inter text-xs text-snow-white/60">
            ⏰ Your conscious time is ticking away...
          </div>
          <LiveCountdown consciousYears={consciousYears} />
        </div>
      </motion.div>
    </div>
  );
}

// Live countdown component
function LiveCountdown({ consciousYears }: { consciousYears: number }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const totalSeconds = consciousYears * 365 * 24 * 60 * 60;
    let remainingSeconds = totalSeconds;

    const interval = setInterval(() => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      
      const days = Math.floor(remainingSeconds / (24 * 60 * 60));
      const hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
      const seconds = remainingSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [consciousYears]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div>
        <div className="font-space-grotesk font-bold text-electric-orange countdown-digit">
          {timeLeft.days.toLocaleString()}
        </div>
        <div className="font-inter text-xs text-snow-white/60">days</div>
      </div>
      <div>
        <div className="font-space-grotesk font-bold text-electric-orange countdown-digit">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <div className="font-inter text-xs text-snow-white/60">hours</div>
      </div>
      <div>
        <div className="font-space-grotesk font-bold text-electric-orange countdown-digit">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <div className="font-inter text-xs text-snow-white/60">mins</div>
      </div>
      <div>
        <div className="font-space-grotesk font-bold text-electric-orange countdown-digit">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <div className="font-inter text-xs text-snow-white/60">secs</div>
      </div>
    </div>
  );
}