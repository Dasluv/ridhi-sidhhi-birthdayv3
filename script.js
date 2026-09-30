const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let w=0,h=0,dpr=1,stars=[],petals=[],raf=0;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  dpr=Math.min(window.devicePixelRatio||1,1.6);
  w=window.innerWidth; h=window.innerHeight;
  canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
  canvas.style.width=w+'px'; canvas.style.height=h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:Math.min(95,Math.floor(w*h/8500))},()=>({
    x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+.35,
    a:Math.random()*.65+.15,phase:Math.random()*Math.PI*2,speed:.005+Math.random()*.012
  }));
}
function draw(){
  ctx.clearRect(0,0,w,h);
  stars.forEach(s=>{
    s.phase+=s.speed;
    const alpha=s.a*(.55+.45*Math.sin(s.phase));
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,224,170,${alpha})`;ctx.fill();
  });
  if(!reduced){
    petals.forEach(p=>{
      p.y+=p.vy;p.x+=Math.sin(p.y*.012+p.phase)*.55;
      p.rot+=p.vr;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.globalAlpha=p.alpha;ctx.fillStyle=p.color;
      ctx.beginPath();ctx.ellipse(0,0,p.size*.55,p.size,0,0,Math.PI*2);ctx.fill();ctx.restore();
    });
    petals=petals.filter(p=>p.y<h+30);
    if(petals.length<22 && Math.random()<.16){
      petals.push({x:Math.random()*w,y:-15,size:4+Math.random()*5,vy:.45+Math.random()*.8,
        rot:Math.random()*6,vr:(Math.random()-.5)*.025,phase:Math.random()*6,
        alpha:.35+Math.random()*.5,color:Math.random()>.5?'#ff9fc5':'#ffd98a'});
    }
  }
  raf=requestAnimationFrame(draw);
}
window.addEventListener('resize',resize,{passive:true});
resize(); draw();

/* =========================
   Birthday opening fireworks
   ========================= */
const intro = document.getElementById('birthday-intro');
const celebration = document.getElementById('celebration');
const cctx = celebration.getContext('2d');
let cw=0,ch=0,cdpr=1;
let fireworks=[], confetti=[];
let celebrationRunning=true;

const fireworkColors=['#ff9fc5','#ffd98a','#d6c4ff','#ffffff','#ff6fae'];

function celebrationResize(){
  cdpr=Math.min(window.devicePixelRatio||1,1.5);
  cw=window.innerWidth; ch=window.innerHeight;
  celebration.width=Math.floor(cw*cdpr);
  celebration.height=Math.floor(ch*cdpr);
  celebration.style.width=cw+'px';
  celebration.style.height=ch+'px';
  cctx.setTransform(cdpr,0,0,cdpr,0,0);
}
function launchFirework(x,y,color){
  const count=48+Math.floor(Math.random()*28);
  for(let i=0;i<count;i++){
    const angle=(Math.PI*2*i)/count + (Math.random()-.5)*.12;
    const speed=2.2+Math.random()*3.5;
    fireworks.push({
      x,y,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      life:0,
      max:42+Math.random()*28,
      size:1.3+Math.random()*2.1,
      color
    });
  }
}
function launchBurst(){
  const x=cw*(.15+Math.random()*.7);
  const y=ch*(.18+Math.random()*.38);
  launchFirework(x,y,fireworkColors[Math.floor(Math.random()*fireworkColors.length)]);
}
function addConfettiBurst(){
  for(let i=0;i<95;i++){
    confetti.push({
      x:cw*.5+(Math.random()-.5)*120,
      y:ch*.35+(Math.random()-.5)*70,
      vx:(Math.random()-.5)*7,
      vy:-2-Math.random()*6,
      g:.12+Math.random()*.08,
      rot:Math.random()*6,
      vr:(Math.random()-.5)*.3,
      size:3+Math.random()*5,
      life:0,
      max:110+Math.random()*70,
      color:fireworkColors[Math.floor(Math.random()*fireworkColors.length)]
    });
  }
}
function drawCelebration(){
  if(!celebrationRunning) return;
  cctx.clearRect(0,0,cw,ch);

  fireworks.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vx*=.985; p.vy*=.985; p.vy+=.035; p.life++;
    const alpha=Math.max(0,1-p.life/p.max);
    cctx.save();
    cctx.globalAlpha=alpha;
    cctx.shadowBlur=12;
    cctx.shadowColor=p.color;
    cctx.fillStyle=p.color;
    cctx.beginPath();cctx.arc(p.x,p.y,p.size,0,Math.PI*2);cctx.fill();
    cctx.restore();
  });
  fireworks=fireworks.filter(p=>p.life<p.max);

  confetti.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.rot+=p.vr;p.life++;
    const alpha=Math.max(0,1-p.life/p.max);
    cctx.save();cctx.globalAlpha=alpha;cctx.translate(p.x,p.y);cctx.rotate(p.rot);
    cctx.fillStyle=p.color;cctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*1.8);cctx.restore();
  });
  confetti=confetti.filter(p=>p.life<p.max && p.y<ch+30);

  requestAnimationFrame(drawCelebration);
}

function startBirthdayCelebration(){
  if(reduced){
    intro.classList.add('hide');
    return;
  }
  celebrationResize();
  window.addEventListener('resize',celebrationResize,{passive:true});

  // Immediate opening bursts, then a few timed bursts.
  setTimeout(()=>launchFirework(cw*.28,ch*.32,'#ff9fc5'),250);
  setTimeout(()=>launchFirework(cw*.72,ch*.28,'#ffd98a'),650);
  setTimeout(()=>launchFirework(cw*.50,ch*.22,'#d6c4ff'),1100);
  setTimeout(()=>launchFirework(cw*.18,ch*.43,'#ffffff'),1650);
  setTimeout(()=>launchFirework(cw*.82,ch*.42,'#ff6fae'),1950);
  setTimeout(addConfettiBurst,2300);
  setTimeout(()=>launchFirework(cw*.50,ch*.30,'#ffd98a'),2850);
  setTimeout(addConfettiBurst,3200);
  setTimeout(()=>launchFirework(cw*.30,ch*.25,'#ff9fc5'),3900);
  setTimeout(()=>launchFirework(cw*.70,ch*.25,'#d6c4ff'),4300);

  drawCelebration();

  // Give the surprise a proper opening, then reveal the page.
  setTimeout(()=>{
    intro.classList.add('hide');
    setTimeout(()=>{
      celebrationRunning=false;
      cctx.clearRect(0,0,cw,ch);
    },1000);
  },6100);
}

startBirthdayCelebration();

/* Music */
const musicButtons=[...document.querySelectorAll('.music-btn')];
const audios=musicButtons.map(btn=>document.getElementById(btn.dataset.audio));
const toast=document.getElementById('toast');
let toastTimer;
function showToast(msg){
  toast.textContent=msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),3500);
}
function resetButtons(){
  musicButtons.forEach(b=>{
    b.textContent='▶';
    b.setAttribute('aria-label',b.dataset.audio==='audio1'?'Play Tenu Sang Rakhna':'Play Tera Yaar Hoon Main');
  });
}
musicButtons.forEach(btn=>{
  const audio=document.getElementById(btn.dataset.audio);
  btn.addEventListener('click',async()=>{
    audios.forEach(other=>{
      if(other!==audio){other.pause();other.currentTime=0}
    });
    resetButtons();
    if(audio.paused){
      try{
        await audio.play();
        btn.textContent='Ⅱ';
        btn.setAttribute('aria-label','Pause song');
      }catch(e){
        showToast('Audio file not found. Check the MP3 filename and folder.');
      }
    }else{
      audio.pause();
      btn.textContent='▶';
    }
  });
  audio.addEventListener('ended',()=>{btn.textContent='▶'});
});
