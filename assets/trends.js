'use strict';
// Pure calendar helpers. Dates are calendar labels, not timestamps or locations.
(() => {
 const DAY=86400000;
 const stamp=value=>Date.parse(value+'T00:00:00Z');
 const iso=value=>new Date(value).toISOString().slice(0,10);
 const valid=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(stamp(value))&&iso(stamp(value))===value;
 function bounds(mode,month,end,journey){
  if(!valid(end))throw new Error('Choose a valid end date.');
  if(mode==='month'){
   if(!/^\d{4}-\d{2}$/.test(month)||!valid(month+'-01'))throw new Error('Choose a valid month.');
   const start=month+'-01',d=new Date(stamp(start));
   return {start,end:iso(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)-DAY),step:'day'};
  }
  if(mode==='90')return {start:iso(stamp(end)-89*DAY),end,step:'week'};
  const last=end>journey.raceDate?end:journey.raceDate;
  return {start:journey.startDate,end:last,step:(stamp(last)-stamp(journey.startDate))/DAY>120?'month':'week'};
 }
 const filter=(logs,range)=>logs.filter(r=>r.date>=range.start&&r.date<=range.end).sort((a,b)=>a.date.localeCompare(b.date));
 function summary(logs){
  const distance=logs.reduce((sum,r)=>sum+r.distanceKm,0),seconds=logs.reduce((sum,r)=>sum+r.durationSeconds,0);
  return {distance,seconds,runs:logs.length,pace:distance?seconds/distance:null};
 }
 function buckets(logs,range){
  const result=[];let start=stamp(range.start),finish=stamp(range.end);
  while(start<=finish){
   const d=new Date(start);
   let next=range.step==='month'?Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1):start+(range.step==='week'?7:1)*DAY;
   const end=Math.min(finish,next-DAY);
   const bucket={start:iso(start),end:iso(end)};
   result.push({...bucket,...summary(filter(logs,bucket))});start=next;
  }
  return result;
 }
 globalThis.JournalTrends=Object.freeze({DAY,stamp,valid,bounds,filter,summary,buckets});
})();
