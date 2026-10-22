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
  const km=value=>Number.isInteger(value)?String(value):value===21.0975?'21.1':String(value);
  const range=(lo,hi)=>lo===0&&hi===0?'Rest':lo===hi?km(lo)+' km':km(lo)+'–'+km(hi)+' km';
  for(const [i,w] of weeks.entries()){
   const row=el('tr');const window=el('th');window.scope='row';
   window.append(el('strong',date(w.startDate)+' – '+date(w.endDate)),el('small','Week '+(i+1)));
   row.append(window);
   w.sessions.forEach(session=>{
    const cell=el('td'),rest=session.maxKm===0;
    cell.append(el('span',session.kind==='Race'?'Race · 21.1 km':range(session.minKm,session.maxKm),'session-distance'));
    if(!rest)cell.append(el('small',(session.kind==='Race'?'Goal ':'')+pace(session.paceMinSecondsPerKm)+'–'+pace(session.paceMaxSecondsPerKm)+'/km','session-pace'));
    if(session.optional&&!rest)cell.append(el('small','Optional','session-optional'));
    row.append(cell);
   });
   const core=w.sessions.filter(s=>!s.optional),extra=w.sessions.filter(s=>s.optional&&s.maxKm>0);
   const totalCell=el('td');totalCell.append(el('span',i===7?'Race':range(core.reduce((n,s)=>n+s.minKm,0),core.reduce((n,s)=>n+s.maxKm,0))));
   if(extra.length)totalCell.append(el('small','+ '+range(extra.reduce((n,s)=>n+s.minKm,0),extra.reduce((n,s)=>n+s.maxKm,0))+' optional','session-optional'));
   row.append(totalCell);
   if(now>=w.startDate&&now<=w.endDate)row.className='current-week';
   $('plan-rows').append(row);
   const note=el('li');note.append(el('strong','W'+(i+1)+' · '+w.title+': '),document.createTextNode(w.adjustment));$('plan-adjustments').append(note);
  }
  journey.historicalBests.forEach(pb=>{const article=el('article',undefined,'pb');const left=el('div'),right=el('div');left.append(el('h3',pb.distanceKm+' km'),el('small',pb.longestReported?'PB · longest reported':'Personal best'));right.append(el('strong',pace(pb.paceSecondsPerKm)+' '),el('small','min/km'),el('p',pb.when,'small muted'));article.append(left,right);$('pbs').append(article);});
  const T=window.JournalTrends;
  let period='all',metric='distance';
  $('trend-month').value=now.slice(0,7);$('trend-end').value=now;
  const ns='http://www.w3.org/2000/svg';
  const svgEl=(tag,attrs={},text)=>{const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;};
  const duration=seconds=>seconds>=3600?`${Math.floor(seconds/3600)}:${String(Math.floor(seconds/60)%60).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`:pace(seconds);
  function renderTrends(){
   let range;
   try{range=T.bounds(period,$('trend-month').value,$('trend-end').value,journey);$('period-error').hidden=true;}
   catch(error){put('period-error',error.message);$('period-error').hidden=false;return;}
   const selected=T.filter(logs,range),summary=T.summary(selected),bins=T.buckets(selected,range);
   ['all','month','90'].forEach(p=>$('period-'+p).setAttribute('aria-pressed',period===p));
   $('month-control').hidden=period!=='month';$('end-control').hidden=period!=='90';
   put('period-label',`${date(range.start,{day:'numeric',month:'short',year:'numeric'})} – ${date(range.end,{day:'numeric',month:'short',year:'numeric'})}${period==='90'?' · 90 calendar days, inclusive':''}`);
   put('period-km',summary.distance.toFixed(1));put('period-runs',summary.runs);put('period-pace',summary.pace===null?'—':pace(Math.round(summary.pace)));put('period-time',duration(summary.seconds));
   $('log-rows').replaceChildren();put('log-label',`View period log · ${selected.length} ${selected.length===1?'run':'runs'}`);
   for(const r of [...selected].reverse()){const tr=el('tr');[date(r.date,{day:'numeric',month:'short',year:'numeric'}),r.distanceKm.toFixed(1)+' km',pace(Math.round(r.durationSeconds/r.distanceKm)),duration(r.durationSeconds),r.effort+' / 10'].forEach(v=>tr.append(el('td',v)));$('log-rows').append(tr);}
   if(!selected.length){const tr=el('tr'),td=el('td','No runs logged in this period.');td.colSpan=5;tr.append(td);$('log-rows').append(tr);}
   $('distance-tab').setAttribute('aria-pressed',metric==='distance');$('pace-tab').setAttribute('aria-pressed',metric==='pace');
   const svg=svgEl('svg',{viewBox:'0 0 540 210',role:'img','aria-labelledby':'chart-description'});
   const desc=svgEl('title',{id:'chart-description'});svg.append(desc);
   const line=(x1,y1,x2,y2,extra={})=>svg.append(svgEl('line',{x1,y1,x2,y2,stroke:'var(--line)',...extra}));
   const text=(x,y,t,extra={})=>svg.append(svgEl('text',{x,y,fill:'var(--muted)','font-size':10,'font-family':'var(--font-numbers)',...extra},t));
   if(metric==='distance'){
    put('chart-title',range.step==='day'?'Daily distance':range.step==='week'?'Weekly distance':'Monthly distance');
    const max=Math.max(4,Math.ceil(Math.max(0,...bins.map(b=>b.distance))/2)*2);
    [0,.5,1].forEach(v=>{const y=170-v*135;line(36,y,532,y);text(28,y+4,(v*max).toFixed(0),{'text-anchor':'end'});});
    const pitch=488/Math.max(1,bins.length),width=Math.min(30,pitch*.6),labelStep=Math.max(1,Math.ceil(bins.length/6));
    bins.forEach((b,i)=>{const x=40+i*pitch+(pitch-width)/2,h=b.distance/max*135;const rect=svgEl('rect',{x,y:h?170-h:167,width,height:h||3,rx:Math.min(3,width/2),fill:h?'var(--orange)':'none',stroke:h?'none':'var(--muted)','stroke-dasharray':h?'':'2 2'});rect.append(svgEl('title',{},`${date(b.start)}${b.end!==b.start?' – '+date(b.end):''}: ${b.distance.toFixed(1)} km, ${b.runs} runs logged`));svg.append(rect);if(h&&bins.length<=13)text(x+width/2,162-h,b.distance.toFixed(1),{'text-anchor':'middle',fill:'var(--accent)'});if(i%labelStep===0)text(x+width/2,195,date(b.start,range.step==='month'?{month:'short',year:'2-digit'}:{day:'numeric',month:'short'}),{'text-anchor':'middle','font-size':9});});
    desc.textContent=selected.length?bins.map(b=>`${b.start} to ${b.end}: ${b.distance.toFixed(1)} km logged`).join('; '):'No runs logged in this period.';
    put('chart-caption',selected.length?'Solid: logged distance. Dashed: no entry, not confirmed rest.':'No runs logged in this period. Choose another month or All time.');
   }else{
    put('chart-title','Pace by run');
    const values=selected.map(r=>r.durationSeconds/r.distanceKm),low=Math.min(330,...values)-15,high=Math.max(435,...values)+15;
    const y=v=>170-(v-low)/(high-low)*135;
    [low,high].forEach(v=>{line(44,y(v),528,y(v));text(38,y(v)+4,pace(Math.round(v)),{'text-anchor':'end'});});
    line(44,y(360),528,y(360),{stroke:'var(--accent)','stroke-dasharray':'5 5'});text(526,y(360)-8,'Sub-6:00 target',{'text-anchor':'end',fill:'var(--accent)'});
    const span=Math.max(T.DAY,T.stamp(range.end)-T.stamp(range.start));
    selected.forEach(r=>{const x=54+(T.stamp(r.date)-T.stamp(range.start))/span*460,v=Math.round(r.durationSeconds/r.distanceKm);const c=svgEl('circle',{cx:x,cy:y(v),r:5,fill:'var(--orange)'});c.append(svgEl('title',{},`${date(r.date)}: ${pace(v)} min/km`));svg.append(c);if(selected.length<=6)text(Math.min(x+10,490),y(v)+4,pace(v));});
    text(44,198,date(range.start));text(528,198,date(range.end),{'text-anchor':'end'});
    desc.textContent=selected.length?selected.map(r=>`${r.date}: ${pace(Math.round(r.durationSeconds/r.distanceKm))} min/km`).join('; ')+'. Dashed: race target.':'No pace entries in this period. Dashed line is the race target, not a completed run.';
    put('chart-caption',selected.length?'Dots: runs. Dashed: race target. Average pace uses total time ÷ total distance.':'No pace entries in this period. The dashed line is only the race target.');
   }
   if(!selected.length)text(285,103,'No runs logged',{'text-anchor':'middle',fill:'var(--ink)','font-size':13});
   $('chart').replaceChildren(svg);
  }
  ['all','month','90'].forEach(p=>$('period-'+p).addEventListener('click',()=>{period=p;renderTrends();}));
  $('trend-month').addEventListener('change',renderTrends);$('trend-end').addEventListener('change',renderTrends);
  $('distance-tab').addEventListener('click',()=>{metric='distance';renderTrends();});$('pace-tab').addEventListener('click',()=>{metric='pace';renderTrends();});renderTrends();
  let saved;try{saved=localStorage.getItem('journal-theme');}catch{}
  if(saved==='dark'||(!saved&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.body.classList.add('dark');
  const themeLabel=()=> $('theme').setAttribute('aria-label',document.body.classList.contains('dark')?'Switch to light theme':'Switch to dark theme');themeLabel();
  $('theme').addEventListener('click',()=>{document.body.classList.toggle('dark');themeLabel();try{localStorage.setItem('journal-theme',document.body.classList.contains('dark')?'dark':'light');}catch{}});
 }catch(error){$('error').hidden=false;}
})();
