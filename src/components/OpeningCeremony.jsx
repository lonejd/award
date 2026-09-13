import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CEREMONY } from "../data/awards";
import { scaleTime, usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const ease = [0.22, 1, 0.36, 1];

const BEATS = [
  { id: "void", hold: 900 },
  { id: "spotlight", hold: 1600 },
  { id: "welcome", hold: 1600 },
  { id: "title", hold: 2200 },
  { id: "year", hold: 1500 },
  { id: "dedication", hold: 2400 },
  { id: "line1", hold: 2800 },
  { id: "line2", hold: 2600 },
  { id: "cta", hold: 0 },
];

export default function OpeningCeremony({ onBegin, audio }) {
  const reduced = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const [beat, setBeat] = useState(0);

  const enterTheatre = (event) => {
    event.preventDefault();
    const theme = document.getElementById("ceremony-theme");
    if (theme) {
      theme.muted = false;
      theme.volume = 0.6;
      theme.loop = true;
      theme.play().catch(() => {
        audio?.playTheme();
      });
    } else {
      audio?.playTheme();
    }
    setArmed(true);
  };

  useEffect(() => {
    if (!armed) return undefined;
    const current = BEATS[beat];
    if (!current || current.hold === 0) return undefined;
    const timer = window.setTimeout(() => {
      setBeat((value) => Math.min(value + 1, BEATS.length - 1));
    }, scaleTime(current.hold, reduced));
    return () => window.clearTimeout(timer);
  }, [armed, beat, reduced]);

  const id = BEATS[beat].id;
  const show = (name) => BEATS.findIndex((item) => item.id === name) <= beat;
  const titleCard = ["title", "year", "dedication"].includes(id);

  if (!armed) {
    return (
      <button
        type="button"
        className="stage-screen opening enter-gate"
        onClick={enterTheatre}
      >
        <div className="opening-spot" />
        <div className="opening-copy">
          <p className="eyebrow">Press anywhere</p>
        </div>
      </button>
    );
  }

  return (
    <section className="stage-screen opening" onPointerDown={() => audio?.playTheme()}>
      <motion.div
        className="opening-spot"
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{
          opacity: show("spotlight") ? 1 : 0,
          scale: show("spotlight") ? 1 : 0.72,
        }}
        transition={{ duration: reduced ? 0.2 : 2.4, ease }}
      />

      <div className="opening-copy">
        <AnimatePresence mode="wait">
          {id === "welcome" && (
            <motion.p
              key="welcome"
              className="eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease }}
            >
              Welcome to
            </motion.p>
          )}
        </AnimatePresence>

        {titleCard && (
          <motion.h1
            className="display-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.2 : 1.6, ease }}
          >
            {CEREMONY.title}
          </motion.h1>
        )}

        {titleCard && show("year") && (
          <motion.p
            className="year-mark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease }}
          >
            {CEREMONY.year}
          </motion.p>
        )}

        {id === "dedication" && (
          <motion.p
            className="dedication"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease }}
          >
            {CEREMONY.dedication}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {id === "line1" && (
            <motion.p
              key="line1"
              className="spoken"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease }}
            >
              Tonight, every award has only one winner.
            </motion.p>
          )}
          {id === "line2" && (
            <motion.p
              key="line2"
              className="spoken"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease }}
            >
              And somehow… she still deserves all of them.
            </motion.p>
          )}
        </AnimatePresence>

        {id === "cta" && (
          <motion.div
            className="opening-cta"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease }}
          >
            <p className="spoken linger">
              And somehow… she still deserves all of them.
            </p>
            <button type="button" className="begin-button" onClick={onBegin}>
              <span>Begin Ceremony</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
