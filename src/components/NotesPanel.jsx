import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { BookText, LockOpen, Orbit, Pin, WandSparkles } from 'lucide-react';

const MAX_STACK_SIZE = 4;
const STACK_DEPTH = 4;

const stackVisuals = [
  {
    opacity: 1,
    scale: 1,
    top: 0,
    rotateX: 0,
    zIndex: 40,
  },
  {
    opacity: 0.6,
    scale: 0.95,
    top: -12,
    rotateX: 8,
    zIndex: 30,
  },
  {
    opacity: 0.3,
    scale: 0.9,
    top: -24,
    rotateX: 11,
    zIndex: 20,
  },
  {
    opacity: 0.18,
    scale: 0.86,
    top: -36,
    rotateX: 13,
    zIndex: 10,
  },
];

function buildHeading(startDate, endDate) {
  if (!startDate) return 'Notes in orbit';
  if (!endDate) return `Notes for ${format(startDate, 'MMMM d')}`;
  return `Notes for ${format(startDate, 'MMMM d')} - ${format(endDate, 'MMMM d')}`;
}

function createStackEntry({ noteKey, label, startDate, endDate, value }) {
  return {
    key: noteKey,
    label,
    heading: buildHeading(startDate, endDate),
    startDate: startDate ? startDate.toISOString() : null,
    endDate: endDate ? endDate.toISOString() : null,
    value,
  };
}

function isAdjacentSingleDay(previousDate, nextDate, hasRange) {
  if (!previousDate || !nextDate || hasRange) return false;
  return Math.abs(differenceInCalendarDays(nextDate, previousDate)) === 1;
}

function PastSlide({ entry, index, theme }) {
  const visual = stackVisuals[index] ?? stackVisuals[stackVisuals.length - 1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{
        opacity: visual.opacity,
        scale: visual.scale,
        top: visual.top,
      }}
      exit={{ opacity: 0, y: -18, scale: 0.84 }}
      transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.86 }}
      className="pointer-events-none absolute inset-x-4 rounded-[1.9rem] border border-white/10 bg-white/[0.06] backdrop-blur-3xl sm:inset-x-5"
      style={{
        zIndex: visual.zIndex,
        transformOrigin: 'top center',
        boxShadow: `0 18px 50px rgba(15, 23, 42, 0.18), inset 0 1px 0 ${theme.accentBorder}`,
      }}
    >
      <div className="absolute inset-0 rounded-[1.9rem] bg-[linear-gradient(155deg,rgba(255,255,255,0.18),rgba(255,255,255,0.05)_48%,rgba(15,23,42,0.12))]" />
      <div
        className="relative rounded-[1.9rem] px-6 pb-4 pt-5 text-slate-100"
        style={{ transform: `perspective(1400px) rotateX(${visual.rotateX}deg)` }}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.62rem] uppercase tracking-[0.32em] text-slate-300/72">
            Past slide {index}
          </p>
          <span className="truncate text-[0.62rem] uppercase tracking-[0.28em] text-slate-300/50">
            {entry.label}
          </span>
        </div>
        <h4 className="mt-3 truncate text-xl font-semibold tracking-[-0.03em] text-white/92">
          {entry.heading}
        </h4>
      </div>
    </motion.div>
  );
}

