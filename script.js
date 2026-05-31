let appConfig = {
  birthdayName: "Aapi Jaan",
  relation: "dearest sister"
};

let birthdaySequence = [
  {
    text: () => `Happy Birthday, ${appConfig.birthdayName}`,
    revealName: true
  },
  {
    text: () =>
      "Today is not just another date on the calendar. Today is the day my world received one of its brightest lights, and my heart received one of its greatest blessings."
  },
  {
    text: () =>
      `My ${appConfig.relation}, your smile has always felt like a soft sunrise after a long night. Your voice brings calm to my storms, your kindness heals hidden wounds, and your pure heart spreads warmth wherever you go.`
  },
  {
    text: () =>
      `Every moment you believed in me when I doubted myself, every prayer you whispered for me quietly, and every time you stood beside me like a shield of love and loyalty means more to me than words can ever say.`
  },
  {
    text: () =>
      `You are grace, you are strength, you are gentleness, and you are courage all in one soul. You carry love with dignity, and you carry pain with patience. That is what makes you truly beautiful.`
  },
  {
    text: () =>
      "I pray that this year wraps you in peace, fills your days with laughter, and places ease in every path ahead of you. May your health stay strong, your heart stay light, and your dreams grow bigger every day."
  },
  {
    text: () =>
      "May Allah bless your life with barakah that never fades, rizq that keeps increasing, and joy that keeps multiplying. May every tear turn into relief, every fear turn into faith, and every delay turn into something better."
  },
  {
    text: () =>
      "You deserve gentle mornings, beautiful surprises, sincere people, and endless reasons to smile. You deserve a life where your effort is honored, your goodness is returned, and your pure intentions are rewarded beyond imagination."
  },
  {
    text: () =>
      "If love could be measured, mine for you would be endless. If prayers could be counted, mine for you would never stop. If gratitude had a voice, it would speak your name with respect, affection, and pride."
  },
  {
    text: () =>
      "You are not just family to me. You are my comfort place, my trusted person, my safe corner in this noisy world. You make ordinary days meaningful and hard days survivable, simply by being who you are."
  },
  {
    text: () =>
      "On your birthday, I want you to remember this forever: you are deeply loved, truly admired, and endlessly appreciated. Your presence is a gift, your heart is precious, and your story is written with honor."
  },
  {
    text: () =>
      "May this new year of your life bring success without stress, happiness without limits, and love without conditions. May doors open for you in the right places, at the right time, with the right blessings."
  },
  {
    text: () =>
      "I pray your smile stays bright, your soul stays peaceful, and your confidence stays unshakable. May every step you take lead you toward beauty, dignity, and fulfillment in both dunya and akhirah."
  },
  {
    text: () =>
      `And as always, my promise remains forever: I will celebrate you loudly, respect you deeply, stand by you faithfully, and keep praying for your happiness every single day. Happy birthday once again, ${appConfig.birthdayName}.`
  }
];

let micReplies = [
  {
    pattern: /(thank you|thanks)/i,
    reply: "Always. You deserve every bit of joy today."
  },
  {
    pattern: /(love you|i love you)/i,
    reply: "I love you too. Happy Birthday, star of the day."
  },
  {
    pattern: /(how are you|you there)/i,
    reply: "Online and celebrating. Standing by for your next command."
  }
];

const nodes = {
  appShell: document.getElementById("app-shell"),
  zipIntro: document.getElementById("zip-intro"),
  zipSlider: document.getElementById("zip-slider"),
  zipBlast: document.getElementById("zip-blast"),
  celebrationSlide: document.getElementById("celebration-slide"),
  classicCakeSlide: document.getElementById("classic-cake-slide"),
  classicBlast: document.getElementById("classic-blast"),
  classicCandleBtn: document.getElementById("classic-candle-btn"),
  orbShell: document.getElementById("orb-shell"),
  orbLabel: document.getElementById("orb-label"),
  birthdayName: document.getElementById("birthday-name"),
  birthdayMessage: document.getElementById("birthday-message"),
  startBtn: document.getElementById("start-btn"),
  pauseBtn: document.getElementById("pause-btn"),
  listenBtn: document.getElementById("listen-btn"),
  finalWordBtn: document.getElementById("final-word-btn"),
  finalWordScreen: document.getElementById("final-word-screen"),
  finalWordTyped: document.getElementById("final-word-typed"),
  finalWordCloseBtn: document.getElementById("final-word-close-btn"),
  waveBars: document.getElementById("wave-bars")
};

let sequenceActive = false;
let isPaused = false;
let waveTimer = null;
let recognition = null;
let lastVoiceLog = "";
let speechKeepAliveTimer = null;
let voicesReady = false;
let voiceInitPromise = null;
let galleryAutoAdvanceTimer = null;
let cakeSongAudio = null;
let cakeMusicStopTimer = null;
let cakeMusicPrimed = false;
let cakeMusicStartTimer = null;
let finalWordTypingTimer = null;
let typingAudioCtx = null;
let typingAudioMaster = null;

