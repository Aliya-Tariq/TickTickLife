import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClockLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export default function ClockLogo({ size = 'md', animated = true, className }: ClockLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const strokeWidth = {
    sm: 1.5,
    md: 2,
    lg: 2.5,
    xl: 3
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring with gradient */}
        <defs>
          <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#18C3B9" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF4F61" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main clock circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#clockGradient)"
          strokeWidth={strokeWidth[size]}
          fill="transparent"
          filter="url(#glow)"
          initial={animated ? { pathLength: 0, opacity: 0 } : {}}
          animate={animated ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Hour markers */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
          const angle = (hour * 30) - 90; // Convert to degrees, starting from 12 o'clock
          const isMainHour = hour % 3 === 0;
          const outerRadius = 45;
          const innerRadius = isMainHour ? 35 : 38;
          
          const x1 = 50 + outerRadius * Math.cos(angle * Math.PI / 180);
          const y1 = 50 + outerRadius * Math.sin(angle * Math.PI / 180);
          const x2 = 50 + innerRadius * Math.cos(angle * Math.PI / 180);
          const y2 = 50 + innerRadius * Math.sin(angle * Math.PI / 180);

          return (
            <motion.line
              key={hour}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#18C3B9"
              strokeWidth={isMainHour ? strokeWidth[size] : strokeWidth[size] * 0.7}
              strokeLinecap="round"
              initial={animated ? { opacity: 0 } : {}}
              animate={animated ? { opacity: 1 } : {}}
              transition={{ delay: animated ? 0.5 + hour * 0.1 : 0, duration: 0.3 }}
            />
          );
        })}

        {/* Clock hands */}
        {/* Hour hand */}
        <motion.line
          x1="50"
          y1="50"
          x2="50"
          y2="25"
          stroke="#FFA500"
          strokeWidth={strokeWidth[size] * 1.2}
          strokeLinecap="round"
          initial={animated ? { rotate: 0, opacity: 0 } : { rotate: 45 }}
          animate={animated ? { rotate: 45, opacity: 1 } : {}}
          transition={{ delay: animated ? 1.2 : 0, duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Minute hand */}
        <motion.line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke="#FF4F61"
          strokeWidth={strokeWidth[size]}
          strokeLinecap="round"
          initial={animated ? { rotate: 0, opacity: 0 } : { rotate: 135 }}
          animate={animated ? { rotate: 135, opacity: 1 } : {}}
          transition={{ delay: animated ? 1.4 : 0, duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Center dot */}
        <motion.circle
          cx="50"
          cy="50"
          r={strokeWidth[size] * 1.5}
          fill="#18C3B9"
          initial={animated ? { scale: 0, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: animated ? 1.6 : 0, duration: 0.4, type: "spring", stiffness: 200 }}
        />

        {/* Subtle tick animation */}
        {animated && (
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            stroke="#18C3B9"
            strokeWidth="0.5"
            fill="transparent"
            opacity="0.3"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </svg>

      {/* Pulsing glow effect for animated version */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(24, 195, 185, 0.2) 0%, transparent 70%)',
            filter: 'blur(4px)'
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}