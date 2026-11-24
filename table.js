/* 10 — The Glass Table */
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS='http://www.w3.org/2000/svg';
const svg=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e;};
const el=(t,c,html)=>{const e=document.createElement(t);if(c)e.className=c;if(html!=null)e.innerHTML=html;return e;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pad=n=>String(n).padStart(2,'0');
const LIST=(window.HGDemos&&HGDemos.list)||[];
const idx=id=>LIST.findIndex(d=>d.id===id);
const vw=()=>document.documentElement.clientWidth,isWide=()=>vw()>980;

const hero=$('#hero'),cam=$('#cam'),tbl=$('#tbl'),rig=$('#rig'),sp=$('#sp');
let K=.56,layout=()=>{};
function fit(){K=tbl.offsetWidth/1254;tbl.style.setProperty('--u',K.toFixed(4)+'px');layout();const vr=document.getElementById('viewRig');if(vr)vr.style.setProperty('--vs',isWide()?Math.min(1,(vw()*.46-60)/452).toFixed(3):((Math.min(vw(),560)-74)/452).toFixed(3));}
fit();addEventListener('resize',()=>{fit();if(focus>=0)place(focus);fitDock();});

/* ---------- buildings: real boxes on the night plan. Roof = the plan texture, walls = lit clay with glowing windows ---------- */
const W=(l,t,w,h,c,d)=>`<b class="gt-win ${c||''}" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%;--wd:${d||0}s"></b>`;
const B={
  house:{x:266,y:400,w:186,h:166,z:70,
    f:W(12,34,20,34,'',.1)+W(68,34,20,34,'',.5)+`<b class="gt-door" style="left:41%;width:18%;height:62%"></b>`,
    l:W(30,30,34,36,'',.8),r:W(36,30,34,36,'',.3)},
  warehouse:{x:484,y:208,w:262,h:202,z:104,
    f:W(9,12,20,17,'gt-win--tri',.2)+W(40,12,20,17,'gt-win--tri',.5)+W(71,12,20,17,'gt-win--tri',.8)+`<b class="gt-shut" style="left:31%;width:38%;height:54%"></b><b class="gt-bol" style="left:24%"></b><b class="gt-bol" style="left:71.5%"></b>`,
    l:W(18,24,26,22,'',.9)+W(56,24,26,22,'',.4),r:W(18,24,26,22,'',.6)+W(56,24,26,22,'',1)},
  clinic:{x:774,y:394,w:230,h:128,z:78,
    f:`<b class="gt-trim" style="top:20%"></b>`+W(7,36,18,36,'',.3)+W(76,36,18,36,'',.7)+W(36,30,28,70,'gt-win--door',.1),
    l:W(28,34,40,36,'',.6),r:W(30,34,40,36,'',.9),awn:[30,40,66,34]},
  office:{x:337,y:728,w:260,h:118,z:72,
    f:W(9,34,20,38,'gt-win--frame',.4)+`<b class="gt-trim gt-trim--s" style="top:22%;left:38%;width:52%"></b>`+W(42,34,44,66,'gt-win--bay',.1),
    l:W(30,32,38,36,'',.7),r:W(30,32,38,36,'',.2)},
  shop:{x:678,y:730,w:238,h:94,z:78,
    f:W(7,46,56,40,'gt-win--shop',.2)+W(72,40,17,60,'gt-win--door',.6)+`<b class="gt-trim gt-trim--s" style="top:30%;left:70%;width:22%"></b>`,
    l:W(26,34,44,36,'',.5),r:W(26,34,44,36,'',.9),awn:[4,62,60,30,1]}
};
Object.keys(B).forEach((k,i)=>{const b=B[k],w=el('div','gt-b gt-b--'+k);
  w.innerHTML=`<i class="gt-bloom"></i><i class="gt-spill"></i><i class="gt-w gt-w-b"></i><i class="gt-w gt-w-l">${b.l||''}</i><i class="gt-w gt-w-r">${b.r||''}</i><i class="gt-w gt-w-f">${b.f}</i>${b.awn?`<i class="gt-awn${b.awn[4]?' gt-awn--s':''}"></i>`:''}<i class="gt-b-top"></i>`;
  $('#blds').appendChild(w);b.el=w;b.p={};['bloom','spill','w-b','w-l','w-r','w-f','awn','b-top'].forEach(c=>b.p[c]=w.querySelector('.gt-'+c));
  const on=()=>w.classList.add('is-lit');if(RM)on();else setTimeout(on,1500+i*420);});

/* ---------- pins: upright glass flags that always face you ---------- */
const PINS=[
  {id:'follow-up',b:'house',x:359,y:470,z:70,h:52,side:'l',short:'Follow-ups',idle:'Waiting on a finished job'},
  {id:'sealed-bid',b:'warehouse',x:615,y:300,z:104,h:60,side:'r',short:'Sealed bids',idle:'Bidding open'},
  {id:'lead-responder',b:'clinic',x:889,y:452,z:78,h:60,side:'r',short:'Leads',idle:'Watching the inbox'},
  {id:'crm',b:null,x:150,y:690,z:0,h:62,side:'l',short:'Outreach',idle:'Scanning a market'},
  {id:'quote-builder',b:'office',x:420,y:786,z:72,h:24,side:'l',short:'Quotes',idle:'Ready to quote'},
  {id:'jsp-naturals',b:'shop',x:840,y:776,z:78,h:24,side:'r',short:'Store',idle:'Store open'},
  {id:'allacart',b:null,x:1100,y:690,z:0,h:62,side:'r',short:'Cart app',idle:'Cart in sync'}
].filter(p=>idx(p.id)>=0).sort((a,b)=>idx(a.id)-idx(b.id));
if(!isWide())PINS.forEach(p=>{if(p.id==='crm')p.side='r';if(p.id==='allacart')p.side='l';});
const pinsEl=$('#pins');
const hotB=(p,on)=>{if(p.b)B[p.b].el.classList.toggle('is-hot',on);};
PINS.forEach((p,i)=>{
  const d=LIST[idx(p.id)];
  const w=el('div','gt-pin gt-pin--'+p.side);w.style.cssText=`--h:${p.h}px;--d:${(i*.37).toFixed(2)}s`;
  w.innerHTML=`<div class="gt-pin-in"><i class="gt-stem"></i><button type="button" class="gt-flag" aria-label="${d.name}: open this build"><b><i>${pad(idx(p.id)+1)}</i>${p.short}</b><span>${p.idle}</span></button></div>`;
  pinsEl.appendChild(w);p.el=w;p.btn=$('.gt-flag',w);p.stat=$('.gt-flag span',w);
  const hot=on=>{if(focus<0||PINS[focus]!==p)hotB(p,on);};
  p.btn.addEventListener('pointerenter',()=>hot(true));p.btn.addEventListener('pointerleave',()=>hot(false));
  p.btn.addEventListener('focus',()=>hot(true));p.btn.addEventListener('blur',()=>hot(false));
  p.btn.addEventListener('click',e=>{e.stopPropagation();if(dragged)return;if(isWide())open(i);else HGPanel.open(p.id);});
});
const pinOf=id=>PINS.find(p=>p.id===id);
layout=()=>{const u=v=>(v*K).toFixed(1)+'px';
  Object.values(B).forEach(b=>{b.el.style.cssText=`left:${u(b.x)};top:${u(b.y)};width:${u(b.w)};height:${u(b.h)}`;const p=b.p,z=u(b.z);
    p['b-top'].style.cssText=`transform:translateZ(${z});background-size:${u(1254)} ${u(1254)};background-position:-${u(b.x)} -${u(b.y)}`;
    p['w-f'].style.cssText=`left:0;width:100%;height:${z};top:${u(b.h-b.z)}`;
    p['w-b'].style.cssText=`left:0;width:100%;height:${z};top:${u(-b.z)}`;
    p['w-l'].style.cssText=`top:0;height:100%;width:${z};left:${u(-b.z)}`;
    p['w-r'].style.cssText=`top:0;height:100%;width:${z};left:100%`;
    p.spill.style.cssText=`left:${u(-b.w*.18)};width:${u(b.w*1.36)};top:${u(b.h-6)};height:${u(Math.max(150,b.w*.62))}`;
    p.bloom.style.cssText=`left:${u(-b.w*.35)};width:${u(b.w*1.7)};top:${u(-b.h*.4)};height:${u(b.h*1.8+120)}`;
    if(p.awn){const a=b.awn;p.awn.style.cssText=`left:${a[0]}%;width:${a[1]}%;top:100%;height:${u(a[3])};transform:translateZ(${u(b.z*a[2]/100)}) rotateX(-20deg)`;}});
  PINS.forEach(p=>{p.el.style.left=u(p.x);p.el.style.top=u(p.y);});
  if(typeof applyCam==='function'&&typeof tilt==='number')applyCam();};

/* ---------- routes along the roads + light packets ---------- */
const routesSvg=$('#routes'),packEl=$('#packets');
const round=(pts,r)=>{let d='M'+pts[0];for(let i=1;i<pts.length-1;i++){const a=pts[i-1],c=pts[i],b=pts[i+1];
    const la=Math.hypot(a[0]-c[0],a[1]-c[1]),lb=Math.hypot(b[0]-c[0],b[1]-c[1]),ra=Math.min(r,la/2),rb=Math.min(r,lb/2);
    d+='L'+[c[0]+(a[0]-c[0])*ra/la,c[1]+(a[1]-c[1])*ra/la]+'Q'+c+' '+[c[0]+(b[0]-c[0])*rb/lb,c[1]+(b[1]-c[1])*rb/lb];}
  return d+'L'+pts[pts.length-1];};
const ROUTES=[
  {k:'lead',pin:'lead-responder',text:'Lead answered',dur:5200,delay:500,pts:[[358,598],[358,672],[900,672],[900,632]]},
  {k:'quote',pin:'quote-builder',text:'Quote sent',dur:7000,delay:2000,pts:[[614,508],[614,672],[140,672],[104,640],[500,1034],[500,918]]},
  {k:'invoice',pin:'follow-up',text:'Invoice sent',dur:9000,delay:3400,pts:[[797,920],[797,1034],[1146,646],[623,92],[102,640],[140,672],[358,672],[358,598]]},
  {k:'review',pin:'follow-up',text:'Review requested',dur:6000,delay:5400,pts:[[797,920],[797,1034],[623,1150],[104,644],[140,672],[358,672],[358,598]]}
];
ROUTES.forEach(r=>{
  const d=round(r.pts,46);
  const gs=svg('g',{class:'gt-route','data-k':r.k});gs.appendChild(svg('path',{d,class:'gt-r-glow'}));gs.appendChild(svg('path',{d,class:'gt-r-glow2'}));gs.appendChild(svg('path',{d,class:'gt-r-core'}));routesSvg.appendChild(gs);
  r.path=gs.firstChild;r.len=r.path.getTotalLength();r.t0=null;r.gs=gs;
  r.g=el('div','gt-pk');r.parts=[0,1,2,3,4].map(i=>{const e=el('i',i?'gt-pk-t':'gt-pk-h');if(i)e.style.opacity=(.75-i*.15).toFixed(2);r.g.appendChild(e);return e;});
  packEl.appendChild(r.g);
  setPacket(r,RM?.55:0);
});
function setPacket(r,p){const fade=p<.05?p/.05:p>.95?(1-p)/.05:1;r.g.style.opacity=fade.toFixed(2);
  r.parts.forEach((e,i)=>{const pt=r.path.getPointAtLength(Math.max(0,p*r.len-i*22));e.style.transform=`translate(${(pt.x*K).toFixed(1)}px,${(pt.y*K).toFixed(1)}px)`;});}

/* layer switches */
let layer='all';
$$('.gt-layers button').forEach(b=>b.addEventListener('click',()=>{layer=b.dataset.layer;
  $$('.gt-layers button').forEach(x=>{x.classList.toggle('is-on',x===b);x.setAttribute('aria-pressed',x===b);});
  ROUTES.forEach(r=>{const d=layer!=='all'&&r.k!==layer;r.g.classList.toggle('is-dim',d);r.gs.classList.toggle('is-dim',d);});}));

/* feed + pin status */
const feed=$('#feed'),clockEl=$('#gtClock');const items=[];
let nightMin=21*60+14;
const stamp=m=>{m=m%1440;const h=Math.floor(m/60),mm=m%60;return ((h+11)%12+1)+':'+String(mm).padStart(2,'0')+(h<12?' AM':' PM');};
function event(pinId,text,quiet){
  const p=pinOf(pinId);if(!p)return;const d=LIST[idx(pinId)];
  if(!quiet){p.stat.textContent=text;p.el.classList.add('is-blip');clearTimeout(p.tm);
    p.tm=setTimeout(()=>{p.el.classList.remove('is-blip');p.stat.textContent=p.idle;},4200);}
  const t=stamp(nightMin);if(clockEl)clockEl.textContent=t;
  nightMin+=9+Math.floor(Math.random()*29);if(nightMin>29*60+40)nightMin=21*60+14;
  if(!feed)return;
  const li=el('li',null,`<b>${text}</b><time>${t}</time><span>${pad(idx(pinId)+1)} · ${d.name}</span>`);
  feed.prepend(li);items.unshift(li);while(items.length>2)items.pop().remove();
}
const AMB=[['crm','Outreach email drafted'],['sealed-bid','Sealed bid received'],['allacart','Item saved to the cart'],['jsp-naturals','Order placed'],['crm','Site checked for a real problem'],['sealed-bid','Results held for approval']];
let ambI=0,ambT=0;
event('lead-responder','Lead answered',true);event('follow-up','Review requested',true);

/* ---------- the camera: tilt + turn, real perspective ---------- */
const TILT0=55,P=1700;
let mx=0,my=0,dSpin=0,dTilt=0,tilt=RM?TILT0:(isWide()?8:36),spin=RM?-6:-28,dragging=false,dragged=false,sx=0,sy=0,b0=0,b1=0,vis=true,paused=false,last=0,idleT=0,t00=0,focus=-1,raf=0;
hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;});
tbl.addEventListener('pointerdown',e=>{if(e.target.closest('.gt-flag'))return;dragging=true;dragged=false;sx=e.clientX;sy=e.clientY;b0=dSpin;b1=dTilt;tbl.classList.add('is-drag');});
addEventListener('pointermove',e=>{if(!dragging)return;const ax=e.clientX-sx,ay=e.clientY-sy;if(Math.abs(ax)+Math.abs(ay)>6)dragged=true;
  dSpin=clamp(b0-ax*.22,-70,70);if(e.pointerType!=='touch')dTilt=clamp(b1-ay*.12,-16,12);idleT=performance.now();if(lite)kick();});
