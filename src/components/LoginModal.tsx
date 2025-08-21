import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ClockLogo from './ClockLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast.success('Welcome back! Your time journey continues...');
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error } = await signUp(formData.email, formData.password);
        if (error) throw error;
        toast.success('Account created successfully! You can now start your journey.');
        onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            className="bg-soft-purple-gray/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-snow-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <ClockLogo size="md" animated={true} />
                <h2 className="font-space-grotesk font-bold text-xl text-snow-white">
                  TickTickLife
                </h2>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-snow-white/70 hover:text-snow-white hover:bg-soft-purple-gray/50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center mb-8">
              <h3 className="font-space-grotesk font-bold text-2xl text-snow-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join the Revolution'}
              </h3>
              <p className="font-inter text-snow-white/70">
                {isLogin 
                  ? 'Continue your time awareness journey' 
                  : 'Start reclaiming your precious time'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-snow-white/80">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-snow-white/50" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-dark-charcoal/50 border border-snow-white/20 rounded-xl pl-10 pr-4 py-3 text-snow-white placeholder-snow-white/50 focus:outline-none focus:ring-2 focus:ring-electric-orange focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-snow-white/80">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-snow-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-dark-charcoal/50 border border-snow-white/20 rounded-xl pl-10 pr-12 py-3 text-snow-white placeholder-snow-white/50 focus:outline-none focus:ring-2 focus:ring-electric-orange focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-snow-white/50 hover:text-snow-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm password field (signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block font-inter text-sm font-medium text-snow-white/80">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-snow-white/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-dark-charcoal/50 border border-snow-white/20 rounded-xl pl-10 pr-4 py-3 text-snow-white placeholder-snow-white/50 focus:outline-none focus:ring-2 focus:ring-electric-orange focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-electric-orange to-warm-gold hover:from-electric-orange/90 hover:to-warm-gold/90 text-dark-charcoal font-space-grotesk font-bold py-3 text-lg rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-dark-charcoal/30 border-t-dark-charcoal rounded-full animate-spin" />
                    <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Toggle between login/signup */}
            <div className="mt-6 text-center">
              <p className="font-inter text-snow-white/70">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-semibold text-digital-teal hover:text-digital-teal/80 transition-colors underline decoration-digital-teal/50 hover:decoration-digital-teal/80"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Inspirational footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center space-x-2 text-snow-white/60">
                <Sparkles className="h-4 w-4" />
                <span className="font-inter text-xs">
                  Join 50,000+ people living more consciously
                </span>
                <Sparkles className="h-4 w-4" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}