const finalWordMessage = `Until now, your younger brother Muhammad has carried these words in his heart for you.

I miss your expressions, your smile, your laughter, and the peace your presence brings into every moment of my life. You are not only my sister, you are my comfort, my strength, and one of the greatest blessings Allah gave me. I love you with all my heart, more than I can ever explain in words.

May Allah give you endless love, Hassan, and fulfill your life with complete joy, health, success, and beautiful happiness in every step.

Love you so much, my all time favourite Aapi Jaan.

Forever yours, your younger brother Muhammad, with endless love, duas, and respect.`;

void bootstrap();

async function bootstrap() {
  await loadPythonConfig();
  ensureVoicesReady();

  nodes.birthdayName.textContent = appConfig.birthdayName;
  seedWaveBars(14);
  bindEvents();
  bindIntroExperience();
}

async function loadPythonConfig() {
  try {
    const response = await fetch("/api/config", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = await response.json();

    if (payload?.appConfig?.birthdayName && payload?.appConfig?.relation) {
      appConfig = {
        birthdayName: String(payload.appConfig.birthdayName),
        relation: String(payload.appConfig.relation)
      };
    }

    if (Array.isArray(payload?.birthdaySequence) && payload.birthdaySequence.length) {
      birthdaySequence = payload.birthdaySequence
        .filter(step => typeof step?.text === "string" && step.text.trim())
        .map(step => ({
          revealName: Boolean(step.revealName),
          text: () => hydrateBirthdayTemplate(step.text)
        }));
    }

    if (Array.isArray(payload?.micReplies) && payload.micReplies.length) {
      const mappedReplies = payload.micReplies
        .filter(item => typeof item?.pattern === "string" && typeof item?.reply === "string")
        .map(item => ({
          pattern: new RegExp(item.pattern, "i"),
          reply: item.reply
        }));

      if (mappedReplies.length) {
        micReplies = mappedReplies;
      }
    }
  } catch {
    // Keep local defaults when backend config is unavailable.
  }
}

function hydrateBirthdayTemplate(text) {
  return String(text)
    .replaceAll("{name}", appConfig.birthdayName)
    .replaceAll("{relation}", appConfig.relation);
}

function bindEvents() {
  nodes.startBtn.addEventListener("click", startBirthdaySequence);
  nodes.pauseBtn.addEventListener("click", togglePauseResume);
  if (nodes.listenBtn) {
    nodes.listenBtn.addEventListener("click", activateMicReply);
  }
  if (nodes.finalWordBtn) {
    nodes.finalWordBtn.addEventListener("click", showFinalWordScreen);
  }
  if (nodes.finalWordCloseBtn) {
    nodes.finalWordCloseBtn.addEventListener("click", hideFinalWordScreen);
  }
  if (nodes.classicCandleBtn) {
    nodes.classicCandleBtn.addEventListener("click", handleClassicCandleClick);
  }
}

function bindIntroExperience() {
  if (!nodes.appShell) {
    return;
  }

  if (!nodes.zipIntro) {
    showCelebrationSlide();
    return;
  }

  if (!nodes.zipSlider) {
    showCelebrationSlide();
    return;
  }

  nodes.zipSlider.addEventListener("click", openZipExperience);
}

function openZipExperience() {
  if (!nodes.zipIntro || !nodes.appShell || nodes.zipIntro.classList.contains("opened")) {
    return;
  }

  primeCakeSlideMusic();
  playZipRevealSound();
  triggerZipBlast();
  nodes.zipIntro.classList.add("opened");
  if (nodes.zipSlider) {
    nodes.zipSlider.disabled = true;
  }

  window.setTimeout(() => {
    nodes.zipIntro.remove();
    showCelebrationSlide();
  }, 1800);
}

function triggerZipBlast() {
  if (!nodes.zipBlast) {
    return;
  }

  const colors = ["#ffeffc", "#ffc9f1", "#ff8ede", "#ff64d4", "#ff4fc9", "#ffd8f6"];
  const particles = 66;

  nodes.zipBlast.innerHTML = "";

  for (let i = 0; i < particles; i += 1) {
    const piece = document.createElement("span");
    piece.className = "zip-particle";

    const angleDeg = -95 + Math.random() * 190;
    const angleRad = (angleDeg * Math.PI) / 180;
    const distance = 140 + Math.random() * 360;
    const driftX = Math.cos(angleRad) * distance;
    const driftY = Math.sin(angleRad) * distance;
    const size = 4 + Math.random() * 11;
    const duration = 860 + Math.random() * 920;
    const delay = Math.random() * 120;
    const rotation = -260 + Math.random() * 520;
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.setProperty("--x", `${driftX.toFixed(1)}px`);
    piece.style.setProperty("--y", `${driftY.toFixed(1)}px`);
    piece.style.setProperty("--size", `${size.toFixed(1)}px`);
    piece.style.setProperty("--dur", `${duration.toFixed(0)}ms`);
    piece.style.setProperty("--delay", `${delay.toFixed(0)}ms`);
    piece.style.setProperty("--rot", `${rotation.toFixed(0)}deg`);
    piece.style.setProperty("--color", color);

    nodes.zipBlast.appendChild(piece);
  }

  nodes.zipBlast.classList.remove("burst");
  void nodes.zipBlast.offsetWidth;
  nodes.zipBlast.classList.add("burst");
}

function showCelebrationSlide() {
  if (!nodes.appShell) {
    return;
  }

  if (!nodes.celebrationSlide) {
    showClassicCakeSlide();
    return;
  }

  if (galleryAutoAdvanceTimer) {
    window.clearTimeout(galleryAutoAdvanceTimer);
    galleryAutoAdvanceTimer = null;
  }

  if (nodes.classicCakeSlide) {
    clearCakeMusicStartTimer();
    stopCakeSlideMusic();
    nodes.classicCakeSlide.hidden = true;
    nodes.classicCakeSlide.classList.remove("active");
    nodes.classicCakeSlide.classList.remove("closing");
    nodes.classicCakeSlide.classList.remove("candles-out");
  }

  nodes.celebrationSlide.classList.remove("closing");
  nodes.celebrationSlide.hidden = false;
  window.requestAnimationFrame(() => {
    nodes.celebrationSlide.classList.add("active");
  });

  galleryAutoAdvanceTimer = window.setTimeout(() => {
    transitionToClassicCakeSlide();
  }, 4400);
}

function transitionToClassicCakeSlide() {
  if (!nodes.celebrationSlide) {
    showClassicCakeSlide();
    return;
  }

  if (galleryAutoAdvanceTimer) {
    window.clearTimeout(galleryAutoAdvanceTimer);
    galleryAutoAdvanceTimer = null;
  }

  // Start slide 3 underneath first, then fade slide 2 out so slide 4 never peeks through.
  showClassicCakeSlide();
  nodes.celebrationSlide.classList.add("closing");

  window.setTimeout(() => {
    nodes.celebrationSlide.hidden = true;
    nodes.celebrationSlide.classList.remove("active");
  }, 480);
}

function showClassicCakeSlide() {
  if (!nodes.appShell) {
    return;
  }

  if (!nodes.classicCakeSlide) {
    nodes.appShell.classList.remove("pre-intro");
    return;
  }

  nodes.classicCakeSlide.hidden = false;
  nodes.classicCakeSlide.classList.remove("closing");
  nodes.classicCakeSlide.classList.remove("candles-out");
  window.requestAnimationFrame(() => {
    nodes.classicCakeSlide.classList.add("active");
  });
  scheduleCakeSlideMusicStart();

  if (nodes.classicCandleBtn) {
    nodes.classicCandleBtn.disabled = false;
    nodes.classicCandleBtn.innerHTML = '<span class="lighter-icon" aria-hidden="true"></span> Blow Candle, Open AI';
  }
}

function handleClassicCandleClick() {
  if (!nodes.classicCakeSlide || !nodes.appShell) {
    return;
  }

  if (nodes.classicCakeSlide.classList.contains("candles-out")) {
    return;
  }

  clearCakeMusicStartTimer();
  playCandleBlowSound();
  triggerClassicSideBlast();
  window.setTimeout(() => {
    stopCakeSlideMusic();
  }, 120);
  nodes.classicCakeSlide.classList.add("candles-out");

  if (nodes.classicCandleBtn) {
    nodes.classicCandleBtn.disabled = true;
    nodes.classicCandleBtn.textContent = "Opening Robotic UI...";
  }

  window.setTimeout(() => {
    nodes.classicCakeSlide.classList.add("closing");
  }, 5100);

  window.setTimeout(() => {
    nodes.classicCakeSlide.hidden = true;
    nodes.classicCakeSlide.classList.remove("active");
    nodes.appShell.classList.remove("pre-intro");
  }, 5600);
}

function scheduleCakeSlideMusicStart() {
  clearCakeMusicStartTimer();
  cakeMusicStartTimer = window.setTimeout(() => {
    if (!nodes.classicCakeSlide || nodes.classicCakeSlide.hidden) {
      return;
    }
    playCakeSlideMusic();
  }, 700);
}

function clearCakeMusicStartTimer() {
  if (cakeMusicStartTimer) {
    window.clearTimeout(cakeMusicStartTimer);
    cakeMusicStartTimer = null;
  }
}

function playCakeSlideMusic() {
  clearCakeMusicStartTimer();
  if (cakeMusicStopTimer) {
    window.clearTimeout(cakeMusicStopTimer);
    cakeMusicStopTimer = null;
  }

  const audio = getCakeSongAudio();
  if (!audio) {
    return;
  }

  audio.currentTime = 0;
  audio.volume = 1;
  audio.muted = false;
  audio.loop = true;

  const playPromise = audio.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      // If browser blocks autoplay, user can click again and it will play.
    });
  }

  cakeMusicStopTimer = window.setTimeout(() => {
    stopCakeSlideMusic();
  }, 120000);
}

