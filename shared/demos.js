
(function(){
const BASE=new URL("../assets/site/",document.currentScript.src).href;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IMG={
  allaLanding:"images/alla-landing.jpg",
  allaCart:"images/alla-cart.jpg",
  allaZoom:"images/alla-zoom.jpg",
  jspTall:"images/jsp-tall.jpg",
  iphone:"images/product-iphone.jpg",
  shorts:"images/product-shorts.jpg",
  jacket:"images/product-jacket.jpg",
  visor:"images/product-visor.jpg",
  chino:"images/product-chino.jpg",
  top:"images/product-top.jpg",
  dress:"images/product-dress.jpg",
  sandals:"images/product-sandals.jpg",
  triangle:"images/product-triangle.jpg",
  jeans:"images/product-jeans.jpg",
  sneaker:"images/product-sneaker.jpg"
};
Object.keys(IMG).forEach(k=>IMG[k]=BASE+IMG[k].replace('images/',''));
const h=(t,c,html)=>{const e=document.createElement(t);if(c)e.className=c;if(html!=null)e.innerHTML=html;return e;};
const money=n=>'$'+n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const money0=n=>'$'+Math.round(n).toLocaleString();

class Scene{
  constructor(k){this.root=h('div','scene '+k);this.t=[];this.playing=false;this.expanded=false;this.build();this.reset();}
  after(ms,fn){const x=setTimeout(fn,RM?0:ms);this.t.push(x);return x;}
  clear(){this.t.forEach(clearTimeout);this.t=[];}
  play(){if(this.playing)return;this.playing=true;this.cycle();}
  pause(){this.playing=false;this.clear();}
  cycle(){this.clear();this.reset();this.run(()=>{if(RM)return;this.after(1400,()=>{if(this.playing&&!this.expanded)this.cycle();});});}
  trigger(){this.clear();this.reset();this.run(()=>{});}
  setExpanded(b){this.expanded=b;this.root.classList.toggle('x',b);this.pause();if(b){this.onExpand&&this.onExpand();this.trigger();}}
  ctl(){const c=h('div','ctl');this.root.appendChild(c);return c;}
}

/* ===== 01 Allacart ===== */
const AC_SEED=[['Dylan Baggy Jeans Dark Blue','pacsun.com',25.00,'jeans'],['ALO Sunset Sneaker Black','aloyoga.com',225.00,'sneaker']];
const AC_PROD=[
 ['iPhone 17 Unlocked','backmarket.com',35.00,'iphone'],
 ['Define Jacket Nulu','lululemon.com',128.00,'jacket'],
 ['Bombshell Mini Dress White','us.princesspolly.com',75.00,'dress'],
 ['Havaianas x Zara Sandals','zara.com',39.90,'sandals'],
 ['Airlift Solar Visor Sunshine','aloyoga.com',78.00,'visor'],
 ['Fear of God Essentials Shorts','depop.com',25.00,'shorts'],
 ['Straight Italian-Stretch Chino','bananarepublic.gap.com',100.00,'chino'],
 ['Ashlinn Off Shoulder Top Grey','us.princesspolly.com',45.00,'top'],
 ['Sun-Kissed Bloom Triangle Top','altardstate.com',52.00,'triangle']];
class Allacart extends Scene{
  build(){
    const b=h('div','body');this.root.appendChild(b);
    const shop=h('div','shop','<div class="h">Nine stores, one cart<small>demo</small></div>');
    const pg=h('div','pg');this.btns=[];
    AC_PROD.forEach((p,i)=>{
      const t=h('div','pr',`<img src="${IMG[p[3]]}" alt=""><div class="m"><span class="d">${p[1]}</span><b>${p[0]}</b><div class="r"><span>${money(p[2])}</span><button type="button">Add</button></div></div>`);
      const bt=t.querySelector('button');bt.addEventListener('click',()=>this.add(i));this.btns.push(bt);pg.appendChild(t);});
    shop.appendChild(pg);b.appendChild(shop);
    const cart=h('div','cart','<div class="h">Your Allacart<small class="cnt"></small></div><ul class="cl"></ul><div class="tot"><span>Total</span><span class="a"></span></div>');
    this.cnt=cart.querySelector('.cnt');this.cl=cart.querySelector('.cl');this.totA=cart.querySelector('.tot .a');b.appendChild(cart);
    const ph=h('div','phone','<div class="ph"><div class="t">Allacart</div><ul></ul></div>');this.phl=ph.querySelector('ul');b.appendChild(ph);
    const c=this.ctl();c.appendChild(h('span','hint','Add anything on the left. It lands in one cart, whatever store it came from.'));
  }
  reset(){this.items=AC_SEED.map(x=>x.slice());this.btns.forEach(b=>{b.disabled=false;b.textContent='Add';b.closest('.pr').classList.remove('in');});this.render();}
  add(i){const b=this.btns[i];if(b.disabled)return;this.items.push(AC_PROD[i].slice());b.disabled=true;b.textContent='In cart';b.closest('.pr').classList.add('in');this.render(AC_PROD[i][0]);}
  render(newName){
    const rows=this.items.slice().reverse();
    this.cl.innerHTML=rows.map(x=>`<li class="${x[0]===newName?'new':''}"><img src="${IMG[x[3]]}" alt=""><span class="t"><b>${x[0]}</b><span>${x[1]}</span></span><span class="p">${money(x[2])}</span></li>`).join('');
    const total=this.items.reduce((s,x)=>s+x[2],0);const stores=new Set(this.items.map(x=>x[1])).size;
    this.totA.textContent=money(total);this.cnt.textContent=this.items.length+' items, '+stores+' stores';
    this.phl.innerHTML=rows.slice(0,7).map(x=>`<li><img src="${IMG[x[3]]}" alt=""><span>${x[0]}</span><b>${money(x[2])}</b></li>`).join('');
  }
  run(done){[0,1,2,3].forEach((i,k)=>this.after(800+k*1150,()=>this.add(i)));this.after(800+4*1150,done);}
}

/* ===== 02 Sealed-bid ===== */
const SB_B=['Northline Resale','Apex Asset Recovery','Redwood Surplus','Harbor Tech','Summit Refurb','Bluefin Liquidation','Keystone IT','Tidewater Electronics','Ironwood Recovery','Cascade Circuit','Meridian Assets','Pinecrest Surplus','Lakeside Systems','Granite Resale'];
const SB_V=[4120,3875,4460,2990,5140,4780,3320,4655,5010,3990,4210,5215,3760,4880];
class SealedBid extends Scene{
  build(){
    const b=h('div','body');this.root.appendChild(b);
    const lot=h('div','lot','<div class="lh"><b>Lot 14, 40x Dell Latitude 5420</b><span class="cd"></span></div>');this.cd=lot.querySelector('.cd');
    const rows=h('div','rows');this.rows=SB_B.map(n=>{const r=h('div','r',`<span class="n">${n}</span><span class="b"></span>`);rows.appendChild(r);return r;});
    lot.appendChild(rows);b.appendChild(lot);
    const out=h('div','out','<div class="c">Result emails <b>0</b> of 14</div><div class="chips"></div>');this.oc=out.querySelector('b');this.chips=out.querySelector('.chips');b.appendChild(out);
    const op=h('div','op',`<table><tr><th>Lot</th><th>Reserve</th><th>High bid</th><th>Bidders</th><th>Status</th></tr>
      <tr><td>12, 25x ThinkPad T14</td><td>$2,800</td><td>$3,410</td><td>9</td><td>Awarded</td></tr>
      <tr><td>13, 60x Optiplex 7090</td><td>$3,000</td><td>$2,650</td><td>11</td><td>Below reserve</td></tr>
      <tr><td>14, 40x Latitude 5420</td><td>$4,000</td><td class="hb">sealed</td><td>14</td><td class="hs">Bidding open</td></tr>
      <tr><td>15, 18x MacBook Air M2</td><td>$6,500</td><td>sealed</td><td>7</td><td>Bidding open</td></tr></table>
      <div class="gate"><b>Results for lot 14</b><br><span class="gt">Waiting for bidding to close.</span><br><button type="button" disabled>Approve and send 14 emails</button></div>`);
    this.hb=op.querySelector('.hb');this.hs=op.querySelector('.hs');this.gt=op.querySelector('.gt');this.gb=op.querySelector('.gate button');
    this.gb.addEventListener('click',()=>{this.gb.disabled=true;this.gb.textContent='Sent 14 emails';this.gt.textContent='Sent. 1 winner, 13 outbid notices.';});
    b.appendChild(op);
    const c=this.ctl();const go=h('button','go','Close bidding');
    go.addEventListener('click',()=>{this.root.classList.remove('op-on');this.seg[0].classList.add('on');this.seg[1].classList.remove('on');this.trigger();});c.appendChild(go);
    const seg=h('div','seg','<button type="button" class="on">Bidder view</button><button type="button">Operator view</button>');this.seg=[...seg.querySelectorAll('button')];
    this.seg[0].addEventListener('click',()=>{this.root.classList.remove('op-on');this.seg[0].classList.add('on');this.seg[1].classList.remove('on');});
    this.seg[1].addEventListener('click',()=>{this.root.classList.add('op-on');this.seg[1].classList.add('on');this.seg[0].classList.remove('on');});
    c.appendChild(seg);
  }
  reset(){this.cd.textContent='closes in 0:03';this.cd.classList.remove('z');this.rows.forEach(r=>{r.classList.remove('won');r.querySelector('.b').textContent='\u2022\u2022\u2022\u2022\u2022';});this.oc.textContent='0';this.chips.innerHTML='';this.hb.textContent='sealed';this.hs.textContent='Bidding open';this.gt.textContent='Waiting for bidding to close.';this.gb.disabled=true;this.gb.textContent='Approve and send 14 emails';}
  run(done){
    const max=Math.max(...SB_V),wi=SB_V.indexOf(max);
    this.after(550,()=>this.cd.textContent='closes in 0:02');this.after(1100,()=>this.cd.textContent='closes in 0:01');
    this.after(1650,()=>{this.cd.textContent='closed';this.cd.classList.add('z');});
    this.rows.forEach((r,i)=>this.after(1850+i*40,()=>r.querySelector('.b').textContent=money0(SB_V[i])));
    this.after(2550,()=>{this.rows[wi].classList.add('won');this.hb.textContent=money0(max);this.hs.textContent='Awarded';this.gt.textContent='Winner: '+SB_B[wi]+' at '+money0(max)+'. 14 emails queued.';this.gb.disabled=false;});
    SB_B.forEach((n,i)=>this.after(2950+i*60,()=>{const w=i===wi;this.chips.appendChild(h('div','chip'+(w?' w':''),(w?'won, ':'outbid, ')+n));this.oc.textContent=String(i+1);}));
    this.after(4100,done);
  }
}

/* ===== 03 Outreach CRM ===== */
const CR_SCAN=[
 ['summitexteriors.com',41,'low'],['ridgelineroofing.com',82,'hit'],['gwinnettroofpros.net',38,'low'],
 ['bufordroofing.co',67,''],['atlpeakroofing.com',29,'low'],['northgaexteriors.com',74,'']];
const CR_LEADS=[
 {co:'Ridgeline Roofing',dom:'ridgelineroofing.com',city:'Cumming, GA',score:82,flag:'No booking form found. Phone number only.',
  sub:'quick note about your quote form',body:'Hi, I looked at ridgelineroofing.com and there is no way to request a quote without calling. Most homeowners search at night. A form that texts you the lead takes about a day to add.'},
 {co:'Peachtree Plumbing',dom:'peachtreeplumbing.net',city:'Alpharetta, GA',score:91,flag:'Contact form returns 404 on submit.',
  sub:'your contact form is dropping leads',body:'Hi, I tested the contact form on peachtreeplumbing.net and it returns a 404 after submit. Anything sent through it since the last site update is gone. Happy to show you what I found.'},
 {co:'Lanier Landscaping',dom:'lanierlandscaping.co',city:'Buford, GA',score:74,flag:'No mobile layout. Text unreadable on phones.',
  sub:'your site on a phone',body:'Hi, lanierlandscaping.co does not resize on a phone, so the text comes out tiny. Most of your traffic is mobile. This is usually a one day fix.'},
 {co:'North Fulton Dental',dom:'northfultondental.com',city:'Roswell, GA',score:88,flag:'No online scheduling. Average reply 11 days.',
  sub:'booking without the phone tag',body:'Hi, there is no way to book on northfultondental.com, and my test message went 11 days without a reply. Online scheduling would take that to zero.'}];
const CR_GATES=['Not on the unsubscribe list','No email to this domain in 30 days','Inside send window, 8am to 6pm'];
const CR_PH=['Discover','Detect','Draft','Approve'];
class CRM extends Scene{
  build(){
    const ph=h('div','phases','<div class="bar"></div>');this.bar=ph.querySelector('.bar');
    this.ph=CR_PH.map(n=>{const e=h('div','p',n);ph.insertBefore(e,this.bar);return e;});this.root.appendChild(ph);
    const g=h('div','grid');this.root.appendChild(g);
    const scan=h('div','scan','<div class="lbl"><span>Scanning</span><b class="c">0/6</b></div><div class="list"></div>');
    this.scanList=scan.querySelector('.list');this.scanC=scan.querySelector('.c');g.appendChild(scan);
    const work=h('div','work',`
      <div class="vp"><div class="fake"><div class="a w2"></div><div class="a w1"></div><div class="a w4"></div><div class="a w3"></div><div class="btnrow"><i></i><i></i></div></div><div class="sweep"></div><div class="flag"></div></div>
      <div class="draft"><div class="sub"></div><div class="bd"></div><span class="cur"></span></div>
      <div class="gate"></div>
      <div class="sent"><span>Sent</span><span class="who"></span></div>`);
    this.vp=work.querySelector('.vp');this.flag=work.querySelector('.flag');this.draft=work.querySelector('.draft');
    this.dsub=work.querySelector('.sub');this.dbd=work.querySelector('.bd');
    this.gate=work.querySelector('.gate');this.sent=work.querySelector('.sent');this.sentWho=work.querySelector('.who');
    this.gates=CR_GATES.map(t=>{const e=h('div','g',`<i></i><span>${t}</span>`);this.gate.appendChild(e);return e;});
    g.appendChild(work);
    const m=h('div','meters');this.m=['Scanned','Flagged','Drafted','Sent'].map(k=>{const d=h('div','',`<div class="k">${k}</div><div class="v">0</div>`);m.appendChild(d);return d.querySelector('.v');});
    this.root.appendChild(m);
    const c=this.ctl();const go=h('button','go','Run the pipeline');go.addEventListener('click',()=>this.trigger());c.appendChild(go);
    const seg=h('div','seg');this.seg=CR_LEADS.map((l,i)=>{const b=h('button','',l.co.split(' ')[0]);if(i===0)b.className='on';b.addEventListener('click',()=>{this.li=i;this.seg.forEach((x,k)=>x.className=k===i?'on':'');this.trigger();});seg.appendChild(b);return b;});
    c.appendChild(seg);this.li=0;
  }
  phase(i){this.ph.forEach((e,k)=>{e.classList.toggle('on',k===i);e.classList.toggle('done',k<i);});this.bar.style.width=((i+1)/4*100)+'%';}
  reset(){
    this.phase(-1);this.bar.style.width='0';
    this.scanList.innerHTML='';this.scanC.textContent='0/6';
    this.vp.classList.remove('scanning');this.flag.classList.remove('on');this.flag.textContent='';
    this.dsub.textContent='';this.dbd.textContent='';this.draft.classList.remove('typing');
    this.gates.forEach(g=>g.classList.remove('ok'));this.sent.classList.remove('on');
    this.m.forEach(v=>v.textContent='0');
  }
  run(done){
    const L=CR_LEADS[this.li];const rows=CR_SCAN.map(r=>r[0]===L.dom?[L.dom,L.score,'hit']:r);
    this.after(60,()=>this.phase(0));
    rows.forEach((r,i)=>this.after(200+i*190,()=>{
      const e=h('div','sr '+r[2],`<span class="d">${r[0]}</span><span class="s">${r[1]}</span>`);
      this.scanList.appendChild(e);this.scanC.textContent=(i+1)+'/6';this.m[0].textContent=String(i+1);
    }));
    const t1=200+rows.length*190+140;
    this.after(t1,()=>{this.phase(1);this.vp.classList.add('scanning');});
    this.after(t1+1150,()=>{this.flag.textContent=L.flag;this.flag.classList.add('on');this.m[1].textContent='1';});
    const t2=t1+1600;
    this.after(t2,()=>{this.phase(2);this.draft.classList.add('typing');});
    for(let i=1;i<=L.sub.length;i++)this.after(t2+i*16,()=>this.dsub.textContent=L.sub.slice(0,i));
    const t3=t2+L.sub.length*16+120;
    for(let i=1;i<=L.body.length;i++)this.after(t3+i*7,()=>this.dbd.textContent=L.body.slice(0,i));
    const t4=t3+L.body.length*7+150;
    this.after(t4,()=>{this.draft.classList.remove('typing');this.m[2].textContent='1';this.phase(3);});
    this.gates.forEach((g,i)=>this.after(t4+250+i*300,()=>g.classList.add('ok')));
    const t5=t4+250+3*300+200;
    this.after(t5,()=>{this.sentWho.textContent=L.co;this.sent.classList.add('on');this.m[3].textContent='1';});
    this.after(t5+500,done);
  }
}

/* ===== 04 JSP Naturals ===== */
class JSP extends Scene{
  build(){const b=h('div','body');this.root.appendChild(b);
    const lap=h('div','lap','<div class="vp" data-lenis-prevent><img alt="jspnaturals.com, home through reviews"></div>');
    this.vp=lap.querySelector('.vp');this.img=lap.querySelector('img');this.img.src=IMG.jspTall;b.appendChild(lap);
    const c=this.ctl();const go=h('button','go','Scroll the store');go.addEventListener('click',()=>this.trigger());c.appendChild(go);
    c.appendChild(h('span','hint','or drag inside the screen'));}
  reset(){this.img.style.transition='none';this.img.style.transform='translateY(0)';this.vp.scrollTop=0;}
  run(done){this.after(400,()=>{const d=Math.max(0,this.img.offsetHeight-this.vp.clientHeight);
    if(this.expanded){this.vp.scrollTo({top:d,behavior:RM?'auto':'smooth'});}
    else{this.img.style.transition='transform 5.4s linear';this.img.style.transform='translateY(-'+d+'px)';}});
    this.after(6000,done);}
}

/* ===== 05 Lead responder ===== */
const LR_CANNED=["need my gutters looked at, maybe sometime next week? I'm in Buford","hi, can I get a cleaning appointment for my daughter? we're in Duluth","looking to place a wholesale order, about 40 units, ship to Atlanta","my books are a mess and taxes are coming, can you help? based in Roswell"];
const LR_SVC=[[/gutter/,'Gutters'],[/roof/,'Roofing'],[/clean|dental|tooth/,'Dental cleaning'],[/wholesale|units|order/,'Wholesale order'],[/book|tax/,'Bookkeeping'],[/lawn|mow/,'Lawn care']];
const LR_REPLY={'Gutters':['Thanks for reaching out. Gutters are a quick one for us.','We can come by for a look, no charge for the visit.','Two open slots below. Pick one and you are booked.'],
 'Dental cleaning':['Thanks for the message. We would be glad to see your daughter.','A cleaning takes about 45 minutes.','Two open times below. Reply with the one that works.'],
 'Wholesale order':['Thanks for the interest. 40 units is well within what we stock.','I will send the wholesale price sheet and shipping estimate today.','If you want to talk it through first, two open times are below.'],
 'Bookkeeping':['Thanks for reaching out. Messy books before tax season is the most common call we get.','We start with a 30 minute review of what you have.','Two open slots below. Pick one and we will take it from there.'],
 'default':['Thanks for reaching out.','I will look at this and get back to you with details today.','If you want to talk first, two open times are below.']};
class LeadResponder extends Scene{
  build(){const b=h('div','body');this.root.appendChild(b);
    const f=h('div','form','<div class="fh">Contact form, 9:02 pm</div><div class="f"><span class="ph">Name</span></div><div class="f msg"></div>');
    this.nameF=f.querySelectorAll('.f')[0];this.msgF=f.querySelector('.msg');
    const canned=h('div','canned');
    LR_CANNED.forEach((t,i)=>{const b2=h('button','',['Gutters','Dental','Wholesale','Bookkeeping'][i]);b2.addEventListener('click',()=>this.custom(t));canned.appendChild(b2);});
    const own=h('button','','Type your own');own.addEventListener('click',()=>{this.msgF.innerHTML='<textarea placeholder="Type an inquiry, then press Run"></textarea>';this.msgF.querySelector('textarea').focus();});
    canned.appendChild(own);f.appendChild(canned);b.appendChild(f);
    const r=h('div','res','<div class="kv"><span>Service</span><b class="s"></b><span>Urgency</span><b class="u"></b><span>Area</span><b class="a"></b></div><div class="rp"></div><div class="slots"><span>Tue Sep 8, 9:00 am</span><span>Thu Sep 10, 1:30 pm</span></div><div class="fine">The live version uses a language model. This demo is scripted so it runs with nothing behind it.</div>');
    this.kv={s:r.querySelector('.s'),u:r.querySelector('.u'),a:r.querySelector('.a')};this.rp=r.querySelector('.rp');this.slots=[...r.querySelectorAll('.slots span')];b.appendChild(r);
    const c=this.ctl();const go=h('button','go','Run');
    go.addEventListener('click',()=>{const ta=this.msgF.querySelector('textarea');if(ta&&ta.value.trim())this.custom(ta.value.trim(),true);else this.trigger();});
    c.appendChild(go);this.text=LR_CANNED[0];this.name='Dana Whitfield';}
  classify(t){const l=t.toLowerCase();const svc=(LR_SVC.find(x=>x[0].test(l))||[0,'General inquiry'])[1];
    const urg=/asap|today|urgent|leak|emergency|now/.test(l)?'High':'Normal';
    const m=t.match(/\b(?:in|to|from|near)\s+([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/);
    return{svc,urg,area:m?m[1]+', GA':'Not given'};}
  custom(t,keep){this.text=t;this.clear();this.reset(keep);this.run(()=>{},keep);}
  reset(keep){this.nameF.innerHTML='<span class="ph">Name</span>';if(!keep)this.msgF.textContent='';
    Object.values(this.kv).forEach(b=>{b.classList.remove('on');b.textContent='';});this.rp.innerHTML='';this.slots.forEach(s=>s.classList.remove('on'));}
  run(done,keep){const t=this.text,c=this.classify(t);let d=0;
    if(!keep){this.after(300,()=>this.nameF.textContent=this.name);const per=20;
      for(let i=1;i<=t.length;i++)this.after(480+i*per,()=>this.msgF.textContent=t.slice(0,i));d=480+t.length*per;}
    else{this.nameF.textContent=this.name;d=200;}
    [['s',c.svc],['u',c.urg],['a',c.area]].forEach((x,k)=>this.after(d+280*(k+1),()=>{this.kv[x[0]].textContent=x[1];this.kv[x[0]].classList.add('on');}));
    const lines=LR_REPLY[c.svc]||LR_REPLY.default;
    this.after(d+1050,()=>this.rp.innerHTML=lines.map(l=>`<p>${l}</p>`).join(''));
    lines.forEach((l,k)=>this.after(d+1150+380*k,()=>{const p=this.rp.querySelectorAll('p')[k];p&&p.classList.add('on');}));
    this.slots.forEach((s,k)=>this.after(d+1250+380*lines.length+180*k,()=>s.classList.add('on')));
    this.after(d+1250+380*lines.length+700,done);}
}

/* ===== 06 Quote builder ===== */
const QB={roof:{unit:'Square footage',opts:['3-tab shingle','Architectural shingle','Standing seam metal'],rate:[1.10,1.55,4.20],labor:[1.80,1.80,2.60],tog:'Tear-off of old roof',disp:0.45,permit:250,lines:['Materials','Labor','Disposal','Permit'],min:800,max:5000},
 lawn:{unit:'Lawn size, sq ft',opts:['Mow and edge','Mulch beds','New sod'],rate:[0.012,0.09,0.85],labor:[0.02,0.06,0.40],tog:'Haul away debris',disp:0.01,permit:0,lines:['Materials','Labor','Haul away','Permit'],min:1000,max:20000}};
class QuoteBuilder extends Scene{
  build(){const b=h('div','body');this.root.appendChild(b);
    this.inp=h('div','in');b.appendChild(this.inp);
    const doc=h('div','doc','<h5>Quote 2041</h5><small class="who"></small><div class="lines"></div><div class="stamp">SENT</div>');
    this.lines=doc.querySelector('.lines');this.stamp=doc.querySelector('.stamp');this.who=doc.querySelector('.who');b.appendChild(doc);
    const c=this.ctl();const go=h('button','go','Build it again');go.addEventListener('click',()=>this.trigger());c.appendChild(go);
    const seg=h('div','seg','<button type="button" class="on">Roofing</button><button type="button">Landscaping</button>');
    this.seg=[...seg.querySelectorAll('button')];
    this.seg[0].addEventListener('click',()=>this.setTrade('roof'));this.seg[1].addEventListener('click',()=>this.setTrade('lawn'));
    c.appendChild(seg);this.trade='roof';this.sq=2400;this.mat=1;this.tog=true;this.renderInputs();}
  setTrade(t){this.trade=t;this.seg[0].classList.toggle('on',t==='roof');this.seg[1].classList.toggle('on',t==='lawn');
    this.sq=t==='roof'?2400:6500;this.mat=1;this.tog=true;this.renderInputs();this.trigger();}
  renderInputs(){const T=QB[this.trade];
    this.inp.innerHTML=`<label>${T.unit}</label><div class="v sq">0</div>
      <input class="live" type="range" min="${T.min}" max="${T.max}" step="50" value="${this.sq}">
      <div class="live vv" style="font-family:'Spline Sans Mono',monospace;margin:-4px 0 8px"></div>
      <label>${this.trade==='roof'?'Material':'Service'}</label><div class="v mat"></div>
      <select class="live">${T.opts.map((o,i)=>`<option value="${i}"${i===this.mat?' selected':''}>${o}</option>`).join('')}</select>
      <label>${T.tog}</label><div class="v tg">No</div>
      <select class="live tgs"><option value="1"${this.tog?' selected':''}>Yes</option><option value="0"${this.tog?'':' selected'}>No</option></select>`;
    const r=this.inp.querySelector('input'),vv=this.inp.querySelector('.vv');vv.textContent=this.sq.toLocaleString();
    r.addEventListener('input',()=>{this.sq=+r.value;vv.textContent=this.sq.toLocaleString();this.calc(true);});
    this.inp.querySelectorAll('select')[0].addEventListener('change',e=>{this.mat=+e.target.value;this.calc(true);});
    this.inp.querySelector('.tgs').addEventListener('change',e=>{this.tog=e.target.value==='1';this.calc(true);});}
  calc(show){const T=QB[this.trade];const m=this.sq*T.rate[this.mat],l=this.sq*T.labor[this.mat],d=this.tog?this.sq*T.disp:0,p=T.permit;
    const sub=m+l+d+p,mg=sub*0.22,tot=sub+mg;
    const rows=[[T.lines[0],m],[T.lines[1],l],[T.lines[2],d],[T.lines[3],p],['Subtotal',sub],['Margin, 22%',mg],['Total',tot]];
    this.lines.innerHTML=rows.map((r,i)=>`<div class="ln${i===6?' tot':''}${show?' on':''}"><span>${r[0]}</span><span class="a">${money(r[1])}</span></div>`).join('');
    this.who.textContent=(this.trade==='roof'?'Full replacement, ':'Yard service, ')+T.opts[this.mat].toLowerCase()+', '+this.sq.toLocaleString()+' sq ft';
    return rows;}
  reset(){this.inp.querySelector('.sq').textContent='0';this.inp.querySelector('.mat').textContent='';this.inp.querySelector('.tg').textContent='No';
    this.stamp.classList.remove('on');this.calc(false);}
  run(done){const T=QB[this.trade];const sqEl=this.inp.querySelector('.sq');const steps=16;
    for(let i=1;i<=steps;i++)this.after(260+i*42,()=>sqEl.textContent=Math.round(this.sq*i/steps).toLocaleString());
    this.after(1100,()=>this.inp.querySelector('.mat').textContent=T.opts[this.mat]);
    this.after(1450,()=>this.inp.querySelector('.tg').textContent=this.tog?'Yes':'No');
    const ln=this.lines.querySelectorAll('.ln');ln.forEach((e,i)=>this.after(1800+i*300,()=>e.classList.add('on')));
    this.after(1800+7*300+350,()=>this.stamp.classList.add('on'));this.after(1800+7*300+900,done);}
}

/* ===== 07 Follow-up ===== */
const FU=[['1 hour','Thank-you text','Thanks for choosing Ridgeline. Photos are in your inbox.','Thanks for choosing Ridgeline Roofing, Marcus. Photos of the finished roof and your warranty certificate are in your inbox. Text this number any time.'],
 ['1 day','Invoice email','Invoice 1187 attached. Pay online or by check.','Invoice 1187 for the full replacement at 412 Chestnut Lane is attached. Pay online with the link below, or mail a check.'],
 ['3 days','Review request','If we did right by you, a Google review helps.','Marcus, if we did right by you, a quick Google review helps more than anything else we do. One tap, link below.'],
 ['6 months','Reactivation offer','Free gutter check for past customers. Book here.','It has been six months since the new roof went on. We do a free gutter and flashing check for past customers. Pick a time below.']];
class FollowUp extends Scene{
  build(){const b=h('div','body');this.root.appendChild(b);
    const job=h('div','job','<div><b>Job 1187, full replacement</b><small>412 Chestnut Lane, Cumming GA</small></div><span class="pill">In progress</span>');
    this.pill=job.querySelector('.pill');b.appendChild(job);
    const tl=h('div','tl','<div class="prog"></div>');this.prog=tl.querySelector('.prog');
    const steps=h('div','steps4');
    this.steps=FU.map(s=>{const e=h('div','stp',`<span>${s[0]}</span><b>${s[1]}</b><div class="msg short">${s[2]}</div><div class="msg long">${s[3]}</div>`);steps.appendChild(e);return e;});
    tl.appendChild(steps);b.appendChild(tl);this.on=[true,true,true,true];
    const c=this.ctl();const go=h('button','go','Mark job complete');go.addEventListener('click',()=>this.trigger());c.appendChild(go);
    FU.forEach((s,i)=>{const l=h('label','',`<input type="checkbox" checked> ${s[1].split(' ')[0]}`);
      l.querySelector('input').addEventListener('change',e=>{this.on[i]=e.target.checked;this.steps[i].classList.toggle('off',!this.on[i]);});c.appendChild(l);});}
  reset(){this.pill.textContent='In progress';this.pill.classList.remove('done');this.prog.style.width='0';this.steps.forEach(s=>s.classList.remove('on'));}
  run(done){this.after(450,()=>{this.pill.textContent='Complete';this.pill.classList.add('done');});
    this.steps.forEach((s,i)=>this.after(1000+i*900,()=>{if(this.on[i])s.classList.add('on');this.prog.style.width=(i/3*100)+'%';}));
    this.after(1000+4*900,done);}
}

/* ===== catalog ===== */
const DEMOS=[
 {id:'allacart',k:'ac',name:'Allacart',status:'Live',cls:Allacart,
  h:'A cart that follows you <span class="em">across every store</span>',
  lab:'CONSUMER iOS + WEB <b>/</b> SHIPPED TO THE APP STORE',
  metric:['1,000+','items added to carts by real shoppers'],
  copy:'One cart across every store you shop. Chrome and Safari extensions, a native iOS app on the App Store, and a real-time backend, all built end to end. The panel on the left is running the real cart logic with real products pulled from my own saved items.',
  shots:[['allaLanding','myallacart.com'],['allaCart','Saved items, 20 stores'],['allaZoom','Cart detail']],
  ext:['myallacart.com','https://myallacart.com']},
 {id:'sealed-bid',k:'sb',name:'Sealed-Bid Platform',status:'Built',cls:SealedBid,
  h:'Sealed bids in, <span class="em">winners out</span>, no broker',
  lab:'B2B MARKETPLACE <b>/</b> EQUIPMENT RESALE',
  copy:'Buyers get a link and bid on lots without seeing each other. The moment bidding closes the system computes the winner and queues every result email. Nothing goes out until one human presses approve. No brokers, no commissions, fully owned by the operator.'},
 {id:'crm',k:'cr',name:'Outreach CRM',status:'In use',cls:CRM,
  h:'It finds the lead, <span class="em">reads the site</span>, writes the email',
  lab:'INTERNAL OPS <b>/</b> SINGLE OPERATOR PIPELINE',
  metric:['Hundreds','of outreach emails sent through it'],
  copy:'Four stages, all of them automatic: scan a market, check each site for a real problem, draft the email from what was actually found, then run it through compliance guardrails that live in the send path rather than a policy document. Pick a different lead in the controls and watch it run again.'},
 {id:'jsp-naturals',k:'jsp',name:'JSP Naturals',status:'Live store',cls:JSP,
  h:'A storefront built <span class="em">without a template</span>',
  lab:'E-COMMERCE <b>/</b> MY OWN BRAND',
  metric:['$5,000+','in sales through the store'],
  copy:'This one is my own brand, so the store is built from scratch: products, cart, checkout, order history, reviews, and customer accounts. No Shopify, no theme, no plugins.',
  shots:[['jspTall','jspnaturals.com']],
  ext:['jspnaturals.com','https://jspnaturals.com']},
 {id:'lead-responder',k:'lr',name:'Inbound Lead Responder',status:'Built',cls:LeadResponder,
  h:'Someone writes at 9pm. <span class="em">It answers.</span>',
  lab:'AUTOMATION <b>/</b> ANY SERVICE BUSINESS',
  copy:'A form fills in at nine at night. Before you ever see it, the request is sorted by service, urgency, and area, a reply is drafted in your voice, and two open slots from your calendar are attached. You approve it in the morning, or let it send. Type your own inquiry into it.'},
 {id:'quote-builder',k:'qb',name:'Instant Quote Builder',status:'Built',cls:QuoteBuilder,
  h:'Three inputs, <span class="em">one finished quote</span>',
  lab:'INTERNAL OPS <b>/</b> ANY TRADE WITH A PRICE LIST',
  copy:'Move the inputs and the quote recalculates with your margin already in it. The customer gets a clean document. You stop doing the math on a napkin. Switch it to landscaping in the controls to see the same engine on a different trade.'},
 {id:'follow-up',k:'fu',name:'Post-Job Follow-Up',status:'Built',cls:FollowUp,
  h:'Mark it done. <span class="em">The rest happens.</span>',
  lab:'AUTOMATION <b>/</b> RETENTION',
  copy:'Thank-you, invoice, review request, then a reactivation offer six months later. Every step can be switched off and nothing ever sends twice. Uncheck one in the controls and run it again.'}];


/* ===== public API (mockups) =====
   HGDemos.list            -> [{id,name,status,h,lab,metric,copy,shots,ext}]
   HGDemos.create(id)      -> scene {root, play(), pause(), trigger(), setExpanded(bool)}
   HGDemos.mount(el,id,o)  -> creates a scene, appends scene.root to el (el must be
                              position:relative with a size). o.expanded, o.autoplay (default: plays while visible)
   HGDemos.img(key)        -> absolute URL of a site screenshot (allaLanding, allaCart, allaZoom, jspTall, ...)
*/
const byId={};DEMOS.forEach(d=>byId[d.id]=d);
function create(id){const d=byId[id];if(!d)throw new Error('unknown demo '+id);return new d.cls(d.k);}
function mount(el,id,o){o=o||{};const s=create(id);el.appendChild(s.root);
  if(o.expanded)s.setExpanded(true);
  else if(o.autoplay!==false){new IntersectionObserver(es=>{es[0].isIntersecting?s.play():s.pause();},{threshold:.2}).observe(el);}
  return s;}
window.HGDemos={list:DEMOS.map(d=>{const c=Object.assign({},d);delete c.cls;return c;}),create,mount,img:k=>IMG[k],base:BASE};
})();