const endDrag=()=>{if(!dragging)return;dragging=false;tbl.classList.remove('is-drag');setTimeout(()=>dragged=false,0);};
addEventListener('pointerup',endDrag);addEventListener('pointercancel',endDrag);
tbl.addEventListener('click',()=>{if(!dragged&&focus>=0)closeFocus();});
tbl.tabIndex=0;
tbl.addEventListener('keydown',e=>{if(e.target!==tbl)return;if(e.key==='ArrowLeft')dSpin=clamp(dSpin+8,-70,70);else if(e.key==='ArrowRight')dSpin=clamp(dSpin-8,-70,70);else return;e.preventDefault();idleT=performance.now();});
function applyCam(){
  rig.style.transform=`rotateX(${tilt.toFixed(2)}deg) rotateZ(${spin.toFixed(2)}deg)`;
  const inv=`rotateZ(${(-spin).toFixed(2)}deg) rotateX(${(-tilt).toFixed(2)}deg)`;
  PINS.forEach(p=>{p.el.style.transform=`translateZ(${(p.z*K).toFixed(1)}px) ${inv}`;});
}
function target(){
  if(focus>=0){const p=PINS[focus];return [50,clamp(-(p.x-627)/627*26,-26,26)];}
  const sc=clamp(scrollY/(hero.offsetHeight||1),0,1);
  return [clamp(TILT0+my*7+dTilt+sc*14,34,74),mx*-12+dSpin+(RM?-6:Math.sin(performance.now()/4200)*3)];
}
/* perf guard: on a device that cannot keep up, hold the camera still and thin the model out */
let lite=false,slowN=0,frames=0;
function goLite(){lite=true;document.documentElement.classList.add('gt-lite');
  Object.values(B).forEach(b=>b.el.classList.add('is-lit'));
  const [tt,ts]=target();tilt=tt;spin=ts;applyCam();
  const seq=ROUTES.map(r=>[r.pin,r.text]).concat(AMB);let n=0;setInterval(()=>{if(vis&&!paused&&layer==='all'){const a=seq[n++%seq.length];event(a[0],a[1]);}},3200);}
