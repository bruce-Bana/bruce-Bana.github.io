/* Bruce Bana portfolio interactions — dependency-free and performance-aware */
(function(){
  const page=document.body.dataset.page;
  document.querySelectorAll('.navlinks a').forEach(a=>{if(a.dataset.page===page)a.classList.add('active')});

  // Add a compact mobile menu to every page without changing each page's markup.
  document.querySelectorAll('nav .wrap').forEach(wrap=>{
    const links=wrap.querySelector('.navlinks');
    if(!links||wrap.querySelector('.nav-toggle'))return;
    const button=document.createElement('button');
    button.className='nav-toggle';button.type='button';button.setAttribute('aria-label','Open navigation');
    button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','primary-links');
    button.innerHTML='<span></span>';
    if(!links.id)links.id='primary-links';
    wrap.appendChild(button);
    const close=()=>{links.classList.remove('is-open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation')};
    button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation');links.classList.toggle('is-open',open)});
    links.addEventListener('click',e=>{if(e.target.closest('a'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.addEventListener('click',e=>{if(!wrap.contains(e.target))close()});
  });

  if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
  const footer=document.querySelector('footer .wrap');
  if(footer)footer.innerHTML=footer.innerHTML.replace(/©\s*\d{4}/,'© '+new Date().getFullYear());

  // Keep the background subtle and inexpensive. Static on mobile, reduced-motion and save-data.
  const canvas=document.getElementById('stars');
  if(canvas){
    const ctx=canvas.getContext('2d');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower=matchMedia('(max-width: 680px)').matches||navigator.connection?.saveData||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);
    let w=0,h=0,stars=[],frame=0,raf=0;
    function resize(){
      const d=Math.min(devicePixelRatio||1,1.25);w=innerWidth;h=innerHeight;
      canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);
      const count=Math.min(lowPower?18:54,Math.floor(w*h/(lowPower?48000:26000)));
      stars=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h*.72,r:.35+Math.random()*.9,a:.2+Math.random()*.5,phase:Math.random()*6}));
      draw();
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(const s of stars){const alpha=reduce||lowPower?s.a:s.a*(.72+.28*Math.sin(frame*.012+s.phase));ctx.fillStyle='rgba(137,218,255,'+alpha+')';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}
      frame++;
      if(!reduce&&!lowPower&&!document.hidden)raf=requestAnimationFrame(draw);
    }
    let timer;addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(resize,160)},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!reduce&&!lowPower)draw()});
    resize();
  }

  // Hero terminal copy is static by default; no delayed timers or layout shifts.
  const term=document.getElementById('termBody');
  if(term){
    const lines=[['$ whoami','prompt'],['bruce_bana — software developer & AI systems builder','out'],['$ ls ./stack','prompt'],['python  rust  javascript  android','out'],['$ ./build --focus','prompt'],['AI systems · developer tools · useful software','out']];
    term.replaceChildren(...lines.map(([text,kind])=>{const p=document.createElement('p');p.className='ln '+kind;p.textContent=text;return p}));
  }

  const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
  let ticking=false;
  function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';ticking=false}
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true}},{passive:true});
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});
    document.querySelectorAll('main section,.project-card,.int-card,.blog-card').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
  }
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){const input=document.getElementById('siteSearch');if(input){e.preventDefault();input.focus()}}});
})();