#!/usr/bin/env python3
"""Add one supplied completed run, validate, and regenerate the public journal."""
import argparse
import json
import re
import sys
from pathlib import Path
sys.dont_write_bytecode=True
from build import build, ROOT

def duration(value):
    if re.fullmatch(r'\d+:[0-5]\d',value):
        minutes,seconds=map(int,value.split(':'))
        return minutes*60+seconds
    if re.fullmatch(r'\d+:[0-5]\d:[0-5]\d',value):
        hours,minutes,seconds=map(int,value.split(':'))
        return hours*3600+minutes*60+seconds
    raise argparse.ArgumentTypeError('Use M:SS or H:MM:SS for duration.')

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--date',required=True,help='YYYY-MM-DD; calendar date only')
    parser.add_argument('--km',required=True,type=float)
    parser.add_argument('--duration',required=True,type=duration,help='M:SS or H:MM:SS')
    parser.add_argument('--effort',required=True,type=float,help='1–10')
    parser.add_argument('--allow-same-day',action='store_true',help='Use only for a distinct second run on an already logged date')
    args=parser.parse_args()
    path=ROOT/'data/logs.json'
    original=path.read_bytes()
    logs=json.loads(original)
    run={'date':args.date,'distanceKm':args.km,'durationSeconds':args.duration,'effort':args.effort}
    if run in logs: parser.error('This exact run is already logged. No changes made.')
    if any(row['date']==args.date for row in logs) and not args.allow_same_day:
        parser.error('A run exists on this date. Edit it to correct it, or use --allow-same-day for a distinct additional run.')
    generated={p:p.read_bytes() for p in [ROOT/'assets/data.js',ROOT/'README.md']}
    logs.append(run)
    try:
        path.write_text(json.dumps(logs,indent=2)+'\n')
        build()
    except Exception as error:
        path.write_bytes(original)
        for p,data in generated.items(): p.write_bytes(data)
        parser.error(str(error)+' No changes kept.')
    print('Run added. Review the log and site before publishing.')
if __name__=='__main__': main()
