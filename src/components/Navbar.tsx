import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Zap, Info, Mail, ChevronDown, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ClockLogo from './ClockLogo';
import { User as UserType } from '@supabase/supabase-js';

interface NavbarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
  userHasCompletedSetup?: boolean;
  onLoginClick?: () => void;
  user?: UserType | null;
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home, href: '#home' },
  { 
    id: 'features', 
    label: 'Features', 
    icon: Zap, 
    href: '#features',
    submenu: [
      { id: 'calculator', label: 'Life Clock', href: '#calculator', requiresSetup: false },
      { id: 'habit-analyzer', label: 'Habit Analyzer', href: '#habit-analyzer', requiresSetup: true },
      { id: 'real-life-time', label: 'Time Reality', href: '#real-life-time', requiresSetup: true },
      { id: 'goal-management', label: 'Goal Manager', href: '#goal-management', requiresSetup: true },
      { id: 'what-if-simulator', label: 'What If?', href: '#what-if-simulator', requiresSetup: true },
      { id: 'final-summary', label: 'Summary', href: '#final-summary', requiresSetup: true }
    ]
  },
  { id: 'about', label: 'About', icon: Info, href: '#about' },
  { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' }
];

export default function Navbar({ 
  currentPage = 'home', 
  onPageChange, 
  userHasCompletedSetup = false,
  onLoginClick,
  user
}: NavbarProps) {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dark mode detection
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(event.target as Node)) {
        setIsOpen(false);
        setFeaturesDropdownOpen(false);
        setUserDropdownOpen(false);
        setMobileSubmenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavClick = (itemId: string, href?: string) => {
    setIsOpen(false);
    setFeaturesDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileSubmenuOpen(false);
    
    // Handle navigation
    if (onPageChange) {
      onPageChange(itemId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string, href?: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavClick(itemId, href);
    }
  };

  const handleFeaturesClick = () => {
    if (window.innerWidth >= 768) {
      setFeaturesDropdownOpen(!featuresDropdownOpen);
    } else {
      setMobileSubmenuOpen(!mobileSubmenuOpen);
    }
  };

  const handleSubmenuClick = (subItem: { id: string; href: string; requiresSetup?: boolean }) => {
    // Check if feature requires setup and user hasn't completed it
    if (subItem.requiresSetup && !userHasCompletedSetup) {
      // Show a toast or redirect to setup
      if (onPageChange) {
        onPageChange('calculator');
      }
      return;
    }
    
    handleNavClick(subItem.id, subItem.href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isFeatureActive = (submenuId: string) => {
    const featuresItem = navigationItems.find(item => item.id === 'features');
    return featuresItem?.submenu?.some(sub => sub.id === submenuId && currentPage === submenuId);
  };

  const isFeaturesActive = currentPage === 'features' || 
    navigationItems.find(item => item.id === 'features')?.submenu?.some(sub => sub.id === currentPage);

  return (
    <motion.nav
      id="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "relative rounded-2xl transition-all duration-300 backdrop-blur-md",
            isDarkMode 
              ? "bg-dark-charcoal/90 border border-soft-purple-gray/30" 
              : "bg-snow-white/90 border border-gray-200/30",
            scrolled 
              ? "shadow-lg shadow-black/10" 
              : "shadow-md shadow-black/5"
          )}
        >
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavClick('home')}
              onKeyDown={(e) => handleKeyDown(e, 'home')}
              tabIndex={0}
              role="button"
              aria-label="Go to homepage"
            >
              <ClockLogo size="md" animated={true} />
              <h1 className={cn(
                "text-xl font-space-grotesk font-bold transition-colors",
                isDarkMode ? "text-snow-white" : "text-dark-charcoal"
              )}>
                TickTickLife
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id || (item.id === 'features' && isFeaturesActive);
                
                if (item.submenu) {
                  return (
                    <div key={item.id} className="relative" ref={dropdownRef}>
                      <motion.button
                        onClick={handleFeaturesClick}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleFeaturesClick();
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "relative flex items-center space-x-2 px-4 py-2 rounded-xl font-inter font-medium text-base transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-offset-2",
                          isDarkMode ? "focus:ring-offset-dark-charcoal" : "focus:ring-offset-snow-white",
                          isActive
                            ? "text-digital-teal bg-digital-teal/10"
                            : isDarkMode
                            ? "text-snow-white/80 hover:text-digital-teal hover:bg-soft-purple-gray/50"
                            : "text-dark-charcoal/80 hover:text-digital-teal hover:bg-gray-100/50"
                        )}
                        aria-expanded={featuresDropdownOpen}
                        aria-haspopup="true"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{item.label}</span>
                        <motion.div
                          animate={{ rotate: featuresDropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-digital-teal rounded-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>

                      {/* Desktop Dropdown */}
                      <AnimatePresence>
                        {featuresDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={cn(
                              "absolute top-full left-0 mt-2 w-48 rounded-xl shadow-lg backdrop-blur-md border z-50",
                              isDarkMode 
                                ? "bg-dark-charcoal/95 border-soft-purple-gray/30" 
                                : "bg-snow-white/95 border-gray-200/30"
                            )}
                          >
                            <div className="py-2">
                              {item.submenu.map((subItem, index) => {
                                const isDisabled = subItem.requiresSetup && !userHasCompletedSetup;
                                
                                return (
                                  <motion.button
                                    key={subItem.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    onClick={() => handleSubmenuClick(subItem)}
                                    disabled={isDisabled}
                                    className={cn(
                                      "w-full text-left px-4 py-2 font-inter text-sm transition-all duration-200",
                                      "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-inset",
                                      isDisabled
                                        ? "text-snow-white/40 cursor-not-allowed"
                                        : isFeatureActive(subItem.id)
                                        ? "text-digital-teal bg-digital-teal/10 font-medium"
                                        : isDarkMode
                                        ? "text-snow-white/80 hover:text-digital-teal hover:bg-soft-purple-gray/50"
                                        : "text-dark-charcoal/80 hover:text-digital-teal hover:bg-gray-100/50"
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{subItem.label}</span>
                                      {isDisabled && (
                                        <span className="text-xs text-electric-orange">Setup Required</span>
                                      )}
                                      {!isDisabled && isFeatureActive(subItem.id) && (
                                        <div className="w-2 h-2 bg-digital-teal rounded-full" />
                                      )}
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.href)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, item.href)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative flex items-center space-x-2 px-4 py-2 rounded-xl font-inter font-medium text-base transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-offset-2",
                      isDarkMode ? "focus:ring-offset-dark-charcoal" : "focus:ring-offset-snow-white",
                      isActive
                        ? "text-digital-teal bg-digital-teal/10"
                        : isDarkMode
                        ? "text-snow-white/80 hover:text-digital-teal hover:bg-soft-purple-gray/50"
                        : "text-dark-charcoal/80 hover:text-digital-teal hover:bg-gray-100/50"
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-digital-teal rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}

              {/* User Menu */}
              {user ? (
                <div className="relative ml-4">
                  <motion.button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-offset-2",
                      isDarkMode ? "focus:ring-offset-dark-charcoal" : "focus:ring-offset-snow-white",
                      isDarkMode
                        ? "text-snow-white/80 hover:text-digital-teal hover:bg-soft-purple-gray/50"
                        : "text-dark-charcoal/80 hover:text-digital-teal hover:bg-gray-100/50"
                    )}
                  >
                    <User className="h-4 w-4" />
                    <ChevronDown className="h-3 w-3" />
                  </motion.button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={cn(
                          "absolute top-full right-0 mt-2 w-48 rounded-xl shadow-lg backdrop-blur-md border z-50",
                          isDarkMode 
                            ? "bg-dark-charcoal/95 border-soft-purple-gray/30" 
                            : "bg-snow-white/95 border-gray-200/30"
                        )}
                      >
                        <div className="py-2">
                          <div className="px-4 py-2 border-b border-snow-white/10">
                            <p className="font-inter text-sm text-snow-white/80">
                              {user.email}
                            </p>
                          </div>
                          <button
                            onClick={handleSignOut}
                            className={cn(
                              "w-full text-left px-4 py-2 font-inter text-sm transition-all duration-200 flex items-center space-x-2",
                              "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-inset",
                              isDarkMode
                                ? "text-snow-white/80 hover:text-red-400 hover:bg-soft-purple-gray/50"
                                : "text-dark-charcoal/80 hover:text-red-400 hover:bg-gray-100/50"
                            )}
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  onClick={onLoginClick}
                  className="ml-4 btn-primary"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "md:hidden p-2 rounded-xl transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-offset-2",
                isDarkMode 
                  ? "text-snow-white hover:bg-soft-purple-gray/50 focus:ring-offset-dark-charcoal" 
                  : "text-dark-charcoal hover:bg-gray-100/50 focus:ring-offset-snow-white"
              )}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                  "md:hidden overflow-hidden border-t",
                  isDarkMode 
                    ? "border-soft-purple-gray/30 bg-dark-charcoal/95" 
                    : "border-gray-200/30 bg-snow-white/95"
                )}
              >
                <div className="px-6 py-4 space-y-2">
                  {navigationItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = currentPage === item.id || (item.id === 'features' && isFeaturesActive);
                    
                    if (item.submenu) {
                      return (
                        <div key={item.id} className="space-y-2">
                          <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            onClick={handleFeaturesClick}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-3 rounded-xl font-inter font-medium text-base transition-all duration-200",
                              "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-offset-2",
                              isDarkMode ? "focus:ring-offset-dark-charcoal" : "focus:ring-offset-snow-white",
                              isActive
                                ? "text-digital-teal bg-digital-teal/10"
                                : isDarkMode
                                ? "text-snow-white/80 hover:text-digital-teal hover:bg-soft-purple-gray/50"
                                : "text-dark-charcoal/80 hover:text-digital-teal hover:bg-gray-100/50"
                            )}
                            aria-expanded={mobileSubmenuOpen}
                            aria-haspopup="true"
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent className="h-5 w-5" />
                              <span>{item.label}</span>
                            </div>
                            <motion.div
                              animate={{ rotate: mobileSubmenuOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.div>
                          </motion.button>

                          {/* Mobile Submenu */}
                          <AnimatePresence>
                            {mobileSubmenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden ml-4 space-y-1"
                              >
                                {item.submenu.map((subItem, subIndex) => {
                                  const isDisabled = subItem.requiresSetup && !userHasCompletedSetup;
                                  
                                  return (
                                    <motion.button
                                      key={subItem.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: subIndex * 0.05, duration: 0.2 }}
                                      onClick={() => handleSubmenuClick(subItem)}
                                      disabled={isDisabled}
                                      className={cn(
                                        "w-full text-left px-4 py-2 rounded-lg font-inter text-sm transition-all duration-200",
                                        "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-offset-2",
                                        isDarkMode ? "focus:ring-offset-dark-charcoal" : "focus:ring-offset-snow-white",
                                        isDisabled
                                          ? "text-snow-white/40 cursor-not-allowed"
                                          : isFeatureActive(subItem.id)
                                          ? "text-snow-white bg-digital-teal font-medium rounded-full"
                                          : isDarkMode
                                          ? "text-snow-white/70 hover:text-digital-teal hover:bg-soft-purple-gray/30"
                                          : "text-dark-charcoal/70 hover:text-digital-teal hover:bg-gray-100/30"
                                      )}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>{subItem.label}</span>
                                        {isDisabled && (
                                          <span className="text-xs text-electric-orange">Setup</span>
                                        )}
                                        {!isDisabled && isFeatureActive(subItem.id) && (
                                          <div className="w-1.5 h-1.5 bg-snow-white rounded-full" />
                                        )}
                                      </div>
                                    </motion.button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }
                    
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        onClick={() => handleNavClick(item.id, item.href)}
                        onKeyDown={(e) => handleKeyDown(e, item.id, item.href)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-inter font-medium text-base transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-digital-teal focus:ring-offset-2",
                          isDarkMode ? "focus:ring-offset-dark-charcoal" : "focus:ring-offset-snow-white",
                          isActive
                            ? "text-digital-teal bg-digital-teal/10"
                            : isDarkMode
                            ? "text-snow-white/80 hover:text-digital-teal hover:bg-soft-purple-gray/50"
                            : "text-dark-charcoal/80 hover:text-digital-teal hover:bg-gray-100/50"
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-left">{item.label}</span>
                        
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 bg-digital-teal rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}

                  {/* Mobile User Menu */}
                  {user ? (
                    <div className="border-t border-snow-white/10 pt-4 mt-4">
                      <div className="px-4 py-2 text-sm text-snow-white/70">
                        {user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-inter font-medium text-base transition-all duration-200 text-red-400 hover:bg-red-400/10"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-snow-white/10 pt-4 mt-4">
                      <button
                        onClick={onLoginClick}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl font-inter font-medium text-base transition-all duration-200 bg-electric-orange text-dark-charcoal hover:bg-electric-orange/90"
                      >
                        <User className="h-5 w-5" />
                        <span>Login / Sign Up</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}