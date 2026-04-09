import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';


const ORB_SPECS = [
  {
    id: 'orb-a',
    className: 'left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] sm:h-[38rem] sm:w-[38rem] xl:h-[44rem] xl:w-[44rem]',
    animate: { x: ['0%', '8%', '-4%', '0%'], y: ['0%', '4%', '-6%', '0%'], scale: [1, 1.08, 0.94, 1] },
    duration: 36,
  },
  {
    id: 'orb-b',
    className: 'right-[-10rem] top-[8%] h-[26rem] w-[26rem] sm:h-[32rem] sm:w-[32rem] xl:h-[36rem] xl:w-[36rem]',
    animate: { x: ['0%', '-10%', '4%', '0%'], y: ['0%', '-8%', '6%', '0%'], scale: [0.96, 1.06, 1, 0.96] },
    duration: 42,
  },
  {
    id: 'orb-c',
    className: 'bottom-[-14rem] left-[18%] h-[28rem] w-[28rem] sm:h-[34rem] sm:w-[34rem] xl:h-[40rem] xl:w-[40rem]',
    animate: { x: ['0%', '6%', '-8%', '0%'], y: ['0%', '-6%', '5%', '0%'], scale: [1, 0.92, 1.05, 1] },
    duration: 40,
  },
  {
    id: 'orb-d',
    className: 'bottom-[-12rem] right-[8%] h-[22rem] w-[22rem] sm:h-[28rem] sm:w-[28rem] xl:h-[32rem] xl:w-[32rem]',
    animate: { x: ['0%', '-4%', '7%', '0%'], y: ['0%', '7%', '-5%', '0%'], scale: [1, 1.04, 0.95, 1] },
    duration: 46,
  },
  {
    id: 'orb-e',
    className: 'left-1/2 top-1/3 h-[18rem] w-[18rem] -translate-x-1/2 sm:h-[24rem] sm:w-[24rem] xl:h-[28rem] xl:w-[28rem]',
    animate: { x: ['0%', '3%', '-5%', '0%'], y: ['0%', '-4%', '4%', '0%'], scale: [0.92, 1.04, 0.98, 0.92] },
    duration: 34,
  },
];

export default function AmbientBackground({ palette }) {
  const MotionDiv = motion.div;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={palette.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {ORB_SPECS.map((orb, index) => (
            <MotionDiv
              key={`${palette.name}-${orb.id}`}
              animate={orb.animate}
              transition={{
                duration: orb.duration,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: index * 0.35,
              }}
              className={`absolute rounded-full blur-[120px] will-change-transform ${orb.className}`}
              style={{
                background: palette.orbs[index % palette.orbs.length],
                opacity: index === 4 ? 0.26 : 0.34,
              }}
            />
          ))}

          <motion.div
            animate={{ opacity: [0.16, 0.26, 0.18], scale: [1, 1.04, 0.98] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 15%, ${palette.overlay}, transparent 42%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
