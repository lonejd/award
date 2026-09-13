import { motion } from "framer-motion";
import { CEREMONY } from "../data/awards";

const ease = [0.22, 1, 0.36, 1];

export default function AwardCategory({ award, reduced }) {
  const words = award.category.split(" ");

  return (
    <section className="stage-screen">
      <motion.div
        className="wander-spot"
        initial={{ x: "-28vw", opacity: 0 }}
        animate={{ x: "0vw", opacity: 0.9 }}
        transition={{ duration: reduced ? 0.2 : 2.2, ease }}
      />
      <div className="stage-copy">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease }}
        >
          {CEREMONY.title}
        </motion.p>
        <motion.p
          className="category-index"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
        >
          Category {award.number}
        </motion.p>
        <h2 className="category-title">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0.15 : 1.05,
                delay: reduced ? 0 : 0.28 + index * 0.16,
                ease,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </div>
    </section>
  );
}
