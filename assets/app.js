'use strict';
(() => {
 const $ = id => document.getElementById(id);
 const put = (id, value) => { $(id).textContent = value; };
 const day = s => Date.parse(s + 'T00:00:00Z');
 const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
 const date = (s, options={day:'numeric',month:'short'}) => new Date(day(s)).toLocaleDateString('en-GB',{...options,timeZone:'UTC'});
 const pace = seconds => `${Math.floor(seconds/60)}:${String(Math.round(seconds)%60).padStart(2,'0')}`;
 const el = (tag, content, cls) => { const node=document.createElement(tag); if(content!==undefined)node.textContent=content; if(cls)node.className=cls; return node; };
 try {
  const {journey,logs,weeks}=window.JOURNAL;
  const sorted=[...logs].sort((a,b)=>a.date.localeCompare(b.date));
  const now=today(), last=sorted.at(-1), total=logs.reduce((s,r)=>s+r.distanceKm,0);
  const remaining=Math.ceil((day(journey.raceDate)-day(now))/86400000);
  put('days',Math.max(0,remaining)); put('days-label',remaining>0?'days to go':remaining===0?'race day':'days remaining');
  put('journey-status',now<journey.startDate?'Starts 22 October':remaining<0?'Race date passed · result unreported':remaining===0?'Race day · result unreported':'Journey started');
  put('transparent-status',`${logs.length} completed ${logs.length===1?'run':'runs'} logged; race result unreported.`);
  put('total-km',total.toFixed(1)); put('run-count',logs.length); put('run-label',logs.length===1?'run':'runs'); put('longest',logs.length?Math.max(...logs.map(r=>r.distanceKm)).toFixed(1):'—');
  put('latest-date',last?`Latest entry · ${date(last.date)}`:'No entries yet');
  put('freshness',last?`Last logged: ${date(last.date,{day:'numeric',month:'long',year:'numeric'})}. Countdown uses your device’s calendar date; training status comes only from the log.`:'No completed runs logged.');
  if(last){put('entry-date',date(last.date,{day:'numeric',month:'long'}));put('entry-km',last.distanceKm.toFixed(1));put('entry-pace',pace(Math.round(last.durationSeconds/last.distanceKm))+' /km');put('entry-duration',pace(last.durationSeconds));put('entry-effort',last.effort+' / 10');}
  else { document.querySelector('.latest').replaceChildren(el('p','No completed runs logged yet.')); }
  for(const r of [...sorted].reverse()) {const tr=el('tr');[date(r.date,{day:'numeric',month:'short',year:'numeric'}),r.distanceKm.toFixed(1)+' km',pace(Math.round(r.durationSeconds/r.distanceKm)),pace(r.durationSeconds),r.effort+' / 10'].forEach(v=>tr.append(el('td',v)));$('log-rows').append(tr);}
  for(const [i,w] of weeks.entries()){
   const details=el('details'); const summary=el('summary'); const active=now>=w.startDate&&now<=w.endDate;
   summary.append(el('span',String(i+1).padStart(2,'0'),`week-num${active?' active':''}`),el('span',w.title,'week-title'),el('span',`${date(w.startDate)} – ${date(w.endDate)}`,'week-dates'),el('span',active?'This week':now>w.endDate?'Past window':'Upcoming',`pill${active?' accent':''}`));
   const body=el('div',undefined,'week-body');body.append(el('p',w.target),el('p',w.adjustment),el('p','Flexible intention · completion is not inferred from dates.','small'));
   details.append(summary,body);$('timeline').append(details);
  }
  journey.historicalBests.forEach(pb=>{const article=el('article',undefined,'pb');const left=el('div'),right=el('div');left.append(el('h3',pb.distanceKm+' km'),el('small',pb.longestReported?'PB · longest reported':'Personal best'));right.append(el('strong',pace(pb.paceSecondsPerKm)+' '),el('small','min/km'),el('p',pb.when,'small muted'));article.append(left,right);$('pbs').append(article);});
  const ns='http://www.w3.org/2000/svg';
  const svgEl=(tag,attrs={},text)=>{const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;};
  function chart(metric){
   $('distance-tab').setAttribute('aria-pressed',metric==='distance');$('pace-tab').setAttribute('aria-pressed',metric==='pace');
   const svg=svgEl('svg',{viewBox:'0 0 540 210',role:'img','aria-labelledby':'chart-description'});
   const desc=svgEl('title',{id:'chart-description'}); svg.append(desc);
   const line=(x1,y1,x2,y2,extra={})=>svg.append(svgEl('line',{x1,y1,x2,y2,stroke:'var(--line)',...extra}));
   const text=(x,y,t,extra={})=>svg.append(svgEl('text',{x,y,fill:'var(--muted)','font-size':10,'font-family':'monospace',...extra},t));
   if(metric==='distance'){
    put('chart-title','Distance, week by week');
    const totals=weeks.map(w=>logs.filter(r=>r.date>=w.startDate&&r.date<=w.endDate).reduce((sum,r)=>sum+r.distanceKm,0));
    const max=Math.max(4,...totals)*1.15;
    [0,.5,1].forEach(v=>{let y=170-v*140;line(36,y,534,y);text(27,y+4,(v*max).toFixed(1),{'text-anchor':'end'});});
    totals.forEach((v,i)=>{let x=49+i*61;let h=v/max*140;const rect=svgEl('rect',{x,y:v?170-h:167,width:30,height:v?h:3,rx:3,fill:v?'var(--orange)':'none',stroke:v?'none':'var(--muted)','stroke-dasharray':v?'':'3 3'});rect.append(svgEl('title',{},`Week ${i+1}: ${v?v.toFixed(1)+' km logged':'no runs logged'}`));svg.append(rect);if(v)text(x+15,160-h,v.toFixed(1),{'text-anchor':'middle',fill:'var(--accent)'});text(x+15,195,'W'+(i+1),{'text-anchor':'middle'});});
    desc.textContent='Weekly logged distance: '+totals.map((v,i)=>`week ${i+1}, ${v.toFixed(1)} kilometres`).join('; ')+'. Empty weeks are unlogged, not confirmed rest weeks.';
    put('chart-caption','Solid: logged distance. Dashed: no entry.');
   }else{
    put('chart-title','Pace, one run at a time');
    const values=sorted.map(r=>r.durationSeconds/r.distanceKm), low=Math.min(330,...values)-15,high=Math.max(435,...values)+15;
    const y=v=>170-(v-low)/(high-low)*140;
    [low,high].forEach(v=>{line(44,y(v),528,y(v));text(38,y(v)+4,pace(Math.round(v)),{'text-anchor':'end'});});
    line(44,y(360),528,y(360),{stroke:'var(--accent)','stroke-dasharray':'5 5'});text(526,y(360)-8,'Sub-6:00 target',{'text-anchor':'end',fill:'var(--accent)'});
    sorted.forEach(r=>{const x=54+(day(r.date)-day(journey.startDate))/(day(journey.raceDate)-day(journey.startDate))*460;const v=Math.round(r.durationSeconds/r.distanceKm);const c=svgEl('circle',{cx:x,cy:y(v),r:5,fill:'var(--orange)'});c.append(svgEl('title',{},`${date(r.date)}: ${pace(v)} min/km`));svg.append(c);text(x+10,y(v)+4,pace(v));});
    text(44,198,'22 Oct');text(528,198,'13 Dec',{'text-anchor':'end'});
    desc.textContent=sorted.length?sorted.map(r=>`${date(r.date)}: ${pace(Math.round(r.durationSeconds/r.distanceKm))} minutes per kilometre`).join('; ')+'. Dashed reference: sub-6:00 race goal.':'No pace entries yet.';
    put('chart-caption','Dots: completed runs. Dashed: race target, not an easy-run pace.');
   }
   $('chart').replaceChildren(svg);
  }
  $('distance-tab').addEventListener('click',()=>chart('distance'));$('pace-tab').addEventListener('click',()=>chart('pace'));chart('distance');
  let saved;try{saved=localStorage.getItem('journal-theme');}catch{}
  if(saved==='dark'||(!saved&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.body.classList.add('dark');
  const themeLabel=()=> $('theme').setAttribute('aria-label',document.body.classList.contains('dark')?'Switch to light theme':'Switch to dark theme');themeLabel();
  $('theme').addEventListener('click',()=>{document.body.classList.toggle('dark');themeLabel();try{localStorage.setItem('journal-theme',document.body.classList.contains('dark')?'dark':'light');}catch{}});
 }catch(error){$('error').hidden=false;}
})();
