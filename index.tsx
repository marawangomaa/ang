
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, Variants, useScroll, useTransform } from 'framer-motion';
import { Heart, Sparkles, Star, Zap, Camera, Gift, Music, Share2, Flame, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';

/** 
 * IMAGE MAPPING
 * Using the provided Google Drive IDs with the more reliable direct-link format
 */
const getDriveUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

const PHOTOS = {
  solo1: getDriveUrl("1qlCHjN7I8dn2VsSaZeLpSOgBmLoOI6ru"),
  solo2: getDriveUrl("112pYdnv7KK3mFD1C0KTDLcEF1UsY13Wm"),
  solo3: getDriveUrl("1Ecw7RRkG1PEZEtITPVK62W2p1qykFE5y"),
  sisters1: getDriveUrl("103OK8V2BgimlyB3EJP0vxoS3CsnGEdeO"),
  sisters2: getDriveUrl("1sCM9CxekGozoLbK7N8VQ9hkAMBFJnQdb"),
  sisters3: getDriveUrl("15fUaRPUQz-Xcf5ihywyvqB_c0z5CAG_4"),
};

// Focused media items using only the new photos provided
const mediaItems = [
  { id: 1, src: PHOTOS.solo1, caption: "Angile • The Star" },
  { id: 2, src: PHOTOS.solo2, caption: "Golden Hour An" },
  { id: 3, src: PHOTOS.solo3, caption: "Radiant Angi" },
  { id: 4, src: PHOTOS.sisters1, caption: "Better Together" },
  { id: 5, src: PHOTOS.sisters2, caption: "Sister Squad" },
  { id: 6, src: PHOTOS.sisters3, caption: "Forever Connection" },
  { id: 7, src: PHOTOS.solo1, caption: "Simply Beautiful" },
  { id: 8, src: PHOTOS.sisters1, caption: "The Bond" },
];

const FloatingParticles = () => {
  const particles = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 100 + 20,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      type: Math.random() > 0.5 ? 'circle' : 'heart'
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{ opacity: 0, y: 100 }}
          animate={{
            y: [0, -1000],
            opacity: [0, 0.4, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            left: p.left,
            top: '110%',
          }}
        >
          {p.type === 'heart' ? (
            <Heart size={p.size / 4} className="text-pink-500/20" />
          ) : (
            <div 
              className="rounded-full bg-yellow-500/10 blur-xl" 
              style={{ width: p.size, height: p.size }} 
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

const Polaroid = ({ src, caption, rotation = 0 }: { src: string; caption: string; rotation?: number; key?: React.Key }) => {
  const [revealed, setRevealed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: rotation + 1, zIndex: 10 }}
      style={{ rotate: rotation }}
      onClick={() => setRevealed(!revealed)}
      className="bg-white p-3 pb-10 shadow-2xl cursor-pointer relative group border border-zinc-200 transition-shadow hover:shadow-yellow-500/10"
    >
      <div className="aspect-[3/4] bg-zinc-100 overflow-hidden relative">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )}
        <motion.img 
          src={imgError ? `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600` : src} 
          alt={caption}
          onLoad={() => setLoading(false)}
          className={`w-full h-full object-cover transition-all duration-1000 ${revealed ? 'filter-none scale-100' : 'filter brightness-75 scale-105'}`}
          onError={() => {
            setImgError(true);
            setLoading(false);
          }}
        />
        {!revealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] group-hover:bg-black/10 transition-colors">
            <Camera size={24} className="text-white mb-2 opacity-80" />
            <span className="text-[8px] text-white tracking-[0.2em] font-bold uppercase">Click to See</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
         <Star size={8} className="text-yellow-500 fill-yellow-500" />
         <p className="font-serif text-zinc-800 text-center text-[10px] tracking-widest uppercase font-bold">{caption}</p>
         <Star size={8} className="text-yellow-500 fill-yellow-500" />
      </div>
    </motion.div>
  );
};

