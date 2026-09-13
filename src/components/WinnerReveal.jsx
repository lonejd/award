import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

export default function WinnerReveal({ award, reduced }) {
  const name = award.revealName || award.winner;

  return (
    <section className="stage-screen reveal-screen">
      <motion.div
        className="gold-burst"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: reduced ? 0.2 : 1.4, ease }}
      />
      <div className="reveal-dust" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => (
          <motion.span
            key={index}
            className="reveal-mote"
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: [0, 0.8, 0.2], y: -40 - index * 4, scale: 1 }}
            transition={{
              duration: reduced ? 0.2 : 2.2,
              delay: reduced ? 0 : index * 0.05,
              ease,
            }}
            style={{ left: `${18 + ((index * 13) % 64)}%` }}
          />
        ))}
      </div>
      <motion.h2
        className="winner-name"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0.2 : 1.35, ease }}
      >
        {name}
      </motion.h2>
    </section>
  );
}
