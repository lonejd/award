import { motion } from "framer-motion";

export default function NextAwardControl({ visible, onNext, isLast }) {
  if (!visible) return null;

  return (
    <div className="next-award-wrap">
      <motion.button
        type="button"
        className="next-award"
        onClick={onNext}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
      >
        <span>{isLast ? "Final Award" : "Next Award"}</span>
        <em aria-hidden="true">→</em>
      </motion.button>
    </div>
  );
}