function primeCakeSlideMusic() {
  if (cakeMusicPrimed) {
    return;
  }

  const audio = getCakeSongAudio();
  if (!audio) {
    return;
  }

  audio.muted = true;

  const primePromise = audio.play();
  if (primePromise?.then) {
    primePromise
      .then(() => {
        cakeMusicPrimed = true;
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      })
      .catch(() => {
        cakeMusicPrimed = false;
      });
  } else {
    cakeMusicPrimed = true;
  }
}

function stopCakeSlideMusic() {
  if (cakeMusicStopTimer) {
    window.clearTimeout(cakeMusicStopTimer);
    cakeMusicStopTimer = null;
  }

  if (cakeSongAudio) {
    cakeSongAudio.pause();
    cakeSongAudio.currentTime = 0;
    cakeSongAudio.muted = false;
  }
}

function getCakeSongAudio() {
  if (typeof Audio === "undefined") {
    return null;
  }

  if (!cakeSongAudio) {
    const audio = new Audio(
      "https://upload.wikimedia.org/wikipedia/commons/transcoded/0/02/Happy_Birthday_to_You.ogg/Happy_Birthday_to_You.ogg.mp3"
    );
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 1;
    audio.crossOrigin = "anonymous";
    cakeSongAudio = audio;
  }

  return cakeSongAudio;
}

