// ---------- active nav link ----------
(function(){
  const page = document.body.dataset.page;
  document.querySelectorAll('.navlinks a').forEach(a => {
    if(a.dataset.page === page) a.classList.add('active');
  });
})();

// ---------- starfield canvas ----------
(function(){
  const canvas = document.getElementById('stars');
  if(!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function init(){
    resize();
    const count = Math.min(140, Math.floor((w*h)/9000));
    stars = Array.from({length: count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h*0.6,
      r: Math.random()*1.4 + 0.3,
      a: Math.random()*0.6 + 0.2,
      tw: Math.random()*0.02 + 0.005,
      dir: Math.random() > 0.5 ? 1 : -1,
      hue: Math.random() > 0.5 ? '79,215,255' : '155,123,255'
    }));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      ctx.beginPath();
      ctx.fillStyle = `rgba(${s.hue},${s.a})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
      if(!reduceMotion){
        s.a += s.tw * s.dir;
        if(s.a > 0.85 || s.a < 0.15) s.dir *= -1;
      }
    }
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { init(); if(reduceMotion) draw(); });
  init();
  draw();
})();

// ---------- hero terminal typing ----------
(function(){
  const body = document.getElementById('termBody');
  if(!body) return;
  const lines = [
    { t: "$ whoami", cls: "prompt" },
    { t: "bruce_bana — software developer, AI systems builder", cls: "out" },
    { t: "$ ls ./stack", cls: "prompt" },
    { t: "python  rust  node.js  android", cls: "out" },
    { t: "$ ./run --project active", cls: "prompt" },
    { t: "AIDE Ultra ........ local AI runtime", cls: "out" },
    { t: "BEX CLI ........... v8 ultra", cls: "out" },
    { t: "JARVIS Phase 11 ... building", cls: "out" },
  ];
  let li = 0, ci = 0;

  function typeLine(){
    if(li >= lines.length){
      const cur = document.createElement('span');
      cur.className = 'cursor';
      body.appendChild(cur);
      return;
    }
    const line = lines[li];
    const p = document.createElement('p');
    p.className = 'ln ' + line.cls;
    body.appendChild(p);
    ci = 0;
    typeChar(p, line.t);
  }
  function typeChar(p, text){
    if(ci <= text.length){
      p.textContent = text.slice(0, ci);
      ci++;
      setTimeout(() => typeChar(p, text), 14 + Math.random()*18);
    } else {
      li++;
      setTimeout(typeLine, li % 2 === 0 ? 260 : 90);
    }
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    body.innerHTML = lines.map(l => `<p class="ln ${l.cls}">${l.t}</p>`).join('');
  } else {
    typeLine();
  }
})();
