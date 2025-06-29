import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Download, Twitter, Facebook } from 'lucide-react';
import { toast } from 'sonner';

interface ShareResultsProps {
  consciousYears: number;
  totalRemainingYears: number;
  currentAge: number;
  lifeExpectancy: number;
  topTimeWaster: {
    activity: string;
    years: number;
    icon: string;
  };
}

export default function ShareResults({ 
  consciousYears, 
  totalRemainingYears, 
  currentAge, 
  lifeExpectancy,
  topTimeWaster 
}: ShareResultsProps) {
  const [isSharing, setIsSharing] = useState(false);

  const percentage = (consciousYears / totalRemainingYears) * 100;
  
  const shareText = `🤯 I just discovered I only have ${consciousYears.toFixed(1)} years of conscious living time left! That's just ${percentage.toFixed(1)}% of my remaining life. My biggest time waster? ${topTimeWaster.activity} - stealing ${topTimeWaster.years.toFixed(1)} years! ${topTimeWaster.icon} #TimeAwareness #LifeReality #TickTickLife`;

  const shareUrl = window.location.href;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  const generateShareImage = async () => {
    setIsSharing(true);
    
    // Create a canvas element for the share image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      toast.error('Failed to generate image');
      setIsSharing(false);
      return;
    }

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#181818');
    gradient.addColorStop(1, '#2D2B4A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Title
    ctx.fillStyle = '#F2F2F2';
    ctx.font = 'bold 48px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('My Life Reality Check', 400, 80);

    // Main stat
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 72px Space Grotesk, sans-serif';
    ctx.fillText(`${consciousYears.toFixed(1)} Years`, 400, 180);

    ctx.fillStyle = '#F2F2F2';
    ctx.font = '32px Inter, sans-serif';
    ctx.fillText('of conscious time left', 400, 220);

    // Percentage
    ctx.fillStyle = percentage < 25 ? '#FF4444' : percentage < 40 ? '#FFAA00' : '#4CAF50';
    ctx.font = 'bold 56px Space Grotesk, sans-serif';
    ctx.fillText(`${percentage.toFixed(1)}%`, 400, 300);

    ctx.fillStyle = '#F2F2F2';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(`of my remaining ${totalRemainingYears} years`, 400, 330);

    // Top time waster
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 36px Space Grotesk, sans-serif';
    ctx.fillText(`Biggest Time Waster: ${topTimeWaster.activity}`, 400, 420);

    ctx.fillStyle = '#F2F2F2';
    ctx.font = '28px Inter, sans-serif';
    ctx.fillText(`Stealing ${topTimeWaster.years.toFixed(1)} years of my life!`, 400, 460);

    // Footer
    ctx.fillStyle = '#FFD369';
    ctx.font = 'bold 24px Space Grotesk, sans-serif';
    ctx.fillText('Calculate yours at TickTickLife', 400, 540);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-life-reality-check.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Image downloaded!');
      } else {
        toast.error('Failed to generate image');
      }
      setIsSharing(false);
    }, 'image/png');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          Share Your Reality Check
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80 max-w-2xl mx-auto">
          Wake up your friends and family! Share your time awareness results and inspire others 
          to take control of their precious time.
        </p>
      </div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-countdown max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">🤯</div>
          <h4 className="font-space-grotesk font-bold text-xl text-electric-orange">
            My Life Reality Check
          </h4>
          
          <div className="space-y-2">
            <div className="font-space-grotesk font-black text-4xl text-snow-white">
              {consciousYears.toFixed(1)} Years
            </div>
            <div className="font-inter text-snow-white/80">
              of conscious time left
            </div>
            <div 
              className="font-space-grotesk font-bold text-2xl"
              style={{ 
                color: percentage < 25 ? '#FF4444' : percentage < 40 ? '#FFAA00' : '#4CAF50' 
              }}
            >
              {percentage.toFixed(1)}%
            </div>
            <div className="font-inter text-sm text-snow-white/70">
              of my remaining {totalRemainingYears} years
            </div>
          </div>

          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4">
            <div className="font-space-grotesk font-bold text-lg text-snow-white">
              Biggest Time Waster: {topTimeWaster.activity} {topTimeWaster.icon}
            </div>
            <div className="font-inter text-sm text-red-400">
              Stealing {topTimeWaster.years.toFixed(1)} years of my life!
            </div>
          </div>

          <div className="font-inter text-xs text-warm-gold">
            #TimeAwareness #LifeReality #TickTickLife
          </div>
        </div>
      </motion.div>

      {/* Share Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={handleCopyText}
          className="btn-secondary w-full"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Text
        </Button>

        <Button
          onClick={generateShareImage}
          disabled={isSharing}
          className="btn-primary w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {isSharing ? 'Generating...' : 'Download Image'}
        </Button>

        <Button
          onClick={handleTwitterShare}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full"
        >
          <Twitter className="mr-2 h-4 w-4" />
          Tweet
        </Button>

        <Button
          onClick={handleFacebookShare}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Viral Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-gradient-to-r from-electric-orange to-warm-gold rounded-3xl p-6 text-center"
      >
        <div className="text-3xl mb-3">🚀</div>
        <h4 className="font-space-grotesk font-bold text-xl text-dark-charcoal mb-2">
          Start a Time Revolution!
        </h4>
        <p className="font-inter text-dark-charcoal/90">
          Challenge your friends to calculate their conscious time. 
          Who has the most time awareness? Who needs the biggest wake-up call?
        </p>
      </motion.div>

      {/* Call to Action */}
      <div className="text-center">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn-primary text-lg px-8 py-4"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Calculate Again
        </Button>
      </div>
    </div>
  );
}