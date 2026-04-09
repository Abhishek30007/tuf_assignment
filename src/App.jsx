import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import CalendarCard from './components/CalendarCard';
import LiquidGlassBackground from './components/LiquidGlassBackground';
import NotesPanel from './components/NotesPanel';

const NOTES_STORAGE_KEY = 'antigravity-calendar-notes-v1';
const MONTH_EDITORIAL = {
  0: {
    title: 'Winter whispers through frosted glass.',
    subtitle: 'A crystal-clear stage for your new year resolutions.',
  },
  1: {
    title: 'Love notes in a digital orbit.',
    subtitle: 'Capturing moments of connection in a weightless environment.',
  },
  2: {
    title: 'March notes descend like floating film cards.',
    subtitle: 'A frosted calendar on the left, a larger note stage on the right.',
  },
  3: {
    title: 'Spring rains refresh the glass interface.',
    subtitle: 'Watch your tasks bloom as the season turns.',
  },
  4: {
    title: 'Lush greenery meets translucent design.',
    subtitle: 'Navigating through the vibrant energy of late spring.',
  },
  5: {
    title: 'Golden hour glows behind the grid.',
    subtitle: 'Long days and floating plans under a summer sun.',
  },
  6: {
    title: 'Deep blue horizons in every scroll.',
    subtitle: 'Your summer itinerary, drifting like a calm tide.',
  },
  7: {
    title: 'Thermal heat ripples the frosted stage.',
    subtitle: 'High summer notes captured in a shimmering glass state.',
  },
  8: {
    title: 'Autumnal embers glow behind the glass.',
    subtitle: 'Harvesting ideas as the year begins its graceful descent.',
  },
  9: {
    title: 'Moody mists mask the floating planner.',
    subtitle: 'Spooky notes and atmospheric transitions.',
  },
  10: {
    title: 'Cozy shadows and crisp glass edges.',
    subtitle: 'Preparing for the frost with a focused, tactile stage.',
  },
  11: {
    title: 'Stardust settles on the winter grid.',
    subtitle: 'A celebratory end to a year of floating memories.',
  },
};
const MONTH_THEMES = {
  0: {
    name: 'january',
    accent: 'rgba(125, 211, 252, 0.7)',
    accentSoft: 'rgba(125, 211, 252, 0.18)',
    accentBorder: 'rgba(186, 230, 253, 0.28)',
    badgeText: 'text-cyan-100/85',
    iconText: 'text-cyan-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(147, 230, 255, 0.48), rgba(32, 91, 132, 0.1) 58%, transparent 78%)',
      'radial-gradient(circle at 50% 50%, rgba(94, 182, 255, 0.38), rgba(54, 74, 137, 0.08) 55%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(77, 210, 255, 0.32), rgba(14, 165, 233, 0.06) 58%, transparent 80%)',
    ],
    overlay: 'rgba(148, 220, 255, 0.18)',
  },
  1: {
    name: 'february',
    accent: 'rgba(167, 139, 250, 0.66)',
    accentSoft: 'rgba(167, 139, 250, 0.16)',
    accentBorder: 'rgba(196, 181, 253, 0.28)',
    badgeText: 'text-indigo-100/85',
    iconText: 'text-indigo-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(180, 162, 255, 0.42), rgba(82, 70, 142, 0.1) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(133, 118, 255, 0.36), rgba(76, 29, 149, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(220, 180, 255, 0.24), rgba(99, 102, 241, 0.06) 58%, transparent 80%)',
    ],
    overlay: 'rgba(174, 154, 255, 0.14)',
  },
  2: {
    name: 'march',
    accent: 'rgba(110, 240, 194, 0.62)',
    accentSoft: 'rgba(16, 185, 129, 0.16)',
    accentBorder: 'rgba(167, 243, 208, 0.24)',
    badgeText: 'text-emerald-100/85',
    iconText: 'text-emerald-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(110, 255, 204, 0.38), rgba(6, 78, 59, 0.1) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.3), rgba(2, 44, 34, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(94, 234, 212, 0.18), rgba(6, 95, 70, 0.06) 58%, transparent 80%)',
    ],
    overlay: 'rgba(118, 255, 204, 0.14)',
  },
  3: {
    name: 'april',
    accent: 'rgba(129, 140, 248, 0.64)',
    accentSoft: 'rgba(99, 102, 241, 0.16)',
    accentBorder: 'rgba(165, 180, 252, 0.24)',
    badgeText: 'text-indigo-100/85',
    iconText: 'text-indigo-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(164, 174, 255, 0.4), rgba(67, 56, 202, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(128, 145, 255, 0.3), rgba(49, 46, 129, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(123, 156, 255, 0.22), rgba(45, 212, 191, 0.04) 58%, transparent 80%)',
    ],
    overlay: 'rgba(156, 168, 255, 0.14)',
  },
  4: {
    name: 'may',
    accent: 'rgba(110, 231, 183, 0.62)',
    accentSoft: 'rgba(52, 211, 153, 0.16)',
    accentBorder: 'rgba(167, 243, 208, 0.24)',
    badgeText: 'text-emerald-100/85',
    iconText: 'text-emerald-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(139, 255, 203, 0.36), rgba(22, 101, 52, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.28), rgba(20, 83, 45, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(110, 231, 183, 0.22), rgba(5, 150, 105, 0.06) 58%, transparent 80%)',
    ],
    overlay: 'rgba(110, 255, 198, 0.12)',
  },
  5: {
    name: 'june',
    accent: 'rgba(56, 189, 248, 0.62)',
    accentSoft: 'rgba(14, 165, 233, 0.16)',
    accentBorder: 'rgba(125, 211, 252, 0.24)',
    badgeText: 'text-sky-100/85',
    iconText: 'text-sky-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(126, 230, 255, 0.38), rgba(3, 105, 161, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.28), rgba(30, 64, 175, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(125, 211, 252, 0.24), rgba(59, 130, 246, 0.06) 58%, transparent 80%)',
    ],
    overlay: 'rgba(135, 222, 255, 0.14)',
  },
  6: {
    name: 'july',
    accent: 'rgba(248, 113, 113, 0.5)',
    accentSoft: 'rgba(239, 68, 68, 0.14)',
    accentBorder: 'rgba(252, 165, 165, 0.22)',
    badgeText: 'text-rose-100/80',
    iconText: 'text-rose-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(255, 148, 148, 0.3), rgba(127, 29, 29, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(248, 113, 113, 0.22), rgba(136, 19, 55, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(251, 146, 60, 0.2), rgba(153, 27, 27, 0.05) 58%, transparent 80%)',
    ],
    overlay: 'rgba(255, 163, 163, 0.1)',
  },
  7: {
    name: 'august',
    accent: 'rgba(251, 191, 36, 0.46)',
    accentSoft: 'rgba(245, 158, 11, 0.14)',
    accentBorder: 'rgba(253, 230, 138, 0.22)',
    badgeText: 'text-amber-100/80',
    iconText: 'text-amber-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(255, 215, 117, 0.28), rgba(120, 53, 15, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.2), rgba(146, 64, 14, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(253, 224, 71, 0.18), rgba(180, 83, 9, 0.05) 58%, transparent 80%)',
    ],
    overlay: 'rgba(255, 218, 122, 0.08)',
  },
  8: {
    name: 'september',
    accent: 'rgba(192, 132, 252, 0.5)',
    accentSoft: 'rgba(168, 85, 247, 0.14)',
    accentBorder: 'rgba(221, 214, 254, 0.22)',
    badgeText: 'text-violet-100/82',
    iconText: 'text-violet-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(214, 170, 255, 0.3), rgba(88, 28, 135, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.22), rgba(91, 33, 182, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(196, 181, 253, 0.2), rgba(76, 29, 149, 0.05) 58%, transparent 80%)',
    ],
    overlay: 'rgba(214, 180, 255, 0.1)',
  },
  9: {
    name: 'october',
    accent: 'rgba(251, 146, 60, 0.46)',
    accentSoft: 'rgba(249, 115, 22, 0.14)',
    accentBorder: 'rgba(254, 215, 170, 0.22)',
    badgeText: 'text-orange-100/80',
    iconText: 'text-orange-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(255, 174, 116, 0.3), rgba(124, 45, 18, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.2), rgba(154, 52, 18, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(253, 186, 116, 0.18), rgba(180, 83, 9, 0.05) 58%, transparent 80%)',
    ],
    overlay: 'rgba(255, 194, 134, 0.08)',
  },
  10: {
    name: 'november',
    accent: 'rgba(45, 212, 191, 0.5)',
    accentSoft: 'rgba(20, 184, 166, 0.14)',
    accentBorder: 'rgba(153, 246, 228, 0.2)',
    badgeText: 'text-teal-100/82',
    iconText: 'text-teal-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(112, 250, 230, 0.28), rgba(17, 94, 89, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(45, 212, 191, 0.2), rgba(19, 78, 74, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(125, 211, 252, 0.16), rgba(8, 145, 178, 0.05) 58%, transparent 80%)',
    ],
    overlay: 'rgba(127, 246, 226, 0.08)',
  },
  11: {
    name: 'december',
    accent: 'rgba(125, 211, 252, 0.62)',
    accentSoft: 'rgba(56, 189, 248, 0.16)',
    accentBorder: 'rgba(186, 230, 253, 0.24)',
    badgeText: 'text-sky-100/85',
    iconText: 'text-sky-200',
    orbs: [
      'radial-gradient(circle at 30% 30%, rgba(161, 233, 255, 0.38), rgba(30, 64, 175, 0.08) 58%, transparent 80%)',
      'radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.26), rgba(30, 41, 59, 0.08) 54%, transparent 78%)',
      'radial-gradient(circle at 35% 35%, rgba(191, 219, 254, 0.2), rgba(56, 189, 248, 0.05) 58%, transparent 80%)',
    ],
    overlay: 'rgba(173, 226, 255, 0.14)',
  },
};

