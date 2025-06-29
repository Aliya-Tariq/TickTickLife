import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Target, Sparkles, Lightbulb, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface GoalWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: (goal: any) => void;
}

const goalCategories = [
  { id: 'health', label: 'Health & Fitness', icon: '💪', color: '#4CAF50' },
  { id: 'financial', label: 'Financial', icon: '💰', color: '#FFA500' },
  { id: 'travel', label: 'Travel & Adventure', icon: '✈️', color: '#2196F3' },
  { id: 'learning', label: 'Learning & Skills', icon: '📚', color: '#9C27B0' },
  { id: 'relationships', label: 'Relationships', icon: '❤️', color: '#E91E63' },
  { id: 'career', label: 'Career & Business', icon: '🚀', color: '#FF5722' },
  { id: 'creative', label: 'Creative & Hobbies', icon: '🎨', color: '#607D8B' },
  { id: 'personal', label: 'Personal Growth', icon: '🌱', color: '#8BC34A' },
  { id: 'custom', label: 'Custom Goal', icon: '✨', color: '#FFD700' }
];

const goalSuggestions = {
  health: ['Run a marathon', 'Lose 20 pounds', 'Do 100 push-ups daily', 'Quit smoking'],
  financial: ['Save $10,000', 'Buy a house', 'Start investing', 'Pay off debt'],
  travel: ['Visit 10 countries', 'Backpack Europe', 'Learn a new language abroad', 'Road trip across country'],
  learning: ['Learn Python', 'Read 50 books', 'Get a certification', 'Master a musical instrument'],
  relationships: ['Get married', 'Make 5 new friends', 'Reconnect with family', 'Find a mentor'],
  career: ['Get promoted', 'Start a business', 'Change careers', 'Build a portfolio'],
  creative: ['Write a book', 'Learn photography', 'Start a YouTube channel', 'Paint 20 paintings'],
  personal: ['Meditate daily', 'Practice gratitude', 'Overcome fear of public speaking', 'Build confidence']
};

