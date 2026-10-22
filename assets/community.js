'use strict';
// External comments are deliberately opt-in: no requests until a visitor loads notes.
(() => {
 const config=window.JOURNAL?.community;
 const button=document.getElementById('load-notes');
 const status=document.getElementById('notes-status');
 const host=document.getElementById('discussion-widget');
 if(!config?.enabled) return;
 if(!config.repo||!config.repoId||!config.category||!config.categoryId){status.textContent='Visitor notes are not configured yet.';return;}
 document.getElementById('notes-badge').textContent='GitHub Discussions';
 document.getElementById('notes-disclosure').hidden=false;
 button.disabled=false;button.textContent='Load visitor notes';
 status.textContent='Join the conversation with a GitHub account. Notes load only when you choose to open them.';
 let loading=false,loaded=false;
 button.addEventListener('click',()=>{
  if(loading||loaded)return;
  loading=true;button.disabled=true;button.textContent='Loading notes…';status.textContent='Connecting to the discussion space…';
  const script=document.createElement('script');
  script.src='https://giscus.app/client.js';script.async=true;script.crossOrigin='anonymous';
  const settings={repo:config.repo,'repo-id':config.repoId,category:config.category,'category-id':config.categoryId,mapping:'specific',term:'The Long Run — visitor notes',strict:'1','reactions-enabled':'1','emit-metadata':'0','input-position':'top',theme:document.body.classList.contains('dark')?'dark':'light',lang:'en',loading:'eager'};
  Object.entries(settings).forEach(([name,value])=>script.setAttribute('data-'+name,value));
  const timer=setTimeout(()=>{
   if(!loaded){loading=false;button.disabled=false;button.textContent='Retry loading notes';status.textContent='The discussion service is taking longer than expected. Check your connection and retry.';script.remove();}
  },15000);
  script.onload=()=>{clearTimeout(timer);loaded=true;loading=false;button.hidden=true;status.textContent='Visitor notes are hosted in GitHub Discussions. Sign in within the comments area to post or reply.';};
  script.onerror=()=>{clearTimeout(timer);script.remove();loading=false;button.disabled=false;button.textContent='Retry loading notes';status.textContent='Notes could not load. Check your connection and try again.';};
  host.replaceChildren(script);
 });
 document.getElementById('theme').addEventListener('click',()=>{
  const frame=host.querySelector('iframe.giscus-frame');
  if(frame?.contentWindow)frame.contentWindow.postMessage({giscus:{setConfig:{theme:document.body.classList.contains('dark')?'dark':'light'}}},'https://giscus.app');
 });
})();