function triggerClassicSideBlast() {
  if (!nodes.classicBlast) {
    return;
  }

  const colors = ["#ffeefe", "#ffcbf3", "#ff9ae5", "#ff72db", "#ff56d3", "#ffdff7"];
  const particlesPerSide = 30;

  nodes.classicBlast.innerHTML = "";

  const createSideParticles = side => {
    for (let i = 0; i < particlesPerSide; i += 1) {
      const piece = document.createElement("span");
      piece.className = `classic-blast-particle ${side}`;

      const horizontal = 70 + Math.random() * 230;
      const vertical = -170 + Math.random() * 260;
      const driftX = side === "side-left" ? horizontal : -horizontal;
      const driftY = vertical;
      const size = 4 + Math.random() * 10;
      const duration = 4300 + Math.random() * 700;
      const delay = Math.random() * 160;
      const rotation = -240 + Math.random() * 500;
      const color = colors[Math.floor(Math.random() * colors.length)];

      piece.style.setProperty("--x", `${driftX.toFixed(1)}px`);
      piece.style.setProperty("--y", `${driftY.toFixed(1)}px`);
      piece.style.setProperty("--size", `${size.toFixed(1)}px`);
      piece.style.setProperty("--dur", `${duration.toFixed(0)}ms`);
      piece.style.setProperty("--delay", `${delay.toFixed(0)}ms`);
      piece.style.setProperty("--rot", `${rotation.toFixed(0)}deg`);
      piece.style.setProperty("--color", color);

      nodes.classicBlast.appendChild(piece);
    }
  };

  createSideParticles("side-left");
  createSideParticles("side-right");

  nodes.classicBlast.classList.remove("burst");
  void nodes.classicBlast.offsetWidth;
  nodes.classicBlast.classList.add("burst");
}

