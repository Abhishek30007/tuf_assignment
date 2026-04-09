import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MONTH_IMAGES = [
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1539607547234-a09dd906b3bc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1574774191469-3d7732e5fc8b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1563299796-17596ed6b05e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1502280963622-71c4b223d6a2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800',
];

const monthVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 64 : -64,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.018,
      delayChildren: 0.04,
    },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -64 : 64,
    transition: {
      duration: 0.3,
      ease: [0.55, 0, 0.55, 0.2],
    },
  }),
};

const dayVariants = {
  enter: { opacity: 0, y: 18, scale: 0.92 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
      mass: 0.8,
    },
  },
};

export default function CalendarCard({
  currentMonth,
  monthDirection,
  setMonthDirection,
  setCurrentMonth,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  hoveredDate,
  setHoveredDate,
  theme,
  darkMode,
}) {
  const MotionButton = motion.button;
  const MotionDiv = motion.div;
  const MotionImg = motion.img;
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonthIndex = currentMonth.getMonth();
  const currentMonthImage = MONTH_IMAGES[currentMonthIndex];

  const handleDateClick = (day) => {
    if (!startDate || endDate) {
      setStartDate(day);
      setEndDate(null);
      return;
    }
    if (isBefore(day, startDate)) {
      setEndDate(startDate);
      setStartDate(day);
      return;
    }
    setEndDate(day);
  };

  const goToPreviousMonth = () => {
    setMonthDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setMonthDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isSelected = (day) => (
    Boolean(startDate && isSameDay(day, startDate)) ||
    Boolean(endDate && isSameDay(day, endDate))
  );

  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    return isWithinInterval(day, { start: startDate, end: endDate });
  };

  const isHovered = (day) => Boolean(hoveredDate && isSameDay(day, hoveredDate));

  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/5 p-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-7 lg:p-8"
      style={{ boxShadow: `0 32px 64px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 ${theme.accentBorder}` }}
    >
      {/* Dynamic Background Highlight */}
      <div
        className="pointer-events-none absolute -top-24 right-[-4.5rem] h-64 w-64 rounded-full blur-[100px] opacity-40"
        style={{ background: theme.accentSoft }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] font-medium ${theme.badgeText}`}
              style={{ borderColor: theme.accentBorder }}
            >
              <Sparkles size={12} />
              Floating planner
            </div>
            <h2 className="mt-4 flex items-center gap-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              <CalendarDays className={theme.iconText} size={28} />
              {format(monthStart, 'MMMM yyyy')}
            </h2>
          </div>

          <div className="flex gap-2 self-start">
            <MotionButton
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousMonth}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/15"
              style={{ borderColor: theme.accentBorder }}
            >
              <ChevronLeft size={20} />
            </MotionButton>
            <MotionButton
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNextMonth}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/15"
              style={{ borderColor: theme.accentBorder }}
            >
              <ChevronRight size={20} />
            </MotionButton>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <MotionImg
                key={currentMonthIndex}
                src={currentMonthImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: darkMode ? 0.35 : 0.55, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            {/* Darker/Lighter Overlay for Legibility */}
            <div className={cn(
              "absolute inset-0 z-10 backdrop-blur-[2px]",
              darkMode ? "bg-black/40" : "bg-white/10"
            )} />
          </div>

          {/* Week Days Header */}
          <div className="relative z-20 grid grid-cols-7 gap-2 px-4 pt-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            {weekDays.map((day) => <div key={day}>{day}</div>)}
          </div>

          {/* Grid Content */}
          <div className="relative z-20 p-4 sm:p-5">
            <AnimatePresence custom={monthDirection} mode="wait">
              <MotionDiv
                key={format(monthStart, 'yyyy-MM')}
                custom={monthDirection}
                variants={monthVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-7 gap-2 sm:gap-3"
              >
                {days.map((day) => {
                  const selected = isSelected(day);
                  const inRange = isInRange(day);
                  const outsideMonth = !isSameMonth(day, monthStart);
                  const hovered = isHovered(day);

                  return (
                    <MotionDiv key={day.toISOString()} variants={dayVariants} className="relative aspect-square">
                      {/* Range Background */}
                      {inRange && !selected && (
                        <div 
                          className="pointer-events-none absolute inset-y-[15%] inset-x-0 z-0 opacity-40"
                          style={{ background: theme.accent }}
                        />
                      )}

                      <MotionButton
                        whileHover={{ y: -4, scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
                        whileTap={{ scale: 0.94 }}
                        onMouseEnter={() => setHoveredDate(day)}
                        onMouseLeave={() => setHoveredDate(null)}
                        onClick={() => handleDateClick(day)}
                        className={cn(
                          'relative z-10 flex h-full w-full items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 backdrop-blur-sm',
                          darkMode 
                            ? (outsideMonth ? 'border-white/5 bg-white/5 text-white/20' : 'border-white/15 bg-white/10 text-white shadow-xl')
                            : (outsideMonth ? 'border-black/5 bg-black/5 text-black/20' : 'border-white/40 bg-white/30 text-slate-900 shadow-md'),
                          selected && 'border-white/40 shadow-2xl'
                        )}
                        style={{
                          background: selected ? `linear-gradient(135deg, ${theme.accent}, rgba(255,255,255,0.9))` : undefined,
                          color: selected ? '#000' : undefined,
                          borderColor: hovered && !selected ? theme.accent : undefined
                        }}
                      >
                        <span className="relative z-10">{format(day, 'd')}</span>
                      </MotionButton>
                    </MotionDiv>
                  );
                })}
              </MotionDiv>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Status Info */}
        <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          {[
            { label: 'Selected', val: startDate ? format(startDate, 'MMM d') : 'None' },
            { label: 'Range End', val: endDate ? format(endDate, 'MMM d') : 'Single day' },
            { label: 'Preview', val: hoveredDate ? format(hoveredDate, 'MMM d') : '—' }
          ].map((item, i) => (
            <div key={i}>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{item.label}</p>
              <p className="mt-1 text-sm font-medium text-white">{item.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}