import { Trophy } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { CEREMONY } from "../data/awards";

const ease = [0.22, 1, 0.36, 1];

export default function WinnerCard({ award, reduced }) {
  return (
    <section className="stage-screen">
      <motion.article
        className="winner-card"
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduced ? 0.2 : 1.8, ease }}
      >
        <div className="winner-card-inner">
          <p className="eyebrow">{CEREMONY.title}</p>
          <p className="winner-card-label">Category</p>
          <h3>{award.category}</h3>
          <div className="winner-card-trophy">
            <Trophy weight="thin" size={42} />
          </div>
          <p className="winner-card-label">Winner</p>
          <h2>{award.winner}</h2>
          <p className="winner-card-quote">{award.quote}</p>
        </div>
      </motion.article>
    </section>
  );
}
