document.addEventListener("DOMContentLoaded", function () {
  const chatWindow = document.getElementById("chatWindow");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const viewerCount = document.getElementById("viewerCount");
  const portals = document.getElementById("portals");
  const zonePanel = document.getElementById("zonePanel");
  const closePanel = document.getElementById("closePanel");
  const muteBtn = document.getElementById("muteBtn");
  const glitchBtn = document.getElementById("glitchBtn");
  const video = document.getElementById("natashaVideo");
  const panelSigil = document.getElementById("panelSigil");
  const archiveStrip = document.querySelector(".archive-strip");
  const pageTitle = document.getElementById("pageTitle");
  const streamHealth = document.querySelector(".stream-health");

  const videoSources = [
    "./assets/videos/natasha-live.mp4",
    "./assets/videos/nat2.mp4",
    "./assets/videos/nat3.mp4",
    "./assets/videos/nat4.mp4",
    "./assets/videos/nat5.mp4",
    "./assets/videos/nat6.mp4",
    "./assets/videos/nat7.mp4"
  ];

  let scriptedChat = [
    { name: "Marty404", text: "Je confirme : la route du port a encore bégayé." },
    { name: "MaxLiberty", text: "Les lumières restent allumées. Pas de panique au comptoir." },
    { name: "natasha", text: "Bienvenue sur Blacklace. Si le signal saute, c'est normal. Enfin... presque." },
    { name: "A_R_E_P_O", text: "R O T A S / O P E R A / T E N E T" },
    { name: "Slobodane", text: "Je ne dis pas que c'est cosmique. Je dis que ça regarde dans notre direction." },
    { name: "system", text: "La brume réorganise les accès." }
  ];

  let natashaLines = {
    morning: [
      "Le port est calme ce matin. C'est presque suspect.",
      "Max nettoie déjà le comptoir. Il fait ça quand quelque chose approche."
    ],
    day: [
      "L'île paraît normale en plein jour. C'est son meilleur mensonge.",
      "Marty vient de livrer un colis sans adresse. Il sourit trop."
    ],
    night: [
      "SATOR est plus actif la nuit. Ne répète pas les mots trop vite.",
      "Il y a une voix sous le signal. Je ne vais pas la nommer.",
      "Nikolas a remis le même morceau trois fois. Quelqu'un essaie de passer."
    ]
  };

  const replies = [
    "Je te vois dans le chat. Enfin... le signal te voit.",
    "Tu peux entrer par le port, mais ne suis pas les reflets trop longtemps.",
    "Max dit que le bar reste ouvert si la réalité commence à tousser.",
    "Marty est dans la clairière. S'il parle seul, ne l'interromps pas tout de suite.",
    "Le Feuch Institute n'est pas dangereux. En théorie. Sur papier. Avant minuit."
  ];

  const presenceLines = [
    { name: "system", text: "Le signal s'est souvenu d'un ancien passage." },
    { name: "Marty404", text: "Je n'ai pas écrit ce graffiti. Enfin... pas aujourd'hui." },
    { name: "system", text: "Un accès vient de changer d'état." },
    { name: "natasha", text: "Ne clique pas trop vite. Les chemins n'aiment pas ça." },
    { name: "system", text: "La route côtière répète un vieux message." },
    { name: "Marty404", text: "Si le chat saute, note l'heure. C'est important. Je crois." },
    { name: "natasha", text: "Je crois que quelqu'un trie les chemins pendant qu'on parle." }
  ];

  const titleVariants = [
    "Natasha est en direct.<br>La brume répond.",
    "Natasha est en direct.<br>La brume écoute.",
    "Natasha est en direct.<br>La brume hésite.",
    "Natasha est en direct.<br>Le signal se souvient.",
    "Natasha est en direct.<br>Les accès bougent."
  ];

  const portalStates = [
    { state: "stable", label: "stable" },
    { state: "unstable", label: "instable" },
    { state: "locked", label: "verrouillé" },
    { state: "listening", label: "écoute" }
  ];

  let zones = {
    port: {
      kicker: "ACCÈS // PORSA ROTAS",
      title: "Le Port",
      accent: "port",
      sigil: "sigil-target",
      text: "Le port de Porsa Rotas est la première frontière. Les visiteurs y arrivent entre brume salée, vieux terminaux et signaux perdus.",
      fragment: "Chaque arrivée modifie légèrement l'île. Les routes ne reviennent jamais exactement au même endroit.",
      reaction: "Le port est calme ce soir. Trop calme pour être honnête."
    },
    max: {
      kicker: "ACCÈS // MAX LIBERTY",
      title: "Max Liberty",
      accent: "max",
      sigil: "sigil-eye",
      text: "Max Liberty est le bar néon de Moscomiul. Il garde l'équilibre quand le reste de l'île commence à bégayer.",
      fragment: "Si le bar s'éteint, le cycle gèle. Max sait toujours qui vient d'entrer.",
      reaction: "Max sourit. Ça veut dire que tu es le bienvenu, ou que tu arrives trop tard."
    },
    sator: {
      kicker: "ACCÈS // CLAIRIÈRE SATOR",
      title: "La Clairière SATOR",
      accent: "sator",
      sigil: "sigil-triangle",
      text: "La clairière capte des fragments sans origine stable. Marty y parle aux signes, aux glitchs et aux choses qui répondent avant qu'on les appelle.",
      fragment: "SATOR AREPO TENET OPERA ROTAS. Le temps ne tourne pas toujours dans le bon sens.",
      reaction: "Marty parle encore tout seul près des dolmens."
    },
    institute: {
      kicker: "ACCÈS // FEUCH INSTITUTE",
      title: "Feuch Institute",
      accent: "institute",
      sigil: "sigil-hex",
      text: "Le Feuch Institute centralise les inventions, les prototypes, les jeux et les projets trop ambitieux pour rester dans un carnet.",
      fragment: "Feuchroom, laboratoires, anneaux NFC, mécaniques de jeu : une idée abandonnée peut devenir une zone entière.",
      reaction: "Le Feuch Institute vient d'allumer ses voyants. Personne ne sait qui a appuyé sur ON."
    }
  };

  let chatIndex = 0;
  let videoIndex = randomIndex(videoSources.length);
  let currentPeriod = getPeriod();
  let archiveItems = [];
  let memory = loadPresenceMemory();

  async function loadIslandData() {
    try {
      const response = await fetch("./assets/data/blacklace.json", { cache: "no-store" });
      if (!response.ok) return;

      const data = await response.json();
      if (data.chat && Array.isArray(data.chat.scripted)) {
        scriptedChat = data.chat.scripted;
      }
      if (data.chat && data.chat.natasha) {
        natashaLines = data.chat.natasha;
      }
      if (data.zones) {
        zones = data.zones;
      }
      if (Array.isArray(data.archives)) {
        archiveItems = data.archives;
      }
    } catch (error) {
      addMsg("system", "Base locale indisponible. Le signal utilise sa memoire cachee.");
    }
  }

  function renderArchives() {
    if (!archiveStrip || !archiveItems.length) return;

    archiveStrip.innerHTML = "";
    archiveItems.forEach(function (item) {
      const article = document.createElement("article");
      const sigil = document.createElement("span");
      const kicker = document.createElement("p");
      const title = document.createElement("h2");
      const text = document.createElement("p");

      sigil.className = "archive-sigil " + item.sigil;
      sigil.setAttribute("aria-hidden", "true");
      kicker.className = "archive-kicker";
      kicker.textContent = item.kicker;
      title.textContent = item.title;
      text.textContent = item.text;

      article.append(sigil, kicker, title, text);
      archiveStrip.appendChild(article);
    });
  }

  function randomIndex(length, excludedIndex) {
    if (length < 2) return 0;
    let next = Math.floor(Math.random() * length);
    while (next === excludedIndex) {
      next = Math.floor(Math.random() * length);
    }
    return next;
  }

  function getPeriod() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 20) return "day";
    return "night";
  }

  function applyPeriod() {
    document.body.classList.remove("period-morning", "period-day", "period-night");
    document.body.classList.add("period-" + currentPeriod);
  }

  function loadPresenceMemory() {
    const fallback = {
      visits: 0,
      lastZone: "",
      openedZones: {},
      firstSeen: new Date().toISOString(),
      lastSeen: ""
    };

    try {
      const stored = JSON.parse(localStorage.getItem("blacklacePresence") || "null");
      return Object.assign(fallback, stored || {});
    } catch (error) {
      return fallback;
    }
  }

  function savePresenceMemory() {
    try {
      localStorage.setItem("blacklacePresence", JSON.stringify(memory));
    } catch (error) {}
  }

  function markVisit() {
    const previousZone = memory.lastZone;
    memory.visits += 1;
    memory.lastSeen = new Date().toISOString();
    savePresenceMemory();

    if (memory.visits > 1) {
      window.setTimeout(function () {
        addMsg("system", previousZone ? "Retour détecté. Le dernier accès n'est plus exactement au même endroit." : "Retour détecté. La page avait gardé une trace.");
        triggerPresence("memory");
      }, 1500);
    }
  }

  function rememberZone(zoneName) {
    memory.lastZone = zoneName;
    memory.openedZones[zoneName] = (memory.openedZones[zoneName] || 0) + 1;
    savePresenceMemory();
  }

  function addMsg(name, text) {
    const msg = document.createElement("div");
    msg.className = "msg";
    if (name === "natasha") msg.classList.add("natasha");
    if (name === "system") msg.classList.add("system");

    if (name === "system") {
      msg.textContent = text;
    } else {
      const author = document.createElement("strong");
      author.textContent = `${name}:`;
      msg.append(author, ` ${text}`);
    }

    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function triggerGlitch() {
    document.body.classList.add("is-glitching");
    window.setTimeout(function () {
      document.body.classList.remove("is-glitching");
    }, 500);
  }

  function triggerPresence(reason) {
    document.body.classList.add("is-presence-awake");
    if (reason) document.body.dataset.presence = reason;
    window.setTimeout(function () {
      document.body.classList.remove("is-presence-awake");
      document.body.removeAttribute("data-presence");
    }, 1200);
  }

  function driftTitle() {
    if (!pageTitle) return;
    const nextTitle = titleVariants[randomIndex(titleVariants.length)];
    pageTitle.classList.add("is-rewriting");
    window.setTimeout(function () {
      pageTitle.innerHTML = nextTitle;
      pageTitle.classList.remove("is-rewriting");
    }, 220);
  }

  function changePortalState(targetPortal, forcedState) {
    const portalList = document.querySelectorAll(".portal");
    const portal = targetPortal || portalList[randomIndex(portalList.length)];
    if (!portal) return;
    const state = forcedState || portalStates[randomIndex(portalStates.length)];

    portal.dataset.state = state.state;
    portal.dataset.stateLabel = state.label;
    portal.classList.add("is-touched");

    window.setTimeout(function () {
      portal.classList.remove("is-touched");
    }, 1500);
  }

  function updateSignalHealth() {
    if (!streamHealth) return;
    const health = 91 + Math.floor(Math.random() * 8);
    streamHealth.textContent = "Signal " + health + "%";
  }

  function runPresencePulse() {
    const roll = Math.random();
    const line = presenceLines[randomIndex(presenceLines.length)];

    addMsg(line.name, line.text);
    updateSignalHealth();

    if (roll > 0.34) changePortalState();
    if (roll > 0.58) driftTitle();
    if (roll > 0.72) triggerGlitch();
    triggerPresence("pulse");

    const nextDelay = 24000 + Math.floor(Math.random() * 36000);
    window.setTimeout(runPresencePulse, nextDelay);
  }

  function setVideo(index, silent) {
    videoIndex = index;
    video.querySelector("source").src = videoSources[videoIndex];
    video.load();
    video.play().catch(function () {});
    if (!silent) {
      addMsg("system", "Le signal vidéo saute.");
      triggerGlitch();
    }
  }

  function playNextVideo() {
    setVideo(randomIndex(videoSources.length, videoIndex), false);
  }

  function natashaAside(lines) {
    const source = lines || natashaLines[currentPeriod];
    addMsg("natasha", source[Math.floor(Math.random() * source.length)]);
  }

  function selectZone(zoneName, shouldReact) {
    const zone = zones[zoneName];
    if (!zone) return;

    document.body.dataset.zone = zone.accent;
    panelSigil.className = "panel-sigil " + zone.sigil;
    document.getElementById("panelKicker").textContent = zone.kicker;
    document.getElementById("panelTitle").textContent = zone.title;
    document.getElementById("panelText").textContent = zone.text;
    document.getElementById("panelFragment").textContent = zone.fragment;
    zonePanel.classList.remove("is-collapsed");
    rememberZone(zoneName);

    document.querySelectorAll(".portal").forEach(function (portal) {
      portal.classList.toggle("active", portal.dataset.zone === zoneName);
    });

    if (shouldReact) {
      addMsg("system", "Accès demandé : " + zone.title + ".");
      window.setTimeout(function () {
        addMsg("natasha", zone.reaction);
      }, 650);
      triggerGlitch();
      triggerPresence(zoneName);
    }
  }

  function switchCamera() {
    setVideo(randomIndex(videoSources.length, videoIndex), false);
  }

  async function startIsland() {
    await loadIslandData();
    renderArchives();
    markVisit();

    setVideo(videoIndex, true);
    applyPeriod();
    addMsg("system", "Connexion au live Natasha...");
    window.setTimeout(function () {
      addMsg("natasha", "Le signal est stable. Pour l'instant.");
    }, 700);
    window.setTimeout(function () {
      natashaAside();
    }, 2200);
    window.setTimeout(runPresencePulse, 12000 + Math.floor(Math.random() * 18000));

    selectZone("port", false);
    zonePanel.classList.add("is-collapsed");
    document.querySelectorAll(".portal").forEach(function (portal) {
      changePortalState(portal, {
        state: portal.classList.contains("active") ? "stable" : "listening",
        label: portal.classList.contains("active") ? "stable" : "écoute"
      });
    });

    window.setInterval(function () {
      const item = scriptedChat[chatIndex % scriptedChat.length];
      addMsg(item.name, item.text);
      chatIndex += 1;
      viewerCount.textContent = (124 + Math.floor(Math.random() * 19)) + " viewers";
      updateSignalHealth();
    }, 4200);

    window.setInterval(function () {
      currentPeriod = getPeriod();
      applyPeriod();
      natashaAside();
    }, 30000);
  }

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMsg("Toi", text);
    chatInput.value = "";

    window.setTimeout(function () {
      addMsg("natasha", replies[Math.floor(Math.random() * replies.length)]);
      if (Math.random() > 0.62) {
        triggerPresence("reply");
        changePortalState();
      }
    }, 850);
  });

  document.getElementById("enterBtn").addEventListener("click", function () {
    portals.scrollIntoView({ behavior: "smooth", block: "center" });
    addMsg("system", "Les premiers accès viennent de s'ouvrir.");
    triggerGlitch();
    driftTitle();
    triggerPresence("enter");
  });

  if (muteBtn) {
    muteBtn.addEventListener("click", function () {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "Son coupé" : "Son actif";
      muteBtn.setAttribute("aria-pressed", String(video.muted));
    });
  }

  if (glitchBtn) {
    glitchBtn.addEventListener("click", switchCamera);
  }

  video.addEventListener("ended", playNextVideo);

  document.querySelectorAll(".portal").forEach(function (portal) {
    portal.addEventListener("mouseenter", function () {
      document.body.dataset.previewZone = portal.dataset.zone;
    });
    portal.addEventListener("mouseleave", function () {
      document.body.removeAttribute("data-preview-zone");
    });
    portal.addEventListener("click", function () {
      selectZone(portal.dataset.zone, true);
    });
  });

  closePanel.addEventListener("click", function () {
    zonePanel.classList.add("is-collapsed");
  });

  startIsland();
});
