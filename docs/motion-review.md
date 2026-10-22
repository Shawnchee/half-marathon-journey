# Motion opportunity review

Reviewed 22 October 2026 using the find-animation-opportunities skill. Plain HTML/CSS/JS, no motion library; existing press feedback is 120ms ease-out. This is a calm reading interface. The review was read-only; the implementation below was a separate, user-authorized step.

## Part 1 — Opportunities

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | `assets/app.js:25`, `index.html:7` | Weekly detail text and the training table appear instantly when disclosed | Preventing a jarring change; state indication | Occasional pointer interaction | Fade only the newly opened content from opacity 0.65 to 1, 160ms ease-out. Keep native disclosure and layout immediate. Reduced motion: opacity 0.9 to 1 over 80ms. Keyboard activation: immediate, no animation. Cancel on close; never lock input. |

Gate record: frequency is occasional, purpose is making an intentional disclosure legible, speed is below the 300ms UI budget, and function is preserved because no data, layout, focus, or controls move and opening is never delayed. No hover motion is proposed, so hover gating is inapplicable.

## Part 2 — Rejected candidates

- `assets/app.js:58` — chart line drawing, bar growth, or animated metric swaps. **Rejected at function:** readers need stable data, and one run does not justify a dramatic progress reveal.
- `index.html:4` — countdown roll-up and animated number counters. **Rejected at purpose/function:** they invent activity and make a simple fact slower to read.
- `assets/glass.css:59` — adding hover lift to every card. **Rejected at frequency/purpose:** repeated decorative motion provides no useful feedback. Existing subtle press feedback is sufficient.
- `index.html:3` — navigation entrances and keyboard-triggered transitions. **Rejected at frequency:** common navigation and keyboard actions should stay immediate.
- `index.html:5` — parallax or a moving track background. **Rejected at function:** the artwork should establish tone without distracting from training records. There are no draggable surfaces, toast queues, or destructive controls requiring a gesture or confirmation animation.

## Part 3 — Verdict

One small disclosure fade is enough. The highest-leverage opportunity is the weekly-details entrance; the same behavior can cover the training log. No library or page-wide entrance choreography is needed. The standard skill handoff would be `improve-animations plan disclosure content fade`; here the user explicitly authorized implementation after review, so the recipe was implemented separately in `assets/motion.js`.
