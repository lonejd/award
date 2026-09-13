const FADE_MS = 1400;
export const THEME_SRC = encodeURI(
  "/audio/awards/Oscars Theme - MUSIC BY GREG HULME - Greg Hulme.mp3"
);
const THEME_VOLUME = 0.6;
const NOTE = {
  C2: 65.41,
  G2: 98.0,
  C3: 130.81,
  D3: 146.83,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  E5: 659.26,
  G5: 783.99,
};

const PRESETS = {
  smile: {
    notes: [NOTE.C3, NOTE.E3, NOTE.G3, NOTE.A3, NOTE.C4],
    filter: 920,
    volume: 0.11,
    sparkle: [NOTE.E4, NOTE.G4, NOTE.A4],
    sparkleRate: 2.4,
  },
  eyes: {
    notes: [NOTE.A3, NOTE.C4, NOTE.E4, NOTE.B4],
    filter: 780,
    volume: 0.1,
    sparkle: [NOTE.E4, NOTE.A4, NOTE.C5],
    sparkleRate: 3.2,
  },
  miss: {
    notes: [NOTE.D3, NOTE.F3, NOTE.A3, NOTE.C4],
    filter: 640,
    volume: 0.09,
    sparkle: [NOTE.A3, NOTE.D4, NOTE.F4],
    sparkleRate: 4.1,
  },
  night: {
    notes: [NOTE.F3, NOTE.A3, NOTE.C4, NOTE.E4],
    filter: 700,
    volume: 0.1,
    sparkle: [NOTE.A3, NOTE.C4, NOTE.E4],
    sparkleRate: 2.8,
    vinyl: true,
  },
  heart: {
    notes: [NOTE.Eb3, NOTE.G3, NOTE.Bb3, NOTE.D4],
    filter: 860,
    volume: 0.11,
    sparkle: [NOTE.G3, NOTE.Bb3, NOTE.D4],
    sparkleRate: 3.6,
  },
  playful: {
    notes: [NOTE.C4, NOTE.E4, NOTE.G4],
    filter: 1400,
    volume: 0.1,
    sparkle: [NOTE.E5, NOTE.G5, NOTE.C5],
    sparkleRate: 0.55,
    staccato: true,
  },
  memory: {
    notes: [NOTE.G3, NOTE.B3, NOTE.D4, NOTE.E4],
    filter: 800,
    volume: 0.1,
    sparkle: [NOTE.B3, NOTE.D4, NOTE.G4],
    sparkleRate: 2.9,
  },
  life: {
    notes: [NOTE.C3, NOTE.G3, NOTE.C4, NOTE.E4, NOTE.G4],
    filter: 980,
    volume: 0.12,
    sparkle: [NOTE.C4, NOTE.E4, NOTE.G4],
    sparkleRate: 2.2,
  },
  finale: {
    notes: [NOTE.C2, NOTE.G2, NOTE.C3, NOTE.G3, NOTE.C4, NOTE.E4],
    filter: 1100,
    volume: 0.14,
    sparkle: [NOTE.G4, NOTE.C5, NOTE.E5],
    sparkleRate: 2.0,
  },
};

