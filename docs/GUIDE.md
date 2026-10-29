# Setup and update guide

All commands and file paths below are relative to the repository root.

<p align="center"><img src="../assets/banner.svg" alt="The road to 21.1 — a half marathon journal, 22 October to 13 December 2026" width="100%"></p>

<p align="center"><strong>52 days. One half marathon. One run at a time.</strong><br>22 October → 13 December 2026</p>

---

### The intention

A public record of building toward a half marathon on **13 December 2026**, with a target of **strictly under 6:00 min/km**. For 21.0975 km, that means under **2:06:35.1** (derived from the target, not a predicted finish). Fitness and readiness are still being established. No finish or race result has been reported.

Football is paused. The current plan uses three easy runs with at least one non-running day between them, adjusted for recovery. The 13 December event stays on the calendar; current logs do not yet establish readiness. Future intentions never count as completed training.

### The work so far

<!-- STATS:START -->
**9.6 km logged · 3 completed runs · Last entry: 2026-10-29**

| Date | Distance | Pace | Duration | Effort |
| :--- | ---: | ---: | ---: | ---: |
| 2026-10-22 | 3.0 km | 6:46 min/km | 20:18 | 4/10 |
| 2026-10-27 | 2.5 km | 6:28 min/km | 16:10 | 2.5/10 |
| 2026-10-29 | 4.1 km | 6:28 min/km | 26:39 | 4.0/10 |
<!-- STATS:END -->

Pace is calculated from distance and duration, rounded to the nearest second per kilometre. The starting run was supplied as 3.0 km, 6:46 min/km, 20:18, effort 4/10. Calendar time passing does not establish further training or a completed race.

### Past benchmarks

| Distance | Historical PB pace | Context |
| :--- | ---: | :--- |
| 5 km | 4:52 min/km | Last year, as supplied |
| 10 km | 6:03 min/km | Last year; longest reported distance |

**These are historical bests, not present fitness.** They are kept separate from the current journey totals. No exact historical dates or race results have been invented.

### The weeks ahead

The current source is `data/weeks.json`, shown in the live weekly table with pace guides. Three easy session slots replace the earlier football-based plan. The revised progression reflects the clarification that 3 km was a chosen distance, not a current maximum. It includes a lighter week, controlled pace practice and a conditional 12–14 km peak, then a taper. See [the current evidence review](TRAINING-REVIEW-2026-10-26.md) for the race decision and longer-term route to sub-6:00/km. The schedule alone cannot establish race readiness or guarantee sub-6:00/km.

### Open the site

Open **index.html** in a browser for an offline preview. All fonts, graphics, scripts, and styles are local. For a local web preview, run this from the repository folder:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit **http://127.0.0.1:8000**. Stop the preview with Ctrl+C. No packages, build service, API keys, or sign-in are required. Python 3.9 or newer is enough for the data-refresh script.

The site has distance and pace charts, an expandable training log, flexible weekly windows, historical PBs, and a light/dark switch. The countdown uses each visitor's device calendar date, at day granularity; there is no invented race start time. It stops at zero and shows “result unreported” after race day. A weekly label reflects its date window only. The README is a snapshot of supplied logs; its statistics do not change with the clock.

### Update the training log

1. Edit **data/logs.json**. Add an object for a genuinely completed run, using only these fields:

```json
{
  "date": "YYYY-MM-DD",
  "distanceKm": 0,
  "durationSeconds": 0,
  "effort": 1
}
```

This is a schema illustration, **not a run**. Replace the placeholder date, distance, duration, and effort with real values. Distance and duration must be greater than zero; duration is whole seconds; effort is 1–10. Use a calendar date without a time or location. Keep commas between objects in the array. More than one run on the same date is allowed.

2. From the repository folder, refresh the site data and README totals:

```sh
python3 scripts/build.py
```

3. Preview **index.html** and review the changes. Publish `data/logs.json`, the generated `assets/data.js`, and `README.md` together. The page uses the generated file so it also works offline; editing JSON alone will not refresh the displayed site.