function pickPreferredClearEnglishVoice(lang) {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) {
    return null;
  }

  const englishVoices = voices.filter(voice => String(voice.lang || "").toLowerCase().startsWith("en"));
  const voicePool = englishVoices.length ? englishVoices : voices;

  const explicitPriorityPatterns = [
    /google uk english male/i,
    /google us english/i,
    /microsoft (guy|davis|ryan|mark|david)/i,
    /(natural|neural|enhanced|premium)/i,
    /(daniel|arthur|christopher|james|andrew|brian|alex)/i
  ];

  for (const pattern of explicitPriorityPatterns) {
    const hit = voicePool.find(voice => pattern.test(String(voice.name || "")));
    if (hit) {
      return hit;
    }
  }

  const roboticHints = ["robot", "espeak", "sapi 4", "sapi4", "festival"];
  const qualityHints = ["google", "microsoft", "natural", "neural", "enhanced", "premium", "online"];
  const maleVoiceHints = [
    "male", "man", "boy", "guy", "david", "mark", "ryan", "daniel",
    "arthur", "christopher", "james", "andrew", "brian", "alex"
  ];
  const femaleVoiceHints = [
    "female", "woman", "girl", "samantha", "zira", "aria", "natasha", "jenny"
  ];
  const preferredLangWeights = {
    "en-us": 200,
    "en-gb": 190,
    "en-au": 180,
    "en-ca": 175,
    "en-ie": 168,
    "en-nz": 165,
    "en-in": 155,
    "en-pk": 150
  };

  const scoreCandidate = voice => {
    const name = String(voice.name || "").toLowerCase();
    const voiceLang = String(voice.lang || "").toLowerCase();
    let score = 0;

    if (!voiceLang.startsWith("en")) {
      score -= 320;
    } else {
      score += 120;
      score += preferredLangWeights[voiceLang] || 140;
    }

    if (qualityHints.some(hint => name.includes(hint))) {
      score += 55;
    }

    if (maleVoiceHints.some(hint => name.includes(hint))) {
      score += 65;
    }

    if (femaleVoiceHints.some(hint => name.includes(hint))) {
      score -= 55;
    }

    if (roboticHints.some(hint => name.includes(hint))) {
      score -= 140;
    }

    if (voice.localService) {
      score += 5;
    }

    return score;
  };

  const scored = voicePool.map(voice => ({ voice, score: scoreCandidate(voice) }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.voice ?? null;
}

function seedWaveBars(count) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    fragment.appendChild(document.createElement("span"));
  }
  nodes.waveBars.appendChild(fragment);
}

function setStatus(text) {
  void text;
}

async function startBirthdaySequence() {
  if (sequenceActive) {
    return;
  }

  if (!window.speechSynthesis) {
    appendLog("Speech synthesis is not available in this browser.");
    setStatus("Voice Unsupported");
    return;
  }

  sequenceActive = true;
  isPaused = false;
  await ensureVoicesReady();
  normalizeSpeechEngineState();
  speechSynthesis.cancel();
  await wait(220);
  normalizeSpeechEngineState();
  nodes.startBtn.disabled = true;
  setStatus("Initializing");
  nodes.orbLabel.textContent = "AI CORE: SPEAKING";
  nodes.birthdayMessage.textContent = `Happy Birthday, ${appConfig.birthdayName}`;

  appendLog(`Happy Birthday, ${appConfig.birthdayName}`);

  playStartupChime();

  const sequence = birthdaySequence;
  for (const step of sequence) {
    const line = typeof step.text === "function" ? step.text() : step.text;
    if (step.revealName) {
      nodes.birthdayName.classList.add("revealed");
    }

    nodes.birthdayMessage.textContent = line;
    appendLog(line);
    await speakLine(line, "en");
    await wait(280);
  }

  setStatus("Celebration Active");
  nodes.orbLabel.textContent = "AI CORE: LISTENING";

  appendLog(`Happy Birthday, ${appConfig.birthdayName}`);

  nodes.startBtn.disabled = false;
  sequenceActive = false;
}

function togglePauseResume() {
  if (!window.speechSynthesis || (!speechSynthesis.speaking && !speechSynthesis.pending)) {
    return;
  }

  if (isPaused) {
    speechSynthesis.resume();
    isPaused = false;
    setStatus("Resumed");
  } else {
    speechSynthesis.pause();
    isPaused = true;
    setStatus("Paused");
  }
}

function activateMicReply() {
  if (!nodes.listenBtn) {
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    nodes.listenBtn.disabled = true;
    appendLog("Speech recognition is not supported in this browser.");
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = event => {
      const spoken = event.results[0][0].transcript;
      appendLog(`You: ${spoken}`);
      handleMicReply(spoken);
    };

    recognition.onerror = event => {
      appendLog(`Mic error: ${event.error}`);
      setStatus("Mic Error");
    };

    recognition.onend = () => {
      nodes.listenBtn.textContent = "Enable Mic Reply";
    };
  }

  recognition.lang = "en-IN";
  try {
    recognition.start();
  } catch {
    appendLog("Mic is already active.");
    return;
  }

  setStatus("Listening...");
  nodes.listenBtn.textContent = "Listening...";
}

async function handleMicReply(text) {
  const rules = micReplies;
  const matched = rules.find(rule => rule.pattern.test(text));

  const reply = matched ? matched.reply : "Always with you. Happy Birthday once again.";

  appendLog(`AI: ${reply}`);
  nodes.birthdayMessage.textContent = reply;
  await speakLine(reply, "en");
}