function buildSelectionKey(startDate, endDate) {
  if (!startDate) return null;

  const startKey = format(startDate, 'yyyy-MM-dd');
  const endKey = endDate ? format(endDate, 'yyyy-MM-dd') : startKey;

  return `${startKey}__${endKey}`;
}

function buildSelectionLabel(startDate, endDate) {
  if (!startDate) return 'Hover a day to preview notes';
  if (!endDate) return format(startDate, 'MMMM d');
  return `${format(startDate, 'MMMM d')} to ${format(endDate, 'MMMM d')}`;
}

function buildSelectionMeta(startDate, endDate, mode) {
  if (!startDate) {
    return {
      key: 'empty',
      label: 'Hover over a day or lock in a range',
      hint: 'Select a single day or drag through a date range to pin notes to it.',
      editable: false,
      selectionMode: mode,
    };
  }

  const isRange = Boolean(endDate && format(startDate, 'yyyy-MM-dd') !== format(endDate, 'yyyy-MM-dd'));

  return {
    key: buildSelectionKey(startDate, endDate),
    label: buildSelectionLabel(startDate, endDate),
    hint: isRange
      ? 'This note is attached to the full range and will return whenever you revisit it.'
      : 'This note is attached to this day and stays in local storage on this device.',
    editable: mode === 'selected',
    selectionMode: mode,
  };
}