function frame(now){
  raf=0;if(!vis||paused||lite)return;
  if(!t00)t00=now;const raw=now-(last||now),dt=Math.min(60,raw);last=now;
  if(++frames>4&&now-t00<9000){if(raw>140)slowN++;if(slowN>=6){goLite();return;}}
  if(!RM){ROUTES.forEach(r=>{if(r.t0==null)r.t0=now+r.delay;const p=(now-r.t0)/r.dur;
    if(p<0){if(!r.hid){r.hid=1;r.g.style.opacity=0;}return;}r.hid=0;
    if(p>=1){if(layer==='all'||layer===r.k)event(r.pin,r.text);r.t0=now+1300+Math.random()*1200;return;}
    setPacket(r,p);});
    ambT+=dt;if(ambT>4700){ambT=0;if(layer==='all'){const a=AMB[ambI++%AMB.length];event(a[0],a[1]);}}}
  if(!dragging&&now-idleT>2600){dSpin*=.975;dTilt*=.975;}
  const [tt,ts]=target(),e=now-t00<2600?.035:.075;
  tilt+=(tt-tilt)*e;spin+=(ts-spin)*e;applyCam();
  raf=requestAnimationFrame(frame);
}
const kick=()=>{if(lite){const [tt,ts]=target();tilt=tt;spin=ts;applyCam();return;}if(!raf&&vis&&!paused){last=0;raf=requestAnimationFrame(frame);}};
new IntersectionObserver(es=>{vis=es[0].isIntersecting;kick();},{threshold:.02}).observe(hero);
addEventListener('hgpanel:open',()=>{paused=true;if(dockScene)dockScene.pause();if(viewScene)viewScene.pause();});
addEventListener('hgpanel:close',()=>{paused=false;ROUTES.forEach(r=>r.t0=null);if(dockScene&&focus>=0)dockScene.play();if(viewScene&&viewOn)viewScene.play();kick();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){ROUTES.forEach(r=>r.t0=null);kick();}});
layout();
if(RM){event('quote-builder','Quote sent');}

