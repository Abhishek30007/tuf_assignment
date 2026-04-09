import React, { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const BLOB_CONFIG = [
  {
    id: 'blob-1',
    className:
      'left-[-10rem] top-[2rem] h-[28rem] w-[28rem] sm:h-[40rem] sm:w-[40rem] xl:h-[52rem] xl:w-[52rem]',
    positions: [
      { x: 0, y: 0, rotate: 0, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
      { x: 36, y: -28, rotate: 42, borderRadius: '54% 46% 38% 62% / 52% 42% 58% 48%' },
      { x: -22, y: 18, rotate: 88, borderRadius: '66% 34% 44% 56% / 64% 28% 72% 36%' },
      { x: 18, y: 30, rotate: 136, borderRadius: '58% 42% 34% 66% / 58% 34% 66% 42%' },
    ],
  },
  {
    id: 'blob-2',
    className:
      'bottom-[0rem] right-[-10rem] h-[28rem] w-[28rem] sm:h-[40rem] sm:w-[40rem] xl:h-[52rem] xl:w-[52rem]',
    positions: [
      { x: 0, y: 0, rotate: 0, borderRadius: '58% 42% 64% 36% / 44% 60% 40% 56%' },
      { x: -34, y: 22, rotate: -38, borderRadius: '48% 52% 58% 42% / 54% 42% 58% 46%' },
      { x: 26, y: -18, rotate: -90, borderRadius: '64% 36% 68% 32% / 40% 66% 34% 60%' },
      { x: -18, y: -30, rotate: -140, borderRadius: '56% 44% 62% 38% / 50% 58% 42% 50%' },
    ],
  },
  {
    id: 'blob-3',
    className:
      'top-[20%] left-[10%] h-[24rem] w-[24rem] sm:h-[30rem] sm:w-[30rem] xl:h-[40rem] xl:w-[40rem]',
    positions: [
      { x: 0, y: 0, rotate: 0, borderRadius: '50% 50% 60% 40% / 40% 50% 50% 60%' },
      { x: 22, y: -18, rotate: 30, borderRadius: '45% 55% 50% 50% / 50% 45% 55% 50%' },
      { x: -15, y: 25, rotate: -40, borderRadius: '55% 45% 55% 45% / 45% 55% 45% 55%' },
      { x: -28, y: -20, rotate: -80, borderRadius: '60% 40% 45% 55% / 55% 45% 60% 40%' },
    ],
  },
];

function Blob({ config, theme, index }) {
  const MotionDiv = motion.div;
  const controls = useAnimationControls();

  useEffect(() => {
    let active = true;

    async function run() {
      // Liquid Inflate entry
      await controls.start({
        scale: 1,
        opacity: 0.9,
        x: config.positions[0].x,
        y: config.positions[0].y,
        rotate: config.positions[0].rotate,
        borderRadius: config.positions[0].borderRadius,
        transition: {
          type: 'spring',
          stiffness: 40,
          damping: 25,
          mass: 1.8,
          delay: index * 0.12,
        },
      });

      let pointer = 1;
      // Infinite, non-linear drifting
      while (active) {
        const target = config.positions[pointer % config.positions.length];
        await controls.start({
          x: target.x,
          y: target.y,
          rotate: target.rotate,
          borderRadius: target.borderRadius,
          transition: {
            type: 'spring',
            stiffness: 16,
            damping: 28,
            mass: 2.1,
          },
        });
        pointer += 1;
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [config, controls, index]);

  return (
    <MotionDiv
      initial={{
        scale: 0.2, // Liquid Inflate entry
        opacity: 0,
        x: index === 0 ? -120 : index === 1 ? 120 : -60,
        y: index === 0 ? -120 : index === 1 ? 120 : 60,
        borderRadius: config.positions[0].borderRadius,
      }}
      animate={controls}
      className={`absolute ${config.className}`}
      style={{
        background: theme.orbs[index % theme.orbs.length],
        filter: 'blur(90px)',
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at 20% 22%, rgba(255,255,255,0.18), transparent 28%)`,
        }}
      />
    </MotionDiv>
  );
}

export default function SpatialBlobs({ theme }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0]">
      {BLOB_CONFIG.map((config, index) => (
        <Blob key={config.id} config={config} theme={theme} index={index} />
      ))}
    </div>
  );
}
