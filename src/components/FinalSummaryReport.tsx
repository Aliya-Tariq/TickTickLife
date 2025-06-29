import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Calendar, Moon, Sun, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface FinalSummaryReportProps {
  birthDate: Date;
  lifeExpectancy: number;
  originalHabits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
  optimizedHabits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
  goalsCreated: number;
  timeReclaimed: number;
}

export default function FinalSummaryReport({
  birthDate,
  lifeExpectancy,
  originalHabits,
  optimizedHabits,
  goalsCreated,
  timeReclaimed
}: FinalSummaryReportProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  const currentAge = new Date().getFullYear() - birthDate.getFullYear();
  const remainingYears = lifeExpectancy - currentAge;

  const calculateYearsSpent = (dailyHours: number) => {
    return (dailyHours * 365 * remainingYears) / (24 * 365);
  };

  const originalConsciousTime = Math.max(0, remainingYears - Object.values(originalHabits).reduce((sum, hours) => 
    sum + calculateYearsSpent(hours), 0
  ));

  const optimizedConsciousTime = Math.max(0, remainingYears - Object.values(optimizedHabits).reduce((sum, hours) => 
    sum + calculateYearsSpent(hours), 0
  ));

  const consciousnessImprovement = ((optimizedConsciousTime / originalConsciousTime) - 1) * 100;

  const motivationalQuotes = [
    "The bad news is time flies. The good news is you're the pilot.",
    "Lost time is never found again. - Benjamin Franklin",
    "The future is something you create in the present.",
    "Time is what we want most, but what we use worst. - William Penn",
    "Yesterday is gone. Tomorrow has not yet come. We have only today.",
    "Time is the most valuable thing we have, because it is the most irrevocable.",
    "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    "Don't wait. The time will never be just right. - Napoleon Hill",
    "Time flies over us, but leaves its shadow behind. - Nathaniel Hawthorne",
    "The trouble is, you think you have time. - Buddha"
  ];

  const [currentQuote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('tickticklife-darkmode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const savedReminder = localStorage.getItem('tickticklife-reminder');
    if (savedReminder) {
      setReminderSet(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('tickticklife-darkmode', JSON.stringify(newMode));
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('summary-report');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: darkMode ? '#181818' : '#ffffff',
        scale: 2,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = 'tickticklife-summary.png';
      link.href = canvas.toDataURL();
      link.click();

      toast.success('Summary image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('summary-report');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: darkMode ? '#181818' : '#ffffff',
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('tickticklife-summary.pdf');
      toast.success('Summary PDF downloaded!');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handleShare = async () => {
    const shareText = `🧠 I just completed my TickTickLife analysis and discovered I can reclaim ${timeReclaimed.toFixed(1)} years of conscious living time! 

📊 My Results:
• ${originalConsciousTime.toFixed(1)} → ${optimizedConsciousTime.toFixed(1)} conscious years
• ${consciousnessImprovement.toFixed(0)}% improvement in life awareness
• ${goalsCreated} meaningful goals created

Time is precious. Calculate yours at TickTickLife! ⏰

#TimeAwareness #LifeOptimization #ConsciousLiving #TickTickLife`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My TickTickLife Summary',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Summary copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share summary');
    }
  };

  const setWeeklyReminder = () => {
    const reminderData = {
      enabled: true,
      day: 'Monday',
      time: '10:00',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('tickticklife-reminder', JSON.stringify(reminderData));
    setReminderSet(true);
    toast.success('Weekly reminder set for Mondays at 10 AM!');
  };

  const getAchievementLevel = () => {
    if (timeReclaimed >= 5) return { level: 'Time Master', icon: '🏆', color: '#FFD700' };
    if (timeReclaimed >= 3) return { level: 'Life Optimizer', icon: '⭐', color: '#FFA500' };
    if (timeReclaimed >= 1) return { level: 'Awareness Seeker', icon: '💡', color: '#18C3B9' };
    return { level: 'Time Explorer', icon: '🔍', color: '#4CAF50' };
  };

  const achievement = getAchievementLevel();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-dark-charcoal' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end">
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
              darkMode 
                ? 'bg-soft-purple-gray text-snow-white' 
                : 'bg-white text-dark-charcoal border border-gray-200'
            }`}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="font-inter text-sm">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </motion.button>
        </div>

        {/* Main Summary Report */}
        <motion.div
          id="summary-report"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl p-8 shadow-2xl ${
            darkMode ? 'bg-soft-purple-gray' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-6xl"
            >
              🧠
            </motion.div>
            <h1 className={`font-space-grotesk font-bold text-3xl ${
              darkMode ? 'text-snow-white' : 'text-dark-charcoal'
            }`}>
              Your Life Awareness Summary
            </h1>
            <p className={`font-inter text-lg ${
              darkMode ? 'text-snow-white/80' : 'text-gray-600'
            }`}>
              Here's how you've transformed your relationship with time
            </p>
          </div>

          {/* Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div 
              className="flex items-center space-x-3 px-6 py-3 rounded-2xl border-2"
              style={{ 
                borderColor: achievement.color,
                backgroundColor: `${achievement.color}20`
              }}
            >
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <div 
                  className="font-space-grotesk font-bold text-lg"
                  style={{ color: achievement.color }}
                >
                  {achievement.level}
                </div>
                <div className={`font-inter text-sm ${
                  darkMode ? 'text-snow-white/70' : 'text-gray-600'
                }`}>
                  Achievement Unlocked!
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: '💡',
                label: 'Time Reclaimed',
                value: `${timeReclaimed.toFixed(1)} years`,
                color: '#4CAF50',
                description: 'Extra conscious living time'
              },
              {
                icon: '📈',
                label: 'Awareness Boost',
                value: `${consciousnessImprovement.toFixed(0)}%`,
                color: '#18C3B9',
                description: 'Improvement in life consciousness'
              },
              {
                icon: '🎯',
                label: 'Goals Created',
                value: goalsCreated.toString(),
                color: '#FFA500',
                description: 'Meaningful objectives set'
              },
              {
                icon: '⏰',
                label: 'Conscious Years',
                value: `${optimizedConsciousTime.toFixed(1)}`,
                color: '#FF6B6B',
                description: 'Years of aware living ahead'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className={`rounded-2xl p-6 text-center ${
                  darkMode ? 'bg-dark-charcoal' : 'bg-gray-50'
                }`}
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div 
                  className="font-space-grotesk font-bold text-2xl mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className={`font-inter text-sm font-semibold mb-2 ${
                  darkMode ? 'text-snow-white' : 'text-dark-charcoal'
                }`}>
                  {stat.label}
                </div>
                <div className={`font-inter text-xs ${
                  darkMode ? 'text-snow-white/60' : 'text-gray-500'
                }`}>
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Before vs After Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className={`rounded-2xl p-6 mb-8 ${
              darkMode ? 'bg-dark-charcoal' : 'bg-gray-50'
            }`}
          >
            <h3 className={`font-space-grotesk font-bold text-xl mb-6 text-center ${
              darkMode ? 'text-snow-white' : 'text-dark-charcoal'
            }`}>
              Your Transformation Journey
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center space-y-3">
                <div className="text-2xl">😔</div>
                <h4 className={`font-space-grotesk font-semibold ${
                  darkMode ? 'text-snow-white' : 'text-dark-charcoal'
                }`}>
                  Before Optimization
                </h4>
                <div className="space-y-2">
                  <div className="text-2xl font-space-grotesk font-bold text-red-400">
                    {originalConsciousTime.toFixed(1)} years
                  </div>
                  <div className={`font-inter text-sm ${
                    darkMode ? 'text-snow-white/70' : 'text-gray-600'
                  }`}>
                    Conscious living time
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="text-2xl">🎉</div>
                <h4 className={`font-space-grotesk font-semibold ${
                  darkMode ? 'text-snow-white' : 'text-dark-charcoal'
                }`}>
                  After Optimization
                </h4>
                <div className="space-y-2">
                  <div className="text-2xl font-space-grotesk font-bold text-green-400">
                    {optimizedConsciousTime.toFixed(1)} years
                  </div>
                  <div className={`font-inter text-sm ${
                    darkMode ? 'text-snow-white/70' : 'text-gray-600'
                  }`}>
                    Conscious living time
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Insight Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="bg-gradient-to-r from-digital-teal/20 to-electric-orange/20 rounded-2xl p-6 border border-digital-teal mb-8"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h4 className={`font-space-grotesk font-bold text-lg mb-2 ${
                  darkMode ? 'text-snow-white' : 'text-dark-charcoal'
                }`}>
                  AI Insight
                </h4>
                <p className={`font-inter ${
                  darkMode ? 'text-snow-white/90' : 'text-gray-700'
                }`}>
                  {timeReclaimed > 2 
                    ? `Incredible! You've reclaimed ${timeReclaimed.toFixed(1)} years. That's enough time to learn 3 new languages, travel to 50 countries, or master 2 musical instruments. Your future self will thank you for these changes.`
                    : timeReclaimed > 0
                    ? `Great start! You've gained ${timeReclaimed.toFixed(1)} years back. Consider reducing screen time by just 30 more minutes daily to unlock even more conscious living time.`
                    : "Every small change matters. Even reducing one habit by 15 minutes daily can compound into significant life improvements over time."
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            onClick={handleShare}
            className="btn-primary flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share My Journey</span>
          </Button>

          <Button
            onClick={handleDownloadImage}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Image</span>
          </Button>

          <Button
            onClick={handleDownloadPDF}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>

          {!reminderSet && (
            <Button
              onClick={setWeeklyReminder}
              className="btn-secondary flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Set Weekly Reminder</span>
            </Button>
          )}

          <Button
            onClick={() => setShowQuote(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Inspire Me</span>
          </Button>
        </motion.div>

        {/* Quote Modal */}
        {showQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuote(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`max-w-md w-full rounded-3xl p-8 text-center ${
                darkMode ? 'bg-soft-purple-gray' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-4">💫</div>
              <h3 className={`font-space-grotesk font-bold text-xl mb-4 ${
                darkMode ? 'text-snow-white' : 'text-dark-charcoal'
              }`}>
                Quote of the Week
              </h3>
              <p className={`font-inter text-lg italic mb-6 ${
                darkMode ? 'text-snow-white/90' : 'text-gray-700'
              }`}>
                "{currentQuote}"
              </p>
              <Button
                onClick={() => setShowQuote(false)}
                className="btn-primary"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Final Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className={`text-center rounded-3xl p-8 ${
            darkMode ? 'bg-soft-purple-gray' : 'bg-white'
          }`}
        >
          <div className="text-4xl mb-4">🌟</div>
          <h2 className={`font-space-grotesk font-bold text-2xl mb-4 ${
            darkMode ? 'text-snow-white' : 'text-dark-charcoal'
          }`}>
            Your Journey Starts Now
          </h2>
          <p className={`font-inter text-lg mb-6 max-w-2xl mx-auto ${
            darkMode ? 'text-snow-white/80' : 'text-gray-600'
          }`}>
            You've gained awareness of your most precious resource: time. 
            Now it's up to you to turn these insights into reality. 
            Every moment is a chance to choose consciousness over autopilot.
          </p>
          <div className={`font-space-grotesk font-bold text-xl ${
            darkMode ? 'text-electric-orange' : 'text-digital-teal'
          }`}>
            Make every second count. ⏰
          </div>
        </motion.div>
      </div>
    </div>
  );
}