/* ---------- focus: the camera eases to a building and its build docks beside it ---------- */
const dock=$('#dock'),dockM=$('#dockM'),lead=$('#leadline');let dockScene=null;
function project(x,y,z,t,s){t*=Math.PI/180;s*=Math.PI/180;const dx=(x-627)*K,dy=(y-627)*K,dz=z*K;
  const x1=dx*Math.cos(s)-dy*Math.sin(s),y1=dx*Math.sin(s)+dy*Math.cos(s),y2=y1*Math.cos(t)-dz*Math.sin(t),z2=y1*Math.sin(t)+dz*Math.cos(t),f=P/(P-z2);
  return [tbl.offsetLeft+tbl.offsetWidth/2+x1*f,tbl.offsetTop+tbl.offsetHeight/2+y2*f];}
function place(i){const p=PINS[i],zoom=1.5,W=hero.offsetWidth,H=hero.offsetHeight,[tt,ts]=target();
  const [px,py]=project(p.x,p.y,p.z,tt,ts),X=W*.31,Y=H*.6;
  cam.style.transform=`translate(${(X-zoom*px).toFixed(1)}px,${(Y-zoom*py).toFixed(1)}px) scale(${zoom})`;
  lead.classList.remove('is-on');clearTimeout(leadT);
  leadT=setTimeout(()=>{if(focus!==i)return;const h=hero.getBoundingClientRect(),r=p.btn.getBoundingClientRect(),d=dock.getBoundingClientRect();
    const x0=r.right-h.left+12,w=d.left-h.left-x0-12;if(w<24)return;
    lead.style.left=x0+'px';lead.style.top=(clamp(r.top+r.height/2,d.top+30,d.bottom-30)-h.top)+'px';lead.style.width=w+'px';lead.classList.add('is-on');},1250);}
