import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BLOCKS = [
  {
    id: 'liquid-a',
    className:
      'bottom-[-16rem] left-[-12rem] h-[26rem] w-[26rem] sm:h-[32rem] sm:w-[32rem] xl:h-[38rem] xl:w-[38rem]',
    initialBorderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
    loopBorderRadius: [
      '60% 40% 30% 70% / 60% 30% 70% 40%',
      '54% 46% 38% 62% / 52% 42% 58% 48%',
      '66% 34% 44% 56% / 64% 28% 72% 36%',
      '60% 40% 30% 70% / 60% 30% 70% 40%',
    ],
    entry: {
      x: ['0rem', '5rem'],
      y: ['0rem', '-11rem'],
      scale: [0.2, 1],
      opacity: [0, 1],
      rotate: [-8, 0],
      borderRadius: [
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '54% 46% 38% 62% / 52% 42% 58% 48%',
      ],
    },
    loop: {
      x: ['5rem', '10rem', '16rem', '5rem'],
      y: ['-11rem', '-14rem', '-19rem', '-11rem'],
      rotate: [0, 6, 10, 0],
      borderRadius: [
        '54% 46% 38% 62% / 52% 42% 58% 48%',
        '66% 34% 44% 56% / 64% 28% 72% 36%',
        '58% 42% 34% 66% / 58% 34% 66% 42%',
        '54% 46% 38% 62% / 52% 42% 58% 48%',
      ],
    },
    duration: 28,
    delay: 0,
  },
  {
    id: 'liquid-b',
    className:
      'bottom-[-15rem] right-[-12rem] h-[24rem] w-[24rem] sm:h-[30rem] sm:w-[30rem] xl:h-[36rem] xl:w-[36rem]',
    initialBorderRadius: '58% 42% 64% 36% / 44% 60% 40% 56%',
    loopBorderRadius: [
      '58% 42% 64% 36% / 44% 60% 40% 56%',
      '48% 52% 58% 42% / 54% 42% 58% 46%',
      '64% 36% 68% 32% / 40% 66% 34% 60%',
      '58% 42% 64% 36% / 44% 60% 40% 56%',
    ],
    entry: {
      x: ['0rem', '-6rem'],
      y: ['0rem', '-12rem'],
      scale: [0.2, 1],
      opacity: [0, 1],
      rotate: [10, 0],
      borderRadius: [
        '58% 42% 64% 36% / 44% 60% 40% 56%',
        '48% 52% 58% 42% / 54% 42% 58% 46%',
      ],
    },
    loop: {
      x: ['-6rem', '-11rem', '-16rem', '-8rem', '-6rem'],
      y: ['-12rem', '-16rem', '-21rem', '-15rem', '-12rem'],
      rotate: [0, -8, -12, -4, 0],
      scale: [1, 1.04, 0.96, 1.02, 1],
      borderRadius: [
        '48% 52% 58% 42% / 54% 42% 58% 46%',
        '64% 36% 68% 32% / 40% 66% 34% 60%',
        '56% 44% 62% 38% / 50% 58% 42% 50%',
        '48% 52% 58% 42% / 54% 42% 58% 46%',
      ],
    },
    duration: 32,
    delay: 0.15,
  },
];

function LiquidBlob({ block, theme }) {
  const MotionDiv = motion.div;
  const [entered, setEntered] = useState(false);

  const animateProps = entered ? block.loop : block.entry;
  const transitionProps = entered
    ? {
        duration: block.duration,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      }
    : {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: block.delay,
      };

  return (
    <MotionDiv
      key={`${theme.name}-${block.id}`}
      initial={{
        scale: 0.2,
        opacity: 0,
        x: 0,
        y: 0,
        rotate: 0,
        borderRadius: block.initialBorderRadius,
      }}
      animate={animateProps}
      transition={transitionProps}
      onAnimationComplete={() => {
        if (!entered) setEntered(true);
      }}
      className={`absolute ${block.className}`}
      style={{
        background: `
          linear-gradient(
            135deg,
            rgba(255,255,255,0.4) 0%,
            rgba(150,150,150,0.1) 50%,
            rgba(0,0,0,0.3) 100%
          ),
          radial-gradient(circle at 25% 20%, ${theme.accentSoft}, transparent 52%),
          radial-gradient(circle at 70% 75%, ${theme.overlay}, transparent 48%)
        `,
        boxShadow: `
          inset 0 0 20px rgba(255,255,255,0.3),
          inset -18px -22px 40px rgba(15,23,42,0.16),
          0 40px 90px rgba(2,6,23,0.18)
        `,
        backdropFilter: 'blur(72px)',
        WebkitBackdropFilter: 'blur(72px)',
        border: '1px solid rgba(255,255,255,0.16)',
      }}
    >
      <div className="absolute inset-[7%] rounded-[inherit] border border-white/8" />
      <div className="absolute inset-[12%] rounded-[inherit] bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.34),transparent_34%)] opacity-80" />
      <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02)_38%,rgba(15,23,42,0.14)_100%)]" />
    </MotionDiv>
  );
}

export default function LiquidGlassBackground({ theme }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-10] overflow-hidden">
      {BLOCKS.map((block) => <LiquidBlob key={`${theme.name}-${block.id}`} block={block} theme={theme} />)}
    </div>
  );
}