Edit **data/weeks.json** to adjust weekly intentions. The script validates their date coverage and field names. Keep text anonymous. The race goal and historical records in **data/journey.json** preserve the supplied baseline; the validator intentionally locks them to these facts. Supporting new race results or revising those facts requires a deliberate schema, validator, and display update.

### Publish to GitHub Pages — when you're ready

The site itself does not access GitHub or publish updates. The following steps describe how to publish the static site when you choose to share it. Menu labels can change.

1. Review every file first. Create a new public repository with a neutral name such as `half-marathon-journey`. A public repository reveals its owning account; choose an account whose public identity you are comfortable associating with this journal.
2. Upload **the contents of this folder** to the repository root, including `.nojekyll` and `.gitignore`. Keep `index.html` at the root, not nested inside another folder. Do not upload the ZIP itself.
3. In the repository's **Settings → Pages**, choose **Deploy from a branch**, select the branch containing the files (commonly `main`), and choose **/ (root)**. Save.
4. Wait for Pages to finish deploying and use the site link shown in that settings screen. All asset paths are relative, so a project repository works without changing a base URL.
5. For updates, edit the JSON locally, run the refresh script, and upload the changed source and generated files together. Pages republishes the selected branch. No workflow or additional permissions are required by this package.

If you use Git locally instead of uploading files, set a GitHub-provided private/noreply commit email **before your first commit**, and review the author name that Git records. The code can be anonymous while account ownership, commit metadata, issue discussions, and repository history still identify you. Do not put personal information in commit messages.

### Privacy by design

Only the supplied performance details and requested journey dates are included. There are **no names, precise locations, GPS coordinates, routes, personal photos, account handles, contact details, device details, credentials, or sensitive identifiers**. The decorative lines in the banner are abstract artwork, not a route.

There are no analytics, remote fonts, external scripts, social embeds, APIs, or tracking pixels. The only browser storage is the chosen light/dark preference, stored locally on the visitor's device. The site's code sends no telemetry. Your hosting provider may still keep ordinary request logs.

Keep exports such as GPX, FIT, TCX, route screenshots, and original activity files out of this repository. `.gitignore` helps exclude common exports and photos when using Git, but does not inspect content, protect already tracked files, or apply to manual web uploads. The data validator rejects extra fields in logs; it cannot identify every sensitive phrase inside editable plan text. Review content manually before sharing. Removing a file later does not erase public Git history or copies.

### Files

```text
index.html              Static site; works offline and on Pages
assets/style.css        Responsive layout and color themes
assets/app.js           Charts, totals, countdown, and timeline
assets/data.js          Generated browser data; refresh after JSON edits
assets/banner.svg       README artwork
assets/favicon.svg      Local site icon
data/journey.json       Supplied goal and historical bests
data/logs.json          Completed runs; the main file to update
data/weeks.json         Flexible weekly intentions
scripts/build.py        Validate data and refresh browser/README stats
.nojekyll               Serve the site as plain static files
.gitignore              Exclude common private/local files
```

No dependency installation, backend, database, or GitHub token is needed. No license is supplied; choose one deliberately before inviting reuse of code or journal content.

### Track runs through this chat

Post a completed run in the same chat using this format:

```text
Date: YYYY-MM-DD
Distance: … km
Duration: … minutes … seconds
Effort: …/10
```

You can include pace if you know it. If pace, duration, and distance disagree, resolve the difference before changing the canonical log. State whether an entry is a **new run** or a **correction** to an existing one. Multiple runs on the same day should be identified explicitly. Do not send route exports, locations, or personal identifiers for the public journal.

The assistant can update `data/logs.json`, refresh the charts and README, and produce a new ZIP when asked in this chat. Sending a message does **not** automatically write files or publish an update in the background. The JSON file is the durable source of truth; keep a copy of the latest repository if continuing in a different chat or workspace. Visitors cannot edit your training log through comments.

Optional local entry helper:

```sh
python3 scripts/log_run.py --help
```

Use the required date, kilometre, duration, and effort arguments to add a real completed run. The helper validates and rebuilds the journal, rejects exact duplicates, and restores the previous files if validation fails. Use `--allow-same-day` only for a genuinely separate run on the same date. Correct existing entries in `data/logs.json`, then rebuild.

