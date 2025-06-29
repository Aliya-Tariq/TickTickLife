import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone, MapPin, Send, Heart, Clock, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Get in touch for partnerships, feedback, or support',
    contact: 'aliyatariq.dev@gmail.com',
    color: '#FF4F61'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our AI time awareness expert TICKBOT!',
    contact: 'Available 24/7',
    color: '#FFCB3A'
  }
  
  
];

const reasons = [
  {
    icon: '🤝',
    title: 'Partnerships',
    description: 'Collaborate with us to spread time awareness globally'
  },
  {
    icon: '💡',
    title: 'Feature Ideas',
    description: 'Share your vision for the future of conscious living'
  },
  {
    icon: '🐛',
    title: 'Bug Reports',
    description: 'Help us improve the TickTickLife experience'
  },
  {
    icon: '❤️',
    title: 'Success Stories',
    description: 'Tell us how TickTickLife transformed your life'
  },
  {
    icon: '🎓',
    title: 'Speaking Events',
    description: 'Invite us to speak at your conference or workshop'
  },
  {
    icon: '📰',
    title: 'Press Inquiries',
    description: 'Media requests and interview opportunities'
  }
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-gray to-charcoal overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-10 w-64 h-64 bg-coral-pink/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-10 w-48 h-48 bg-yellow-gold/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [-30, 30, -30],
            x: [-20, 20, -20],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/2 w-32 h-32 bg-deep-plum/10 rounded-full blur-xl"
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
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl"
            >
              📞
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="text-5xl"
            >
              💬
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="text-6xl"
            >
              ✉️
            </motion.div>
          </div>

          <h1 className="font-outfit font-black text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
            Let's Connect
          </h1>
          
          <p className="font-dm-sans text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Have a question? Want to share your time transformation story? 
            Ready to partner with us in the time awareness revolution?
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
          >
            <Clock className="h-12 w-12 text-coral-pink mx-auto mb-4" />
            <h2 className="font-outfit font-bold text-2xl text-white mb-4">
              We Value Your Time
            </h2>
            <p className="font-dm-sans text-lg text-white/90">
              We respond to all messages within <span className="font-bold text-yellow-gold">24 hours</span> 
              because we know how precious your time is.
            </p>
          </motion.div>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white text-center mb-12">
            Choose Your Preferred Way
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 text-center cursor-pointer"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${method.color}20` }}
                  >
                    <IconComponent 
                      className="h-8 w-8" 
                      style={{ color: method.color }}
                    />
                  </div>
                  <h3 className="font-outfit font-bold text-lg text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="font-dm-sans text-white/80 text-sm mb-3">
                    {method.description}
                  </p>
                  <p className="font-dm-sans font-semibold text-coral-pink">
                    {method.contact}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <Send className="h-8 w-8 text-coral-pink" />
                <h2 className="font-outfit font-bold text-2xl text-white">
                  Send Us a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-dm-sans text-white/80 text-sm mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-coral-pink focus:border-transparent transition-all duration-200"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block font-dm-sans text-white/80 text-sm mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-coral-pink focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-dm-sans text-white/80 text-sm mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-coral-pink focus:border-transparent transition-all duration-200"
                  >
                    <option value="" className="bg-charcoal">Select a subject</option>
                    <option value="partnership" className="bg-charcoal">Partnership Opportunity</option>
                    <option value="feature" className="bg-charcoal">Feature Request</option>
                    <option value="bug" className="bg-charcoal">Bug Report</option>
                    <option value="success" className="bg-charcoal">Success Story</option>
                    <option value="speaking" className="bg-charcoal">Speaking Event</option>
                    <option value="press" className="bg-charcoal">Press Inquiry</option>
                    <option value="other" className="bg-charcoal">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-dm-sans text-white/80 text-sm mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-coral-pink focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help you or share your thoughts..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-coral-pink hover:bg-coral-pink/90 text-white font-outfit font-bold py-4 text-lg rounded-2xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Reasons to Contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 mb-8">
              <Heart className="h-8 w-8 text-yellow-gold" />
              <h2 className="font-outfit font-bold text-2xl text-white">
                Why People Reach Out
              </h2>
            </div>

            <div className="space-y-4">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{reason.icon}</div>
                    <div>
                      <h3 className="font-outfit font-bold text-lg text-white mb-2">
                        {reason.title}
                      </h3>
                      <p className="font-dm-sans text-white/80 text-sm">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Community Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-coral-pink/20 to-yellow-gold/20 rounded-3xl p-6 border border-coral-pink/30"
            >
              <Users className="h-8 w-8 text-coral-pink mb-4" />
              <h3 className="font-outfit font-bold text-xl text-white mb-4">
                Join Our Community
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="font-outfit font-bold text-2xl text-white">50K+</div>
                  <div className="font-dm-sans text-white/80 text-sm">Active Users</div>
                </div>
                <div>
                  <div className="font-outfit font-bold text-2xl text-white">24h</div>
                  <div className="font-dm-sans text-white/80 text-sm">Response Time</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-deep-plum/20 to-charcoal/20 rounded-3xl p-12 border border-deep-plum/30 backdrop-blur-sm">
            <Sparkles className="h-12 w-12 text-yellow-gold mx-auto mb-6" />
            <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white mb-6">
              Every Message Matters
            </h2>
            <p className="font-dm-sans text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your feedback, ideas, and stories help us build a better future where everyone lives more consciously. 
              We read every message and value every connection.
            </p>
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <Clock className="h-5 w-5" />
              <span className="font-dm-sans">
                Average response time: <span className="font-bold text-coral-pink">4 hours</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}