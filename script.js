document.addEventListener('DOMContentLoaded', function () {
  const qs = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));

  const video = document.getElementById('localVideo');
  const overlay = document.getElementById('signalOverlay');
  const screenLabel = document.getElementById('screenLabel');
  const viewerCount = document.getElementById('viewerCount');
  const chatLog = document.getElementById('chatLog');
  const chatForm = document.getElementById('blacklaceChatForm');
  const chatInput = document.getElementById('blacklaceChatInput');
  const phaseLabel = document.getElementById('phaseLabel');
  const modal = document.getElementById('zoneModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalKicker = document.getElementById('modalKicker');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalFragment = document.getElementById('modalFragment');
  const modalActions = document.getElementById('modalActions');

  const videoSources = [
    'assets/videos/natasha-live.mp4','assets/videos/nat2.mp4','assets/videos/nat3.mp4','assets/videos/nat4.mp4','assets/videos/nat5.mp4','assets/videos/nat6.mp4','assets/videos/nat7.mp4'
  ];

  const zones = {
    port:{kicker:'Porsa Rotas',title:'Le Port',text:'La porte d’entrée de Blacklace. Les voyageurs arrivent ici avant de comprendre que l’île les observe aussi.',fragment:'Un ferry fantôme passe parfois sans faire de vagues.'},
    max:{kicker:'Bar & lumières',title:'Max Liberty',text:'Le bar garde les conversations, les verres et les signaux faibles. Max sait souvent avant les autres.',fragment:'Les lumières ne s’éteignent jamais complètement.'},
    sator:{kicker:'Clairière',title:'Clairière SATOR',text:'Marty parle aux pierres. Certaines répondent dans le désordre.',fragment:'SATOR AREPO TENET OPERA ROTAS.'},
    ludmila:{kicker:'Club',title:'Club Ludmila',text:'Zone de perception modifiée, entre danse, glitch et rites nocturnes.',fragment:'La musique vient parfois du lendemain.'},
    institute:{kicker:'Lab',title:'Feuch Institute',text:'Prototypes, artefacts et idées dangereusement prometteuses.',fragment:'Le Feuch aime les expériences qui font clignoter le réel.'},
    network:{kicker:'Diffusion',title:'Pro.Hibited Network',text:'BNN24, Moscomiul Break et signaux vidéo de l’île.',fragment:'Chaque vidéo est peut-être une serrure.'}
  };

  const scriptedChat = [
    ['MARTY','Je confirme : la route du port a encore bégayé.'],
    ['NATASHA','Le signal revient. Ne bouge pas trop vite.'],
    ['SYSTEM','Micro-anomalie détectée près de Rotas.'],
    ['MAX','Les lumières restent allumées. Pas de panique au comptoir.'],
    ['ALOISIA','Je garde ce fragment dans la brume.']
  ];

  function addLine(name, text){
    if(!chatLog) return;
    const line = document.createElement('div');
    line.className = chatLog.classList.contains('bl-log-list') ? 'bl-log' : 'chat-line';
    const strong = document.createElement('strong');
    strong.textContent = name;
    const span = document.createElement('span');
    span.textContent = text;
    line.append(strong, span);
    chatLog.appendChild(line);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function setPhase(phase){
    document.body.classList.remove('phase-signal','phase-feuch','phase-reboot');
    document.body.classList.add(phase);
    if(phaseLabel) phaseLabel.textContent = phase.replace('phase-','').toUpperCase() + ' ACTIVE';
  }

  qsa('.mode-switcher,[data-phase]').forEach(btn=>{
    btn.addEventListener('click',()=> setPhase(btn.dataset.phase || 'phase-signal'));
  });

  if(video){
    let index = 0;
    function loadVideo(i){
      index = i % videoSources.length;
      video.src = videoSources[index];
      video.muted = true;
      video.loop = false;
      video.play().catch(()=>{});
      if(overlay) overlay.classList.add('hidden');
      if(screenLabel) screenLabel.textContent = index === 0 ? 'ROTAS // SIGNAL PRINCIPAL' : 'BLACKLACE // SIGNAL ' + (index+1);
    }
    video.addEventListener('ended',()=>loadVideo(index+1));
    loadVideo(0);
  }

  if(chatForm && chatInput){
    chatForm.addEventListener('submit', function(e){
      e.preventDefault();
      const value = chatInput.value.trim();
      if(!value) return;
      addLine('BENOÎT', value);
      chatInput.value='';
      setTimeout(()=>addLine('ALOISIA','Signal reçu. Je le garde dans la brume pour la prochaine mutation de l’île.'),420);
    });
    chatInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); chatForm.requestSubmit(); }
    });
  }

  let chatIndex = 0;
  if(chatLog){
    setInterval(()=>{
      const item = scriptedChat[chatIndex % scriptedChat.length];
      addLine(item[0], item[1]);
      chatIndex++;
      if(viewerCount) viewerCount.textContent = (118 + Math.floor(Math.random()*21)) + ' viewers';
    }, 6500);
  }

  qsa('[data-zone]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const z = zones[btn.dataset.zone];
      if(!z || !modal) return;
      if(modalKicker) modalKicker.textContent = z.kicker;
      if(modalTitle) modalTitle.textContent = z.title;
      if(modalText) modalText.textContent = z.text;
      if(modalFragment) modalFragment.textContent = z.fragment;
      if(modalActions) modalActions.innerHTML = '<button class="modal-action">Marquer le signal</button>';
      modal.classList.remove('hidden');
    });
  });

  function closeModal(){ if(modal) modal.classList.add('hidden'); }
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  const particles = document.getElementById('signalParticles');
  if(particles){
    setInterval(()=>{
      const p = document.createElement('span');
      p.className = 'signal-particle';
      p.style.left = Math.random()*100 + '%';
      p.style.top = (70 + Math.random()*25) + '%';
      p.style.animationDuration = (4 + Math.random()*4) + 's';
      particles.appendChild(p);
      setTimeout(()=>p.remove(),8000);
    },900);
  }
});