### Visitor notes and replies — GitHub Discussions

**No separate database is required for this setup.** Run records live in the JSON files. Visitor comments, replies, and reactions will live in GitHub Discussions through [giscus](https://giscus.app/). This is an asynchronous conversation space, not live chat. Visitors need a GitHub account to post; GitHub profile names and avatars can appear in the discussion. Keep visitor comments separate from your anonymous training records.

The site's notes section is implemented, but **not connected**. `data/community.json` has `enabled: false`, and every repository field is empty. Connecting this feature requires a real repository and the giscus app; neither is provisioned by the site code. There are no fabricated comments or locally saved “public” messages. The disabled state clearly says that notes are not being collected.

When you choose to connect it:

1. Explicitly authorize repository access/setup, or perform the setup yourself. Enable Discussions in your chosen public repository and install the giscus GitHub app for that repository. These are external account changes; this package does not perform them.
2. At the official giscus configuration page, choose the repository and a discussion category. A category of the Announcements type lets maintainers and giscus create topics while visitors add comments. Select a specific-term mapping using **The Long Run — visitor notes** so the conversation stays associated with this journal across URL changes.
3. Copy the values for repository, repository ID, category, and category ID into `data/community.json` as `repo`, `repoId`, `category`, and `categoryId`. These are public configuration values, not credentials. They necessarily identify the public repository once enabled. Do not add personal access tokens, passwords, or private keys.
4. Set `enabled` to `true`, run `python3 scripts/build.py`, and preview. Publish the changed JSON and generated browser data only when you are ready. Keep `enabled: false` until configuration is complete.
5. Verify the live discussion widget after publication. Moderate inappropriate comments in GitHub Discussions and use GitHub's reporting/blocking controls as needed. The comments integration has been prepared locally; end-to-end posting cannot be tested until a real repository is connected.

Visitors must deliberately press **Load visitor notes** before the site loads the giscus script or contacts the discussion services. The button is unavailable while the service is unconfigured. Once loaded, comments use the provider's own network, authentication, and storage; the original “all local assets / no external services” description applies to the unconnected journal. The site has no analytics. Sign-in is handled by GitHub, and no credentials are collected by the journal code.

For a guestbook without GitHub accounts, a separate storage service plus spam controls and moderation would be needed. A custom live chat would add ongoing presence and real-time delivery. Neither is part of this Discussions-based setup.

### Glass materials and accessibility

The updated UI uses platform system fonts, stationary color washes, a floating frosted toolbar, and thicker translucent panels for important content, following the Apple design skill's material and hierarchy guidance. Press feedback is immediate. Light and dark themes, visible keyboard focus, and readable chart labels are preserved. Reduced-motion preferences remove transforms; reduced-transparency and increased-contrast preferences use solid, defined surfaces. Browsers without backdrop-filter receive solid surfaces.

Additional files: `assets/glass.css` contains the glass theme; `assets/community.js` handles opt-in comments; `data/community.json` stores the disabled-by-default public connection settings; `scripts/log_run.py` is the optional validated run-entry helper.

### Number typography

Distances, times, pace, and countdown figures use self-hosted **IBM Plex Mono Regular** with tabular numerals. The rest of the interface uses the platform system font. Font source: the Google Fonts IBM Plex Mono distribution; its SIL Open Font License is included in `assets/fonts/OFL.txt`. No font service is contacted by visitors.

### Visual assets

The editorial strip is **AI-generated artwork**, not a photograph of the runner or their surroundings. The built-in imagegen tool created `assets/images/track-study.png`; the exact final prompt and source note are in [the asset provenance record](asset-provenance.md). No image service is contacted by the website. The repository's image exception is limited to this deliberate artwork.

### Restrained motion

Only pointer-opened weekly details and the training log receive a brief content fade. Keyboard activation and layout changes stay immediate; reduced-motion preferences receive a gentler fade. No animated charts, counters, parallax, card-hover choreography, or motion dependencies. See [the opportunity review and rejected candidates](motion-review.md).

## Current live setup (supersedes the earlier setup notes)

The public page is now compact: race target/countdown, logged totals, latest run, chart, and full run log. The weekly intentions and historical PBs are collapsed. Notes link directly to the enabled GitHub Discussions space; no giscus app or embedded widget is required. Visitors sign in on GitHub to start a discussion or reply. Posting notes does not give them edit access to this repository.

### Log as the owner

1. Use **Log a run** at the bottom of the live page.
2. Sign in to GitHub as **Shawnchee** if prompted.
3. On **Update journal**, choose **Run workflow** on `main`.
4. Enter the completed run's date, kilometre distance, duration (`M:SS` or `H:MM:SS`), and effort (`1`–`10`), then run it. Check the additional-run box only for a separate second run on an already logged date.
5. Wait for the workflow to succeed. It validates the entry, commits the log as Shawnchee using a noreply email, updates the charts, and deploys Pages. Invalid entries or duplicates fail without saving a run.

This is GitHub-authenticated owner access, not a separate website account. The public link does not grant permissions. Workflow dispatch is additionally restricted to the repository owner. There are no admin tokens or passwords in the website. A custom in-page admin form would require an authenticated backend or OAuth integration; this static site deliberately delegates sign-in and writes to GitHub.

Corrections: edit `data/logs.json` through GitHub's file editor while signed in as the owner, then commit. A push to `main` runs the same validation/build/deployment workflow. Local edits and the chat-based update process still work. The README stays short. Pages now deploys through **GitHub Actions**, replacing the earlier branch-publishing instructions.

## Current weekly training targets

The public table uses three session slots: Easy 1, Easy 2 and Long easy (event goal in the last window). Football is paused. Leave a non-running day between runs. Easy guides are 6:40–7:20/km and 6:50–7:40/km for longer runs; conversation and comfortable effort override these untested ranges. Planned distance and pace never count as completed performances.

Easy 2 may contain optional controlled blocks, shown within its distance total; warm-up, recoveries and cool-down are included. Session `note` text is validated anonymous plan content. The race row shows the target, not a confirmed pace prescription. Sub-6:00/km remains the goal; readiness is not established. The user has confirmed 13 December is fixed; assess the pace target by 25 November from actual training, with another review nearer race day. No time is promised from one recent 3 km. See [the evidence review](TRAINING-REVIEW-2026-10-26.md).

## Where records live and how the period views work

**`data/logs.json` is the canonical public run history**, versioned in GitHub. The generated `assets/data.js` is a browser copy, not another database. Month/90-day filters never overwrite, delete, or summarize away those source records. Save only anonymous completed-run fields; all original dates, distances, durations, and efforts remain available for re-analysis. Back up the repository or download the JSON whenever desired.

- **All time** includes the entire recorded history. Until race day its chart spans the original training window; after that it extends with the calendar. The top lifetime cards and latest-run card remain all-time context.
- **Month** lets you choose any calendar month, including older months. Its chart shows each calendar day.
- **90 days** uses the selected “Through” date and the preceding 89 calendar days, inclusive; its distance chart groups those days into seven-day buckets, with a shorter final bucket.
- The small period summary, pace/distance chart, and expandable run table all use the selected period. Average pace is total duration divided by total distance, not the mean of individual paces. Missing entries are unlogged, not confirmed rest days. Empty periods show no invented average or trend.
- Historical PBs and planned sessions are excluded from recorded totals. Run logging is allowed after race day; the race schedule and historical race result status remain separate from the growing record.

The period calculations live in `assets/trends.js`. Verify date boundaries, leap months, same-day entries, weighted pace, and empty periods with `node --test tests/trends.test.cjs`. Browser preferences and period selection are not a backup: the repository is the saved record.

## Revision history

Earlier versions accommodated football with two priority runs and an optional third. On 26 October, football was paused and that draft was replaced by the three-run progression and evidence review linked above. The TikTok carousel was reviewed previously; its advanced workload was not copied. No new completed run was supplied or added.

The subsequent clarification that 3 km was chosen rather than limiting supersedes the earlier cautious 4.8 km peak. The new three-run schedule peaks at 23–27 km/week and a conditional 12–14 km long run. No additional performance has been logged; the reference to feeling comfortable around 6:30/km is qualitative context, not a new timed run.
