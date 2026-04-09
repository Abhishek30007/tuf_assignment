import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
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

const WHEEL_OFFSETS = [-1, 0, 1];

const monthVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 50 : -50 }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.015,
      delayChildren: 0.02,
    },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -50 : 50,
    transition: { duration: 0.26, ease: [0.55, 0, 0.55, 0.2] },
  }),
};

const dayVariants = {
  enter: { opacity: 0, y: 10, scale: 0.94 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22, mass: 0.82 },
  },
};

function wrapMonth(monthIndex) {
  return ((monthIndex % 12) + 12) % 12;
}

function MonthYearWheel({ currentMonth, setCurrentMonth, setMonthDirection }) {
  const MotionButton = motion.button;
  const MotionDiv = motion.div;
  const monthIndex = currentMonth.getMonth();
  const yearValue = currentMonth.getFullYear();
  const monthNames = Array.from({ length: 12 }, (_, index) =>
    format(new Date(2026, index, 1), 'MMMM'),
  );
  const [expandedWheel, setExpandedWheel] = useState(null);

  const shiftMonth = (delta) => {
    if (!delta) return;
    setMonthDirection(delta > 0 ? 1 : -1);
    setCurrentMonth(addMonths(currentMonth, delta));
  };

  const shiftYear = (delta) => {
    if (!delta) return;
    setMonthDirection(delta > 0 ? 1 : -1);
    setCurrentMonth(new Date(yearValue + delta, monthIndex, 1));
  };

  const onMonthWheel = (event) => {
    event.preventDefault();
    shiftMonth(event.deltaY > 0 ? 1 : -1);
  };

  const onYearWheel = (event) => {
    event.preventDefault();
    shiftYear(event.deltaY > 0 ? 1 : -1);
  };

  const wheelItemClass = (offset) =>
    cn(
      'flex h-14 items-center justify-center font-medium transition-all duration-500',
      offset === 0 ? 'text-white' : 'text-white/30',
    );

  const wheelItemStyle = (offset) => ({
    transform: `perspective(1000px) rotateX(${offset * 18}deg) scale(${offset === 0 ? 1 : 0.86})`,
    opacity: offset === 0 ? 1 : 0.34,
  });

  return (
    <div className="grid grid-cols-[1.55fr_0.95fr] gap-5">
      <div
        onWheel={onMonthWheel}
        onMouseEnter={() => setExpandedWheel('month')}
        onMouseLeave={() => setExpandedWheel((current) => (current === 'month' ? null : current))}
        className="relative overflow-hidden rounded-[2rem] bg-white/[0.05] px-3 py-3 backdrop-blur-3xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(0deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
        <MotionDiv
          animate={{ height: expandedWheel === 'month' ? 182 : 82 }}
          transition={{ type: 'spring', stiffness: 90, damping: 22, mass: 1.2 }}
          className="relative overflow-hidden"
        >
          <MotionDiv
            animate={{ y: expandedWheel === 'month' ? 0 : -58 }}
            transition={{ type: 'spring', stiffness: 80, damping: 24, mass: 1.1 }}
            className="flex flex-col pt-2"
          >
            {WHEEL_OFFSETS.map((offset) => {
              const label = monthNames[wrapMonth(monthIndex + offset)];
              return (
                <MotionButton
                  key={`month-${label}-${offset}`}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => shiftMonth(offset)}
                  className={wheelItemClass(offset)}
                  style={wheelItemStyle(offset)}
                >
                  <span className={offset === 0 ? 'text-4xl font-semibold tracking-[-0.05em]' : 'text-2xl'}>
                    {label}
                  </span>
                </MotionButton>
              );
            })}
          </MotionDiv>
        </MotionDiv>
      </div>

      <div
        onWheel={onYearWheel}
        onMouseEnter={() => setExpandedWheel('year')}
        onMouseLeave={() => setExpandedWheel((current) => (current === 'year' ? null : current))}
        className="relative overflow-hidden rounded-[2rem] bg-white/[0.05] px-3 py-3 backdrop-blur-3xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(0deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
        <MotionDiv
          animate={{ height: expandedWheel === 'year' ? 182 : 82 }}
          transition={{ type: 'spring', stiffness: 90, damping: 22, mass: 1.2 }}
          className="relative overflow-hidden"
        >
          <MotionDiv
            animate={{ y: expandedWheel === 'year' ? 0 : -58 }}
            transition={{ type: 'spring', stiffness: 80, damping: 24, mass: 1.1 }}
            className="flex flex-col pt-2"
          >
            {WHEEL_OFFSETS.map((offset) => {
              const year = yearValue + offset;
              return (
                <MotionButton
                  key={`year-${year}`}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => shiftYear(offset)}
                  className={wheelItemClass(offset)}
                  style={wheelItemStyle(offset)}
                >
                  <span className={offset === 0 ? 'text-4xl font-semibold tracking-[-0.05em]' : 'text-2xl'}>
                    {year}
                  </span>
                </MotionButton>
              );
            })}
          </MotionDiv>
        </MotionDiv>
      </div>
    </div>
  );
}

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

  const isSelected = (day) =>
    Boolean(startDate && isSameDay(day, startDate)) || Boolean(endDate && isSameDay(day, endDate));

  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    return isWithinInterval(day, { start: startDate, end: endDate });
  };

  const isHovered = (day) => Boolean(hoveredDate && isSameDay(day, hoveredDate));

  const stepMonth = (delta) => {
    setMonthDirection(delta > 0 ? 1 : -1);
    setCurrentMonth(addMonths(currentMonth, delta));
  };

  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.52)] backdrop-blur-3xl sm:p-6 lg:p-7"
      style={{ boxShadow: `0 32px 64px -12px rgba(0, 0, 0, 0.52), inset 0 1px 0 ${theme.accentBorder}` }}
    >
      <div
        className="pointer-events-none absolute -top-20 right-[-4rem] h-52 w-52 rounded-full blur-[100px] opacity-30"
        style={{ background: theme.accentSoft }}
      />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/[0.05] p-3 backdrop-blur-3xl">
              <CalendarDays className={theme.iconText} size={22} />
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/42">Date Navigator</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">
                {format(monthStart, 'MMMM yyyy')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MotionButton
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => stepMonth(-1)}
              className="rounded-full bg-white/[0.05] p-3 text-white/80 backdrop-blur-3xl"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </MotionButton>
            <MotionButton
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => stepMonth(1)}
              className="rounded-full bg-white/[0.05] p-3 text-white/80 backdrop-blur-3xl"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </MotionButton>
          </div>
        </div>

        <MonthYearWheel
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          setMonthDirection={setMonthDirection}
        />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <MotionImg
                key={currentMonthIndex}
                src={currentMonthImage}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 0.52, scale: 1 }}
                exit={{ opacity: 0, scale: 1.08 }}
                transition={{ duration: 0.7, ease: 'circOut' }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div className="relative z-10 overflow-hidden rounded-[inherit] bg-black/12 p-3 backdrop-blur-3xl sm:p-4">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.26))]" />

            <div className="relative z-20 grid grid-cols-7 gap-2 px-2 pb-4 pt-2 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-white/42">
              {weekDays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="relative z-20">
              <AnimatePresence custom={monthDirection} mode="wait">
                <MotionDiv
                  key={format(monthStart, 'yyyy-MM')}
                  custom={monthDirection}
                  variants={monthVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="grid grid-cols-7 gap-2"
                >
                  {days.map((day) => {
                    const selected = isSelected(day);
                    const inRange = isInRange(day);
                    const outsideMonth = !isSameMonth(day, monthStart);
                    const hovered = isHovered(day);

                    return (
                      <MotionDiv key={day.toISOString()} variants={dayVariants} className="relative aspect-square">
                        {inRange && !selected && (
                          <div
                            className="pointer-events-none absolute inset-0 z-0 rounded-full opacity-36"
                            style={{ backgroundColor: theme.accent }}
                          />
                        )}

                        <MotionButton
                          whileHover={{ y: -3, scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          onMouseEnter={() => setHoveredDate(day)}
                          onMouseLeave={() => setHoveredDate(null)}
                          onClick={() => handleDateClick(day)}
                          className={cn(
                            'relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-full border text-sm font-semibold transition-all duration-300 backdrop-blur-sm',
                            outsideMonth
                              ? 'border-white/5 bg-white/[0.04] text-white/18'
                              : 'border-white/10 bg-white/[0.08] text-white shadow-xl',
                            selected && 'border-white/20 text-slate-950 shadow-2xl',
                            hovered && !selected && 'bg-white/[0.14]',
                          )}
                          style={{
                            backgroundColor: selected
                              ? theme.accent
                              : undefined,
                            borderColor: hovered && !selected ? theme.accent : undefined,
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
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-[1.8rem] bg-white/[0.03] p-4 backdrop-blur-3xl">
          {[
            { label: 'Selected', value: startDate ? format(startDate, 'MMM d') : 'None' },
            { label: 'Range End', value: endDate ? format(endDate, 'MMM d') : 'Single' },
            { label: 'Preview', value: hoveredDate ? format(hoveredDate, 'MMM d') : 'None' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[0.62rem] uppercase tracking-[0.32em] text-white/38">{item.label}</p>
              <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
