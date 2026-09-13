import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { awards } from "../data/awards";
import {
  FINALE_FLOW,
  HUMOR_FLOW,
  STANDARD_FLOW,
  TIMINGS,
} from "../lib/timings";
import { scaleTime, usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useSwipeNavigation } from "./useSwipeNavigation";

function flowFor(award) {
  if (award?.style === "finale") return FINALE_FLOW;
  if (award?.style === "humor") return HUMOR_FLOW;
  return STANDARD_FLOW;
}

export function useCeremony(audio) {
  const reduced = usePrefersReducedMotion();
  const [started, setStarted] = useState(false);
  const [awardIndex, setAwardIndex] = useState(0);
  const [phase, setPhase] = useState("opening");
  const [stepIndex, setStepIndex] = useState(0);
  const timerRef = useRef(null);
  const award = awards[awardIndex];
  const flow = useMemo(() => flowFor(award), [award]);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const canAdvance = phase === "photo";

  const goToAward = useCallback(
    (index) => {
      const next = awards[index];
      if (!next) return;
      clearTimer();
      setAwardIndex(index);
      setStepIndex(0);
      setPhase(flowFor(next)[0][0]);
    },
    [audio]
  );

  const nextAward = useCallback(() => {
    if (!canAdvance) return;
    if (awardIndex >= awards.length - 1) return;
    goToAward(awardIndex + 1);
  }, [awardIndex, canAdvance, goToAward]);

  const begin = useCallback(async () => {
    await audio.unlock();
    audio.playTheme();
    setStarted(true);
    setAwardIndex(0);
    setStepIndex(0);
    setPhase(STANDARD_FLOW[0][0]);
  }, [audio]);

  useEffect(() => {
    if (!started) return undefined;
    const current = flow[stepIndex];
    if (!current) return undefined;
    const [name, timingKey] = current;
    setPhase(name);

    if (name === "photo") {
      const next = awards[awardIndex + 1];
      if (next) {
        const img = new Image();
        img.src = next.image;
      }
    }

    if (name === "reveal" && award.style === "humor") {
      audio.playSfx("chime");
    }

    if (!timingKey) return undefined;
    const wait = scaleTime(TIMINGS[timingKey], reduced);
    timerRef.current = window.setTimeout(() => {
      setStepIndex((value) => value + 1);
    }, wait);

    return () => clearTimer();
  }, [started, stepIndex, award, awardIndex, flow, audio, reduced]);

  useEffect(() => {
    if (!canAdvance) return undefined;
    const onKey = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextAward();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canAdvance, nextAward]);

  useSwipeNavigation(canAdvance, nextAward);

  useEffect(() => {
    const next = awards[awardIndex + 1];
    if (!next) return;
    const img = new Image();
    img.src = next.image;
  }, [awardIndex]);

  return {
    audio,
    started,
    begin,
    award,
    awardIndex,
    phase,
    nextAward,
    canAdvance,
    reduced,
    total: awards.length,
  };
}