function showFinalWordScreen() {
  if (!nodes.finalWordScreen || !nodes.finalWordTyped) {
    return;
  }

  stopCakeSlideMusic();
  clearCakeMusicStartTimer();

  if (recognition) {
    try {
      recognition.stop();
    } catch {
      // Ignore if recognition is already stopped.
    }
  }

  if (window.speechSynthesis) {
    speechSynthesis.cancel();
  }

  nodes.finalWordScreen.hidden = false;
  document.body.classList.add("final-word-open");
  window.requestAnimationFrame(() => {
    nodes.finalWordScreen.classList.add("active");
  });
  startFinalWordTyping(finalWordMessage);
}

function hideFinalWordScreen() {
  if (!nodes.finalWordScreen) {
    return;
  }

  stopFinalWordTyping();
  nodes.finalWordScreen.classList.remove("active");
  document.body.classList.remove("final-word-open");
  window.setTimeout(() => {
    nodes.finalWordScreen.hidden = true;
  }, 260);
}

function startFinalWordTyping(message) {
  if (!nodes.finalWordTyped) {
    return;
  }

  stopFinalWordTyping();
  nodes.finalWordTyped.textContent = "";
  nodes.finalWordTyped.classList.add("typing");
  nodes.finalWordTyped.classList.remove("done");

  let index = 0;

  const typeNextChar = () => {
    if (!nodes.finalWordTyped) {
      return;
    }

    if (index >= message.length) {
      nodes.finalWordTyped.classList.remove("typing");
      nodes.finalWordTyped.classList.add("done");
      finalWordTypingTimer = null;
      return;
    }

    const char = message[index];
    nodes.finalWordTyped.textContent += char;
    if (!/\s/.test(char)) {
      playTypingSound();
    }

    index += 1;
    let nextDelay = 24 + Math.random() * 22;
    if (/[,.!?]/.test(char)) {
      nextDelay = 130 + Math.random() * 90;
    } else if (char === "\n") {
      nextDelay = 180;
    }
    finalWordTypingTimer = window.setTimeout(typeNextChar, nextDelay);
  };

  finalWordTypingTimer = window.setTimeout(typeNextChar, 220);
}

function stopFinalWordTyping() {
  if (finalWordTypingTimer) {
    window.clearTimeout(finalWordTypingTimer);
    finalWordTypingTimer = null;
  }
  if (nodes.finalWordTyped) {
    nodes.finalWordTyped.classList.remove("typing");
  }
}

function ensureTypingAudio() {
  if (typingAudioCtx && typingAudioMaster) {
    if (typingAudioCtx.state === "suspended") {
      typingAudioCtx.resume().catch(() => {});
    }
    return true;
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return false;
  }

  typingAudioCtx = new AudioCtx();
  typingAudioMaster = typingAudioCtx.createGain();
  typingAudioMaster.gain.setValueAtTime(0.52, typingAudioCtx.currentTime);
  typingAudioMaster.connect(typingAudioCtx.destination);
  return true;
}

function playTypingSound() {
  if (!ensureTypingAudio() || !typingAudioCtx || !typingAudioMaster) {
    return;
  }

  const now = typingAudioCtx.currentTime;
  const keyOsc = typingAudioCtx.createOscillator();
  const keyGain = typingAudioCtx.createGain();
  const clickNoiseBuffer = typingAudioCtx.createBuffer(1, Math.floor(typingAudioCtx.sampleRate * 0.02), typingAudioCtx.sampleRate);
  const clickNoiseData = clickNoiseBuffer.getChannelData(0);

  for (let i = 0; i < clickNoiseData.length; i += 1) {
    clickNoiseData[i] = (Math.random() * 2 - 1) * (1 - i / clickNoiseData.length);
  }

  const clickNoise = typingAudioCtx.createBufferSource();
  const clickNoiseGain = typingAudioCtx.createGain();

  keyOsc.type = "triangle";
  keyOsc.frequency.setValueAtTime(860 + Math.random() * 340, now);
  keyGain.gain.setValueAtTime(0.0001, now);
  keyGain.gain.exponentialRampToValueAtTime(0.08, now + 0.0035);
  keyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
  keyOsc.connect(keyGain);
  keyGain.connect(typingAudioMaster);
  keyOsc.start(now);
  keyOsc.stop(now + 0.032);

  clickNoise.buffer = clickNoiseBuffer;
  clickNoiseGain.gain.setValueAtTime(0.0001, now);
  clickNoiseGain.gain.exponentialRampToValueAtTime(0.06, now + 0.002);
  clickNoiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);
  clickNoise.connect(clickNoiseGain);
  clickNoiseGain.connect(typingAudioMaster);
  clickNoise.start(now);
  clickNoise.stop(now + 0.018);
}

