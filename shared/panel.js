/* HGPanel — opens a live demo full-screen in its expanded, interactive mode with its real copy + metric.
   Requires shared/demos.js + demos.css + panel.css.
   HGPanel.open(id)   id: allacart | sealed-bid | crm | jsp-naturals | lead-responder | quote-builder | follow-up
   HGPanel.close()
   Any element with [data-hg-demo="id"] opens that demo on click / Enter automatically.
   CTA "Ask for one like this" closes the panel, prefills [data-hg-message] and scrolls to #contact
   (override scrolling with HGPanel.scrollTo = fn(el) e.g. for Lenis).
   Fires window events 'hgpanel:open' / 'hgpanel:close' (pause your WebGL loop / Lenis while open). */
(function(){
let el,bd,stage,info,cur=null,scene=null,last=null;
function build(){if(el)return;
  bd=document.createElement('div');bd.className='hgp-backdrop';
  el=document.createElement('div');el.className='hgp';el.tabIndex=-1;el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
  el.innerHTML='<div class="hgp-stage"></div><div class="hgp-info"></div>';
  stage=el.firstChild;info=el.lastChild;document.body.append(bd,el);
  bd.addEventListener('click',()=>close());
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cur)close();});}
function open(id){build();if(cur)close(true);
  const d=HGDemos.list.find(x=>x.id===id);if(!d)return;cur=d;last=document.activeElement;
  stage.innerHTML='';scene=HGDemos.create(id);stage.appendChild(scene.root);
  info.innerHTML=`<button class="hgp-close" type="button" aria-label="Close">&times;</button>
    <div class="hgp-lab">${d.lab}</div><h2>${d.h}</h2>
    ${d.metric?`<div class="hgp-metric"><div class="v">${d.metric[0]}</div><div class="k">${d.metric[1]}</div></div>`:''}
    <p class="hgp-copy">${d.copy}</p>
    ${d.shots?`<div class="hgp-strip">${d.shots.map(s=>`<figure><img src="${HGDemos.img(s[0])}" alt="${s[1]}"><figcaption>${s[1]}</figcaption></figure>`).join('')}</div>`:''}
    <div class="hgp-acts"><button class="hgp-ask" type="button">Ask for one like this</button>${d.ext?`<a class="hgp-ext" href="${d.ext[1]}" target="_blank" rel="noopener">${d.ext[0]} ↗</a>`:''}</div>`;
  info.querySelector('.hgp-close').addEventListener('click',()=>close());
  info.querySelector('.hgp-ask').addEventListener('click',()=>{const name=d.name;close();
    const ta=document.querySelector('[data-hg-message]');if(ta&&!ta.value)ta.value='I saw the '+name+' demo on your site. ';
    const c=document.getElementById('contact');if(c){(api.scrollTo||(n=>n.scrollIntoView({behavior:'smooth'})))(c);setTimeout(()=>ta&&ta.focus({preventScroll:true}),1100);}});
  document.documentElement.style.overflow='hidden';bd.classList.add('on');el.classList.add('open');
  requestAnimationFrame(()=>{scene.setExpanded(true);});el.focus();
  window.dispatchEvent(new CustomEvent('hgpanel:open',{detail:{id}}));}
function close(silent){if(!cur)return;const id=cur.id;cur=null;if(scene){scene.pause();}
  el.classList.remove('open');bd.classList.remove('on');document.documentElement.style.overflow='';
  setTimeout(()=>{if(!cur)stage.innerHTML='';},340);
  if(!silent){if(last&&last.focus)last.focus({preventScroll:true});window.dispatchEvent(new CustomEvent('hgpanel:close',{detail:{id}}));}}
document.addEventListener('click',e=>{const t=e.target.closest('[data-hg-demo]');if(t){e.preventDefault();open(t.getAttribute('data-hg-demo'));}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[data-hg-demo]:not(button):not(a)')){e.preventDefault();open(e.target.getAttribute('data-hg-demo'));}});
const api={open,close,get current(){return cur&&cur.id;}};window.HGPanel=api;
})();
