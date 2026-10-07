// ===== EDIT THESE =====
const ROUND1=new Date('2026-10-09T19:00:00+05:30');
const ROUND2=new Date('2026-10-11T18:30:00+05:30');
const FORM_URL='https://forms.gle/DNg85ECqjBBXo6pS7', MEETUP_URL='';
// ======================
const $=id=>document.getElementById(id);
[['formL',FORM_URL,'Open registration form →'],['meetL',MEETUP_URL,'Join Meetup →']].forEach(([id,u,t])=>{
  if(u){const e=$(id);e.href=u;e.textContent=t;e.classList.remove('off');}
});
function share(){
  const text='AWS Codeathon 2K26 by GIST AWS Club: a beginner-friendly cloud quiz and virtual build challenge with prizes and certificates. Quiz on 9 Oct, 7 PM.';
  const url=location.href;
  if(navigator.share){navigator.share({title:'AWS Codeathon 2K26',text,url}).catch(()=>{});}
  else{window.open('https://wa.me/?text='+encodeURIComponent(text+' '+url),'_blank','noopener');}
}
$('shareTop').onclick=share;$('shareBtm').onclick=share;
const steps=[['Registration','Open now'],['Round 1 · Quiz','09 Oct, 7:00 PM'],['Round 2 · Codeathon','Due 11 Oct, 6:30 PM'],['Results','Winners announced · TBA']];
const tl=$('tl');
tl.innerHTML=steps.map(s=>`<li><div class="st"></div><h4>${s[0]}</h4><p>${s[1]}</p></li>`).join('');
function render(){
  const n=new Date();
  const st=[n>=ROUND1?'done':'now',n>=ROUND1?'done':'',n<ROUND1?'':n<ROUND2?'now':'done',n<ROUND2?'':'now'];
  const lab={done:'Done',now:'In progress','':'Upcoming'};
  tl.querySelectorAll('li').forEach((li,i)=>{li.className=st[i];li.querySelector('.st').textContent=lab[st[i]]});
  let t=null,l='Status';
  if(n<ROUND1){t=ROUND1;l='Round 1 starts in'}else if(n<ROUND2){t=ROUND2;l='Round 2 closes in'}
  if(!t){$('cLbl').textContent=l;$('cv').textContent='Completed';return}
  const ms=t-n,d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),p=v=>String(v).padStart(2,'0');
  $('cLbl').textContent=l;$('cv').textContent=`${d}d ${p(h)}h ${p(m)}m`;
}
render();setInterval(render,30000);

document.documentElement.classList.add('js');
(function(){
  const els=document.querySelectorAll('.card,.tl li,.facts,.note,details');
  els.forEach(e=>e.classList.add('rv'));
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return;}
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08});
  els.forEach(e=>io.observe(e));
})();

// ---- top countdown ----
(function(){
  const g=id=>document.getElementById(id),p=v=>String(v).padStart(2,'0');
  function tick(){
    const n=new Date();let t=null,l='Event complete';
    if(n<ROUND1){t=ROUND1;l='Round 1 quiz starts in'}else if(n<ROUND2){t=ROUND2;l='Round 2 closes in'}
    const ms=t?Math.max(0,t-n):0;
    g('tLbl').textContent=l;g('tD').textContent=Math.floor(ms/864e5);
    g('tH').textContent=p(Math.floor(ms%864e5/36e5));g('tM').textContent=p(Math.floor(ms%36e5/6e4));g('tS').textContent=p(Math.floor(ms%6e4/1e3));
  }
  tick();setInterval(tick,1000);
})();
// ---- page routing ----
(function(){
  const pages=[...document.querySelectorAll('.page')],links=[...document.querySelectorAll('.links a')];
  function route(){
    let id=(location.hash||'#home').slice(1);
    if(!document.getElementById('p-'+id))id='home';
    pages.forEach(x=>x.classList.toggle('on',x.id==='p-'+id));
    links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));
    window.scrollTo(0,0);
  }
  addEventListener('hashchange',route);route();
})();

// ---- cheat sheet: download comes straight from Google Drive; "View online" embeds it ----
(function(){
  const btn=document.getElementById('viewBtn'),box=document.getElementById('pdfView'),fr=document.getElementById('pdfFrame');
  btn.addEventListener('click',()=>{
    const open=box.hidden;
    if(open&&!fr.src)fr.src=fr.dataset.src;
    box.hidden=!open;
    btn.setAttribute('aria-expanded',open);
    btn.textContent=open?'Hide preview':'View online';
    if(open)box.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
})();

// ---- mobile menu ----
(function(){
  const btn=document.getElementById('menuBtn'),nav=document.getElementById('navLinks');
  const scrim=document.createElement('div');scrim.className='menuScrim';document.body.appendChild(scrim);
  function set(o){nav.classList.toggle('open',o);scrim.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu')}
  btn.addEventListener('click',()=>set(!nav.classList.contains('open')));
  scrim.addEventListener('click',()=>set(false));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
  addEventListener('hashchange',()=>set(false));
  addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
  addEventListener('resize',()=>{if(innerWidth>760)set(false)});
})();

// ---- registration tracker: 3 checkpoints -> ticks -> 5s completion animation -> Registered ----
(function(){
  const trk=document.getElementById('trk');if(!trk)return;
  const KEY='aws2k26-registration',KEYS=['m1','m2','f'];
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  const st={m1:false,m2:false,f:false};let timer=null;
  try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');KEYS.forEach(k=>st[k]=!!s[k])}catch(e){}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
  const all=()=>KEYS.every(k=>st[k]);
  const barBtn=document.getElementById('barBtn'),T=document.getElementById('trkT'),C=document.getElementById('trkC');
  function setOk(){
    trk.classList.remove('fin');trk.classList.add('ok');
    T.textContent='Registered';barBtn.textContent='Registered \u2713';
  }
  function finish(){
    trk.classList.add('fin');T.textContent='Finalising your registration';
    clearTimeout(timer);timer=setTimeout(setOk,reduce?600:5000); // 5s moderate-paced run
  }
  function render(){
    let n=0;
    KEYS.forEach(k=>{
      const on=st[k];if(on)n++;
      const li=trk.querySelector('li[data-k="'+k+'"]'),b=document.querySelector('.rchk[data-k="'+k+'"]');
      li.classList.toggle('done',on);li.querySelector('small').textContent=on?'Completed':'Pending';
      b.setAttribute('aria-pressed',on);b.querySelector('.rt').textContent=on?'Done \u00b7 tap to undo':'Mark as done';
      b.closest('.reg').classList.toggle('reg-done',on);
    });
    C.textContent=n+' / 3 completed';trk.style.setProperty('--p',(n/3*100)+'%');
    if(n<3){clearTimeout(timer);trk.classList.remove('fin','ok');T.textContent='Registration in progress';barBtn.textContent='Register'}
  }
  document.querySelectorAll('.rchk').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.k,was=all();st[k]=!st[k];save();render();
    if(!was&&all())finish();
  }));
  render();if(all())setOk(); // returning visitor: show the finished state straight away
})();
