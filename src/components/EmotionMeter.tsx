import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EmotionMeterProps {
  consciousYearsGained: number;
  totalConsciousYears: number;
}

const emotionStates = [
  { 
    range: [0, 0.5], 
    emoji: '😐', 
    label: 'Neutral', 
    color: '#888888',
    message: "Small changes, small impact"
  },
  { 
    range: [0.5, 1.5], 
    emoji: '🙂', 
    label: 'Pleased', 
    color: '#4CAF50',
    message: "You're on the right track!"
  },
  { 
    range: [1.5, 3], 
    emoji: '😊', 
    label: 'Happy', 
    color: '#8BC34A',
    message: "Great improvements!"
  },
  { 
    range: [3, 5], 
    emoji: '😄', 
    label: 'Excited', 
    color: '#FFA500',
    message: "Fantastic life changes!"
  },
  { 
    range: [5, Infinity], 
    emoji: '🤩', 
    label: 'Ecstatic', 
    color: '#FF6B6B',
    message: "You're a time-reclaiming champion!"
  }
];

export default function EmotionMeter({ consciousYearsGained, totalConsciousYears }: EmotionMeterProps) {
  const [currentEmotion, setCurrentEmotion] = useState(emotionStates[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const newEmotion = emotionStates.find(state => 
      consciousYearsGained >= state.range[0] && consciousYearsGained < state.range[1]
    ) || emotionStates[0];

    if (newEmotion !== currentEmotion) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentEmotion(newEmotion);
        setIsAnimating(false);
      }, 300);
    }
  }, [consciousYearsGained, currentEmotion]);

  const improvementPercentage = totalConsciousYears > 0 
    ? (consciousYearsGained / totalConsciousYears) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          Life Satisfaction Meter
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          How do your habit changes make you feel?
        </p>
      </div>

      {/* Emotion Display */}
      <motion.div
        className="card-feature text-center space-y-6"
        style={{ 
          borderColor: currentEmotion.color,
          boxShadow: `0 0 20px ${currentEmotion.color}40`
        }}
      >
        {/* Animated Emoji */}
        <motion.div
          key={currentEmotion.emoji}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: isAnimating ? [1, 1.3, 1] : 1,
            rotate: 0
          }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 200
          }}
          className="text-8xl"
        >
          {currentEmotion.emoji}
        </motion.div>

        {/* Emotion Label */}
        <div className="space-y-2">
          <h4 
            className="font-space-grotesk font-bold text-2xl"
            style={{ color: currentEmotion.color }}
          >
            {currentEmotion.label}
          </h4>
          <p className="font-inter text-lg text-snow-white/90">
            {currentEmotion.message}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="font-space-grotesk font-bold text-xl text-snow-white">
              +{consciousYearsGained.toFixed(1)}
            </div>
            <div className="font-inter text-sm text-snow-white/80">
              Years Gained
            </div>
          </div>
          <div className="space-y-1">
            <div 
              className="font-space-grotesk font-bold text-xl"
              style={{ color: currentEmotion.color }}
            >
              {improvementPercentage.toFixed(0)}%
            </div>
            <div className="font-inter text-sm text-snow-white/80">
              Life Improvement
            </div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#2D2B4A"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke={currentEmotion.color}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 56 * (1 - Math.min(improvementPercentage / 100, 1))
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 8px ${currentEmotion.color})`
              }}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-space-grotesk font-bold text-lg text-snow-white">
                {Math.round(improvementPercentage)}%
              </div>
              <div className="font-inter text-xs text-snow-white/60">
                Better
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emotion Scale */}
      <div className="space-y-3">
        <h4 className="font-space-grotesk font-semibold text-lg text-snow-white text-center">
          Emotion Scale
        </h4>
        <div className="flex justify-between items-center bg-soft-purple-gray rounded-2xl p-4">
          {emotionStates.map((emotion, index) => (
            <motion.div
              key={emotion.emoji}
              className={`text-center cursor-pointer transition-all duration-200 ${
                emotion === currentEmotion ? 'scale-125' : 'scale-100 opacity-60'
              }`}
              whileHover={{ scale: 1.1 }}
              style={{
                filter: emotion === currentEmotion ? `drop-shadow(0 0 8px ${emotion.color})` : 'none'
              }}
            >
              <div className="text-2xl mb-1">{emotion.emoji}</div>
              <div 
                className="font-inter text-xs font-semibold"
                style={{ color: emotion === currentEmotion ? emotion.color : '#888888' }}
              >
                {emotion.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      {consciousYearsGained > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-digital-teal/20 to-green-500/20 rounded-2xl p-6 text-center border border-digital-teal"
        >
          <div className="text-3xl mb-3">🎉</div>
          <h4 className="font-space-grotesk font-bold text-lg text-snow-white mb-2">
            Incredible Transformation!
          </h4>
          <p className="font-inter text-sm text-snow-white/90">
            You've unlocked {consciousYearsGained.toFixed(1)} extra years of conscious living! 
            That's enough time to learn new languages, travel the world, or master new skills. 
            Your future self will thank you for these changes.
          </p>
        </motion.div>
      )}
    </div>
  );
}