function speakLine(text, lang) {
  return new Promise(async resolve => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }

    await ensureVoicesReady();
    normalizeSpeechEngineState();

    const textChunks = splitTextForSpeech(text);
    const matchedVoice = pickPreferredClearEnglishVoice(lang);

    if (matchedVoice) {
      const voiceSignature = `${matchedVoice.name}|${matchedVoice.lang}`;
      if (voiceSignature !== lastVoiceLog) {
        appendLog(`Voice selected: ${matchedVoice.name} (${matchedVoice.lang})`);
        lastVoiceLog = voiceSignature;
      }
    }

    for (const chunk of textChunks) {
      const result = await speakChunk(chunk, lang, matchedVoice);
      if (!result.spoken) {
        // Browser got into a stale state; reset queue and continue gracefully.
        speechSynthesis.cancel();
        normalizeSpeechEngineState();
        await wait(100);
      }
      await wait(80);
    }

    resolve();
  });
}

function stopOrbSpeakingAnimation() {
  nodes.orbShell.classList.remove("speaking");
  stopSpeechKeepAlive();
  if (waveTimer) {
    window.clearInterval(waveTimer);
    waveTimer = null;
  }

  [...nodes.waveBars.children].forEach(bar => {
    bar.style.height = "18%";
    bar.style.opacity = "0.35";
  });
}

function updateWaveBars() {
  [...nodes.waveBars.children].forEach((bar, index) => {
    const band = 24 + Math.sin((Date.now() / 220) + index * 0.42) * 18;
    const energy = Math.random() * 36;
    bar.style.height = `${Math.max(10, band + energy)}%`;
    bar.style.opacity = `${0.52 + Math.random() * 0.45}`;
  });
}

function speakChunk(chunk, lang, selectedVoice) {
  return new Promise(resolve => {
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = 0.93;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    utterance.lang = "en-US";

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      const selectedLang = String(selectedVoice.lang || "").toLowerCase();
      utterance.lang = selectedLang.startsWith("en") ? selectedVoice.lang : "en-US";
    }

    const maxSpeakMs = Math.max(7000, chunk.length * 95);
    const watchdogStepMs = 250;
    let elapsedMs = 0;
    let settled = false;

    const settle = spoken => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearInterval(watchdogId);
      stopOrbSpeakingAnimation();
      resolve({ spoken });
    };

    const watchdogId = window.setInterval(() => {
      if (settled) {
        return;
      }
      if (!isPaused && !speechSynthesis.paused) {
        elapsedMs += watchdogStepMs;
      }
      if (elapsedMs >= maxSpeakMs) {
        settle(false);
      }
    }, watchdogStepMs);

    utterance.onstart = () => {
      nodes.orbShell.classList.add("speaking");
      startSpeechKeepAlive();
      waveTimer = window.setInterval(updateWaveBars, 120);
      updateWaveBars();
    };

    utterance.onend = () => {
      settle(true);
    };

    utterance.onerror = event => {
      appendLog(`Voice error: ${event.error || "unknown"}`);
      settle(false);
    };

    try {
      speechSynthesis.speak(utterance);
    } catch {
      settle(false);
    }
  });
}

function splitTextForSpeech(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return [];
  }

  const maxLen = 165;
  if (cleaned.length <= maxLen) {
    return [cleaned];
  }

  const pieces = [];
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  let buffer = "";

  for (const sentence of sentences) {
    if (!sentence) {
      continue;
    }

    const next = buffer ? `${buffer} ${sentence}` : sentence;
    if (next.length <= maxLen) {
      buffer = next;
      continue;
    }

    if (buffer) {
      pieces.push(buffer);
      buffer = "";
    }

    if (sentence.length <= maxLen) {
      buffer = sentence;
      continue;
    }

    const words = sentence.split(" ");
    let wordBuffer = "";
    for (const word of words) {
      const candidate = wordBuffer ? `${wordBuffer} ${word}` : word;
      if (candidate.length <= maxLen) {
        wordBuffer = candidate;
      } else {
        if (wordBuffer) {
          pieces.push(wordBuffer);
        }
        wordBuffer = word;
      }
    }
    if (wordBuffer) {
      buffer = wordBuffer;
    }
  }

  if (buffer) {
    pieces.push(buffer);
  }

  return pieces;
}

function startSpeechKeepAlive() {
  stopSpeechKeepAlive();
  speechKeepAliveTimer = window.setInterval(() => {
    if (!window.speechSynthesis) {
      return;
    }
    if (speechSynthesis.paused && !isPaused) {
      speechSynthesis.resume();
    }
  }, 1800);
}

function stopSpeechKeepAlive() {
  if (speechKeepAliveTimer) {
    window.clearInterval(speechKeepAliveTimer);
    speechKeepAliveTimer = null;
  }
}

function normalizeSpeechEngineState() {
  if (!window.speechSynthesis) {
    return;
  }
  if (speechSynthesis.paused && !isPaused) {
    speechSynthesis.resume();
  }
}

