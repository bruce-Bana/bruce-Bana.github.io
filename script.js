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


// ---------- enhanced navigation + utilities ----------
(function(){
 const links=[['dashboard.html','dashboard'],['projects.html','projects'],['blog.html','blog'],['lab.html','lab'],['search.html','search'],['games.html','games'],['cv.html','cv']];
 document.querySelectorAll('.navlinks').forEach(nav=>{links.forEach(([href,label])=>{if(!nav.querySelector('a[href="'+href+'"]')){const a=document.createElement('a');a.href=href;a.textContent=label;nav.appendChild(a);}});});
 const body=document.body;
 if('serviceWorker' in navigator && location.protocol==='https:') navigator.serviceWorker.register('sw.js').catch(()=>{});
 const year=document.querySelector('footer .wrap'); if(year) year.innerHTML=year.innerHTML.replace(/©\\s*\\d{4}/,'© '+new Date().getFullYear());
})();

// ---------- keyboard shortcut: / opens site search ----------
(function(){document.addEventListener('keydown',e=>{if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){const q=document.getElementById('siteSearch');if(q){e.preventDefault();q.focus();}}});})();

// ---------- living interface ----------
(function(){
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const progress=document.createElement('div');progress.className='scroll-progress';document.body.appendChild(progress);
 const orb=document.createElement('div');orb.className='float-orb';document.body.appendChild(orb);
 const cursor=document.createElement('div');cursor.className='cursor-glow';document.body.appendChild(cursor);
 if(!reduce){
  document.addEventListener('mousemove',e=>{document.documentElement.style.setProperty('--mx',e.clientX+'px');document.documentElement.style.setProperty('--my',e.clientY+'px');cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.opacity='1';});
  document.addEventListener('mouseleave',()=>cursor.style.opacity='0');
  let last=0;window.addEventListener('scroll',()=>{const now=performance.now();if(now-last<30)return;last=now;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?(scrollY/max)*100:0)+'%';});
  const els=document.querySelectorAll('section,.int-card,.glass');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('reveal','visible')}),{threshold:.08});els.forEach(e=>{if(!e.classList.contains('reveal'))e.classList.add('reveal');io.observe(e)});
  let t=0;setInterval(()=>{t+=.7;const x=50+Math.sin(t/18)*32,y=42+Math.cos(t/23)*22;orb.style.setProperty('--orb-x',x+'%');orb.style.setProperty('--orb-y',y+'%')},50);
 }else{progress.style.width='0';}
})();

// ---------- interactive card tilt ----------
(function(){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.querySelectorAll('.int-card,.blog-card,.repo-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(700px) rotateX('+(-y*3)+'deg) rotateY('+(x*3)+'deg) translateY(-3px)';});
  card.addEventListener('mouseleave',()=>card.style.transform='');
 });
})();

// ---------- ambient particle network ----------
(function(){
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce)return;
 const c=document.createElement('canvas');c.id='lifeCanvas';c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.42';document.querySelector('.bg-layer')?.appendChild(c);
 const x=c.getContext('2d');let w,h,p=[];
 function resize(){w=c.width=innerWidth;h=c.height=innerHeight;p=Array.from({length:Math.min(55,Math.floor(w/24))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22}))}resize();addEventListener('resize',resize);
 function draw(){x.clearRect(0,0,w,h);for(const a of p){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1;x.fillStyle='rgba(97,216,255,.45)';x.fillRect(a.x,a.y,1.4,1.4)}for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){const a=p[i],b=p[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<125){x.strokeStyle='rgba(97,216,255,'+(0.08*(1-d/125))+')';x.lineWidth=.7;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}requestAnimationFrame(draw)}draw();
})();

// ---------- meteor shower ----------
(function(){
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce)return;
 const host=document.querySelector('.bg-layer'); if(!host)return;
 const c=document.createElement('canvas'); c.id='meteorCanvas'; c.setAttribute('aria-hidden','true');
 c.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.9'; host.appendChild(c);
 const ctx=c.getContext('2d'); let w=0,h=0,items=[],timer=0,last=performance.now();
 function resize(){const d=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0)}
 function spawn(){const speed=9+Math.random()*8,ang=Math.PI*.70+(Math.random()-.5)*.12;items.push({x:Math.random()*w*1.15-w*.1,y:-40-Math.random()*h*.25,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,len:70+Math.random()*110,width:.8+Math.random()*1.5,age:0,max:55+Math.random()*45})}
 function draw(now){const dt=Math.min(32,now-last);last=now;ctx.clearRect(0,0,w,h);timer-=dt;if(timer<=0){spawn();timer=900+Math.random()*1800}for(let i=items.length-1;i>=0;i--){const m=items[i];m.x+=m.vx*dt/16.67;m.y+=m.vy*dt/16.67;m.age+=dt/16.67;const fade=Math.min(1,m.age/8,m.max/m.age),scale=m.len/16.67,tx=m.x-m.vx*scale/Math.max(Math.abs(m.vx),1),ty=m.y-m.vy*scale/Math.max(Math.abs(m.vy),1),g=ctx.createLinearGradient(m.x,m.y,tx,ty);g.addColorStop(0,'rgba(225,248,255,'+(.95*fade)+')');g.addColorStop(.18,'rgba(97,216,255,'+(.65*fade)+')');g.addColorStop(1,'rgba(97,216,255,0)');ctx.strokeStyle=g;ctx.lineWidth=m.width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(tx,ty);ctx.stroke();ctx.fillStyle='rgba(220,250,255,'+(.9*fade)+')';ctx.shadowBlur=10;ctx.shadowColor='rgba(97,216,255,.8)';ctx.beginPath();ctx.arc(m.x,m.y,m.width*1.35,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(m.age>m.max||m.x>w+180||m.y>h+180)items.splice(i,1)}requestAnimationFrame(draw)}
 addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();