let leadT=0;
function fitDock(){const w=dockM.parentNode.clientWidth;if(w)dockM.style.transform='scale('+(w/452)+')';}
function open(i){
  const p=PINS[i],d=LIST[idx(p.id)];
  PINS.forEach(q=>{q.el.classList.toggle('is-on',q===p);hotB(q,false);});hotB(p,true);
  focus=i;hero.classList.add('is-focus');dock.setAttribute('aria-hidden','false');place(i);
  $('#dockN').textContent=pad(idx(p.id)+1);$('#dockName').textContent=d.name;$('#dockLab').textContent=d.lab.replace(/<[^>]+>/g,'');$('#dockP').innerHTML=d.h;
  if(dockScene){dockScene.pause();dockScene.root.remove();}
  dockScene=HGDemos.create(p.id);dockM.appendChild(dockScene.root);fitDock();dockScene.play();
  kick();
}
function closeFocus(){if(focus<0)return;const p=PINS[focus];focus=-1;hero.classList.remove('is-focus');dock.setAttribute('aria-hidden','true');cam.style.transform='';
  PINS.forEach(q=>{q.el.classList.remove('is-on');hotB(q,false);});
  if(dockScene){dockScene.pause();const s=dockScene;dockScene=null;setTimeout(()=>s.root.remove(),500);}
  p.btn.focus({preventScroll:true});}
