import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function WinnerPhoto({
  award,
  reduced,
  embedded = false,
  hideCaption = false,
}) {
  const [failed, setFailed] = useState(false);
  const humor = award.style === "humor";
  const Frame = embedded ? "div" : "section";

  return (
    <Frame className={embedded ? "photo-embed" : "stage-screen photo-screen"}>
      {!failed && (
        <div className="photo-atmosphere" aria-hidden="true">
          <img src={award.image} alt="" />
        </div>
      )}

      <div className="photo-spot" aria-hidden="true" />

      <motion.figure
        className="winner-photo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.2 : 1.2, ease }}
      >
        <div className="photo-plate">
          {!failed ? (
            <>
              <img className="photo-bloom" src={award.image} alt="" />
              <img
                className="photo-still"
                src={award.image}
                alt={`${award.winner}, ${award.category}`}
                onError={() => setFailed(true)}
              />
            </>
          ) : (
            <div className="photo-placeholder">
              <span>Photograph reserved for Ms Gugappriyaa</span>
              <em>{award.category}</em>
            </div>
          )}
        </div>
        {!hideCaption && (
          <figcaption className="photo-caption">
            <strong>{award.category}</strong>
            <span>{award.winner}</span>
          </figcaption>
        )}
      </motion.figure>

      {humor && (
        <motion.div
          className="humor-lines"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: reduced ? 0 : 1.1, ease }}
        >
          <p>{award.quote}</p>
          <p>{award.afterQuote}</p>
        </motion.div>
      )}
    </Frame>
  );
}