function ensureVoicesReady() {
  if (!window.speechSynthesis) {
    return Promise.resolve(false);
  }

  const currentVoices = speechSynthesis.getVoices();
  if (currentVoices.length) {
    voicesReady = true;
    return Promise.resolve(true);
  }

  if (voiceInitPromise) {
    return voiceInitPromise;
  }

  voiceInitPromise = new Promise(resolve => {
    let done = false;

    const finish = value => {
      if (done) {
        return;
      }
      done = true;
      if (speechSynthesis.removeEventListener) {
        speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      } else {
        speechSynthesis.onvoiceschanged = null;
      }
      voiceInitPromise = null;
      resolve(value);
    };

    const onVoicesChanged = () => {
      if (speechSynthesis.getVoices().length) {
        voicesReady = true;
        finish(true);
      }
    };

    const timeoutId = window.setTimeout(() => {
      voicesReady = speechSynthesis.getVoices().length > 0;
      finish(voicesReady);
      window.clearTimeout(timeoutId);
    }, 1200);

    if (speechSynthesis.addEventListener) {
      speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    } else {
      speechSynthesis.onvoiceschanged = onVoicesChanged;
    }
  });

  return voiceInitPromise;
}

function appendLog(text) {
  void text;
}

function playStartupChime() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.09);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

  [220, 440, 660].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    osc.type = idx === 2 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
    osc.connect(gain);
    osc.start(now + idx * 0.08);
    osc.stop(now + 0.32 + idx * 0.08);
  });

  window.setTimeout(() => {
    ctx.close().catch(() => {});
  }, 1800);
}

function playZipRevealSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

  const zipOsc = ctx.createOscillator();
  zipOsc.type = "sawtooth";
  zipOsc.frequency.setValueAtTime(880, now);
  zipOsc.frequency.exponentialRampToValueAtTime(180, now + 0.52);
  zipOsc.connect(gain);
  zipOsc.start(now);
  zipOsc.stop(now + 0.56);

  const sparkleOsc = ctx.createOscillator();
  sparkleOsc.type = "triangle";
  sparkleOsc.frequency.setValueAtTime(640, now + 0.46);
  sparkleOsc.frequency.exponentialRampToValueAtTime(980, now + 0.8);
  sparkleOsc.connect(gain);
  sparkleOsc.start(now + 0.46);
  sparkleOsc.stop(now + 0.84);

  window.setTimeout(() => {
    ctx.close().catch(() => {});
  }, 1200);
}

function playCandleBlowSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  const limiter = ctx.createDynamicsCompressor();
  const outputBoost = ctx.createGain();
  limiter.threshold.setValueAtTime(-20, now);
  limiter.knee.setValueAtTime(18, now);
  limiter.ratio.setValueAtTime(10, now);
  limiter.attack.setValueAtTime(0.002, now);
  limiter.release.setValueAtTime(0.12, now);
  outputBoost.gain.setValueAtTime(3.6, now);

  master.connect(limiter);
  limiter.connect(outputBoost);
  outputBoost.connect(ctx.destination);
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.82, now + 0.01);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  // Noise burst gives the "firing" air-blast texture.
  const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.38), ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i += 1) {
    noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseData.length);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(1300, now);
  noiseFilter.Q.setValueAtTime(0.8, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.9, now + 0.01);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(now);
  noise.stop(now + 0.3);

  const shot = (start, freqStart, freqEnd, peak, type = "sawtooth") => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, start);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, start + 0.11);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + 0.15);
  };

  // Two quick punchy pops to make it sound like a celebratory firing burst.
  shot(now, 260, 90, 0.62);
  shot(now + 0.085, 210, 80, 0.5, "triangle");

  const tail = ctx.createOscillator();
  const tailGain = ctx.createGain();
  tail.type = "sine";
  tail.frequency.setValueAtTime(120, now + 0.05);
  tail.frequency.exponentialRampToValueAtTime(58, now + 0.42);
  tailGain.gain.setValueAtTime(0.0001, now + 0.04);
  tailGain.gain.exponentialRampToValueAtTime(0.34, now + 0.08);
  tailGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  tail.connect(tailGain);
  tailGain.connect(master);
  tail.start(now + 0.04);
  tail.stop(now + 0.46);

  window.setTimeout(() => {
    ctx.close().catch(() => {});
  }, 1100);
}

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function wait(ms) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
}

window.addEventListener("beforeunload", () => {
  stopFinalWordTyping();
  if (typingAudioCtx && typingAudioCtx.state !== "closed") {
    typingAudioCtx.close().catch(() => {});
  }
  stopCakeSlideMusic();
  if (window.speechSynthesis) {
    speechSynthesis.cancel();
  }
});
