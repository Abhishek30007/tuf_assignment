import React from 'react';
import { motion } from 'framer-motion';

export default function HeroImage() {
  const MotionImg = motion.img;
  const MotionDiv = motion.div;

  return (
    <div className="relative h-64 md:h-full w-full overflow-hidden rounded-3xl glassmorphism">
      <MotionImg 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src="/hero.png" 
        alt="Antigravity Floating Aesthetic" 
        className="w-full h-full object-cover rounded-3xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none rounded-3xl"></div>
      
      <MotionDiv 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-6 left-6 right-6"
      >
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md tracking-tight">Time, Elevated</h2>
        <p className="text-slate-200 font-medium drop-shadow text-sm">Experience scheduling weightlessly.</p>
      </MotionDiv>
    </div>
  );
}
