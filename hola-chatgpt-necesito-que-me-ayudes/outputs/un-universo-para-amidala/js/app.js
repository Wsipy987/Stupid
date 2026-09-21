/* Sin librerías ni compilación: también funciona abriendo index.html directamente. */
(() => {
  "use strict";
  const gift = window.GIFT;
  const $ = (id) => document.getElementById(id);
  const welcome = $("welcome");
  const galaxy = $("galaxy");
  const dialog = $("flower-dialog");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const discovered = new Set();
  let activeIndex = 0;
  let lastBouquet = null;
  let paused = reducedMotion.matches;

  document.querySelectorAll("[data-recipient]").forEach((node) => { node.textContent = gift.recipient.toLocaleUpperCase("es"); });
  document.title = `Un universo para ${gift.recipient} · Flores amarillas`;
  $("intro-text").textContent = gift.intro;
  $("signature").textContent = gift.signature;

  function showGalaxy(shouldFocus = true) {
    welcome.hidden = true;
    galaxy.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    if (shouldFocus) $("galaxy-title").focus({ preventScroll: true });
  }

  function showWelcome(shouldFocus = true) {
    if (dialog.open) dialog.close();
    galaxy.hidden = true;
    welcome.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    if (shouldFocus) $("enter-galaxy").focus({ preventScroll: true });
  }

  // Las anclas permiten que los botones Atrás y Adelante del navegador funcionen.
  function readRoute(shouldFocus = true) {
    if (location.hash === "#galaxia") showGalaxy(shouldFocus);
    else showWelcome(shouldFocus);
  }
  $("enter-galaxy").addEventListener("click", () => { location.hash = "galaxia"; });
  $("back-to-welcome").addEventListener("click", () => { location.hash = "bienvenida"; });
  window.addEventListener("hashchange", () => readRoute());
  readRoute(false);

  gift.bouquets.forEach((bouquet, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bouquet";
    button.dataset.index = index;
    button.setAttribute("aria-label", `Abrir dedicatoria: ${bouquet.label}`);
    const float = document.createElement("span");
    float.className = "bouquet-float";
    const art = document.createElement("span");
    art.className = "bouquet-art";
    art.dataset.art = bouquet.art;
    art.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "bouquet-label";
    label.textContent = bouquet.label;
    const read = document.createElement("span");
    read.className = "read-star";
    read.textContent = "✦";
    read.setAttribute("aria-hidden", "true");
    label.append(read);
    const subtitle = document.createElement("span");
    subtitle.className = "bouquet-subtitle";
    subtitle.textContent = bouquet.subtitle;
    float.append(art, label, subtitle);
    button.append(float);
    button.addEventListener("click", () => { lastBouquet = button; openMessage(index); });
    $("bouquets").append(button);
    const dot = document.createElement("span");
    dot.className = "discovery-dot";
    $("discovery-dots").append(dot);
  });

  function openMessage(index) {
    activeIndex = index;
    const bouquet = gift.bouquets[index];
    $("message-art").dataset.art = bouquet.art;
    $("message-kind").textContent = bouquet.kind;
    $("message-title").textContent = bouquet.title;
    $("message-meaning").textContent = bouquet.meaning;
    $("message-body").textContent = bouquet.message;
    $("message-pagination").textContent = `${String(index + 1).padStart(2, "0")} / ${String(gift.bouquets.length).padStart(2, "0")}`;
    discovered.add(index);
    document.querySelectorAll(".bouquet")[index].classList.add("is-read");
    document.querySelectorAll(".bouquet")[index].setAttribute("aria-label", `Volver a leer: ${bouquet.label}`);
    $("discovery-dots").children[index].classList.add("is-read");
    $("discovery-count").textContent = `${discovered.size} de ${gift.bouquets.length} mensajes descubiertos`;
    if (discovered.size === gift.bouquets.length) $("closing-line").textContent = gift.finalMessage;
    if (!dialog.open) {
      document.body.classList.add("modal-open");
      dialog.showModal();
    }
    dialog.scrollTop = 0;
    $("close-message").focus({ preventScroll: true });
  }

  $("close-message").addEventListener("click", () => dialog.close());
  $("next-message").addEventListener("click", () => openMessage((activeIndex + 1) % gift.bouquets.length));
  // Un clic real fuera de la tarjeta cierra el mensaje; Escape lo resuelve <dialog>.
  let backdropPressed = false;
  dialog.addEventListener("pointerdown", (event) => { backdropPressed = event.target === dialog; });
  dialog.addEventListener("click", (event) => {
    if (backdropPressed && event.target === dialog) dialog.close();
    backdropPressed = false;
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (!galaxy.hidden && lastBouquet) lastBouquet.focus({ preventScroll: true });
  });

  // Cielo ligero: estrellas dibujadas localmente y movimiento según el cursor.
  const canvas = $("starfield");
  const context = canvas.getContext("2d");
  let width = 0, height = 0, stars = [], frame = 0, lastTime = 0;
  const pointer = { x: 0, y: 0 };
  const drift = { x: 0, y: 0 };
  let comet = null;
  let nextCometAt = 0;
  let running = false;

  function resizeSky() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from({ length: Math.min(210, Math.floor(width * height / 5500)) }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: Math.random() * 1.1 + .3,
      alpha: Math.random() * .45 + .12,
      phase: Math.random() * Math.PI * 2,
      depth: Math.random() * 9 + 2,
      warm: Math.random() > .8
    }));
    paintSky(performance.now());
  }

  function paintSky(time) {
    if (!context) return;
    const still = paused || reducedMotion.matches;
    context.clearRect(0, 0, width, height);
    drift.x += (pointer.x - drift.x) * .035;
    drift.y += (pointer.y - drift.y) * .035;
    for (const star of stars) {
      const twinkle = still ? .8 : .65 + Math.sin(time / 2100 + star.phase) * .35;
      context.globalAlpha = star.alpha * twinkle;
      context.fillStyle = star.warm ? "#f8d998" : "#d7d7f5";
      context.beginPath();
      context.arc(star.x + (still ? 0 : drift.x * star.depth), star.y + (still ? 0 : drift.y * star.depth), star.radius, 0, Math.PI * 2);
      context.fill();
    }
    if (!still && time > nextCometAt && !comet) {
      comet = { born: time, x: width * (.2 + Math.random() * .7), y: height * Math.random() * .4 };
      nextCometAt = time + 11000 + Math.random() * 9000;
    }
    if (comet && !still) {
      const age = (time - comet.born) / 1100;
      if (age > 1) comet = null;
      else {
        const x = comet.x - age * 230, y = comet.y + age * 145;
        const gradient = context.createLinearGradient(x, y, x + 85, y - 54);
        gradient.addColorStop(0, "#f4dbab");gradient.addColorStop(1, "#f4dbab00");
        context.globalAlpha = Math.sin(age * Math.PI) * .55;
        context.strokeStyle = gradient;context.lineWidth = 1;
        context.beginPath();context.moveTo(x, y);context.lineTo(x + 85, y - 54);context.stroke();
      }
    }
    context.globalAlpha = 1;
  }

  function tick(time) {
    if (!running) return;
    if (time - lastTime >= 32) { paintSky(time);lastTime = time; }
    frame = requestAnimationFrame(tick);
  }
  function updateMotion() {
    const still = paused || reducedMotion.matches;
    document.documentElement.classList.toggle("motion-paused", still);
    const toggle = $("motion-toggle");
    toggle.setAttribute("aria-pressed", String(still));
    toggle.setAttribute("aria-label", still ? "Activar movimiento de las estrellas" : "Pausar movimiento de las estrellas");
    toggle.title = reducedMotion.matches ? "Tu dispositivo tiene activado reducir movimiento" : (still ? "Activar movimiento" : "Pausar movimiento");
    toggle.disabled = reducedMotion.matches;
    toggle.firstElementChild.textContent = still ? "▷" : "Ⅱ";
    toggle.lastElementChild.textContent = still ? "Activar estrellas" : "Pausar estrellas";
    cancelAnimationFrame(frame);
    running = !still && !document.hidden;
    comet = null;
    nextCometAt = performance.now() + 5000;
    paintSky(performance.now());
    if (running) frame = requestAnimationFrame(tick);
  }
  $("motion-toggle").addEventListener("click", () => { paused = !paused;updateMotion(); });
  reducedMotion.addEventListener("change", () => { paused = reducedMotion.matches;updateMotion(); });
  document.addEventListener("visibilitychange", updateMotion);
  window.addEventListener("resize", resizeSky);
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX / Math.max(width, 1) - .5;
      pointer.y = event.clientY / Math.max(height, 1) - .5;
    }, { passive: true });
  }
  resizeSky();
  updateMotion();
})();
