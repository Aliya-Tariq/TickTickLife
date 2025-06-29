import { useState } from 'react';
import { motion } from 'framer-motion';
import { differenceInSeconds } from 'date-fns';
import DateInput from './DateInput';
import LifespanSlider from './LifespanSlider';
import HabitInput from './HabitInput';
import CountdownDisplay from './CountdownDisplay';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';

interface CalculatorSectionProps {
  onComplete?: (birthDate: Date, lifespan: number, habits: any) => void;
}

export default function CalculatorSection({ onComplete }: CalculatorSectionProps) {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [lifespan, setLifespan] = useState(80);
  const [habits, setHabits] = useState({
    sleeping: 8,
    scrolling: 3,
    eating: 2,
    working: 8,
  });
  const [showResults, setShowResults] = useState(false);

  const calculateRemainingLife = () => {
    if (!birthDate) return 0;
    
    const now = new Date();
    const deathDate = new Date(birthDate);
    deathDate.setFullYear(birthDate.getFullYear() + lifespan);
    
    return Math.max(0, differenceInSeconds(deathDate, now));
  };

  const handleCalculate = () => {
    if (birthDate) {
      setShowResults(true);
    }
  };

  const handleContinue = () => {
    if (onComplete && birthDate) {
      onComplete(birthDate, lifespan, habits);
    }
  };

  const remainingLifeSeconds = calculateRemainingLife();

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="font-outfit font-black text-3xl md:text-5xl text-slate-gray">
            Calculate Your Life Clock
          </h2>
          <p className="font-dm-sans text-lg text-slate-gray/80 max-w-2xl mx-auto">
            Enter your details below to see exactly how much time you have left 
            and how your daily habits are affecting it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate-gray rounded-3xl p-8 space-y-8"
          >
            <h3 className="font-outfit font-bold text-xl text-white text-center">
              Personal Information
            </h3>
            
            <DateInput date={birthDate} onDateChange={setBirthDate} />
            <LifespanSlider lifespan={lifespan} onLifespanChange={setLifespan} />
            
            <div className="space-y-6">
              <h4 className="font-outfit font-bold text-lg text-white">
                Daily Time Spent On:
              </h4>
              
              <HabitInput
                icon="😴"
                label="Sleeping"
                value={habits.sleeping}
                onChange={(value) => setHabits(prev => ({ ...prev, sleeping: value }))}
                max={12}
                unit="hours"
              />
              
              <HabitInput
                icon="📱"
                label="Phone/Social Media"
                value={habits.scrolling}
                onChange={(value) => setHabits(prev => ({ ...prev, scrolling: value }))}
                max={8}
                unit="hours"
              />
              
              <HabitInput
                icon="🍽️"
                label="Eating & Cooking"
                value={habits.eating}
                onChange={(value) => setHabits(prev => ({ ...prev, eating: value }))}
                max={6}
                unit="hours"
              />
              
              <HabitInput
                icon="💼"
                label="Work/Study"
                value={habits.working}
                onChange={(value) => setHabits(prev => ({ ...prev, working: value }))}
                max={16}
                unit="hours"
              />
            </div>
            
            <Button
              onClick={handleCalculate}
              disabled={!birthDate}
              className="w-full bg-coral-pink hover:bg-coral-pink/90 text-white font-outfit font-bold py-6 text-lg rounded-2xl transition-all duration-300"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate My Life Clock
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            {showResults && birthDate ? (
              <>
                <CountdownDisplay 
                  remainingLifeSeconds={remainingLifeSeconds}
                  habitData={habits}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="w-full"
                >
                  <Button
                    onClick={handleContinue}
                    className="w-full btn-primary py-4 text-lg"
                  >
                    <span>Analyze My Habits Deeper</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center space-y-4 border-2 border-dashed border-gray-300">
                <div className="text-6xl">⏳</div>
                <h3 className="font-outfit font-bold text-xl text-slate-gray">
                  Your Life Clock Will Appear Here
                </h3>
                <p className="font-dm-sans text-slate-gray/80">
                  Fill in your information and click calculate to see your remaining time.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}