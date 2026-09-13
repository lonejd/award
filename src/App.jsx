import { useEffect, useMemo } from "react";
import AwardMusic from "./components/AwardMusic";
import CeremonyStage from "./components/CeremonyStage";
import TheatreAtmosphere from "./components/TheatreAtmosphere";
import { createCeremonyAudio } from "./audio/ceremonyAudio";
import { useCeremony } from "./hooks/useCeremony";

export default function App() {
  const audio = useMemo(() => createCeremonyAudio(), []);
  const ceremony = useCeremony(audio);

  useEffect(() => () => audio.dispose(), [audio]);

  return (
    <div className="ceremony-root">
      <TheatreAtmosphere />
      <AwardMusic />
      <CeremonyStage ceremony={ceremony} />
    </div>
  );
}
