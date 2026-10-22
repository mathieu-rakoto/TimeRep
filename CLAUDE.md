# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TimeRep is a French-language workout interval timer (React 18 + Vite, plain JS/JSX, no TypeScript, no test suite). The user enters a number of sets, an effort duration (optional) and a rest duration; the app then runs effort → rest → effort → rest… automatically. Code comments and UI copy are mostly in French — keep that convention.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint, fails on any warning (`--max-warnings 0`)

There are no tests.

## Architecture

All state and timing logic lives in [src/App.jsx](src/App.jsx); the components in `src/components/` are presentational and receive everything via props. Styling is a single [src/assets/style.css](src/assets/style.css).

Key points in `App.jsx` that span multiple concerns:

- **Phase state machine**: `idle → work → rest → … → done`, held in `phase`. `countDown` is the seconds left in the current phase, derived from a real-clock deadline (`endAtRef`, set by `beginPhase`) rather than by counting ticks, so it survives throttled/suspended timers. Two effects drive it: one 250 ms interval that re-reads the clock (only while running, not paused), and one that beeps during the last 5 seconds and transitions phases when `countDown` hits 0. `startRest` is the single exit from a work phase (used by both timer expiry and the "Set done" button); the set counter is decremented there. The last set is also followed by a rest (played with `setsLeft === 0`, so the user can time their recovery); when that rest ends the transition effect goes to `done`. A Screen Wake Lock is held while a program runs.
- **"Free work" mode**: `workTime === 0` means the effort is untimed. The timer does not tick or beep during that phase; the user ends it with "Set done". Many derived values special-case this (`isFreeWork`, `isFreeWorkPhase`), including the timeline, which uses a nominal effort width (`slotWorkTime` = half the rest time) and pulses the pending set (`pulsingSet`).
- **Timeline progress** (`progress`) is derived from remaining time rather than stored; `SetsTimeline` renders it as a bar of work/rest slots.
- **Skip** works by setting `endAtRef` to now and `countDown` to 0 and letting the transition effect handle the rest.
- **Audio**: a single lazily created `Audio('beep.mp3')` (from `public/`) held in a ref. `handleStart` plays it muted (`beep.muted`, since `volume` is read-only on iOS) once inside the click handler to unlock audio on iOS/mobile; later plays from the timer would otherwise be blocked. Preserve this when changing the start flow.
- `ProgramSetup` collects the inputs (a "Rest only / Rest + reps" switch picks the mode: Rest only, the default, shows only the rest inputs and always sends `workTime = 0`, i.e. free work; Rest + reps adds the effort inputs and requires both durations) and calls `handleStart(sets, workTime, restTime)`; `ProgramControls` renders pause/skip/stop/set-done while running.
