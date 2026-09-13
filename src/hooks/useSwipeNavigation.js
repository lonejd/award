import { useEffect, useRef } from "react";

export function useSwipeNavigation(enabled, onNext) {
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;

    const onStart = (event) => {
      const touch = event.changedTouches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
    };

    const onEnd = (event) => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      if (Math.abs(dx) < 56) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.8) return;
      if (dx < 0) onNext();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [enabled, onNext]);
}