$('#dockX').addEventListener('click',closeFocus);
$('#dockPrev').addEventListener('click',()=>open((focus+PINS.length-1)%PINS.length));
$('#dockNext').addEventListener('click',()=>open((focus+1)%PINS.length));
$('#dockOpen').addEventListener('click',()=>{if(focus>=0)HGPanel.open(PINS[focus].id);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&focus>=0&&!paused)closeFocus();});
addEventListener('scroll',()=>{if(focus>=0&&scrollY>hero.offsetHeight*.55)closeFocus();},{passive:true});

/* ---------- builds manifest + glass viewer ---------- */
const man=$('#manifest'),viewM=$('#viewM'),viewRig=$('#viewRig');let cur=-1,viewScene=null,touched=false,viewOn=false,cyc=0;
LIST.forEach((d,i)=>{const li=el('li');const live=/live|in use/i.test(d.status);
  li.innerHTML=`<button type="button" class="gt-row" data-i="${i}"><span class="gt-row-n">${pad(i+1)}</span><span class="gt-row-t"><b>${d.name}</b><span>${d.lab.replace(/<[^>]+>/g,'')}</span></span><span class="gt-row-s${live?' is-live':''}">${d.status}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button>`;
  man.appendChild(li);const b=li.firstChild;
  b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){touched=true;select(i);}});
  b.addEventListener('focus',()=>{touched=true;select(i);});
  b.addEventListener('click',()=>{touched=true;select(i);HGPanel.open(d.id);});});
function select(i){if(i===cur||!LIST[i])return;cur=i;const d=LIST[i];
  $$('.gt-row',man).forEach((r,j)=>r.classList.toggle('is-on',j===i));
  $('#viewN').textContent=pad(i+1);$('#viewName').textContent=d.name;$('#viewStat').textContent=d.status;$('#viewCap').innerHTML=d.h;
  if(viewScene){viewScene.pause();viewScene.root.remove();}
  viewScene=HGDemos.create(d.id);viewM.appendChild(viewScene.root);if(viewOn&&!paused)viewScene.play();
  if(window.gsap&&!RM)gsap.fromTo(viewM,{opacity:0},{opacity:1,duration:.45,ease:'power2.out'});}
