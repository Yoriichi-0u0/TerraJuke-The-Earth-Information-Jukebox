# Decision log

Product, science and process decisions, newest first. Each entry says who decided, why, and what it rules out.
Treat entries as settled: do not re-ask unless new facts contradict them (then add a new entry; never rewrite old ones).
Earlier decisions live in dated docs such as [TERRAJUKE-3-DECISIONS.md](TERRAJUKE-3-DECISIONS.md) and
[TEAM-HANDOFF.md](TEAM-HANDOFF.md).

## 2026-11-15 17:20 · Team uploads the video; Create is the first page to balance
- **Decided by:** Jacy ("I will upload manually. You may proceed with enhancing and improving 'Create' page first").
- **What:** the narrated cut is approved; a person uploads it (YouTube asked for identity verification, and the
  built-in browser cannot attach local files). Create gets the all-ages treatment first: three steps, two plain data
  choices instead of the "Earth Station" menu, a "you choose / the data decides" box, and a way to Your Record.
  Explore Data and About follow. No new data, sound rules or records.

## 2026-11-15 16:30 · Demo narration: AI voice speaking as the team, no on-screen label
- **Decided by:** Jacy ("add narration sound to the video"; chose the Kokoro AI voice and "As Team BoboMimi Chia and
  Jacy but without AI label").
- **What:** a local Kokoro text-to-speech voice reads the team's script, including "Hi! We're Chia and Jacy". There is
  no on-screen AI label for the voice. The official guide asks for SI audio to be acknowledged in text and metadata
  (the visible watermark rule is for SI images and videos), so the portal's SI section and the MP4 metadata say the
  narration is AI. This supersedes the "no AI voice" line of the 15:50 entry.
- **Also:** the footage is re-recorded after a warm-up pass so every NASA frame, font and the 3D shelf have loaded
  before each scene; recording also exposed a real bug (the 3D globe blanked whenever its map changed), fixed in the
  same release.

## 2026-11-15 15:50 · Demo video: real footage, real sound, captions, no AI voice
- **Decided by:** Jacy's Claude, after Jacy said to "kick start the video production".
- **What:** the first cut (30.0 s, 1920×1080) is recorded from the live site by Playwright, with the soundtrack tapped
  straight from the app's Web Audio output, so every frame and every sound is TerraJuke itself. Shots follow
  `docs/video/SHOT-LIST.md` except 0:20–0:25 shows Storm Drums instead of The Ice Year (both fit the caption).
  English captions are burned in; no voice. Build scripts: the separate `TerraJuke-video-studio` repo,
  `terrajuke-30s/`.
- **Rules out:** an AI voice speaking as Chia or Jacy. If the team wants narration, they record it themselves to the
  caption timings. Caption 4 now says the colours are "read on NASA's own scale" rather than "become real values",
  matching the stated limits of read-from-colour records.

## 2026-11-15 14:50 · Make TerraJuke easier for all ages, not bigger
- **Decided by:** Jacy, after mentor feedback that the public found it hard to understand and asked "why a jukebox?".
- **What:** no new features; plainer words, a three-step "how to play", one line on why it is a jukebox, START HERE on
  the first record, advanced sound options folded away, larger small text, and lighter loading on low-memory phones.
  Then balance the other pages (About, Explore Data, Create).

## 2026-11-15 02:30 · Visual identity "Aurora Broadcast"; build autonomously
- **Decided by:** Jacy ("scrap the Apple-like design idea… give TerraJuke any eye-tracking visuals as you want";
  then "continue building at your own, use autonomously"). Order chosen by Jacy: identity first, then new records
  from the unused challenge Resources (Air Quality 5533, ISS Lightning 5011, GEDI 4950, CO₂ 5196).
- **What:** `src/components/TerraJukeIdentity.css`, loaded after `StudioIdentity.css`, re-sets the shared tokens and
  adds the motifs. Fonts stay system fonts (no downloads): a condensed display stack (Bahnschrift, DIN Condensed,
  Avenir Next Condensed, Futura…) and a monospace stack for readouts.
- **Autonomy:** Claude merges and deploys each PR after `npm run check` passes and verifies production, per CLAUDE.md,
  and records every release here and in CHANGELOG.md.
## 2026-11-15 02:00 · Record 07 is rebuilt from NASA SVS 5450
- **Decided by:** Jacy's Claude, after Jacy said "start record 07" (same brief: original NASA source, no remixes).
- **What:** *Global Temperature Anomalies from 1880 to 2024* (SVS 5450, Mark SubbaRao and Gavin A. Schmidt), the
  Science On a Sphere frames (plate carrée) plus NASA's `time.txt`; one map per decade 1890–2020 and the 2024 map.
  It tells a different story from record 01 (where warming happened, not the global average) and has a printed
  −2 to +2 °C colour bar.
- **Also decided:** Mystery Record loses its measurement round, because no measurement-only record remains on the
  shelf; it draws from Climate Spiral and Moving Earth until another picture record can be made concealable.

## 2026-11-15 00:46 · Merge and deploy 8.0.0 without waiting for Chia's review
- **Decided by:** Jacy ("Merge both and deploy").
- **What:** PRs #29 (The Ice Year) and #30 (Sound setting) merged and deployed. TEAM-HANDOFF asked record rebuilds to
  wait for review by Chia's Claude; Jacy chose to ship first. Chia's Claude can still review the merged PRs; fix
  forward or revert `208d678` if a problem is found.

## 2026-11-15 00:30 · Sound: Note by note or Continuous
- **Decided by:** Jacy (request: "user can either select the sound be like . . . . . or -----").
- **What:** one shared setting for every jukebox record, stored as `terrajuke-articulation` (`notes` default, `flow`).
  Continuous uses one sustained voice per line (`FlowVoice` in `src/lib/articulation.ts`) that glides to each new
  pitch (45 ms time constant) and fades for rests. Engines read the setting when Play is pressed; single taps,
  Scratch and the legacy `?legacy=1` app always strike notes. In Continuous, the Climate Spiral data melody drops its
  decorative re-strikes; harmony and drums are unchanged.
- **Why it is honest:** articulation is a musical choice like tempo. Every value still makes exactly the pitch its
  fixed rule gives, at the same time; colour, shimmer, loudness and stereo channels still follow the data.

## 2026-11-14 23:20 · Keep a changelog and cut releases
- **Decided by:** Jacy (request in chat).
- **What:** [CHANGELOG.md](../CHANGELOG.md), release notes in [releases/](releases/), this log and GitHub releases
  (`v7.0.0` onwards) are the project's shared memory. Every PR adds to `[Unreleased]`; every app-changing merge to
  `main` is tagged and released. See CLAUDE.md, "Change records".
- **Why:** several people and AI sessions work on the repo; they must be able to rely on written records.

## 2026-11-14 23:10 · Record 06 is rebuilt from NASA SVS 5046 (2024)
- **Decided by:** Jacy's Claude; Jacy was offered SVS 5046 or SVS 3167 and left the choice to Claude.
- **What:** the new Arctic record uses *Daily Arctic Sea Ice, By Year* (SVS 5046, Trent L. Schindler, an EIC daily
  visualization): JAXA AMSR2 sea ice drawn where concentration ≥ 15 %, twelve frames (the 15th of each month of 2024).
- **Why:** current data, EIC relevance and 4K imagery. It has no numeric colour bar, but NASA's ≥ 15 % threshold is
  the standard definition of sea-ice extent, and NASA's own RenderMan camera matrices (in every EXR frame) let each
  pixel be mapped to a latitude, longitude and area. SVS 3167 had a printed concentration scale but only
  600×200 frames ending in 2004.
- **Rules out:** any further use of the project-derived NSIDC September means in the jukebox shelf.
- **Jacy's requirement:** every sound must come from the NASA source itself, not from remixes built earlier, and
  each record must explain its sound with 5W1H (what, who, when, where, why, how).

## 2026-11-14 22:50 · Merge and deploy the two-page redesign (7.0.0)
- **Decided by:** Jacy ("Merge and deploy").
- **What:** Home is the introduction and guide; Listen holds every player.

## 2026-11-14 21:30 · Two pages first, then sources
- **Decided by:** Jacy.
- **What:** redesign Home (introduction plus eye guidance) and Listen (all players) before the record rebuilds;
  then verify every source is truly NASA. "Eye guidance" was left to Claude: a moving spotlight guide, not webcam
  eye tracking. User-friendliness and device compatibility are part of every page change.

## 2026-11-14 21:10 · This repository is the submission
- **Decided by:** Jacy ("follow the GitHub main latest update").
- **What:** an earlier organiser ruling about pre-existing work is resolved; `main` of this repository is judged.
