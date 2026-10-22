'use strict';
// Native disclosures stay immediate; this only bridges newly revealed content.
(() => {
 let pointerInput=false;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 document.addEventListener('pointerdown',()=>{pointerInput=true;},{capture:true,passive:true});
 document.addEventListener('keydown',()=>{pointerInput=false;},true);
 document.querySelectorAll('details').forEach(details=>{
  const content=details.querySelector('.week-body,.table-wrap');
  if(!content?.animate)return;
  let animation;
  details.addEventListener('toggle',()=>{
   const opacity=animation?getComputedStyle(content).opacity:null;
   animation?.cancel();animation=undefined;
   if(!details.open||!pointerInput)return;
   animation=content.animate([{opacity:opacity??(reduced.matches?.9:.65)},{opacity:1}],{duration:reduced.matches?80:160,easing:'ease-out'});
   animation.onfinish=()=>{animation=undefined;};
  });
 });
})();
