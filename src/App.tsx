import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CalculatorSection from '@/components/CalculatorSection';
import HabitAnalyzerSection from '@/components/HabitAnalyzerSection';
import RealLifeTimeSection from '@/components/RealLifeTimeSection';
import GoalManagementSection from '@/components/GoalManagementSection';
import WhatIfSimulatorSection from '@/components/WhatIfSimulatorSection';
import FinalSummaryReport from '@/components/FinalSummaryReport';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import TickBot from '@/components/TickBot';
import { Toaster } from 'sonner';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [userProfile, setUserProfile] = useState({
    hasCompletedSetup: false,
    birthDate: null as Date | null,
    lifespan: 80,
    habits: {
      sleeping: 8,
      scrolling: 3,
      eating: 2,
      working: 8,
      netflix: 2,
      commuting: 1,
    },
    optimizedHabits: {
      sleeping: 8,
      scrolling: 3,
      eating: 2,
      working: 8,
      netflix: 2,
      commuting: 1,
    },
    goalsCreated: 0
  });

  // Load user profile from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`tickticklife-profile-${user.id}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        // Convert birthDate string back to Date object
        if (profile.birthDate) {
          profile.birthDate = new Date(profile.birthDate);
        }
        setUserProfile(profile);
      }
    }
  }, [user]);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    if (user && userProfile.hasCompletedSetup) {
      localStorage.setItem(`tickticklife-profile-${user.id}`, JSON.stringify(userProfile));
    }
  }, [user, userProfile]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-charcoal flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-orange mx-auto"></div>
          <p className="text-snow-white/80">Loading TickTickLife...</p>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage />;
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    
    // Scroll to section or handle page navigation
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    if (userProfile.hasCompletedSetup) {
      // If user has completed setup, take them to goal management
      setCurrentPage('goal-management');
      setTimeout(() => {
        const goalElement = document.getElementById('goal-management');
        if (goalElement) {
          goalElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If first time user, start with calculator
      setCurrentPage('calculator');
      setTimeout(() => {
        const calculatorElement = document.getElementById('calculator');
        if (calculatorElement) {
          calculatorElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleCalculatorComplete = (birthDate: Date, lifespan: number, habits: any) => {
    const updatedProfile = {
      ...userProfile,
      birthDate,
      lifespan,
      habits: { ...userProfile.habits, ...habits },
      optimizedHabits: { ...userProfile.habits, ...habits },
      hasCompletedSetup: true
    };
    setUserProfile(updatedProfile);
    
    // Auto-navigate to habit analyzer
    setCurrentPage('habit-analyzer');
    setTimeout(() => {
      const habitAnalyzerElement = document.getElementById('habit-analyzer');
      if (habitAnalyzerElement) {
        habitAnalyzerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleHabitAnalysis = (detailedHabits: any) => {
    const updatedProfile = {
      ...userProfile,
      habits: detailedHabits,
      optimizedHabits: detailedHabits
    };
    setUserProfile(updatedProfile);
    
    // Auto-navigate to real life time
    setCurrentPage('real-life-time');
    setTimeout(() => {
      const realLifeTimeElement = document.getElementById('real-life-time');
      if (realLifeTimeElement) {
        realLifeTimeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRealLifeTimeComplete = () => {
    setCurrentPage('goal-management');
    setTimeout(() => {
      const goalManagementElement = document.getElementById('goal-management');
      if (goalManagementElement) {
        goalManagementElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleGoalManagementComplete = () => {
    setCurrentPage('what-if-simulator');
    setTimeout(() => {
      const whatIfSimulatorElement = document.getElementById('what-if-simulator');
      if (whatIfSimulatorElement) {
        whatIfSimulatorElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSimulatorComplete = (finalOptimizedHabits: any, totalGoals: number) => {
    const updatedProfile = {
      ...userProfile,
      optimizedHabits: finalOptimizedHabits,
      goalsCreated: totalGoals
    };
    setUserProfile(updatedProfile);
    
    setCurrentPage('final-summary');
    setTimeout(() => {
      const finalSummaryElement = document.getElementById('final-summary');
      if (finalSummaryElement) {
        finalSummaryElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Calculate conscious years for goal management
  const calculateConsciousYears = () => {
    if (!userProfile.birthDate) return 0;
    
    const currentAge = new Date().getFullYear() - userProfile.birthDate.getFullYear();
    const remainingYears = userProfile.lifespan - currentAge;
    
    const calculateYearsSpent = (dailyHours: number) => {
      return (dailyHours * 365 * remainingYears) / (24 * 365);
    };

    const totalUsedYears = Object.values(userProfile.habits).reduce((sum, hours) => 
      sum + calculateYearsSpent(hours), 0
    );
    
    return Math.max(0, remainingYears - totalUsedYears);
  };

  // Calculate time reclaimed
  const calculateTimeReclaimed = () => {
    if (!userProfile.birthDate) return 0;
    
    const currentAge = new Date().getFullYear() - userProfile.birthDate.getFullYear();
    const remainingYears = userProfile.lifespan - currentAge;
    
    const calculateYearsSpent = (dailyHours: number) => {
      return (dailyHours * 365 * remainingYears) / (24 * 365);
    };

    const originalConsciousTime = Math.max(0, remainingYears - Object.values(userProfile.habits).reduce((sum, hours) => 
      sum + calculateYearsSpent(hours), 0
    ));

    const optimizedConsciousTime = Math.max(0, remainingYears - Object.values(userProfile.optimizedHabits).reduce((sum, hours) => 
      sum + calculateYearsSpent(hours), 0
    ));

    return optimizedConsciousTime - originalConsciousTime;
  };

  // Prepare TickBot user profile data
  const tickBotProfile = userProfile.hasCompletedSetup ? {
    birthDate: userProfile.birthDate,
    lifespan: userProfile.lifespan,
    habits: userProfile.habits,
    consciousYears: calculateConsciousYears()
  } : undefined;

  // Render final summary if that's the current page
  if (currentPage === 'final-summary' && userProfile.birthDate) {
    return (
      <div className="min-h-screen">
        <Navbar 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
          userHasCompletedSetup={userProfile.hasCompletedSetup}
        />
        <div id="final-summary" className="pt-20">
          <FinalSummaryReport
            birthDate={userProfile.birthDate}
            lifeExpectancy={userProfile.lifespan}
            originalHabits={userProfile.habits}
            optimizedHabits={userProfile.optimizedHabits}
            goalsCreated={userProfile.goalsCreated}
            timeReclaimed={calculateTimeReclaimed()}
          />
        </div>
        <TickBot userProfile={tickBotProfile} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        userHasCompletedSetup={userProfile.hasCompletedSetup}
      />
      
      {/* Main content based on current page */}
      <div>
        {currentPage === 'home' && (
          <div id="home">
            <HeroSection 
              onGetStarted={handleGetStarted}
              isReturningUser={userProfile.hasCompletedSetup}
            />
          </div>
        )}
        
        {currentPage === 'calculator' && (
          <div id="calculator" className="pt-20">
            <CalculatorSection onComplete={handleCalculatorComplete} />
          </div>
        )}
        
        {currentPage === 'habit-analyzer' && (
          <div id="habit-analyzer" className="pt-20">
            <HabitAnalyzerSection onAnalyze={handleHabitAnalysis} />
          </div>
        )}
        
        {currentPage === 'real-life-time' && userProfile.birthDate && (
          <div id="real-life-time" className="pt-20">
            <RealLifeTimeSection
              birthDate={userProfile.birthDate}
              lifeExpectancy={userProfile.lifespan}
              habits={userProfile.habits}
              onComplete={handleRealLifeTimeComplete}
            />
          </div>
        )}

        {currentPage === 'goal-management' && userProfile.birthDate && (
          <div id="goal-management" className="pt-20">
            <GoalManagementSection
              birthDate={userProfile.birthDate}
              lifeExpectancy={userProfile.lifespan}
              consciousYears={calculateConsciousYears()}
              onComplete={handleGoalManagementComplete}
            />
          </div>
        )}

        {currentPage === 'what-if-simulator' && userProfile.birthDate && (
          <div id="what-if-simulator" className="pt-20">
            <WhatIfSimulatorSection
              birthDate={userProfile.birthDate}
              lifeExpectancy={userProfile.lifespan}
              originalHabits={userProfile.habits}
              onComplete={handleSimulatorComplete}
            />
          </div>
        )}

        {/* About Section */}
        {currentPage === 'about' && (
          <div id="about" className="pt-20">
            <AboutSection />
          </div>
        )}

        {/* Contact Section */}
        {currentPage === 'contact' && (
          <div id="contact" className="pt-20">
            <ContactSection />
          </div>
        )}

        {/* Show setup prompt for new users who try to access features */}
        {!userProfile.hasCompletedSetup && ['habit-analyzer', 'real-life-time', 'goal-management', 'what-if-simulator'].includes(currentPage) && (
          <div className="min-h-screen bg-dark-charcoal flex items-center justify-center px-6">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="text-6xl mb-6">⏰</div>
              <h2 className="font-space-grotesk font-bold text-3xl text-snow-white">
                Complete Your Setup First
              </h2>
              <p className="font-inter text-lg text-snow-white/80">
                To access this feature, you need to complete your initial life clock calculation. 
                This helps us personalize your experience and provide accurate insights.
              </p>
              <button
                onClick={() => setCurrentPage('calculator')}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Life Clock Setup
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* TickBot - Always visible */}
      <TickBot userProfile={tickBotProfile} />
      
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;