/* HGForm — contact form for harbuckgroup.com. Sends through Web3Forms, same setup as the previous site.
   Markup: <form data-hg-form> <input name="name" required> <input name="business"> <textarea name="message" required></textarea>
           <button type="submit">…</button> <p data-hg-form-state aria-live="polite"></p></form>
   Adds .is-sent on success, .is-error on validation or send failure. */
(function(){
document.querySelectorAll('[data-hg-form]').forEach(f=>{
  /* honeypot: bots tick it, people never see it */
  const hp=document.createElement('input');hp.type='checkbox';hp.name='botcheck';hp.tabIndex=-1;
  hp.setAttribute('aria-hidden','true');hp.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
  f.appendChild(hp);
});
document.addEventListener('submit',async e=>{const f=e.target.closest('[data-hg-form]');if(!f)return;e.preventDefault();
  const st=f.querySelector('[data-hg-form-state]'),b=f.querySelector('[type=submit]');
  const name=((f.elements.name||{}).value||'').trim(),biz=((f.elements.business||{}).value||'').trim(),
        msg=((f.elements.message||{}).value||'').trim();
  const say=t=>{if(st)st.textContent=t;};
  f.classList.remove('is-sent','is-error');
  if(!name||!msg){f.classList.add('is-error');say('Add your name and what you need, then send.');return;}
  if(f.elements.botcheck&&f.elements.botcheck.checked)return;
  if(b)b.disabled=true;say('Sending.');
  try{
    /* FormData, not JSON: a JSON body forces a CORS preflight that Web3Forms rejects on this plan. */
    const fd=new FormData();
    fd.append('access_key','3164bd66-b603-40f3-a526-9420f3020940');
    fd.append('subject','harbuckgroup.com inquiry from '+name);
    fd.append('from_name','harbuckgroup.com');
    fd.append('name',name);fd.append('business',biz||'not given');fd.append('message',msg);
    const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{Accept:'application/json'},body:fd});
    const j=await r.json().catch(()=>({}));
    if(r.ok&&j.success!==false){f.reset();f.classList.add('is-sent');say('Sent. I read every one of these and reply within a day.');}
    else throw new Error('rejected');
  }catch(err){
    f.classList.add('is-error');say('That did not send. Email nick@harbuckgroup.com or call (706) 870-3910.');
  }finally{if(b)b.disabled=false;}
});
})();