const ScratchGame = ({ 
  onComplete, 
  title, 
  subtitle, 
  revealContent
}: { 
  onComplete: () => void, 
  title: string, 
  subtitle: string,
  revealContent: React.ReactNode
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 250;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.5, '#F9E29C');
    gradient.addColorStop(1, '#B8860B');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for(let i=0; i<1000; i++) {
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 1, 1);
    }

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#444';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL THE MAGIC', canvas.width / 2, canvas.height / 2 + 6);

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return { 
        x: (clientX - rect.left) * (canvas.width / rect.width), 
        y: (clientY - rect.top) * (canvas.height / rect.height) 
      };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isScratching || isDone) return;
      const pos = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 40, 0, Math.PI * 2);
      ctx.fill();
      checkCompletion();
    };

    const checkCompletion = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let clearPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++;
      }
      const percentage = (clearPixels / (pixels.length / 4)) * 100;
      if (percentage > 50 && !isDone) {
        setIsDone(true);
        onComplete();
      }
    };

    const handleStart = (e: any) => {
      setIsScratching(true);
      scratch(e);
    };
    const handleEnd = () => setIsScratching(false);

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('touchstart', handleStart);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('touchstart', handleStart);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchmove', scratch);
    };
  }, [isScratching, isDone, onComplete]);

  return (
    <div className="space-y-6 flex flex-col items-center w-full max-w-[400px]">
      <div className="text-center space-y-2">
        <h4 className="text-2xl font-serif text-white">{title}</h4>
        <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-bold">{subtitle}</p>
      </div>
      <div className="relative w-full aspect-[4/2.5] rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-zinc-900 group">
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          {revealContent}
        </div>
        <canvas 
          ref={canvasRef} 
          className={`absolute inset-0 cursor-crosshair transition-opacity duration-1000 ${isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />
        {isDone && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-yellow-500 text-black rounded-full p-2"
          >
            <Sparkles size={16} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

const CandleGame = () => {
  const [blown, setBlown] = useState(false);

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#FFD700', '#FFB6C1', '#FFFFFF', '#FF69B4']
    });
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative h-56 w-14 bg-gradient-to-t from-pink-600 via-pink-400 to-pink-300 rounded-3xl shadow-xl border border-white/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-8 bg-pink-300 rounded-t-3xl opacity-50 blur-sm" />
        <AnimatePresence>
          {!blown && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={handleBlow}
              className="absolute -top-20 left-1/2 -translate-x-1/2 cursor-pointer z-20"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.9, 1, 0.9],
                  rotate: [-3, 3, -3]
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-16 h-20 bg-orange-500 rounded-full blur-[3px] relative flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.6)]"
              >
                <div className="w-8 h-12 bg-yellow-200 rounded-full blur-[2px]" />
                <Flame className="absolute text-white opacity-40" size={40} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {blown && (
            <motion.div 
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -60, opacity: [0, 1, 0] }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 text-pink-300 font-serif italic text-lg whitespace-nowrap"
            >
                Wish coming true...
            </motion.div>
        )}
      </div>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBlow}
        disabled={blown}
        className={`px-10 py-4 rounded-full border border-pink-500/30 text-[10px] tracking-[0.4em] uppercase transition-all flex items-center gap-3 ${blown ? 'opacity-50 bg-transparent text-zinc-500' : 'hover:bg-pink-500/10 bg-zinc-900 text-white'}`}
      >
        {blown ? "The Wish is Yours ✨" : "Make a Wish, Angi"} <Gift size={14} />
      </motion.button>
    </div>
  );
};

const Section = ({ 
  children, 
  direction = 'left', 
  className = '',
  delay = 0
}: { 
  children?: React.ReactNode, 
  direction?: 'left' | 'right' | 'up', 
  className?: string,
  delay?: number
}) => {
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? 60 : 0 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { 
        duration: 1, 
        delay,
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={`py-24 px-6 max-w-7xl mx-auto relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

const App = () => {
  const [celebrated, setCelebrated] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  const today = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, []);

  const handleCelebration = () => {
    setCelebrated(true);
    const end = Date.now() + 3 * 1000;
    const colors = ['#d4af37', '#ffffff', '#f472b6', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 overflow-x-hidden selection:bg-pink-500/30 font-sans">
      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale }} className="z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <span className="text-yellow-500/80 tracking-[0.8em] text-[10px] uppercase block mb-8 font-bold flex items-center justify-center gap-4">
               <Sparkles size={12} /> {today} • TO OUR DEAREST ANGILE <Sparkles size={12} />
            </span>
            <h1 className="text-8xl md:text-[15rem] font-serif leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-700 drop-shadow-2xl">
              Angile
            </h1>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-700"></div>
              <p className="text-lg md:text-3xl font-light text-zinc-400 tracking-[0.6em] uppercase">
                THE GOLDEN <span className="text-yellow-500 font-bold">21</span>
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-zinc-700"></div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="w-px h-32 bg-gradient-to-b from-yellow-500/50 to-transparent mx-auto animate-pulse"></div>
          </motion.div>
        </motion.div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-pink-500/[0.03] rounded-full blur-[200px] pointer-events-none" />
      </section>

      {/* Gallery - Now strictly using user photos */}
      <Section direction="up" className="pt-0">
        <div className="mb-24 space-y-4 text-center">
          <h2 className="text-6xl font-serif">Moments of An</h2>
          <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase font-bold">Tap a memory to bring it to life</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {mediaItems.map((item, index) => (
            <Polaroid 
              key={item.id}
              src={item.src} 
              caption={item.caption} 
              rotation={(index % 2 === 0 ? -1 : 1) * (Math.random() * 5)}
            />
          ))}
        </div>
      </Section>

      {/* Message Section */}
      <Section direction="left">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-4 py-3 px-6 rounded-full bg-white/5 border border-white/10 shadow-lg">
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">21 Remarkable Years</span>
            </div>
            <h2 className="text-7xl font-serif leading-tight">
              Happy Birthday, <br/>
              <span className="italic text-yellow-500 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">Angi.</span>
            </h2>
            <p className="text-2xl text-zinc-400 leading-relaxed font-light max-w-xl">
              Angile, today is your day. Whether we call you <span className="text-white font-medium italic">An</span> or <span className="text-white font-medium italic">Angi</span>, you remain the brightest light in our lives. 21 is a milestone that marks the start of your greatest adventure yet. Keep shining, keep smiling, and never stop being the wonderful soul you are.
            </p>
            <div className="flex gap-4">
                <Heart className="text-pink-500 fill-pink-500/20" size={24} />
                <Smile className="text-yellow-500" size={24} />
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img 
              src={PHOTOS.solo2} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out"
              onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1520850832623-6d4b5120a6fd?auto=format&fit=crop&q=80&w=800")}
            />
            <div className="absolute bottom-12 left-12 z-20 space-y-2">
              <h4 className="text-4xl font-serif italic text-white drop-shadow-lg">Shining Bright</h4>
              <p className="text-yellow-500 text-[10px] tracking-[0.4em] uppercase font-bold">Simply Unforgettable</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Games Section */}
      <div className="bg-white/[0.01] border-y border-white/5 py-40 overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/[0.02] blur-[150px] rounded-full" />
        <Section direction="up" className="text-center">
          <div className="mb-24 space-y-4">
            <h2 className="text-6xl font-serif">Birthday Quests</h2>
            <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase font-bold">Interactive surprises for the Birthday Girl</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16 md:gap-24 items-start max-w-7xl mx-auto">
            <ScratchGame 
              title="A Personal Note"
              subtitle="Scratch for a Message"
              onComplete={() => {}}
              revealContent={
                <div className="text-center p-8 bg-zinc-900 w-full h-full flex flex-col items-center justify-center border-4 border-yellow-500/20 rounded-xl m-2">
                  <p className="text-white text-2xl font-serif italic leading-relaxed">
                    "May your year be as beautiful as your heart, Angile."
                  </p>
                  <p className="text-pink-500 mt-4 font-bold text-[10px] tracking-widest uppercase">- Forever Yours</p>
                </div>
              }
            />

            <div className="flex flex-col items-center">
              <div className="text-center space-y-2 mb-10">
                <h4 className="text-2xl font-serif text-white">Make a Wish</h4>
                <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-bold">The 21st Year Wish</p>
              </div>
              <CandleGame />
            </div>

            <ScratchGame 
              title="Memory Reveal"
              subtitle="A Classic Moment"
              onComplete={handleCelebration}
              revealContent={
                <div className="w-full h-full bg-zinc-800 p-2 overflow-hidden">
                    <img 
                        src={PHOTOS.solo3} 
                        className="w-full h-full object-cover rounded-lg" 
                        onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800")}
                    />
                </div>
              }
            />
          </div>
        </Section>
      </div>

      {/* Sister's Shout Out - Using specified Sister Photos */}
      <Section direction="right">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20 items-center bg-zinc-900/40 p-12 md:p-20 rounded-[4rem] border border-white/10 relative overflow-hidden group shadow-2xl backdrop-blur-md">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-500/[0.05] blur-[100px] group-hover:bg-pink-500/[0.1] transition-all duration-1000" />
          
          <div className="grid grid-cols-2 gap-4 flex-shrink-0 relative shadow-2xl transition-transform duration-700 w-full md:w-[400px]">
             <div className="aspect-square rounded-2xl overflow-hidden border border-white/20">
                <img 
                    src={PHOTOS.sisters1} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105" 
                    onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600")}
                />
             </div>
             <div className="aspect-square rounded-2xl overflow-hidden border border-white/20 translate-y-8">
                <img 
                    src={PHOTOS.sisters2} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105" 
                    onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600")}
                />
             </div>
             <div className="absolute -top-6 -left-6 py-2 px-4 bg-pink-500 text-[10px] tracking-[0.3em] uppercase font-black rounded-full shadow-xl z-20">
                Sister Connection
             </div>
          </div>

          <div className="space-y-8 text-left">
            <h3 className="text-5xl font-serif text-pink-300 italic">Big Shout Out To Her Sisters</h3>
            <p className="text-2xl text-zinc-400 leading-relaxed font-light italic">
              "We also have to give a huge shout out to Angi's sisters! Happy 21st Birthday to the whole family! Your bond is something truly special. Watching the three of you grow together is a joy—here's to all of you having an incredible year!"
            </p>
            <div className="flex flex-wrap items-center gap-8 text-zinc-600 text-[10px] tracking-[0.5em] uppercase font-black">
              <span className="text-pink-400">Dynamic Trio</span>
              <div className="h-1 w-1 rounded-full bg-zinc-800" />
              <span>Sisters 4L</span>
              <div className="h-1 w-1 rounded-full bg-zinc-800" />
              <span className="text-white">Better Together</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Final Celebration */}
      <section className="py-80 text-center relative overflow-hidden">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="z-10 relative px-6"
        >
          <motion.div
            className="absolute -inset-60 bg-pink-500/[0.05] rounded-full blur-[150px] -z-10"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <h3 className="text-7xl md:text-[10rem] font-serif text-white tracking-tighter leading-tight">
            Enjoy, <span className="italic text-yellow-500">Angile.</span>
          </h3>
          <p className="mt-12 text-zinc-500 uppercase tracking-[1em] text-[12px] font-black">The World Is Waiting For You</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-24">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#ec4899' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCelebration}
                className="px-16 py-6 rounded-full bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-2xl hover:text-white"
              >
                Birthday Explosion!
              </motion.button>
              
              <div className="flex items-center gap-6">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                  <Star className="text-yellow-500" size={24} />
                </motion.div>
                <Heart className="text-pink-500 fill-pink-500" size={24} />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="text-yellow-500" size={24} />
                </motion.div>
              </div>
          </div>
        </motion.div>
      </section>

      <footer className="py-20 border-t border-white/5 bg-zinc-950/50 backdrop-blur-xl text-center px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="text-left">
               <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black mb-2">
                 CELEBRATING ANGILE'S 21ST
               </p>
               <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold italic">
                 Philippine Shores • {today}
               </p>
           </div>
           
           <div className="flex gap-10 text-zinc-600">
             <motion.div whileHover={{ scale: 1.2, color: '#ec4899' }} className="cursor-pointer transition-colors">
               <Heart size={20} />
             </motion.div>
             <motion.div whileHover={{ scale: 1.2, color: '#fbbf24' }} className="cursor-pointer transition-colors">
               <Music size={20} />
             </motion.div>
             <motion.div whileHover={{ scale: 1.2, color: '#60a5fa' }} className="cursor-pointer transition-colors">
               <Share2 size={20} />
             </motion.div>
           </div>
        </div>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