$('#viewOpen').addEventListener('click',()=>{if(cur>=0)HGPanel.open(LIST[cur].id);});
new IntersectionObserver(es=>{viewOn=es[0].isIntersecting;if(viewOn){if(cur<0)select(0);else if(viewScene&&!paused)viewScene.play();
    clearInterval(cyc);if(!RM)cyc=setInterval(()=>{if(!touched&&!paused)select((cur+1)%LIST.length);},9000);}
  else{clearInterval(cyc);if(viewScene)viewScene.pause();}},{rootMargin:'200px 0px'}).observe($('#viewer'));
$('#builds').addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!isWide())return;const r=viewRig.getBoundingClientRect();
  const a=clamp((e.clientX-(r.left+r.width/2))/innerWidth,-.6,.6),b=clamp((e.clientY-(r.top+r.height/2))/innerHeight,-.6,.6);
  viewRig.style.setProperty('--vy',(-13+a*14).toFixed(2)+'deg');viewRig.style.setProperty('--vx',(5-b*8).toFixed(2)+'deg');});

/* ---------- nav, sticky cta ---------- */
const nav=$('.gt-nav'),sticky=$('.gt-sticky'),contact=$('#contact');
const onScroll=()=>{nav.classList.toggle('is-stuck',scrollY>30);
  if(sticky){const c=contact.getBoundingClientRect();sticky.classList.toggle('is-in',scrollY>innerHeight*.7&&c.top>innerHeight*.9);}};
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- process plates + reveals ---------- */
const stack=$('#stack'),plates=$$('.gt-plate'),steps=$$('#steps li');
const setStep=i=>{plates.forEach(p=>p.classList.toggle('is-on',+p.dataset.i===i));steps.forEach((s,j)=>s.classList.toggle('is-on',j===i));};
if(window.gsap&&window.ScrollTrigger&&!RM){
  gsap.registerPlugin(ScrollTrigger);gsap.ticker.lagSmoothing(0);
  const g0=isWide()?30:22,g1=isWide()?118:78;
  ScrollTrigger.create({trigger:'#process',start:'top 70%',end:'center 40%',scrub:.6,onUpdate:s=>{stack.style.setProperty('--gap',(g0+(g1-g0)*s.progress).toFixed(1)+'px');setStep(Math.min(2,Math.floor(s.progress*3)));}});
  setStep(0);
  const rv='.gt-head,.gt-read,.gt-row,.gt-sp-c,.gt-steps li,.gt-terms>div,.gt-off li,.gt-off-cta,.gt-about-g>*,.gt-contact-g>*,.gt-view';
  $$(rv).forEach(e=>e.style.opacity='0');
  ScrollTrigger.batch(rv,{start:'top 90%',once:true,onEnter:b=>gsap.fromTo(b,{opacity:0,y:28},{opacity:1,y:0,duration:.9,ease:'power3.out',stagger:.07,clearProps:'transform,opacity'})});
  /* hero intro */
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.from('.gt-copy>*',{opacity:0,y:22,duration:.8,stagger:.08},.1)
    .from('#tbl',{opacity:0,duration:1.2,clearProps:'opacity'},.1)
    .from('.gt-stem',{scaleY:0,transformOrigin:'50% 100%',duration:.5,stagger:.07},1.5)
    .from('.gt-flag',{opacity:0,y:10,duration:.5,stagger:.07,clearProps:'transform,opacity'},1.6)
    .from('.gt-hud,.gt-feed',{opacity:0,duration:.6,clearProps:'opacity'},1.9);
}else{stack.style.setProperty('--gap',(isWide()?92:62)+'px');plates.forEach(p=>p.classList.add('is-on'));steps.forEach(s=>s.classList.add('is-on'));}
kick();
})();