export default function NotesPanel({
  noteKey,
  label,
  hint,
  selectionMode,
  editable,
  value,
  onChange,
  theme,
  startDate,
  endDate,
}) {
  const MotionDiv = motion.div;
  const hasActiveTarget = noteKey !== 'empty';
  const activeAnchor = endDate ?? startDate;
  const nextDateLabel = activeAnchor ? format(addDays(activeAnchor, 1), 'MMMM d') : null;

  const [deckState, setDeckState] = useState({
    entries: [],
    transitionMode: 'drop',
    previousAnchor: null,
    previousSignature: null,
  });

  const currentSignature =
    editable && hasActiveTarget && startDate
      ? `${noteKey}:${startDate.toISOString()}:${endDate ? endDate.toISOString() : 'single'}`
      : 'idle';

  useEffect(() => {
    if (!editable || !hasActiveTarget || !startDate) return undefined;

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setDeckState((currentDeck) => {
        if (currentDeck.previousSignature === currentSignature) return currentDeck;

        const adjacentMove = isAdjacentSingleDay(
          currentDeck.previousAnchor,
          startDate,
          Boolean(endDate),
        );
        const nextEntry = createStackEntry({ noteKey, label, startDate, endDate, value });
        const withoutCurrent = currentDeck.entries.filter((entry) => entry.key !== noteKey);

        return {
          entries: [nextEntry, ...withoutCurrent].slice(0, MAX_STACK_SIZE),
          transitionMode: adjacentMove ? 'adjacent' : 'drop',
          previousAnchor: startDate,
          previousSignature: currentSignature,
        };
      });
    });

    return () => {
      cancelled = true;
    };
  }, [currentSignature, editable, endDate, hasActiveTarget, label, noteKey, startDate, value]);

  useEffect(() => {
    if (!editable || !hasActiveTarget) return undefined;

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setDeckState((currentDeck) => {
        if (!currentDeck.entries.length || currentDeck.entries[0].key !== noteKey) return currentDeck;

        const updatedTop = {
          ...currentDeck.entries[0],
          value,
          label,
          heading: buildHeading(startDate, endDate),
        };

        return {
          ...currentDeck,
          entries: [updatedTop, ...currentDeck.entries.slice(1)],
        };
      });
    });

    return () => {
      cancelled = true;
    };
  }, [editable, endDate, hasActiveTarget, label, noteKey, startDate, value]);

  const visibleStack = useMemo(() => deckState.entries.slice(0, STACK_DEPTH), [deckState.entries]);
  const activeEntry = visibleStack[0] ?? null;
  const pastEntries = visibleStack.slice(1, 4);
  const transitionMode = deckState.transitionMode;

  const activeCardInitial =
    transitionMode === 'adjacent'
      ? { opacity: 0, y: -24, x: 64, scale: 0.98 }
      : { opacity: 0, y: -108, x: 0, scale: 0.97 };

  return (
    <div className="relative [perspective:1600px]">
      <MotionDiv
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.4)] backdrop-blur-3xl sm:p-7 lg:min-h-[42rem] lg:p-8"
        style={{ boxShadow: `0 24px 80px rgba(15, 23, 42, 0.4), inset 0 1px 0 ${theme.accentBorder}` }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_48%,rgba(15,23,42,0.12))]" />
        <div
          className="pointer-events-none absolute -right-14 top-8 h-40 w-40 rounded-full blur-3xl"
          style={{ background: theme.accentSoft }}
        />

        <motion.div
          animate={
            editable
              ? { y: 24, scaleY: 0.93, opacity: 0.42, filter: 'blur(0.6px)' }
              : { y: 0, scaleY: 1, opacity: 1, filter: 'blur(0px)' }
          }
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="relative z-0 flex min-h-[30rem] flex-col"
          style={{ transformOrigin: 'top center' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border bg-slate-950/18 px-3 py-1 text-xs uppercase tracking-[0.3em] ${theme.badgeText}`}
                style={{ borderColor: theme.accentBorder }}
              >
                {selectionMode === 'selected' ? <Pin size={14} /> : <Orbit size={14} />}
                {selectionMode === 'selected' ? 'Pinned note' : 'Preview mode'}
              </div>
              <h3 className="mt-4 flex items-center gap-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                <BookText className={theme.iconText} size={22} />
                Floating notes
              </h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-200/72">{hint}</p>
            </div>

            <div
              className="rounded-2xl border border-white/12 bg-white/10 p-3 text-slate-100/85"
              style={{ borderColor: theme.accentBorder }}
            >
              {editable ? <WandSparkles size={18} /> : <LockOpen size={18} />}
            </div>
          </div>

          <div
            className="mt-7 flex flex-1 flex-col rounded-[1.8rem] border border-white/10 bg-slate-950/24 p-5 shadow-inner shadow-slate-950/20 sm:p-6"
            style={{ borderColor: theme.accentBorder }}
          >
            <div className="mb-4 flex items-center justify-between px-2 text-[0.68rem] uppercase tracking-[0.28em] text-slate-300/52">
              <span>Preview mode</span>
              <span>{hasActiveTarget ? label : 'No selection'}</span>
            </div>

            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] px-5 py-6 text-sm leading-8 text-slate-300/66">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400/60">Current layer</p>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-200/74">
                {hasActiveTarget
                  ? 'The selected note now lands as the front sheet while earlier notes compress upward into a floating stack behind it.'
                  : 'Choose a date to create a layered deck of recent notes. Adjacent days will glide laterally to feel like a continuous film strip.'}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-x-6 top-6 z-20 sm:inset-x-7 sm:top-7 lg:inset-x-8 lg:top-8">
          <div className="relative min-h-[31rem] pt-12">
            <AnimatePresence initial={false}>
              {editable &&
                pastEntries.map((entry, index) => (
                  <PastSlide
                    key={entry.key}
                    entry={entry}
                    index={index + 1}
                    theme={theme}
                  />
                ))}
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              {editable && activeEntry && (
                <MotionDiv
                  key={activeEntry.key}
                  layout
                  initial={activeCardInitial}
                  animate={{ y: 0, x: 0, opacity: 1, scale: 1, rotateX: 0, z: 0 }}
                  exit={{
                    opacity: 0,
                    y: -22,
                    x: transitionMode === 'adjacent' ? -48 : 0,
                    scale: 0.95,
                  }}
                  transition={{ type: 'spring', stiffness: 170, damping: 18, mass: 0.88 }}
                  className="relative z-40"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -64 }}
                    animate={{ opacity: 0.72, y: -10 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute inset-x-[16%] -top-16 h-24 overflow-hidden rounded-b-[2rem]"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.0),rgba(255,255,255,0.22)_42%,rgba(255,255,255,0.0))] blur-xl" />
                    <div className="absolute inset-x-8 top-1 h-px bg-white/55" />
                    <div className="absolute inset-x-12 top-5 h-px bg-white/35" />
                    <div className="absolute inset-x-16 top-10 h-px bg-white/22" />
                  </motion.div>

                  {nextDateLabel && (
                    <motion.div
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.5, delay: 0.08 }}
                      className="pointer-events-none absolute bottom-5 right-[-1.8rem] top-8 w-[3.8rem] overflow-hidden rounded-[1.8rem] border border-black/6 bg-white/82 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                    >
                      <div className="flex h-full flex-col items-center justify-between px-3 py-5 text-center">
                        <span className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-400">Next</span>
                        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-700 [writing-mode:vertical-rl] rotate-180">
                          {nextDateLabel}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    layout
                    initial={{ rotateX: -11, z: 42 }}
                    animate={{ rotateX: 0, z: 0 }}
                    transition={{ type: 'spring', stiffness: 190, damping: 16, mass: 0.85 }}
                    className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white p-6 text-slate-950 shadow-[0_26px_80px_rgba(15,23,42,0.26)] sm:p-7 lg:p-8"
                    style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
                  >
                    <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,rgba(16,185,129,0.0),rgba(16,185,129,0.35),rgba(16,185,129,0.0))]" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-slate-400">
                            Active State
                          </p>
                          <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                            {activeEntry.heading}
                          </h3>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-500">
                          <Pin size={18} />
                        </div>
                      </div>

                      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                        New selections drop into the front of the deck while older notes recede upward as translucent slides, preserving a visible trail of recent context.
                      </p>

                      <textarea
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        readOnly={!editable}
                        placeholder="Write your focused notes for this selected date."
                        className="mt-6 min-h-[16rem] w-full resize-none rounded-[1.4rem] border border-slate-200 bg-white px-5 py-5 text-[0.95rem] leading-8 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300"
                      />
                    </div>
                  </motion.div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