function EditorialHeadline({ monthKey, title, subtitle }) {
  const MotionDiv = motion.div;
  const MotionSpan = motion.span;

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={monthKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.22 } }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white [font-family:var(--font-editorial)] sm:text-5xl lg:text-6xl">
          {title.split('').map((character, index) => (
            <MotionSpan
              key={`${monthKey}-${character}-${index}`}
              initial={{ opacity: 0, y: -52, rotateX: -85 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.018,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block will-change-transform"
              style={{ whiteSpace: character === ' ' ? 'pre' : 'normal' }}
            >
              {character}
            </MotionSpan>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-4 text-sm leading-7 text-slate-200/76 sm:text-base"
        >
          {subtitle}
        </motion.p>
      </MotionDiv>
    </AnimatePresence>
  );
}

function App() {
  const MotionHeader = motion.header;
  const MotionSection = motion.section;
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 2, 1));
  const [monthDirection, setMonthDirection] = useState(1);
  const [startDate, setStartDate] = useState(() => new Date(2026, 2, 11));
  const [endDate, setEndDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [notesBySelection, setNotesBySelection] = useState(() => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (!savedNotes) return {};

      const parsedNotes = JSON.parse(savedNotes);
      if (parsedNotes && typeof parsedNotes === 'object') {
        return parsedNotes;
      }
    } catch (error) {
      console.error('Unable to restore saved notes.', error);
    }

    return {};
  });

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesBySelection));
  }, [notesBySelection]);

  const selectedMeta = useMemo(
    () => buildSelectionMeta(startDate, endDate, 'selected'),
    [startDate, endDate],
  );

  const hoveredMeta = useMemo(
    () => buildSelectionMeta(hoveredDate, null, 'preview'),
    [hoveredDate],
  );

  const activeMeta = selectedMeta.key !== 'empty' ? selectedMeta : hoveredMeta;
  const activeNote = activeMeta.key === 'empty' ? '' : notesBySelection[activeMeta.key] ?? '';
  const currentTheme = MONTH_THEMES[currentMonth.getMonth()] ?? MONTH_THEMES[0];
  const currentEditorial = MONTH_EDITORIAL[currentMonth.getMonth()] ?? MONTH_EDITORIAL[0];
  const currentMonthKey = format(currentMonth, 'yyyy-MM');

  const handleNoteChange = (value) => {
    if (!selectedMeta.editable || selectedMeta.key === 'empty') return;

    setNotesBySelection((currentNotes) => ({
      ...currentNotes,
      [selectedMeta.key]: value,
    }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-6 text-slate-50 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-16">
      <LiquidGlassBackground theme={currentTheme} />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[86rem] flex-col justify-center">
        <MotionHeader
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 max-w-4xl px-2 lg:mb-8"
        >
          <EditorialHeadline
            monthKey={currentMonthKey}
            title={currentEditorial.title}
            subtitle={currentEditorial.subtitle}
          />
        </MotionHeader>

        <div className="grid flex-1 items-stretch gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8 xl:gap-10">
          <MotionSection
            initial={{ opacity: 0, y: 42, x: 38 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <CalendarCard
              currentMonth={currentMonth}
              monthDirection={monthDirection}
              setMonthDirection={setMonthDirection}
              setCurrentMonth={setCurrentMonth}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              hoveredDate={hoveredDate}
              setHoveredDate={setHoveredDate}
              theme={currentTheme}
            />
          </MotionSection>

          <MotionSection
            initial={{ opacity: 0, y: 52, x: 38 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <NotesPanel
              noteKey={activeMeta.key}
              label={activeMeta.label}
              hint={activeMeta.hint}
              selectionMode={activeMeta.selectionMode}
              editable={selectedMeta.editable}
              value={activeNote}
              onChange={handleNoteChange}
              theme={currentTheme}
              startDate={startDate}
              endDate={endDate}
            />
          </MotionSection>
        </div>
      </div>
    </div>
  );
}

export default App;
