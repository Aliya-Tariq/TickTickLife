import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RotateCcw, Brain, Clock, Sparkles, Quote, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface TickBotProps {
  userProfile?: {
    birthDate?: Date;
    lifespan?: number;
    habits?: any;
    consciousYears?: number;
  };
}

const motivationalQuotes = [
  "The bad news is time flies. The good news is you're the pilot.",
  "Lost time is never found again. - Benjamin Franklin",
  "The future is something you create in the present.",
  "Time is what we want most, but what we use worst. - William Penn",
  "Yesterday is gone. Tomorrow has not yet come. We have only today.",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  "Don't wait. The time will never be just right. - Napoleon Hill",
  "Time flies over us, but leaves its shadow behind. - Nathaniel Hawthorne",
  "The trouble is, you think you have time. - Buddha",
  "Every moment is a fresh beginning. - T.S. Eliot"
];

const goalSuggestions = [
  { activity: 'Learn a new language', timeframe: 'in 6 months', impact: '+2 years of cognitive health' },
  { activity: 'Run a 5K', timeframe: 'in 3 months', impact: '+1.5 years of life expectancy' },
  { activity: 'Read 24 books', timeframe: 'this year', impact: '+3 years of wisdom' },
  { activity: 'Learn to cook', timeframe: 'in 2 months', impact: '+2 years of health benefits' },
  { activity: 'Start meditating daily', timeframe: 'starting today', impact: '+4 years of mental clarity' },
  { activity: 'Take a photography course', timeframe: 'in 4 months', impact: '+5 years of creative fulfillment' }
];

