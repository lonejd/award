import { AnimatePresence, motion } from "framer-motion";
import AwardAnnouncement from "./AwardAnnouncement";
import AwardCategory from "./AwardCategory";
import AwardCounter from "./AwardCounter";
import Credits from "./Credits";
import FinalAward from "./FinalAward";
import NextAwardControl from "./NextAwardControl";
import OpeningCeremony from "./OpeningCeremony";
import WinnerCard from "./WinnerCard";
import WinnerPhoto from "./WinnerPhoto";
import WinnerReveal from "./WinnerReveal";

const ease = [0.22, 1, 0.36, 1];

function Scene({ phase, award, reduced, onBegin, audio }) {
  if (phase === "opening") {
    return <OpeningCeremony onBegin={onBegin} audio={audio} />;
  }
  if (award?.style === "finale") {
    if (
      [
        "final-intro",
        "final-no-nominees",
        "final-no-competition",
        "final-category",
        "final-winner-is",
        "final-reveal",
        "final-photo",
        "message-thanks",
        "message-letter",
        "message-birthday",
      ].includes(phase)
    ) {
      return <FinalAward award={award} phase={phase} reduced={reduced} />;
    }
    return <Credits phase={phase} reduced={reduced} />;
  }
  if (phase === "category") {
    return <AwardCategory award={award} reduced={reduced} />;
  }
  if (["description", "dark", "award-goes-to", "winner-is"].includes(phase)) {
    return <AwardAnnouncement award={award} phase={phase} />;
  }
  if (phase === "reveal") {
    return <WinnerReveal award={award} reduced={reduced} />;
  }
  if (phase === "card") {
    return <WinnerCard award={award} reduced={reduced} />;
  }
  if (phase === "photo") {
    return <WinnerPhoto award={award} reduced={reduced} />;
  }
  return null;
}

export default function CeremonyStage({ ceremony }) {
  const { started, begin, award, awardIndex, phase, nextAward, canAdvance, reduced, total } =
    ceremony;

  const showChrome =
    started &&
    !["opening", "credits", "the-end", "beginning", "blackout", "message-thanks", "message-letter", "message-birthday"].includes(
      phase
    );

  return (
    <main className="ceremony-stage">
      <AwardCounter index={awardIndex} total={total} visible={showChrome} />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${award?.id || "open"}-${phase}`}
          className="scene"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.7, ease }}
        >
          <Scene
            phase={started ? phase : "opening"}
            award={award}
            reduced={reduced}
            onBegin={begin}
            audio={ceremony.audio}
          />
        </motion.div>
      </AnimatePresence>
      <NextAwardControl
        visible={canAdvance}
        onNext={nextAward}
        isLast={awardIndex === total - 2}
      />
    </main>
  );
}
