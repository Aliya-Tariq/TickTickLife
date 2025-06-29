import { motion } from 'framer-motion';
import { Clock, Heart, Brain, Target, Zap, Users, Award, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Life Clock Calculator',
    description: 'See exactly how much time you have left and make every second count.',
    color: '#FF4F61'
  },
  {
    icon: Brain,
    title: 'Consciousness Meter',
    description: 'Discover how much of your life you\'re actually living consciously.',
    color: '#FFCB3A'
  },
  {
    icon: Target,
    title: 'Goal Management',
    description: 'Set meaningful objectives that align with your remaining time.',
    color: '#511D47'
  },
  {
    icon: Zap,
    title: 'Habit Optimizer',
    description: 'Transform daily routines to reclaim years of your precious life.',
    color: '#343B3C'
  }
];

const stats = [
  { number: '2.5M+', label: 'Hours Analyzed', icon: '⏰' },
  { number: '50K+', label: 'Lives Transformed', icon: '🌟' },
  { number: '3.2', label: 'Avg Years Reclaimed', icon: '📈' },
  { number: '95%', label: 'User Satisfaction', icon: '❤️' }
];

const team = [
  {
    name: 'Aliya Tariq',
    role: 'Founder & Time Philosopher',
    bio: 'Former tech executive who realized she was living on autopilot.',
    avatar: '👩‍💻'
  },
  {
    name: 'Rafiya Siddiqui',
    role: 'UX Designer & Mindfulness Expert',
    bio: 'Designs experiences that create awareness and inspire change.',
    avatar: '👩‍🎨'
  },
  {
    name: 'Dr. Fakhra Mariyam',
    role: 'Behavioral Psychologist',
    bio: 'PhD in habit formation and conscious living research.',
    avatar: '👩‍🔬'
  }
];

export default function AboutSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-yellow-gold via-deep-plum to-slate-gray overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
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
          className="absolute top-20 left-10 w-32 h-32 bg-coral-pink/10 rounded-full blur-xl"
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
          className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-gold/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-deep-plum/10 rounded-full blur-lg"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8 mb-20"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
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
              className="text-6xl"
            >
              ⏰
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="text-5xl"
            >
              💡
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="text-6xl"
            >
              🧠
            </motion.div>
          </div>

          <h1 className="font-outfit font-black text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
            About TickTickLife
          </h1>
          
          <p className="font-dm-sans text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to wake up humanity from the autopilot of daily life. 
            Every scroll, every mindless moment, every unconscious habit is stealing your precious time.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
          >
            <h2 className="font-outfit font-bold text-2xl text-white mb-4">
              The Brutal Truth
            </h2>
            <p className="font-dm-sans text-lg text-white/90">
              The average person spends <span className="font-bold text-coral-pink">7+ hours daily</span> on screens, 
              loses <span className="font-bold text-yellow-gold">2.5 years</span> to mindless scrolling, 
              and lives only <span className="font-bold text-white">20-30%</span> of their life consciously.
            </p>
          </motion.div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="bg-gradient-to-r from-coral-pink/20 to-yellow-gold/20 rounded-3xl p-8 border border-coral-pink/30 backdrop-blur-sm">
            <Sparkles className="h-12 w-12 text-yellow-gold mx-auto mb-6" />
            <h2 className="font-outfit font-bold text-3xl text-white mb-6">
              Our Mission
            </h2>
            <p className="font-dm-sans text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              To create a global awakening where people live consciously, make intentional choices, 
              and reclaim their most precious resource: <span className="font-bold text-yellow-gold">time</span>.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white text-center mb-12">
            How We're Changing Lives
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <IconComponent 
                        className="h-8 w-8" 
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3 className="font-outfit font-bold text-xl text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="font-dm-sans text-white/80 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white text-center mb-12">
            Our Impact
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="font-outfit font-black text-2xl md:text-3xl text-white mb-2">
                  {stat.number}
                </div>
                <div className="font-dm-sans text-sm text-white/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white text-center mb-12">
            Meet the Time Warriors
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="font-outfit font-bold text-xl text-white mb-2">
                  {member.name}
                </h3>
                <p className="font-dm-sans text-coral-pink font-semibold mb-4">
                  {member.role}
                </p>
                <p className="font-dm-sans text-white/80 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-coral-pink/20 to-yellow-gold/20 rounded-3xl p-12 border border-coral-pink/30 backdrop-blur-sm">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white mb-6">
              Join the Revolution
            </h2>
            <p className="font-dm-sans text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Every person who becomes time-aware creates a ripple effect. 
              Together, we can wake up humanity from the autopilot of modern life.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-coral-pink text-white px-8 py-4 rounded-3xl font-outfit font-bold text-lg hover:shadow-2xl transition-all duration-300 animate-pulse-glow"
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}