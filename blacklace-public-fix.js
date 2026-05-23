document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  if (window.lucide) window.lucide.createIcons();

  const video = $("#localVideo");
  const signalHealth = $("#signalHealth");
  const viewerCount = $("#viewerCount");
  const chatLog = $("#chatLog");
  const form = $("#blacklaceChatForm");
  const input = $("#blacklaceChatInput");
  const modal = $("#zoneModal");
  const modalBackdrop = $("#modalBackdrop");
  const modalClose = $("#modalClose");
  const modalKicker = $("#modalKicker");
  const modalTitle = $("#modalTitle");
  const modalText = $("#modalText");
  const modalFragment = $("#modalFragment");
  const modalActions = $("#modalActions");
  const phaseLabel = $("#phaseLabel");
  const particles = $("#blParticles");

  const videos = [
    "assets/videos/natasha-live.mp4",
    "assets/videos/nat2.mp4",
    "assets/videos/nat3.mp4",
    "assets/videos/nat4.mp4",
    "assets/videos/nat5.mp4",
    "assets/videos/nat6.mp4",
    "assets/videos/nat7.mp4"
  ];

  const zones = {
    port: {
      kicker: "Accès // Porsa Rotas",
      title: "Le Port",
      text: "Le port est la première frontière. Les visiteurs arrivent entre brume salée, terminaux perdus et signaux faibles.",
      fragment: "Chaque arrivée modifie légèrement l’île."
    },
    max: {
      kicker: "Bar & lumières",
      title: "Max Liberty",
      text: "Le bar garde les conversations, les verres et les signaux faibles. Max sait souvent avant les autres.",
      fragment: "Les lumières ne s’éteignent jamais complètement."
    },
    sator: {
      kicker: "Clairière // SATOR",
      title: "Clairière SATOR",
      text: "La clairière capte des fragments sans origine stable. Marty y parle aux signes, aux glitchs et aux choses qui répondent avant qu’on les appelle.",
      fragment: "SATOR AREPO TENET OPERA ROTAS."
    },
    ludmila: {
      kicker: "Club // perception",
      title: "Club Ludmila",
      text: "Le club transforme les perceptions et brouille les temporalités. Ici, une danse peut devenir une archive.",
      fragment: "La basse ouvre parfois des portes."
    },
    institute: {
      kicker: "Prototype // Feuch",
      title: "Feuch Institute",
      text: "Le Feuch Institute centralise les inventions, les jeux, les prototypes et les idées trop ambitieuses pour rester dans un carnet.",
      fragment: "Une idée abandonnée peut devenir une zone entière."
    },
    network: {
      kicker: "Signal // Broadcast",
      title: "Pro.Hibited Network",
      text: "BNN24, Moscomiul Break et transmissions fragmentaires. Le réseau parle avant que l’île ne s’explique.",
      fragment: "Les signaux faibles sont souvent les plus vrais."
    }
  };

  const lines = [
    ["SYSTEM", "Micro-anomalie détectée près de Rotas."],
    ["MAX", "Les lumières restent allumées. Pas de panique au comptoir."],
    ["ALOISIA", "Je garde ce fragment dans la brume."],
    ["MARTY", "Je confirme : la route du port a encore bégayé."],
    ["NATASHA", "Le signal vidéo saute, mais il revient toujours différent."],
    ["SLOBODANE", "Je ne dis pas que c’est cosmique. Je dis que ça regarde dans notre direction."]
  ];

  let videoIndex = 0;

  function glitch() {
    document.body.classList.add("bl-glitch", "bl-route-transition");
    setTimeout(() => document.body.classList.remove("bl-glitch", "bl-route-transition"), 460);
  }

  function addLine(name, text) {
    if (!chatLog) return;
    const line = document.createElement("div");
    line.className = "bl-log";
    line.innerHTML = `<strong>${name}</strong><span>${text}</span>`;
    chatLog.appendChild(line);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function setVideo(idx) {
    if (!video) return;
    videoIndex = idx % videos.length;
    const source = video.querySelector("source") || document.createElement("source");
    source.src = videos[videoIndex];
    source.type = "video/mp4";
    if (!source.parentNode) video.appendChild(source);
    video.load();
    video.play().catch(() => {});
    if (signalHealth) signalHealth.textContent = `SIGNAL ${92 + Math.floor(Math.random() * 7)}%`;
  }

  function nextVideo() {
    setVideo(videoIndex + 1);
    addLine("SYSTEM", "Le signal vidéo vient de glisser.");
    glitch();
  }

  function spawnParticle() {
    if (!particles) return;
    const p = document.createElement("i");
    p.className = "bl-particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.bottom = "-12px";
    p.style.setProperty("--x", (Math.random() * 120 - 60) + "px");
    p.style.animationDuration = (5 + Math.random() * 7) + "s";
    particles.appendChild(p);
    setTimeout(() => p.remove(), 12000);
  }

  function openZone(zoneKey) {
    const zone = zones[zoneKey];
    if (!zone || !modal) return;
    modalKicker.textContent = zone.kicker;
    modalTitle.textContent = zone.title;
    modalText.textContent = zone.text;
    modalFragment.textContent = zone.fragment;
    modalActions.innerHTML = `<button type="button" id="markSignal">Marquer le signal</button>`;
    modal.classList.remove("hidden");
    addLine("SYSTEM", "Accès demandé : " + zone.title + ".");
    glitch();
  }

  function closeModal() {
    if (modal) modal.classList.add("hidden");
  }

  setVideo(0);
  setInterval(nextVideo, 32000);
  setInterval(() => {
    const [name, text] = lines[Math.floor(Math.random() * lines.length)];
    addLine(name, text);
    if (viewerCount) viewerCount.textContent = (121 + Math.floor(Math.random() * 18)) + " viewers";
  }, 10000);
  setInterval(spawnParticle, 650);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    addLine("BENOÎT", value);
    input.value = "";
    setTimeout(() => addLine("ALOISIA", "Signal reçu. Je le garde dans la brume pour la prochaine mutation de l’île."), 450);
    glitch();
  });

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  $$(".mode-switcher").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.body.classList.remove("phase-signal", "phase-feuch", "phase-reboot");
      document.body.classList.add(btn.dataset.phase);
      if (phaseLabel) phaseLabel.textContent = btn.textContent.trim() + " ACTIVE";
      glitch();
    });
  });

  $$(".bl-node[data-zone]").forEach((btn) => {
    btn.addEventListener("click", () => openZone(btn.dataset.zone));
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.href.includes("#")) return;
    document.body.classList.add("bl-route-transition");
  });
});