export default function TickBot({ userProfile }: TickBotProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuoteOfWeek, setShowQuoteOfWeek] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark') ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkMode);
    };

    checkDarkMode();
    window.addEventListener('storage', checkDarkMode);
    return () => window.removeEventListener('storage', checkDarkMode);
  }, []);

  // Auto-scroll to bottom only when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Initialize with welcome message only when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage();
      addBotMessage(welcomeMessage);
    }
  }, [isOpen]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Hey there!';
    
    if (hour < 12) greeting = 'Good morning!';
    else if (hour < 18) greeting = 'Good afternoon!';
    else greeting = 'Good evening!';

    if (user && userProfile?.consciousYears) {
      return `${greeting} I'm TickBot ⏳ Welcome back! You have ${userProfile.consciousYears.toFixed(1)} conscious years left. Ready to make them count? I can help you analyze habits, suggest goals, or just talk about time awareness.`;
    }

    return `${greeting} I'm TickBot ⏳ Your personal time awareness expert! Ready to reflect on time today? I can help you analyze your habits, suggest goal ideas, calculate time lost, or just talk about life's clock.`;
  };

  const addBotMessage = (content: string, delay = 1000) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
  };

  const calculateTimeImpact = (activity: string, hoursPerDay: number) => {
    const lifespan = userProfile?.lifespan || 80;
    const currentAge = userProfile?.birthDate 
      ? new Date().getFullYear() - userProfile.birthDate.getFullYear()
      : 30;
    const remainingYears = lifespan - currentAge;
    const yearsSpent = (hoursPerDay * 365 * remainingYears) / (24 * 365);
    
    return yearsSpent;
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Time loss analysis
    if (lowerInput.includes('scroll') || lowerInput.includes('phone') || lowerInput.includes('social media')) {
      const hours = extractHours(input);
      if (hours) {
        const yearsLost = calculateTimeImpact('scrolling', hours);
        return `Whoa 😲 That's ${yearsLost.toFixed(1)} years of scrolling over your remaining lifetime! That's ${(yearsLost * 365).toFixed(0)} days. Want help reducing it? Try the "15-minute phone-free morning" challenge 📱➡️🌅`;
      }
      return "Scrolling can be a real time thief! 📱 Tell me how many hours you spend daily and I'll calculate the lifetime impact. For example, try saying 'I scroll 4 hours daily'.";
    }

    if (lowerInput.includes('netflix') || lowerInput.includes('tv') || lowerInput.includes('watch')) {
      const hours = extractHours(input);
      if (hours) {
        const yearsLost = calculateTimeImpact('watching', hours);
        return `That's ${yearsLost.toFixed(1)} years of your life spent watching! 📺 While entertainment has value, imagine what you could create with even half that time. Maybe try the "one episode rule" - watch one, then do something active! 🎯`;
      }
      return "Entertainment is important for relaxation, but balance is key! How many hours do you spend watching daily? I'll show you the lifetime math.";
    }

    // Goal suggestions
    if (lowerInput.includes('goal') || lowerInput.includes('suggest') || lowerInput.includes('idea')) {
      const suggestion = goalSuggestions[Math.floor(Math.random() * goalSuggestions.length)];
      return `Here's a time-worthy goal: "${suggestion.activity}" ${suggestion.timeframe}! 🎯 This could give you ${suggestion.impact}. Remember: every goal you achieve is time invested in your future self. What resonates with you?`;
    }

    // Motivational support
    if (lowerInput.includes('stress') || lowerInput.includes('anxious') || lowerInput.includes('overwhelm') || lowerInput.includes('behind')) {
      return "You're not behind. You're exactly where you're supposed to restart 🧘 Time anxiety is real, but remember: you can't control time, only your relationship with it. Take a deep breath. Every tiny change buys your future self more life. What's one small win you can achieve today?";
    }

    if (lowerInput.includes('tired') || lowerInput.includes('exhausted') || lowerInput.includes('burnout')) {
      return "Feeling drained? That's your body and mind asking for conscious rest 😴 Quality sleep isn't time lost - it's time invested. Try this: instead of scrolling before bed, try 10 minutes of reflection. Your future self will thank you with better energy! 💪";
    }

    // Quote request
    if (lowerInput.includes('quote') || lowerInput.includes('inspiration') || lowerInput.includes('motivate')) {
      const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      return `✨ "${quote}" ✨\n\nLet this sink in for a moment. Time is your most precious currency - spend it on what truly matters to you.`;
    }

    // Time left query
    if (lowerInput.includes('time left') || lowerInput.includes('how much time')) {
      if (userProfile?.consciousYears) {
        return `Based on your profile, you have approximately ${userProfile.consciousYears.toFixed(1)} years of conscious living time remaining ⏰ That's ${(userProfile.consciousYears * 365).toFixed(0)} days or ${(userProfile.consciousYears * 8760).toFixed(0)} hours. The question isn't how much time you have, but how consciously you'll live it! 🌟`;
      }
      return "To calculate your remaining conscious time, you'll need to complete your life clock setup first! Head to the calculator section and I'll be able to give you personalized insights. ⏰";
    }

    // Progress tracking
    if (lowerInput.includes('progress') || lowerInput.includes('stats') || lowerInput.includes('how am i doing')) {
      if (userProfile?.consciousYears) {
        return `You're doing great! 🎉 You've gained awareness of your ${userProfile.consciousYears.toFixed(1)} conscious years. That's already a huge win! Most people never even think about this. Keep building momentum - every conscious choice compounds over time. 📈`;
      }
      return "Progress starts with awareness, and you're here talking to me - that's already progress! 🌱 Complete your time analysis to track specific improvements. Remember: you don't need to change everything, just one small win today.";
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! 🤔 Tell me more about your relationship with time. What's your biggest time challenge right now?",
      "I hear you! Time awareness is a journey, not a destination. What aspect of your daily routine feels most unconscious to you? 🕰️",
      "Every conversation about time is valuable! 💭 Want to explore a specific habit or goal? I'm here to help you live more consciously.",
      "Thanks for sharing! 🙏 Remember: small changes in daily habits can give you years of life back. What would you do with an extra year?",
      "Interesting perspective! ⭐ Time is our most democratic resource - everyone gets 24 hours. The magic is in how consciously we use them."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const extractHours = (text: string): number | null => {
    const hourPatterns = [
      /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)/i,
      /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\s*(?:daily|per day|a day)/i,
      /(\d+(?:\.\d+)?)\s*(?:daily|per day|a day)/i
    ];

    for (const pattern of hourPatterns) {
      const match = text.match(pattern);
      if (match) {
        const hours = parseFloat(match[1]);
        if (hours >= 0 && hours <= 24) {
          return hours;
        }
      }
    }
    return null;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    const response = processUserInput(inputValue);
    addBotMessage(response);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    const welcomeMessage = getWelcomeMessage();
    addBotMessage(welcomeMessage, 500);
  };

  const showRandomQuote = () => {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    addBotMessage(`✨ Quote of the Week ✨\n\n"${quote}"\n\nTake a moment to reflect on this. How does it apply to your current relationship with time?`);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring", stiffness: 200 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className={cn(
                "relative w-16 h-16 rounded-full shadow-lg transition-all duration-300",
                "bg-gradient-to-r from-electric-orange to-warm-gold",
                "hover:shadow-xl hover:shadow-electric-orange/25",
                "flex items-center justify-center group"
              )}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-electric-orange/30"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Icon with typing animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <Brain className="h-7 w-7 text-dark-charcoal" />
              </motion.div>

              {/* Notification dot */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-digital-teal rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-dark-charcoal text-snow-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                  Chat with TickBot ⏳
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-charcoal" />
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
          >
            <div className={cn(
              "h-full rounded-3xl shadow-2xl border backdrop-blur-md overflow-hidden flex flex-col",
              isDarkMode 
                ? "bg-dark-charcoal/95 border-soft-purple-gray/30" 
                : "bg-snow-white/95 border-gray-200/30"
            )}>
              {/* Header - Fixed */}
              <div className="flex items-center justify-between p-4 border-b border-snow-white/10 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-10 h-10 bg-gradient-to-r from-electric-orange to-warm-gold rounded-full flex items-center justify-center"
                  >
                    <Brain className="h-5 w-5 text-dark-charcoal" />
                  </motion.div>
                  <div>
                    <h3 className={cn(
                      "font-space-grotesk font-bold text-lg",
                      isDarkMode ? "text-snow-white" : "text-dark-charcoal"
                    )}>
                      TickBot
                    </h3>
                    <p className="text-xs text-electric-orange">
                      Your Time Awareness Expert
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={showRandomQuote}
                    variant="ghost"
                    size="sm"
                    className="text-snow-white/70 hover:text-snow-white hover:bg-soft-purple-gray/50 w-8 h-8 p-0"
                    title="Get a motivational quote"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={clearChat}
                    variant="ghost"
                    size="sm"
                    className="text-snow-white/70 hover:text-snow-white hover:bg-soft-purple-gray/50 w-8 h-8 p-0"
                    title="Clear chat"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-snow-white/70 hover:text-snow-white hover:bg-soft-purple-gray/50 w-8 h-8 p-0"
                    title="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                      message.type === 'user'
                        ? "bg-electric-orange text-dark-charcoal ml-4"
                        : isDarkMode
                        ? "bg-soft-purple-gray text-snow-white mr-4"
                        : "bg-gray-100 text-dark-charcoal mr-4"
                    )}>
                      <div className="whitespace-pre-wrap font-inter">
                        {message.content}
                      </div>
                      <div className={cn(
                        "text-xs mt-2 opacity-70",
                        message.type === 'user' ? "text-dark-charcoal/70" : "text-snow-white/70"
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className={cn(
                      "rounded-2xl px-4 py-3 mr-4",
                      isDarkMode ? "bg-soft-purple-gray" : "bg-gray-100"
                    )}>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-electric-orange rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input - Fixed */}
              <div className="p-4 border-t border-snow-white/10 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about time, habits, or goals..."
                    className={cn(
                      "flex-1 rounded-xl px-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-electric-orange transition-all duration-200",
                      isDarkMode
                        ? "bg-dark-charcoal/50 border-snow-white/20 text-snow-white placeholder-snow-white/50"
                        : "bg-white border-gray-200 text-dark-charcoal placeholder-gray-500"
                    )}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-electric-orange hover:bg-electric-orange/90 text-dark-charcoal p-2 rounded-xl disabled:opacity-50 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Privacy notice */}
                <p className="text-xs text-snow-white/50 mt-2 text-center">
                  I'm an AI assistant. Your data stays private and secure.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}