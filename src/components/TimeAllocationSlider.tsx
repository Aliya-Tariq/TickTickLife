import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

interface TimeAllocationSliderProps {
  icon: string;
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  color: string;
}

export default function TimeAllocationSlider({ 
  icon, 
  label, 
  description, 
  value, 
  onChange, 
  max, 
  color 
}: TimeAllocationSliderProps) {
  const [isHovered, setIsHovered] = useState(false);

  const percentage = (value / 24) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-feature space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.span 
            className="text-2xl"
            animate={{ scale: isHovered ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
          <div>
            <h3 className="font-space-grotesk font-semibold text-snow-white text-lg">
              {label}
            </h3>
            <p className="font-inter text-sm text-snow-white/70">
              {description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-space-grotesk font-bold text-xl text-electric-orange">
            {value}h
          </div>
          <div className="font-inter text-xs text-warm-gold">
            {percentage.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Slider
          value={[value]}
          onValueChange={(newValue) => onChange(newValue[0])}
          max={max}
          min={0}
          step={0.5}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs font-inter text-snow-white/60">
          <span>0h</span>
          <span>{max}h</span>
        </div>
      </div>

      {/* Visual impact indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}