export default function GoalWizardModal({ isOpen, onClose, onGoalCreated }: GoalWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [goalTitle, setGoalTitle] = useState('');
  const [customGoalTitle, setCustomGoalTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isCustomGoal, setIsCustomGoal] = useState(false);

  const emojis = ['🎯', '⭐', '🔥', '💎', '🏆', '🌟', '✨', '🎉', '🚀', '💪', '🌈', '⚡', '🎨', '📚', '💰', '❤️', '🌱', '✈️'];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsCustomGoal(categoryId === 'custom');
    if (categoryId !== 'custom') {
      setCustomGoalTitle('');
    }
    setGoalTitle('');
  };

  const handleCreateGoal = () => {
    const finalTitle = isCustomGoal ? customGoalTitle : goalTitle;
    
    const goal = {
      id: Date.now(),
      category: selectedCategory,
      title: finalTitle,
      emoji: selectedEmoji,
      deadline,
      createdAt: new Date(),
      completed: false
    };
    
    onGoalCreated(goal);
    
    // Reset form
    setCurrentStep(1);
    setSelectedCategory('');
    setGoalTitle('');
    setCustomGoalTitle('');
    setSelectedEmoji('🎯');
    setDeadline(undefined);
    setIsCustomGoal(false);
    
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedCategory !== '';
      case 2: return isCustomGoal ? customGoalTitle.trim() !== '' : goalTitle.trim() !== '';
      case 3: return selectedEmoji !== '';
      case 4: return deadline !== undefined;
      default: return false;
    }
  };

  const selectedCategoryData = goalCategories.find(cat => cat.id === selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-charcoal rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-electric-orange" />
                <h2 className="font-space-grotesk font-bold text-2xl text-snow-white">
                  Goal Wizard
                </h2>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-snow-white hover:bg-soft-purple-gray"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-snow-white/80">
                  Step {currentStep} of 4
                </span>
                <span className="font-inter text-sm text-electric-orange">
                  {Math.round((currentStep / 4) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-soft-purple-gray rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-digital-teal to-electric-orange"
                  initial={{ width: '25%' }}
                  animate={{ width: `${(currentStep / 4) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h3 className="font-space-grotesk font-bold text-xl text-snow-white">
                      Choose a Category
                    </h3>
                    <p className="font-inter text-snow-white/80">
                      What area of your life do you want to improve?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {goalCategories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCategorySelect(category.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                          selectedCategory === category.id
                            ? "border-electric-orange bg-electric-orange/10"
                            : "border-soft-purple-gray bg-soft-purple-gray hover:border-warm-gold"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <div className="font-space-grotesk font-semibold text-snow-white">
                              {category.label}
                            </div>
                            {category.id === 'custom' && (
                              <div className="font-inter text-xs text-electric-orange">
                                Create your own unique goal
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h3 className="font-space-grotesk font-bold text-xl text-snow-white">
                      {isCustomGoal ? 'Create Your Custom Goal' : "What's Your Goal?"}
                    </h3>
                    <p className="font-inter text-snow-white/80">
                      {isCustomGoal 
                        ? 'Describe your unique goal in your own words'
                        : 'Be specific and make it meaningful to you'
                      }
                    </p>
                  </div>

                  <div className="space-y-4">
                    {isCustomGoal ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-electric-orange mb-4">
                          <Lightbulb className="h-5 w-5" />
                          <span className="font-inter text-sm font-semibold">Custom Goal</span>
                        </div>
                        <textarea
                          value={customGoalTitle}
                          onChange={(e) => setCustomGoalTitle(e.target.value)}
                          placeholder="Describe your goal in detail... (e.g., 'Learn to play guitar and perform at an open mic night')"
                          rows={4}
                          className="w-full bg-soft-purple-gray text-snow-white border border-warm-gold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-electric-orange transition-all duration-200 resize-none"
                        />
                        <div className="bg-digital-teal/20 border border-digital-teal rounded-xl p-4">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">💡</div>
                            <div>
                              <h4 className="font-space-grotesk font-semibold text-snow-white mb-2">
                                Tips for a Great Custom Goal:
                              </h4>
                              <ul className="font-inter text-sm text-snow-white/90 space-y-1">
                                <li>• Be specific about what you want to achieve</li>
                                <li>• Make it measurable so you know when you've succeeded</li>
                                <li>• Ensure it's meaningful and personally important to you</li>
                                <li>• Consider the time and resources you'll need</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={goalTitle}
                          onChange={(e) => setGoalTitle(e.target.value)}
                          placeholder="Enter your goal..."
                          className="w-full bg-soft-purple-gray text-snow-white border border-warm-gold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-electric-orange transition-all duration-200"
                        />

                        {selectedCategoryData && goalSuggestions[selectedCategory as keyof typeof goalSuggestions] && (
                          <div className="space-y-3">
                            <p className="font-inter text-sm text-snow-white/80">
                              Need inspiration? Try these {selectedCategoryData.label.toLowerCase()} goals:
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {goalSuggestions[selectedCategory as keyof typeof goalSuggestions].slice(0, 4).map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => setGoalTitle(suggestion)}
                                  className="text-left p-3 bg-soft-purple-gray/50 rounded-xl hover:bg-soft-purple-gray transition-colors text-snow-white/90 hover:text-snow-white"
                                >
                                  <span className="text-sm">{selectedCategoryData.icon} {suggestion}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h3 className="font-space-grotesk font-bold text-xl text-snow-white">
                      Pick an Emoji
                    </h3>
                    <p className="font-inter text-snow-white/80">
                      Choose an emoji that represents your goal
                    </p>
                  </div>

                  <div className="grid grid-cols-6 gap-3">
                    {emojis.map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all duration-200 text-2xl",
                          selectedEmoji === emoji
                            ? "border-electric-orange bg-electric-orange/10"
                            : "border-soft-purple-gray bg-soft-purple-gray hover:border-warm-gold"
                        )}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>

                  <div className="text-center p-4 bg-soft-purple-gray rounded-xl">
                    <p className="font-inter text-snow-white/80 mb-2">Preview:</p>
                    <div className="text-xl">
                      {selectedEmoji} {isCustomGoal ? customGoalTitle : goalTitle}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h3 className="font-space-grotesk font-bold text-xl text-snow-white">
                      Set a Deadline
                    </h3>
                    <p className="font-inter text-snow-white/80">
                      When do you want to achieve this goal?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-inter h-12 bg-soft-purple-gray border-warm-gold text-snow-white hover:bg-soft-purple-gray/80",
                            !deadline && "text-snow-white/60"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-electric-orange" />
                          {deadline ? format(deadline, "PPP") : "Pick a deadline"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={deadline}
                          onSelect={(date) => {
                            setDeadline(date);
                            setCalendarOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {deadline && (
                      <div className="text-center p-4 bg-gradient-to-r from-digital-teal/20 to-electric-orange/20 rounded-xl border border-electric-orange">
                        <p className="font-inter text-snow-white/80 mb-2">Goal Summary:</p>
                        <div className="space-y-1">
                          <div className="text-xl font-space-grotesk font-bold text-snow-white">
                            {selectedEmoji} {isCustomGoal ? customGoalTitle : goalTitle}
                          </div>
                          <div className="text-sm text-electric-orange">
                            Deadline: {format(deadline, "MMMM d, yyyy")}
                          </div>
                          <div className="text-sm text-digital-teal">
                            Category: {selectedCategoryData?.label}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
                className="btn-secondary"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="btn-primary"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreateGoal}
                  disabled={!canProceed()}
                  className="btn-primary"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Goal
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}