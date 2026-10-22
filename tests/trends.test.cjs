const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const context={};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../assets/trends.js'),'utf8'),context);
const T=context.JournalTrends;
const journey={startDate:'2026-10-22',raceDate:'2026-12-13'};
test('calendar months use their actual length, including leap day',()=>{
 const feb=T.bounds('month','2028-02','2028-02-10',journey);
 assert.equal(feb.start,'2028-02-01');assert.equal(feb.end,'2028-02-29');assert.equal(T.buckets([],feb).length,29);
 assert.equal(T.bounds('month','2026-11','2026-10-22',journey).end,'2026-11-30');
});
test('90 days includes both boundary dates, excludes adjacent dates, and counts two same-day runs',()=>{
 const range=T.bounds('90','','2026-10-22',journey);
 assert.equal(range.start,'2026-07-25');assert.equal(range.end,'2026-10-22');
 assert.equal((T.stamp(range.end)-T.stamp(range.start))/T.DAY+1,90);
 const logs=['2026-07-24','2026-07-25','2026-10-22','2026-10-22','2026-10-23'].map(date=>({date,distanceKm:1,durationSeconds:360}));
 const selected=T.filter(logs,range);assert.equal(selected.length,3);
 const bins=T.buckets(selected,range);assert.equal(bins.length,13);assert.equal(bins.reduce((n,b)=>n+b.runs,0),3);assert.equal(bins.reduce((n,b)=>n+b.distance,0),3);
});
test('average pace is weighted by distance, and input records are unchanged',()=>{
 const logs=Object.freeze([Object.freeze({date:'2026-10-22',distanceKm:1,durationSeconds:300}),Object.freeze({date:'2026-10-21',distanceKm:3,durationSeconds:1260})]);
 assert.equal(T.summary(logs).pace,390);assert.equal(T.summary(logs).seconds,1560);
 T.filter(logs,{start:'2026-10-01',end:'2026-10-31'});assert.equal(logs[0].date,'2026-10-22');
});
test('all-time view includes post-race records; empty periods have no invented pace',()=>{
 const range=T.bounds('all','','2027-02-10',journey);
 assert.equal(range.end,'2027-02-10');assert.equal(T.filter([{date:'2027-01-01',distanceKm:2,durationSeconds:800}],range).length,1);
 assert.equal(T.summary([]).pace,null);assert.equal(T.summary([]).distance,0);
});
test('invalid calendar labels are rejected',()=>{
 assert.throws(()=>T.bounds('month','2026-13','2026-10-22',journey));
 assert.throws(()=>T.bounds('90','','2026-02-30',journey));
});
