import { motion } from "framer-motion";
import { CEREMONY } from "../data/awards";

const ease = [0.22, 1, 0.36, 1];

const BLOCKS = [
  { label: null, value: CEREMONY.title, display: true },
  { label: null, value: "A Jeevan Production" },
  { label: "Starring", value: "Ms Gugappriyaa" },
  {
    label: "Featuring",
    value: "Her smile\nHer eyes\nHer laugh\nHer heart\nHer beautiful chaos",
  },
  { label: "Written by", value: "Jeevan" },
  { label: "Directed by", value: "Love" },
  { label: "Produced by", value: "Two people who met at an office" },
  { label: "Special Thanks", value: "To that first look at the office entrance." },
];

export default function Credits({ phase, reduced }) {
  if (phase === "credits") {
    return (
      <section className="stage-screen credits-screen">
        <div className={`credits-reel${reduced ? " credits-static" : ""}`}>
          <p className="eyebrow">{CEREMONY.title}</p>
          {BLOCKS.map((block) => (
            <div key={`${block.label}-${block.value}`} className="credit-block">
              {block.label && <p className="credit-label">{block.label}</p>}
              <p className={block.display ? "credit-display" : "credit-value"}>
                {block.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (phase === "the-end") {
    return (
      <section className="stage-screen">
        <motion.h2
          className="display-title end-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          The End
        </motion.h2>
      </section>
    );
  }

  if (phase === "beginning") {
    return (
      <section className="stage-screen">
        <motion.div
          className="beginning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <h2 className="display-title">Never ending story.</h2>
        </motion.div>
      </section>
    );
  }

  return <section className="stage-screen stage-dark" />;
}
