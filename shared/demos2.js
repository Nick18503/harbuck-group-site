/* Harbuck Group live demos, round 2: Allacart and the Sealed-Bid Platform restyled to look like the real products.
   Load AFTER demos.js (and demos2.css after demos.css). Replaces the `allacart` and `sealed-bid` entries of
   HGDemos.list in place: same ids, same API, same ~452x322 compact box, `.x` expanded, works in HGPanel.
   Extra: HGDemos.mount(el,'allacart',{variant:'phone'}) / HGDemos.create('allacart',{variant:'phone'})
          -> a portrait phone-screen cart (native 260x540; size the mount element 260x540 and CSS-scale it).
   The sealed-bid demo is deliberately unbranded. Everything is scoped under .ac2 / .ac2p / .sb2. */
(function(){
if(!window.HGDemos)return;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IMG=k=>HGDemos.img(k);
const h=(t,c,html)=>{const e=document.createElement(t);if(c)e.className=c;if(html!=null)e.innerHTML=html;return e;};
const usd=n=>'$'+n.toFixed(2);
const usd0=n=>'$'+Math.round(n).toLocaleString('en-US');
const anim=(el,kf,o)=>{if(RM||!el.animate)return null;return el.animate(kf,o);};

class Scene2{
  constructor(k,o){this.o=o||{};this.root=h('div','scene '+k);this.t=[];this.playing=false;this.expanded=false;this.build();this.reset();}
  after(ms,fn){const x=setTimeout(fn,RM?0:ms);this.t.push(x);return x;}
  clear(){this.t.forEach(clearTimeout);this.t=[];}
  play(){if(this.playing)return;this.playing=true;this.cycle();}
  pause(){this.playing=false;this.clear();}
  cycle(){this.clear();this.reset();this.run(()=>{if(RM)return;this.after(1600,()=>{if(this.playing&&!this.expanded)this.cycle();});});}
  trigger(){this.clear();this.reset();this.run(()=>{});}
  setExpanded(b){this.expanded=b;this.root.classList.toggle('x',b);this.pause();if(b){this.onExpand&&this.onExpand();this.trigger();}}
  ctl(){const c=h('div','ctl');this.root.appendChild(c);return c;}
}

/* ---------- icons (inline SVG, stroke = currentColor) ---------- */
const I={
 cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
 lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
 calc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/></svg>',
 plane:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5 21 3z"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>'
};

/* =====================================================================
   01 Allacart: a store page on the left, the real cart wall on the right
   ===================================================================== */
const A_SEED=[
 ['Dylan Baggy Jeans Dark Blue','pacsun.com',25.00,'jeans','4/5'],
 ['ALO Sunset Sneaker Black','aloyoga.com',225.00,'sneaker','7/4']];
const A_PROD=[
 ['Havaianas x Zara Sandals','zara.com',39.90,'sandals','1/1'],
 ['Define Jacket Nulu','lululemon.com',128.00,'jacket','4/5'],
 ['Bombshell Mini Dress White','us.princesspolly.com',75.00,'dress','3/4'],
 ['iPhone 17 Unlocked','backmarket.com',35.00,'iphone','1/1'],
 ['Airlift Solar Visor Sunshine','aloyoga.com',78.00,'visor','5/4'],
 ['Fear of God Essentials Shorts','depop.com',25.00,'shorts','4/5'],
 ['Straight Italian-Stretch Chino','bananarepublic.gap.com',100.00,'chino','3/4'],
 ['Ashlinn Off Shoulder Top Grey','us.princesspolly.com',45.00,'top','1/1'],
 ['Sun-Kissed Bloom Triangle Top','altardstate.com',52.00,'triangle','4/5']];
const aCard=p=>h('div','a2-card',`<div class="a2-ci" style="aspect-ratio:${p[4]}"><img src="${IMG(p[3])}" alt=""></div>
  <div class="a2-cb"><span class="a2-cd">${p[1]}</span><b>${p[0]}</b><span class="a2-cp">${usd(p[2])}</span><i class="a2-hr">${I.heart}</i></div>`);
function wallAdd(wall,p,animate){
  const att=!!wall.offsetParent;const cols=[...wall.children].filter((c,i)=>att?c.offsetParent!==null:i<2);
  let col=cols[0],best=Infinity;
  cols.forEach(c=>{const v=c.offsetHeight||c.children.length;if(v<best){best=v;col=c;}});
  const card=aCard(p),sib=[...col.children];col.prepend(card);
  if(animate&&!RM){
    const dy=card.offsetHeight+(parseFloat(getComputedStyle(col).rowGap)||8);
    sib.forEach(s=>anim(s,[{transform:`translateY(${-dy}px)`},{transform:'none'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'}));
    anim(card,[{opacity:0,transform:'translateY(1.6em) scale(.94)'},{opacity:1,transform:'none',offset:.6},{opacity:.55,offset:.8},{opacity:1,transform:'none'}],{duration:900,easing:'cubic-bezier(.22,1,.36,1)'});
    card.classList.add('new');setTimeout(()=>card.classList.remove('new'),1500);
  }
  return card;
}
class Allacart2 extends Scene2{
  build(){
    const b=h('div','a2-body');this.root.appendChild(b);
    const st=h('div','a2-store',`<div class="a2-bar"><span class="a2-dots"><i></i><i></i><i></i></span><span class="a2-url"></span><span class="a2-demo">Demo</span></div>
      <div class="a2-pg"><div class="a2-pimg"><img alt=""></div><div class="a2-pt"></div><div class="a2-pp"></div>
      <button type="button" class="a2-add">Add to cart</button><div class="a2-again"></div></div>`);
    this.pg=st.querySelector('.a2-pg');this.url=st.querySelector('.a2-url');this.pimg=st.querySelector('.a2-pimg img');
    this.pt=st.querySelector('.a2-pt');this.pp=st.querySelector('.a2-pp');this.addB=st.querySelector('.a2-add');this.again=st.querySelector('.a2-again');
    this.addB.addEventListener('click',e=>{if(e.isTrusted){this.clear();}this.save();});
    b.appendChild(st);
    const cart=h('div','a2-cart',`<div class="a2-ch"><b>Your Allacart</b><span class="a2-cnt"></span></div>
      <div class="a2-wall"><div class="a2-col"></div><div class="a2-col"></div><div class="a2-col"></div></div>
      <div class="a2-toast"><i>${I.check}</i>Saved to Allacart</div><div class="a2-conf" aria-hidden="true"></div>`);
    this.cnt=cart.querySelector('.a2-cnt');this.wall=cart.querySelector('.a2-wall');this.toast=cart.querySelector('.a2-toast');this.conf=cart.querySelector('.a2-conf');
    b.appendChild(cart);
    const c=this.ctl();const nx=h('button','go','Next store');nx.type='button';
    nx.addEventListener('click',()=>{this.clear();this.show((this.cur+1)%A_PROD.length,true);});c.appendChild(nx);
    c.appendChild(h('span','hint','Press the store’s own Add to cart. The item saves itself, from all your stores, into one cart.'));
  }
  show(i,fade){this.cur=i;const p=A_PROD[i];
    const set=()=>{this.url.textContent=p[1];this.pimg.src=IMG(p[3]);this.pt.textContent=p[0];this.pp.textContent=usd(p[2]);
      const n=this.saved[i]||0;this.again.textContent=n>1?'saved again · ×'+n:(n===1?'saved to your Allacart':'');};
    if(fade&&!RM){this.pg.classList.add('sw');clearTimeout(this.swT);this.swT=setTimeout(()=>{set();this.pg.classList.remove('sw');},190);}else set();}
  reset(){clearTimeout(this.swT);clearTimeout(this.toT);this.saved={};this.n=0;this.first=true;
    [...this.wall.children].forEach(c=>c.innerHTML='');this.toast.classList.remove('on');this.pg.classList.remove('sw');
    A_SEED.slice().reverse().forEach(p=>{wallAdd(this.wall,p,false);this.n++;});this.count(false);this.show(0,false);}
  count(pop){this.cnt.textContent=this.n+(this.n===1?' item':' items');
    if(pop)anim(this.cnt,[{transform:'scale(.7)'},{transform:'scale(1.12)',offset:.6},{transform:'none'}],{duration:600,easing:'cubic-bezier(.34,1.56,.64,1)'});}
  save(){const i=this.cur,p=A_PROD[i];
    anim(this.addB,[{transform:'scale(1)'},{transform:'scale(.95)'},{transform:'scale(1)'}],{duration:260});
    this.saved[i]=(this.saved[i]||0)+1;
    if(this.saved[i]===1){wallAdd(this.wall,p,true);this.n++;this.count(true);this.toastOn();if(this.first){this.first=false;this.burst();}
      this.again.textContent='saved to your Allacart';
      const nx=()=>{let j=i;for(let k=1;k<=A_PROD.length;k++){j=(i+k)%A_PROD.length;if(!this.saved[j])break;}if(j!==i&&!this.saved[j])this.show(j,true);};
      if(RM)nx();else this.after(1250,nx);}
    else this.again.textContent='saved again · ×'+this.saved[i];}
  toastOn(){this.toast.classList.add('on');clearTimeout(this.toT);this.toT=setTimeout(()=>this.toast.classList.remove('on'),1500);}
  burst(){if(RM)return;const cols=['#D14638','#F9E7E1','#245239','#E8B04B'];this.conf.innerHTML='';
    for(let k=0;k<16;k++){const d=h('i');d.style.background=cols[k%4];const s=.35+Math.random()*.4;d.style.width=d.style.height=s+'em';this.conf.appendChild(d);
      const a=Math.random()*Math.PI*2,r=3+Math.random()*5;
      anim(d,[{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*r}em,${Math.sin(a)*r-1}em)`,opacity:1,offset:.55},{transform:`translate(${Math.cos(a)*r*1.15}em,${Math.sin(a)*r+3}em)`,opacity:0}],{duration:900,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});}}
  run(done){const n=this.expanded?2:3;
    for(let k=0;k<n;k++)this.after(1100+k*2200,()=>this.save());
    this.after(1100+n*2200,done);}
}

/* phone-screen variant: the real app cart, portrait */
class AllacartPhone extends Scene2{
  build(){
    this.root.innerHTML=`<div class="a2p-hd"><i>${I.cart}</i><b>Allacart</b></div>
      <div class="a2p-in"><h4>Your saved items <span>✨</span></h4><div class="a2p-cnt"></div>
        <div class="a2p-pills"><span class="on">All</span><span>aloyoga.com</span><span>pacsun.com</span><span>zara.com</span></div>
        <div class="a2-wall"><div class="a2-col"></div><div class="a2-col"></div></div></div>
      <div class="a2p-tab"><span>How</span><span>Discover</span><b class="a2p-fab"><i>${I.cart}</i></b><span>Enable</span><span>Account</span></div>`;
    this.cnt=this.root.querySelector('.a2p-cnt');this.wall=this.root.querySelector('.a2-wall');this.q=A_PROD.slice(1,7);
  }
  count(){this.cnt.textContent=this.n+' things you’ve saved · from all your stores';}
  put(p,a){wallAdd(this.wall,p,a);this.n++;this.count();}
  reset(){[...this.wall.children].forEach(c=>c.innerHTML='');this.n=0;
    [A_PROD[0],A_SEED[0],A_SEED[1]].forEach(p=>this.put(p,false));if(RM)this.q.slice(0,3).forEach(p=>this.put(p,false));}
  run(done){this.q.forEach((p,k)=>this.after(1500+k*2100,()=>this.put(p,true)));this.after(1500+this.q.length*2100+600,done);}
  setExpanded(){/* phone variant has no expanded mode */}
}

/* =====================================================================
   02 Sealed-Bid Platform (unbranded): bidder view / admin view
   ===================================================================== */
const S_ME='Northline Resale',S_ROUND='Laptops, Round 14';
const S_OTH=['Apex Asset Recovery','Redwood Surplus','Harbor Tech','Summit Refurb','Bluefin Liquidation','Keystone IT','Tidewater Electronics','Ironwood Recovery','Cascade Circuit','Meridian Assets','Pinecrest Surplus','Lakeside Systems','Granite Resale'];
const S_LINES=[
 {pn:'Latitude 5420',d:'Dell 14″ · i5 · 16GB',ch:['Dell','Grade A'],q:40,def:'103.00',res:85,o:[96.5,92,88.25,99,84,90.5,97.75,86,93,89.5,95,91.25,87]},
 {pn:'ThinkPad T14',d:'Lenovo 14″ · Ryzen 5',ch:['Lenovo','Grade B'],q:25,def:'88.00',res:80,o:[84,96.5,79,90,86.5,82,91.25,77.5,88.5,85,93,81,87.25]}];
const S_GUIDE={
 open:['To do','Bidding is open. Lock it when time is up.'],
 due:['To do','Bidding time is up. Lock the round.'],
 locked:['To do','Compute the awards. Computing sends nothing.'],
 computed:['To do','Read the results, then approve and send.'],
 sent:['Done','Done. Every bidder has their own result.']};
const S_STATUS={open:'Open for bids',locked:'Locked',computed:'Computed',sent:'Sent'};
class SealedBid2 extends Scene2{
  build(){
    const r=this.root;
    const top=h('div','s2-top',`<div class="s2-brand"><b>Sealed-Bid</b><i class="s2-role">Bidder</i></div>
      <div class="s2-seg" role="tablist"><button type="button" class="on">Bidder</button><button type="button">Admin</button></div>`);
    this.role=top.querySelector('.s2-role');this.seg=[...top.querySelectorAll('.s2-seg button')];
    this.seg[0].addEventListener('click',e=>{if(e.isTrusted)this.clear();this.view(0);});
    this.seg[1].addEventListener('click',e=>{if(e.isTrusted)this.clear();this.view(1);});
    r.appendChild(top);
    /* bidder */
    const bid=h('div','s2-view s2-bid',`<div class="s2-head"><div class="s2-ttl"><span class="s2-kick">Sealed-bid round</span><h4>${S_ROUND}</h4><span class="s2-as">Bidding as <b>${S_ME}</b></span></div>
        <div class="s2-clock"><i>${I.clock}</i><div><span class="k">Bidding closes in</span><b class="v"></b></div></div></div>
      <div class="s2-note"><i>${I.lock}</i><span></span></div>
      <div class="s2-how"><span><i>1</i><b>Name your price</b>Type a price per unit on any line</span><span><i>2</i><b>Review &amp; send</b>Nothing is sent until you confirm</span><span><i>3</i><b>Results by email</b>Only your own, once the seller sends</span></div>
      <div class="s2-rows">${S_LINES.map(l=>`<div class="s2-row"><div class="s2-it"><b>${l.pn}</b><span>${l.d}</span><div class="s2-ch">${l.ch.map(c=>`<em>${c}</em>`).join('')}<strong>${l.q} units</strong></div></div>
        <div class="s2-f"><label><span>Your $/unit</span><span class="s2-money"><i>$</i><input type="text" inputmode="decimal" placeholder="0.00" aria-label="Your price per unit for ${l.pn}"></span></label><div class="s2-st"></div></div></div>`).join('')}</div>
      <div class="s2-tray"><i>${I.cart}</i><span class="s2-tm"></span><b class="s2-tt"></b><button type="button" class="s2-btn s2-pri s2-sendoffer">Review &amp; send</button></div>`);
    this.clockEl=bid.querySelector('.s2-clock');this.ck=bid.querySelector('.s2-clock .k');this.cv=bid.querySelector('.s2-clock .v');
    this.note=bid.querySelector('.s2-note');this.noteT=bid.querySelector('.s2-note span');
    this.brow=[...bid.querySelectorAll('.s2-row')];this.inp=this.brow.map(x=>x.querySelector('input'));this.st=this.brow.map(x=>x.querySelector('.s2-st'));
    this.how=[...bid.querySelectorAll('.s2-how span')];this.tray=bid.querySelector('.s2-tray');this.tm=bid.querySelector('.s2-tm');this.tt=bid.querySelector('.s2-tt');this.sob=bid.querySelector('.s2-sendoffer');
    this.inp.forEach((el,i)=>{el.addEventListener('input',e=>{if(e.isTrusted)this.clear();});
      el.addEventListener('change',()=>this.setPrice(i,el.value));
      el.addEventListener('keydown',e=>{if(e.key==='Enter')el.blur();});});
    this.sob.addEventListener('click',e=>{if(e.isTrusted)this.clear();this.submit();});
    r.appendChild(bid);
    /* admin */
    const adm=h('div','s2-view s2-adm',`<div class="s2-steps"><span class="dn"><i>${I.check}</i>Listings</span><span class="dn"><i>${I.check}</i>Bidders</span><span class="cur"><i>3</i>Close &amp; send</span><em>Do this next</em></div>
      <div class="s2-rc"><div class="s2-rl"><div class="s2-rt"><span class="s2-status"></span><h4>${S_ROUND}</h4></div><p class="s2-guide"><em></em><span></span></p>
        <div class="s2-facts"><span>Offers in <b class="s2-oin"></b></span><span>Awards <b class="s2-aw"></b></span></div></div>
        <div class="s2-ra"><button type="button" class="s2-btn s2-pri s2-step"></button></div></div>
      <div class="s2-res"></div>
      <div class="s2-gate"><button type="button" class="s2-btn s2-pri s2-big s2-send"></button><span class="s2-gt"></span></div>`);
    this.status=adm.querySelector('.s2-status');this.gl=adm.querySelector('.s2-guide em');this.gtxt=adm.querySelector('.s2-guide span');
    this.oin=adm.querySelector('.s2-oin');this.awf=adm.querySelector('.s2-aw');this.stepB=adm.querySelector('.s2-step');
    this.res=adm.querySelector('.s2-res');this.gate=adm.querySelector('.s2-gate');this.sendB=adm.querySelector('.s2-send');this.gt=adm.querySelector('.s2-gt');
    this.stepsEl=adm.querySelector('.s2-steps');
    this.stepB.addEventListener('click',e=>{if(e.isTrusted)this.clear();this.step();});
    this.sendB.addEventListener('click',e=>{if(e.isTrusted)this.clear();this.send();});
    r.appendChild(adm);
    const c=this.ctl();const go=h('button','go','Run the whole round');go.type='button';
    go.addEventListener('click',()=>{this.clear();this.reset();this.run(()=>{},true);});c.appendChild(go);
    c.appendChild(h('span','hint','Type a price as the bidder, then switch to Admin: lock, compute, send. Nothing goes out until you press Send.'));
  }
  view(v){this.v=v;this.root.classList.toggle('adm',v===1);this.seg[0].classList.toggle('on',v===0);this.seg[1].classList.toggle('on',v===1);
    this.seg[1].classList.remove('nudge');this.role.textContent=v?'Admin':'Bidder';}
  nOffers(){return S_OTH.length*S_LINES.length+(this.sub?this.price.filter(p=>p>0).length:0);}
  nBidders(){return S_OTH.length+(this.sub&&this.price.some(p=>p>0)?1:0);}
  setPrice(i,val){if(this.state!=='open'||this.due)return;const p=Math.max(0,parseFloat(String(val).replace(/[^0-9.]/g,''))||0);
    this.price[i]=p;this.inp[i].value=p?p.toFixed(2):'';this.dirty=true;this.sub=false;this.paint();
    if(p){this.st[i].innerHTML=`<i class="ok">${I.check}</i>Saved to my offer`;clearTimeout(this['fl'+i]);this['fl'+i]=setTimeout(()=>this.paint(),900);}}
  submit(){if(this.state!=='open'||this.due||!this.price.some(p=>p>0))return;this.sub=true;this.dirty=false;this.paint();
    anim(this.note,[{transform:'scale(.97)'},{transform:'none'}],{duration:300});}
  step(){if(this.state==='open'){this.state='locked';this.stopClock();}
    else if(this.state==='locked'){this.compute();this.state='computed';}
    this.paint();}
  send(){if(this.state!=='computed')return;this.state='sent';this.paint();}
  compute(){this.aw=S_LINES.map((l,i)=>{const all=l.o.map((p,k)=>({n:S_OTH[k],p}));if(this.sub&&this.price[i]>0)all.push({n:S_ME,p:this.price[i],me:true});
    all.sort((a,b)=>b.p-a.p||(a.me?1:-1));const top=all[0];return{all,top,ok:top.p>=l.res,mine:!!top.me&&top.p>=l.res};});}
  stopClock(){clearInterval(this.iv);this.iv=null;}
  startClock(sec){this.stopClock();this.left=sec;this.tick();if(RM)return;this.iv=setInterval(()=>{this.left--;if(this.left<=0){this.left=0;this.due=true;this.stopClock();this.paint();}else this.tick();},1000);}
  tick(){const s=this.left,p=n=>String(n).padStart(2,'0');this.cv.textContent=Math.floor(s/3600)+'h '+p(Math.floor(s/60)%60)+'m '+p(s%60)+'s';}
  pause(){super.pause();this.stopClock();}
  reset(){this.stopClock();this.state='open';this.due=false;this.sub=false;this.dirty=false;this.price=[0,0];this.aw=null;
    this.inp.forEach(x=>x.value='');this.view(0);this.left=this.expanded?249:6;this.tick();this.paint();}
  paint(){
    const s=this.state,closed=s!=='open'||this.due,r=this.root;r.dataset.s=s;
    /* bidder */
    this.clockEl.classList.toggle('z',closed);this.ck.textContent=closed?'Bidding closed':'Bidding closes in';if(closed)this.cv.textContent='Bids are final';
    let tot=0,items=0,units=0;
    S_LINES.forEach((l,i)=>{const p=this.price[i],ext=p*l.q,row=this.brow[i];if(p){tot+=ext;items++;units+=l.q;}
      this.inp[i].disabled=closed;row.classList.toggle('in',!!p&&s!=='sent');row.classList.remove('won','lost');
      let t;
      if(s==='sent'){if(!p||!this.sub)t='No offer submitted';
        else if(this.aw[i].mine){t=`<em class="s2-flag ok">Awarded</em>${usd(p)} × ${l.q} = ${usd0(ext)}`;row.classList.add('won');}
        else{t=this.aw[i].ok?'Not awarded.':'No offer met our minimum price';row.classList.add('lost');}}
      else if(!p)t=closed?'No offer submitted':'Leave blank to skip this one.';
      else if(this.sub)t=`<i class="ok">${I.check}</i>Submitted · ${usd0(ext)}`;
      else t=closed?'Not sent before closing':'In my offer, not yet sent · '+usd0(ext);
      this.st[i].innerHTML=t;});
    this.note.className='s2-note'+(s==='sent'?' res':closed?' shut':this.sub?' in':'');
    this.noteT.innerHTML=s==='sent'?'<b>Results are in.</b> Every award is final, at your own price.'
      :closed?'<b>Bidding closed.</b> Bids are final. Results will be emailed to you.'
      :this.sub?'<b>Your offer is in.</b> You can change it any time until bidding closes.'
      :'<b>Your offer is private.</b> Nobody else sees what you offer, and you do not see theirs.';
    [items>0,this.sub,s==='sent'].forEach((d,i)=>{this.how[i].className=d?'dn':'';this.how[i].firstChild.innerHTML=d?I.check:String(i+1);});
    const nx=this.how.find(x=>!x.className);if(nx)nx.className='cur';
    this.tm.innerHTML=items?`<b>${items}</b> ${items===1?'item':'items'} <b>${units}</b> units`:'Put a price on anything above.';
    this.tt.textContent=items?usd0(tot):'';
    this.sob.textContent=s==='sent'?'Results emailed':closed?'Bidding closed':this.sub?'Offer sent':'Review & send';
    this.sob.disabled=closed||this.sub||!items;this.sob.classList.toggle('s2-pulse',!closed&&!this.sub&&!!items);
    /* admin */
    const nb=this.nBidders(),no=this.nOffers();
    this.status.textContent=S_STATUS[s];this.status.className='s2-status '+s;
    const g=S_GUIDE[s==='open'&&this.due?'due':s];this.gl.textContent=g[0];this.gl.className=s==='sent'?'dn':'td';this.gtxt.textContent=g[1];
    this.oin.textContent=no+' from '+nb+' bidders';
    this.awf.textContent=s==='open'||s==='locked'?'Final at lock':this.aw.filter(a=>a.ok).length+' of '+S_LINES.length+' lines';
    this.stepB.innerHTML=s==='open'?`<i>${I.lock}</i>Lock the round`:s==='locked'?`<i>${I.calc}</i>Compute awards`:`<i>${I.check}</i>Awards computed`;
    this.stepB.disabled=s==='computed'||s==='sent';this.stepB.classList.toggle('s2-pulse',s==='open'||s==='locked');
    this.stepsEl.classList.toggle('all',s==='sent');
    if(this.aw&&(s==='computed'||s==='sent')){
      this.res.className='s2-res on';
      this.res.innerHTML=S_LINES.map((l,i)=>{const a=this.aw[i];
        const rank=a.all.slice(0,3).map((o,k)=>`<li class="${k===0&&a.ok?'w':''}"><i>${k+1}</i><span>${o.n}</span>${k===0&&a.ok?'<em class="s2-flag ok">winner</em>':''}<b>${usd(o.p)}</b></li>`).join('');
        return `<div class="s2-rr"><div class="s2-ri"><b>${l.pn}</b><span>${l.q} units</span></div><span class="s2-rib${a.ok?'':' lo'}">${a.ok?'Awarded':'Below reserve'}</span>
          <div class="s2-ra2">${a.ok?`<b>${a.top.n}</b><span>${usd(a.top.p)} × ${l.q} = ${usd0(a.top.p*l.q)}</span>`:`<span>Top offer ${usd(a.top.p)} under the ${usd(l.res)} reserve</span>`}</div>
          <span class="s2-rk">${a.all.length} offers, ranked</span><ol class="s2-stack">${rank}</ol></div>`;}).join('');
    }else{this.res.className='s2-res';this.res.innerHTML=`<div class="s2-empty">${s==='locked'?'Offers are frozen. Compute to rank them and work out the awards.':'Awards appear here after you lock the round and compute.'}</div>`;}
    this.gate.className='s2-gate'+(s==='computed'?' on':s==='sent'?' on dn':'');
    this.sendB.innerHTML=s==='sent'?`<i>${I.check}</i>${nb} emails sent`:`<i>${I.plane}</i>Send ${nb} emails`;
    this.sendB.disabled=s!=='computed';this.sendB.classList.toggle('s2-pulse',s==='computed');
    this.gt.textContent=s==='sent'?'Results letters: '+nb+' sent. Each bidder sees only their own.':'Nothing goes out until you press Send.';
  }
  type(i,val,t0){if(RM){this.after(t0,()=>this.setPrice(i,val));return t0;}
    [...val].forEach((ch,k)=>this.after(t0+k*70,()=>{this.inp[i].value=val.slice(0,k+1);this.brow[i].classList.add('ty');}));
    const end=t0+val.length*70+220;this.after(end,()=>{this.brow[i].classList.remove('ty');this.setPrice(i,val);});return end;}
  press(el,t,fn){this.after(t-160,()=>anim(el,[{boxShadow:'0 0 0 0 rgba(79,163,168,.7)'},{boxShadow:'0 0 0 .8em rgba(79,163,168,0)'}],{duration:450,easing:'ease-out'}));this.after(t,fn);}
  run(done,full){
    full=full||!this.expanded;
    if(full){this.left=6;this.tick();}
    this.startClock(this.left);
    let t=this.type(0,S_LINES[0].def,500);t=this.type(1,S_LINES[1].def,t+450);
    this.press(this.sob,t+900,()=>this.submit());t+=900;
    if(!full){this.after(t+900,()=>{if(this.v===0)this.seg[1].classList.add('nudge');});this.after(t+1000,done);return;}
    const a=Math.max(t+1500,6500);
    this.after(a,()=>{this.due=true;this.stopClock();this.paint();this.view(1);});
    this.press(this.stepB,a+1100,()=>this.step());
    this.press(this.stepB,a+2200,()=>this.step());
    this.press(this.sendB,a+3700,()=>this.send());
    this.after(a+5100,()=>this.view(0));
    this.after(a+7000,done);
  }
}

/* ---------- catalog: replace the two entries in place ---------- */
const CAT={
 allacart:{k:'ac2',cls:Allacart2,
  h:'One cart that follows you <span class="em">across all your stores</span>',
  copy:'Press a store’s own Add to cart and the item saves itself into one cart, whatever store it came from. Chrome and Safari extensions, a native iOS app on the App Store, and a real-time backend, all built end to end. The products in this demo are real ones from my own saved items. Allacart never checks out for you: tap a card and you are back on the store’s own page.'},
 'sealed-bid':{k:'sb2',cls:SealedBid2,
  h:'Sealed bids in, <span class="em">winners out</span>, no broker',
  copy:'Buyers are invited to a round and price each line without seeing anyone else: not the other offers, not how many companies are bidding. When time is up the seller locks the round, the system ranks every offer and works out the awards, and a result email is drafted for each bidder. Nothing goes out until one human presses Send. No brokers, no commissions, fully owned by the seller.'}
};
HGDemos.list.forEach(d=>{const c=CAT[d.id];if(c){d.k=c.k;d.h=c.h;d.copy=c.copy;}});
const oCreate=HGDemos.create,oMount=HGDemos.mount;
function create(id,o){const c=CAT[id];if(!c)return oCreate(id);
  if(id==='allacart'&&o&&o.variant==='phone')return new AllacartPhone('ac2p',o);
  return new c.cls(c.k,o);}
function mount(el,id,o){if(!CAT[id])return oMount(el,id,o);o=o||{};const s=create(id,o);el.appendChild(s.root);
  if(o.expanded)s.setExpanded(true);
  else if(o.autoplay!==false){new IntersectionObserver(es=>{es[0].isIntersecting?s.play():s.pause();},{threshold:.2}).observe(el);}
  return s;}
HGDemos.create=create;HGDemos.mount=mount;HGDemos.v2=true;
})();
