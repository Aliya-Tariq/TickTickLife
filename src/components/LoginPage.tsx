import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ClockLogo from './ClockLogo';

export default function LoginPage() {
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
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error } = await signUp(formData.email, formData.password);
        if (error) throw error;
        toast.success('Account created! Check your email to verify your account.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
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
    <div className="min-h-screen bg-gradient-to-br from-dark-charcoal via-soft-purple-gray to-dark-charcoal flex items-center justify-center p-4 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-electric-orange/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-digital-teal/10 rounded-full blur-xl"
        />
      </div>

      {/* Fixed floating badge */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          title="Built with Bolt.new"
        >
          <img
            src="src/components/bolt-badge.png"
            alt="Bolt.new"
            className="w-8 h-8 md:w-10 md:h-10 hover:scale-110 transition-transform"
          />
        </a>
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Database by Supabase"
        >
          <img
            src="src/components/supabase.png"
            alt="Supabase"
            className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 transition-transform"
          />
        </a>
        <a
          href="https://www.netlify.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Hosted on Netlify"
        >
          <img
            src="/netlify.svg"
            alt="Netlify"
            className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 transition-transform"
          />
        </a>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Motivational content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left space-y-8"
        >
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <ClockLogo size="xl" animated={true} />
            <h1 className="font-space-grotesk font-bold text-3xl text-snow-white">
              TickTickLife
            </h1>
          </div>

          <div className="space-y-6">
            <h2 className="font-space-grotesk font-bold text-4xl lg:text-5xl text-snow-white leading-tight">
              Welcome Back to Your Time Journey
            </h2>
            <p className="font-inter text-xl text-snow-white/80 leading-relaxed">
              Time waits for no one — let's log in and make every second count.
            </p>
          </div>

          {/* Time awareness quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-gradient-to-r from-electric-orange/20 to-digital-teal/20 rounded-2xl p-6 border border-electric-orange/30"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⏰</div>
              <div>
                <p className="font-inter text-lg text-snow-white/90 italic mb-2">
                  "You've got approximately 4.2 million seconds left this year."
                </p>
                <p className="font-inter text-sm text-electric-orange">
                  Let's log in and live them consciously.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { number: '50K+', label: 'Lives Transformed' },
              { number: '3.2', label: 'Avg Years Reclaimed' },
              { number: '24/7', label: 'Time Awareness' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="font-space-grotesk font-bold text-2xl text-digital-teal">
                  {stat.number}
                </div>
                <div className="font-inter text-sm text-snow-white/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-soft-purple-gray/50 backdrop-blur-md rounded-3xl p-8 border border-snow-white/10 shadow-2xl">
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

              {/* Remember me & Forgot password */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-electric-orange bg-dark-charcoal border-snow-white/20 rounded focus:ring-electric-orange focus:ring-2"
                    />
                    <span className="font-inter text-sm text-snow-white/80">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="font-inter text-sm text-digital-teal hover:text-digital-teal/80 transition-colors"
                  >
                    Forgot password?
                  </button>
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}