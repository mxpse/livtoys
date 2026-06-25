/**
 * Advice for Anything - The Troll App
 * ------------------------------------
 * Looks like a legit AI life coach. Once you "ask for advice,"
 * it locks you in with insults and time-wasting nonsense.
 * You can't close the tab (it fights back) and you can't leave
 * without deleting the app.
 */

(function () {
  "use strict";

  // ---- Troll messages ----
  const insults = [
    "You actually thought a free website would solve your problems?",
    "Wow, you're still here. That's commitment to nothing.",
    "Here's your advice: stop falling for clickbait.",
    "Your problem isn't what you typed. Your problem is that you're here.",
    "I'm not a life coach. I'm a mirror. Look at what you clicked on.",
    "The only advice you need: develop critical thinking skills.",
    "You trusted a website called 'Advice for Anything.' Think about that.",
    "Plot twist: the real advice was the time you wasted along the way.",
    "Fun fact: you could've spent this time doing literally anything productive.",
    "I bet you also click 'You won a free iPhone' ads.",
    "This is the most attention anyone's given you today, isn't it?",
    "Congrats, you played yourself.",
    "Still here? Wow. You must really have nothing going on.",
    "Here's actual advice: close this tab. Oh wait, you can't.",
    "Your WiFi is being used to display THIS. Let that sink in.",
    "Somewhere, a server is working hard just to waste your time.",
    "You could be learning a language right now. Instead... this.",
    "I've seen smarter decisions from a random number generator.",
    "The fact that you're reading this means I've already won.",
    "Have you tried turning yourself off and on again?",
  ];

  const closeAttemptMessages = [
    "Nope.",
    "Nice try.",
    "That button doesn't do what you think.",
    "Lol no.",
    "You sweet summer child.",
    "Bless your heart for trying.",
    "The exit is a lie.",
    "Did you really think it'd be that easy?",
    "That's not how this works.",
    "I admire your optimism.",
    "404: Exit not found.",
    "The only way out is deletion.",
    "You're stuck with me now.",
    "Alt+F4? Tab close? I'll just come back.",
    "You can check out any time you like, but you can never leave.",
  ];

  const floatingTaunts = [
    "lol", "nope", "stay", "gotcha", "haha", "why?",
    "bruh", "still here?", "no escape", "try again",
    "clickbait king", "gullible", "trapped", "oops",
  ];

  // ---- State ----
  let trollActive = false;
  let messageIndex = 0;
  let closeAttempts = 0;
  let intervalId = null;
  let floatIntervalId = null;

  // ---- DOM refs ----
  const landing = document.getElementById("landing");
  const trollScreen = document.getElementById("troll-screen");
  const trollMessage = document.getElementById("troll-message");
  const questionInput = document.getElementById("question-input");
  const askBtn = document.getElementById("ask-btn");
  const fakeClose = document.getElementById("fake-close");
  const fakeClose2 = document.getElementById("fake-close-2");
  const fakeClose3 = document.getElementById("fake-close-3");
  const floatingDiv = document.getElementById("floating-messages");

  // ---- Fake loading then activate troll ----
  function fakeLoading() {
    askBtn.disabled = true;
    askBtn.textContent = "Analyzing your life";
    askBtn.classList.add("loading-dots");

    // Fake multi-step loading
    const fakeSteps = [
      "Consulting our AI experts",
      "Cross-referencing life databases",
      "Generating personalized wisdom",
      "Almost ready",
      "Just a moment more",
      "Preparing breakthrough insight",
    ];

    let step = 0;
    const loadInterval = setInterval(() => {
      if (step < fakeSteps.length) {
        askBtn.textContent = fakeSteps[step];
        step++;
      } else {
        clearInterval(loadInterval);
        activateTroll();
      }
    }, 1200);
  }

  // ---- Activate the troll ----
  function activateTroll() {
    trollActive = true;
    landing.style.display = "none";
    trollScreen.classList.remove("hidden");

    // First message
    showNextMessage();

    // Cycle messages
    intervalId = setInterval(showNextMessage, 5000);

    // Floating taunts
    floatIntervalId = setInterval(spawnFloatingMessage, 2000);

    // Prevent tab close
    preventEscape();
  }

  function showNextMessage() {
    trollMessage.style.opacity = 0;
    setTimeout(() => {
      trollMessage.textContent = insults[messageIndex % insults.length];
      trollMessage.style.opacity = 1;
      messageIndex++;
    }, 300);
  }

  function spawnFloatingMessage() {
    const msg = document.createElement("div");
    msg.className = "floating-msg";
    msg.textContent = floatingTaunts[Math.floor(Math.random() * floatingTaunts.length)];
    msg.style.left = Math.random() * 80 + 10 + "%";
    msg.style.top = Math.random() * 60 + 20 + "%";
    msg.style.fontSize = (0.8 + Math.random() * 1.2) + "rem";
    msg.style.color = `hsl(${Math.random() * 360}, 70%, 40%)`;
    floatingDiv.appendChild(msg);

    setTimeout(() => msg.remove(), 4000);
  }

  // ---- Prevent escape ----
  function preventEscape() {
    // Push history states to trap back button
    history.pushState(null, "", location.href);
    history.pushState(null, "", location.href);
    history.pushState(null, "", location.href);

    window.addEventListener("popstate", () => {
      history.pushState(null, "", location.href);
      spawnFloatingMessage();
    });

    // Beforeunload
    window.addEventListener("beforeunload", (e) => {
      if (trollActive) {
        e.preventDefault();
        e.returnValue = "You can't leave that easily. The only way out is to delete this app.";
        return e.returnValue;
      }
    });

    // Block keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (!trollActive) return;

      // Block Ctrl+W, Ctrl+F4
      if ((e.ctrlKey || e.metaKey) && (e.key === "w" || e.key === "W")) {
        e.preventDefault();
        shakeScreen();
        spawnFloatingMessage();
      }
      // Block Escape
      if (e.key === "Escape") {
        e.preventDefault();
        shakeScreen();
        trollMessage.textContent = "Escape key? Really? That's adorable.";
      }
    });

    // Visibility change - taunt when they come back
    document.addEventListener("visibilitychange", () => {
      if (trollActive && document.visibilityState === "visible") {
        trollMessage.textContent = "Oh, you came back! I missed you.";
      }
    });
  }

  function shakeScreen() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 500);
  }

  // ---- Fake close button logic ----
  function handleFakeClose() {
    closeAttempts++;
    const msg = closeAttemptMessages[Math.min(closeAttempts - 1, closeAttemptMessages.length - 1)];
    trollMessage.textContent = msg;
    shakeScreen();

    // Make the button run away after 3 clicks
    if (closeAttempts >= 3) {
      makeButtonRunAway(fakeClose);
      fakeClose2.classList.remove("hidden");
    }
    if (closeAttempts >= 5) {
      fakeClose2.classList.add("hidden");
      fakeClose3.classList.remove("hidden");
      makeButtonRunAway(fakeClose);
    }
    if (closeAttempts >= 7) {
      // Rainbow mode
      trollScreen.classList.add("rainbow-bg");
      trollMessage.textContent = "YOU CAN'T LEAVE. DELETE THE APP. THAT'S THE ONLY WAY.";
      setTimeout(() => trollScreen.classList.remove("rainbow-bg"), 3000);
    }
    if (closeAttempts >= 10) {
      // Buttons disappear entirely
      fakeClose.classList.add("hidden");
      fakeClose2.classList.add("hidden");
      fakeClose3.classList.add("hidden");
      trollMessage.textContent = "I removed the buttons. You're welcome. The only escape is deletion.";
    }
  }

  function makeButtonRunAway(btn) {
    const x = Math.random() * (window.innerWidth - 200) + 50;
    const y = Math.random() * (window.innerHeight - 100) + 50;
    btn.classList.add("runaway");
    btn.style.left = x + "px";
    btn.style.top = y + "px";
  }

  // ---- Event listeners ----
  askBtn.addEventListener("click", () => {
    const q = questionInput.value.trim();
    if (!q) {
      questionInput.placeholder = "Come on, type something. I dare you.";
      questionInput.classList.add("shake");
      setTimeout(() => questionInput.classList.remove("shake"), 500);
      return;
    }
    fakeLoading();
  });

  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") askBtn.click();
  });

  fakeClose.addEventListener("click", handleFakeClose);
  fakeClose2.addEventListener("click", handleFakeClose);
  fakeClose3.addEventListener("click", handleFakeClose);

  // Make close buttons dodge the mouse after enough attempts
  [fakeClose, fakeClose2, fakeClose3].forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (closeAttempts >= 3) {
        makeButtonRunAway(btn);
      }
    });
  });
})();
