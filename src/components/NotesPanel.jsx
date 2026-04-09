import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { addDays, format } from 'date-fns';
import { BookText, LockOpen, Orbit, Pin, WandSparkles } from 'lucide-react';

const panelVariants = {
  hidden: (mode) => ({
    opacity: 0,
    rotateY: mode === 'preview' ? -16 : 12,
    x: mode === 'preview' ? 48 : 64,
    scale: 0.94,
  }),
  visible: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 180,
      damping: 18,
      mass: 0.85,
    },
  },
  exit: (mode) => ({
    opacity: 0,
    rotateY: mode === 'preview' ? 14 : -12,
    x: mode === 'preview' ? -24 : 30,
    scale: 0.98,
    transition: {
      duration: 0.26,
      ease: [0.55, 0, 0.55, 0.2],
    },
  }),
};

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
  const headingText = startDate
    ? endDate
      ? `Notes for ${format(startDate, 'MMMM d')} - ${format(endDate, 'MMMM d')}`
      : `Notes for ${format(startDate, 'MMMM d')}`
    : 'Notes in orbit';

  return (
    <div className="relative [perspective:1600px]">
      <MotionDiv
        className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-7 lg:min-h-[42rem] lg:p-8"
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
              ? { y: 26, scaleY: 0.93, opacity: 0.45, filter: 'blur(0.4px)' }
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
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-200/72">
                {hint}
              </p>
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
                  ? 'The selected note is now entering as a focused sheet. This underlying preview layer compresses and slips downward to preserve the sense of physical depth.'
                  : 'Choose March 11 or any nearby date to trigger the active note card. Preview content stays muted until a date is pinned.'}
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait" custom={selectionMode}>
          {editable && hasActiveTarget && (
            <MotionDiv
              key={noteKey}
              custom={selectionMode}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-x-6 top-6 z-20 sm:inset-x-7 sm:top-7 lg:inset-x-8 lg:top-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -64 }}
                animate={{ opacity: 0.7, y: -10 }}
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
                initial={{ y: -100, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 170, damping: 18, mass: 0.88 }}
                className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white p-6 text-slate-950 shadow-[0_26px_80px_rgba(15,23,42,0.26)] sm:p-7 lg:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,rgba(16,185,129,0.0),rgba(16,185,129,0.35),rgba(16,185,129,0.0))]" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-slate-400">
                        Active State
                      </p>
                      <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                        {headingText}
                      </h3>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-500">
                      <Pin size={18} />
                    </div>
                  </div>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                    This clean note sheet drops in from above, overtaking the preview layer while keeping adjacent days queued at the edge for smooth side-slide continuation.
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
      </MotionDiv>
    </div>
  );
}