function loadFile(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = true;
    audio.crossOrigin = "anonymous";
    const onReady = () => {
      cleanup();
      resolve(audio);
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Missing audio: ${src}`));
    };
    const cleanup = () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("error", onError);
    };
    audio.addEventListener("canplaythrough", onReady, { once: true });
    audio.addEventListener("error", onError, { once: true });
    audio.src = src;
    audio.load();
  });
}

function fadeElement(audio, from, to, ms) {
  return new Promise((resolve) => {
    const steps = 24;
    const step = (to - from) / steps;
    const interval = ms / steps;
    let i = 0;
    audio.volume = Math.max(0, Math.min(1, from));
    const timer = setInterval(() => {
      i += 1;
      audio.volume = Math.max(0, Math.min(1, from + step * i));
      if (i >= steps) {
        clearInterval(timer);
        audio.volume = Math.max(0, Math.min(1, to));
        resolve();
      }
    }, interval);
  });
}

export function createCeremonyAudio() {
  let ctx = null;
  let unlocked = false;
  let fileAudio = null;
  let themeStarting = false;
  let themeAudio = new Audio(THEME_SRC);
  themeAudio.loop = true;
  themeAudio.preload = "auto";
  themeAudio.volume = THEME_VOLUME;
  themeAudio.load();
  let synthMaster = null;
  let synthNodes = [];
  let sparkleTimer = null;
  let currentKey = null;
  let generation = 0;

  function ensureContext() {
    if (!ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioContext();
    }
    return ctx;
  }

  function stopSynth(ms = FADE_MS) {
    if (sparkleTimer) {
      clearInterval(sparkleTimer);
      sparkleTimer = null;
    }
    if (!ctx || !synthMaster) {
      synthNodes = [];
      return;
    }
    const now = ctx.currentTime;
    synthMaster.gain.cancelScheduledValues(now);
    synthMaster.gain.setValueAtTime(synthMaster.gain.value, now);
    synthMaster.gain.linearRampToValueAtTime(0, now + ms / 1000);
    const dying = synthNodes;
    synthNodes = [];
    synthMaster = null;
    window.setTimeout(() => {
      dying.forEach((node) => {
        try {
          node.stop?.();
        } catch {
          /* already stopped */
        }
      });
    }, ms + 80);
  }

  async function stopFile(ms = FADE_MS) {
    if (!fileAudio) return;
    const outgoing = fileAudio;
    fileAudio = null;
    try {
      await fadeElement(outgoing, outgoing.volume, 0, ms);
    } catch {
      /* ignore */
    }
    outgoing.pause();
    outgoing.src = "";
  }

  function startSynth(presetName) {
    const audioCtx = ensureContext();
    const preset = PRESETS[presetName] || PRESETS.smile;
    const master = audioCtx.createGain();
    master.gain.value = 0;
    master.connect(audioCtx.destination);
    synthMaster = master;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = preset.filter;
    filter.Q.value = 0.7;
    filter.connect(master);

    preset.notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      osc.type = index % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      const gain = audioCtx.createGain();
      gain.gain.value = 0.22 / preset.notes.length;
      osc.connect(gain);
      gain.connect(filter);
      osc.start();
      synthNodes.push(osc);
    });

    if (preset.vinyl) {
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i += 1) {
        data[i] = (Math.random() * 2 - 1) * 0.04;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.value = 0.03;
      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.value = 900;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start();
      synthNodes.push(noise);
    }

    const now = audioCtx.currentTime;
    master.gain.linearRampToValueAtTime(preset.volume, now + 1.8);

    if (preset.sparkle?.length) {
      sparkleTimer = window.setInterval(() => {
        if (!ctx || ctx.state !== "running") return;
        const freq = preset.sparkle[Math.floor(Math.random() * preset.sparkle.length)];
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        const t = ctx.currentTime;
        const peak = preset.staccato ? 0.045 : 0.028;
        const dur = preset.staccato ? 0.18 : 1.4;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(peak, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      }, preset.sparkleRate * 1000);
    }
  }

  return {
    async unlock() {
      const audioCtx = ensureContext();
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      const buffer = audioCtx.createBuffer(1, 1, 22050);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
      unlocked = true;
    },

    isUnlocked() {
      return unlocked;
    },

    playTheme() {
      if (!themeAudio) {
        themeAudio = new Audio(THEME_SRC);
        themeAudio.loop = true;
        themeAudio.preload = "auto";
      }
      if (!themeAudio.paused && !themeAudio.ended) return Promise.resolve();
      if (themeStarting) return Promise.resolve();
      themeStarting = true;
      themeAudio.volume = THEME_VOLUME;
      themeAudio.currentTime = themeAudio.currentTime || 0;

      try {
        const audioCtx = ensureContext();
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        unlocked = true;
      } catch {
        /* keep going */
      }

      const start = themeAudio.play();
      if (!start) {
        themeStarting = false;
        return Promise.resolve();
      }
      return start
        .then(() => {
          themeStarting = false;
        })
        .catch(() => {
          themeStarting = false;
        });
    },

    playSfx(kind = "chime") {
      if (!unlocked) return;
      const audioCtx = ensureContext();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      if (kind === "chime") {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(990, now + 0.28);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    },

    async fadeOut(ms = FADE_MS) {
      generation += 1;
      currentKey = null;
      await Promise.all([stopFile(ms), Promise.resolve(stopSynth(ms))]);
    },

    async play({ src, synth, key }) {
      if (!unlocked) return;
      if (key && key === currentKey) return;
      const token = (generation += 1);
      await Promise.all([stopFile(FADE_MS), Promise.resolve(stopSynth(FADE_MS))]);
      if (token !== generation) return;
      currentKey = key || src || synth;

      if (src) {
        try {
          const audio = await loadFile(src);
          if (token !== generation) {
            audio.src = "";
            return;
          }
          audio.volume = 0;
          fileAudio = audio;
          await audio.play();
          await fadeElement(audio, 0, 0.72, FADE_MS);
          return;
        } catch {
          /* fall through to synth */
        }
      }

      if (token !== generation) return;
      startSynth(synth || "smile");
    },

    preload(src) {
      if (!src) return;
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = src;
    },

    dispose() {
      generation += 1;
      currentKey = null;
      if (sparkleTimer) clearInterval(sparkleTimer);
      stopSynth(200);
      if (fileAudio) {
        fileAudio.pause();
        fileAudio.src = "";
        fileAudio = null;
      }
      if (themeAudio) {
        themeAudio.pause();
        themeAudio.src = "";
        themeAudio = null;
      }
    },
  };
}
