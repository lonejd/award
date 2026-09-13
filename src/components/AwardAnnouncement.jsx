import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function AwardAnnouncement({ award, phase }) {
  const description =
    award.style === "humor" && award.funnyDescription
      ? award.funnyDescription
      : award.description;

  if (phase === "description") {
    return (
      <section className="stage-screen">
        <div className="stage-copy">
          <motion.p
            className="category-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease }}
          >
            {description}
          </motion.p>
        </div>
      </section>
    );
  }

  if (phase === "dark") {
    return <section className="stage-screen stage-dark" />;
  }

  if (phase === "award-goes-to") {
    return (
      <section className="stage-screen">
        <motion.div
          className="wander-spot tight"
          animate={{ opacity: [0.35, 0.8, 0.5], scale: [0.92, 1.04, 1] }}
          transition={{ duration: 2.4, ease }}
        />
        <motion.p
          className="suspense-line"
          initial={{ opacity: 0, letterSpacing: "0.42em" }}
          animate={{ opacity: 1, letterSpacing: "0.28em" }}
          transition={{ duration: 1.4, ease }}
        >
          And the award goes to
        </motion.p>
      </section>
    );
  }

  if (phase === "winner-is") {
    return (
      <section className="stage-screen">
        <motion.p
          className="suspense-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease }}
        >
          {award.style === "humor" ? "And the winner is" : "The winner is"}
        </motion.p>
      </section>
    );
  }

  return null;
}
