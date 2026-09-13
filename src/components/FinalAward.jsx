import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scaleTime } from "../hooks/usePrefersReducedMotion";
import WinnerPhoto from "./WinnerPhoto";
import WinnerReveal from "./WinnerReveal";

const ease = [0.22, 1, 0.36, 1];

function Line({ children, className = "spoken" }) {
  return (
    <section className="stage-screen">
      <motion.p
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease }}
      >
        {children}
      </motion.p>
    </section>
  );
}

export default function FinalAward({ award, phase, reduced }) {
  if (phase === "final-intro") {
    return (
      <section className="stage-screen">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease }}
        >
          The Final Award
        </motion.p>
      </section>
    );
  }

  if (phase === "final-no-nominees") {
    return <Line>This category has no nominees.</Line>;
  }

  if (phase === "final-no-competition") {
    return <Line>Because there was never any competition.</Line>;
  }

  if (phase === "final-category") {
    return (
      <section className="stage-screen">
        <motion.h2
          className="category-title finale-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.2 : 1.6, ease }}
        >
          <span>The Person I Choose</span>
        </motion.h2>
      </section>
    );
  }

  if (phase === "final-winner-is") {
    return <Line className="suspense-line">And the winner is</Line>;
  }

  if (phase === "final-reveal") {
    return <WinnerReveal award={award} reduced={reduced} />;
  }

  if (phase === "final-photo") {
    return <FinalePortrait award={award} reduced={reduced} />;
  }

  if (phase === "message-thanks") {
    return (
      <section className="stage-screen">
        <motion.h2
          className="thanks-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          Thank you for being you.
        </motion.h2>
      </section>
    );
  }

  if (phase === "message-letter") {
    return (
      <section className="stage-screen">
        <motion.blockquote
          className="final-letter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease }}
        >
          <p>You Complete Me....</p>
          <p>Guga</p>
        </motion.blockquote>
      </section>
    );
  }

  if (phase === "message-birthday") {
    return (
      <section className="stage-screen">
        <motion.div
          className="birthday-close"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease }}
        >
          <h2>Advance Happy Birthday Ms Gugappriyaa ❤️</h2>
          <p>
            With love,
            <br />
            Jeevan
          </p>
        </motion.div>
      </section>
    );
  }

  return null;
}

function FinalePortrait({ award, reduced }) {
  const [beat, setBeat] = useState(0);
  const vows = [
    { title: "Ms Gugappriyaa", line: "The person I choose." },
    { line: "Today." },
    { line: "Tomorrow." },
    { line: "Forever." },
  ];

  useEffect(() => {
    if (beat >= vows.length - 1) return undefined;
    const holds = [3200, 2400, 2400];
    const timer = window.setTimeout(() => {
      setBeat((value) => value + 1);
    }, scaleTime(holds[beat], reduced));
    return () => window.clearTimeout(timer);
  }, [beat, reduced, vows.length]);

  const current = vows[beat];

  return (
    <section className="stage-screen photo-screen finale-photo">
      <WinnerPhoto award={award} reduced={reduced} embedded hideCaption />
      <div className={`finale-overlay${current.title ? "" : " vows"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={beat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease }}
          >
            {current.title && <h2 className="winner-name">{current.title}</h2>}
            <p>{current.line}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
