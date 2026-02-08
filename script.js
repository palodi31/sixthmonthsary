(() => {
  // Change password here
  const SECRET_PASSWORD = "0620"; // example only

  // Views
  const views = {
    home: document.getElementById("homeView"),
    letter: document.getElementById("letterView"),
    snapshots: document.getElementById("snapshotsView"),
    reminders: document.getElementById("remindersView"),
    locked: document.getElementById("lockedView"),
  };

  const topNav = document.getElementById("topNav");
  const pageTitle = document.getElementById("pageTitle");
  const homeBtn = document.getElementById("homeBtn");

  const titles = {
    letter: "Letter ♡",
    snapshots: "This Month’s Snapshots ♡",
    reminders: "Daily Reminders ♡",
    locked: "Locked Surprise ♡",
  };

  // ---- Heart sprinkle ----
  function sprinkleHearts(count = 16) {
    const hearts = ["♡", "♥", "❥"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "float-heart";
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

      const x = Math.random() * (window.innerWidth - 20) + 10;
      const y = Math.random() * (window.innerHeight - 40) + 20;
      const dx = (Math.random() * 120 - 60).toFixed(0) + "px";

      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.setProperty("--dx", dx);

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    }
  }

  function showView(name, doHearts = true) {
    Object.values(views).forEach(v => v && v.classList.add("d-none"));

    if (name === "home") {
      views.home?.classList.remove("d-none");
      topNav?.classList.add("d-none");
      document.title = "Six Monthsary ♡";
      history.replaceState({}, "", "#home");
      if (doHearts) sprinkleHearts(14);
      return;
    }

    views[name]?.classList.remove("d-none");
    topNav?.classList.remove("d-none");
    if (pageTitle) pageTitle.textContent = titles[name] || "";
    document.title = titles[name] || "Six Monthsary ♡";
    history.replaceState({}, "", `#${name}`);

    // Auto hearts whenever a section is opened
    if (doHearts) sprinkleHearts(18);
  }

  // Handle card clicks (section pressed)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-go]");
    if (!btn) return;
    const target = btn.getAttribute("data-go");
    if (target && views[target]) showView(target, true);
  });

  // Home button
  homeBtn?.addEventListener("click", () => showView("home", true));

  // Deep-link support via hash (still sprinkles hearts once)
  const hash = (location.hash || "#home").replace("#", "");
  if (views[hash]) showView(hash, true);
  else showView("home", false);

  // ---- Polaroid modal ----
  const modalEl = document.getElementById("photoModal");
  const modalImg = document.getElementById("modalImg");
  const modalCaption = document.getElementById("modalCaption");

  document.addEventListener("click", (e) => {
    const p = e.target.closest(".polaroid[data-img]");
    if (!p) return;

    const img = p.getAttribute("data-img");
    const cap = p.getAttribute("data-caption") || "";

    if (modalImg) modalImg.src = img;
    if (modalCaption) modalCaption.textContent = cap;

    if (modalEl && window.bootstrap) {
      const m = bootstrap.Modal.getOrCreateInstance(modalEl, { backdrop: true });
      m.show();
    }
  });

  if (modalEl) {
    modalEl.addEventListener("hidden.bs.modal", () => {
      if (modalImg) modalImg.src = "";
    });
  }

  // ---- Locked logic ----
  const pwInput = document.getElementById("pwInput");
  const pwBtn = document.getElementById("pwBtn");
  const tapBtn = document.getElementById("tapHeartBtn");
  const tapCountEl = document.getElementById("tapCount");
  const unlockMsg = document.getElementById("unlockMsg");
  const secretArea = document.getElementById("secretArea");

  const STORAGE_KEY = "monthsary_unlocked_v1";
  const unlockedAlready = localStorage.getItem(STORAGE_KEY) === "yes";

  function unlockNow(message = "Unlocked ♡") {
    if (unlockMsg) unlockMsg.textContent = message;
    if (secretArea) secretArea.classList.remove("d-none");
    localStorage.setItem(STORAGE_KEY, "yes");
    sprinkleHearts(26);
  }

  if (unlockedAlready && secretArea) unlockNow("Welcome back ♡");

  pwBtn?.addEventListener("click", () => {
    const typed = (pwInput?.value || "").trim();
    if (!typed) {
      if (unlockMsg) unlockMsg.textContent = "Type a password first ♡";
      return;
    }
    if (typed === SECRET_PASSWORD) {
      unlockNow("Password accepted ♡");
    } else {
      if (unlockMsg) unlockMsg.textContent = "Nope—try again, love ♡";
      if (pwInput) pwInput.value = "";
      pwInput?.focus();
    }
  });

  let taps = 0;
  const TAP_TARGET = 1000;
  const tapStoreKey = "monthsary_taps_v1";

  const storedTaps = Number(localStorage.getItem(tapStoreKey) || "0");
  if (!Number.isNaN(storedTaps) && storedTaps > 0) taps = storedTaps;

  function renderTaps() {
    if (tapCountEl) tapCountEl.textContent = String(taps);
  }
  renderTaps();

  tapBtn?.addEventListener("click", () => {
    if (localStorage.getItem(STORAGE_KEY) === "yes") return;

    taps += 1;
    localStorage.setItem(tapStoreKey, String(taps));
    renderTaps();

    if (taps % 50 === 0 && unlockMsg) unlockMsg.textContent = `So close… (${taps}/${TAP_TARGET}) ♡`;
    if (taps === TAP_TARGET) unlockNow("You did it! ♡");
  });
})();
