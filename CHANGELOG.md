# Changelog

All notable changes to TerraJuke (called Earth FM until 13 November 2026) are recorded here, newest first.
This file, [docs/releases/](docs/releases/) and [docs/DECISION-LOG.md](docs/DECISION-LOG.md) are the project's
authoritative record. A person or AI joining the project can rely on them without asking again; if they ever
disagree with the code or the live site, the code and the live site win and the record must be corrected.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions: `MAJOR` = a new TerraJuke edition
(a new record or a new page structure), `MINOR` = new features within an edition, `PATCH` = fixes, tests and docs.
Versions before 7.0.0 were numbered retroactively on 14 November 2026 from the merge history; only 7.0.0 onwards
have git tags and GitHub releases. Times are MYT (UTC+8). How to cut a release: [docs/releases/README.md](docs/releases/README.md).

## [Unreleased]

## [10.4.1] - 2026-11-15 19:50 · PRs #54, #55, #56, #57, #58 · live

Listen 5 MB lighter; submission records. Production: merge `889d589`, bundle `index-CO58xPMo.js`.
Notes: [docs/releases/v10.4.1.md](docs/releases/v10.4.1.md).

### Fixed
- **Listen is about 5 MB lighter.** The 3D record shelf used Moving Earth's 5.3 MB animated GIF as a flat sleeve
  texture, so every visit to Listen downloaded it. The sleeve now uses a 23 kB still from the same GIF (provenance
  in `public/frames/untethered-stage-960.provenance.json`); the GIF loads only when Moving Earth is chosen. A test
  checks it.

### Changed
- Space Apps project page resubmitted at 19:13 with ten typos fixed in its NASA Data and references lists and the
  broken Blue Marble link corrected; nothing else on the page changed.
- The submitted Space Apps project page was checked (19:20, read-only): it shows TerraJuke with the right demo,
  project and code links, roster and challenge, and is public signed out; ten small typos in its data lists are
  listed in the submission checklist.
- Final submission check (19:05): everything public was verified signed out (site, code, video 29 s, NASA sources,
  hashes, AI disclosure) and recorded at the top of the submission checklist, with the steps only a signed-in person
  can do; the portal draft gains an optional refreshed description.
- Records tidied after 10.4.0: the release index and changelog links now include 10.1.0–10.4.0; SUBMISSION.md
  says eight records, the five all-ages pages, the public video and current test counts (155 unit, 193 browser);
  the portal draft notes the 16:56 submission; the handoff has a current status section; source verification lists
  the current shelf and a fresh hash check (112 files, 0 mismatches).

## [10.4.0] - 2026-11-15 19:00 · PRs #50, #51, #52 · live

About for all ages; the Space Apps project was submitted at 16:56. Production: merge `c7310dc`, bundle
`index-CataseTm.js`. Notes: [docs/releases/v10.4.0.md](docs/releases/v10.4.0.md).

### Added
- The submission checklist records the NASA Space Apps submission at 15 Nov 2026 16:56 MYT (PR #50, by the team).

### Changed
- **About is rewritten for all ages.** It answers "why a jukebox?" in three cards (pick a record, hear it, check it),
  lists the eight records with their sources and links to hear each one, explains the two ways to listen (the
  picture, the numbers), says how TerraJuke is made for everyone and how AI was used (code, watermarked artwork,
  the demo's narration voice; no data or in-app sound), and introduces Team BoboMimi with links to the demo video and
  the source code. The old "Earth Stations" section is folded into Science and sources.

## [10.3.0] - 2026-11-15 18:20 · PRs #47, #48, #49 · live

Explore Data for all ages; the demo video is public. Production: merge `0a01aa0`, bundle `index-RfDQ54Yk.js`.
Notes: [docs/releases/v10.3.0.md](docs/releases/v10.3.0.md).

### Added
- The demo video is public on YouTube (https://youtu.be/bZC6O_t4LHc), with matching English subtitles
  (`docs/video/terrajuke-demo-29s.srt`); the portal draft and checklist link it (PR #47, uploaded by the team).
- **Explore Data: "All eight records, and what their numbers are."** Each record says which kind of number it plays
  (NASA measurements, read from NASA's colour scale, counted from NASA's map, or picture brightness only). The four
  records with a pinned series (Climate Spiral, The Ice Year, The Warming Map, Storm Drums) show a small chart, a
  one-line takeaway computed from the same data, and a CSV download; every card links to hear the record and to
  its NASA source.

### Changed
- Explore Data uses the same two big data buttons as Create instead of the "Earth Station" menu, starts with three
  steps (pick a month, read the number, hear its note), and says the number in a sentence, for example "January
  2025 was 1.37 °C warmer than an average January in 1951–1980."

## [10.2.0] - 2026-11-15 17:40 · PRs #45, #46 · live

Create for all ages. Production: merge `766dafd`, bundle `index-CkT6gDW-.js`.
Notes: [docs/releases/v10.2.0.md](docs/releases/v10.2.0.md).

### Changed
- **Create is easier for all ages.** It opens with three steps (pick the data, pick a sound, play and save), two
  big choices for the data (Earth's temperature from NASA GISTEMP, or Arctic sea ice from the NSIDC Sea Ice Index)
  instead of the "Earth Station" menu, and a plain box saying what you change (instrument, style, speed, echo) and
  what the data decides (which note plays). A new card leads to Your Record on Listen, which now scrolls into view
  with its button ready.

## [10.1.1] - 2026-11-15 16:55 · PRs #43, #44 · live

Globe fix and narrated demo. Production: merge `0285579`, bundle `index-BsR9y5Yq.js`.
Notes: [docs/releases/v10.1.1.md](docs/releases/v10.1.1.md).

### Fixed
- The 3D globe went blank whenever its NASA map changed: on Side B of The Warming Map (each decade) and while Storm
  Drums moved from month to month. It now keeps showing the previous map until the next one has loaded. A test
  samples every frame to make sure it never disappears.

### Changed
- Demo video: narration added (an AI text-to-speech voice reading the team's script, acknowledged in the portal's
  SI section and the video's metadata); captions match the spoken words.

## [10.1.0] - 2026-11-15 16:00 · PRs #41, #42 · live

Easier for all ages, plus the submission kit. Production: merge `22cf545`, bundle `index-CTxge_2e.js`.
Notes: [docs/releases/v10.1.0.md](docs/releases/v10.1.0.md).

### Added
- [docs/SUBMISSION-CHECKLIST.md](docs/SUBMISSION-CHECKLIST.md): what a person must still do before the 21:00 MYT
  deadline (team photo, video upload, the eight portal fields, Submit for Judging).
- A first 30-second demo cut, recorded from the live site with its own sound and English captions (made in the
  separate video studio repository; see the shot list).

### Changed
- Demo caption 4 now says the colours are read on NASA's own scale, instead of "become real values".
- **Easier for all ages** (mentor feedback: the public found it hard to understand, and "why a jukebox?"). Listen now
  starts with three steps (pick a record, press Play, flip to Side B) and one line on why it is a jukebox; the first
  record says START HERE; shelf subtitles, side names and captions use plain words; the Sound setting moved under
  "More sound options"; small labels are at least 11–12 px; Home explains the idea in everyday language.
- Low-memory phones (2 GB or less) skip the decorative 3D shelf; the record list does the same job.

## [10.0.1] - 2026-11-15 15:15 · PR #39 · live

Phone map fix. Production: merge `4138edc`, bundle `index-fEe7sCWD.js`. Notes: [docs/releases/v10.0.1.md](docs/releases/v10.0.1.md).

### Fixed
- On phones, The Warming Map's and Storm Drums' NASA map collapsed to zero height, so Side B could not be touched.
  Found by the live QA sweep ([docs/evidence/qa-2026-11-15.md](docs/evidence/qa-2026-11-15.md)); tests now check
  every map keeps its 2:1 shape on every screen.

## [10.0.0] - 2026-11-15 14:36 · PRs #35, #36, #37

Storm Drums, AI watermarks and the submission kit. Production: https://terrajuke.vercel.app, merge `3389950`,
bundle `index-YNGiaFMz.js`. Notes: [docs/releases/v10.0.0.md](docs/releases/v10.0.0.md).

### Added
- Record 08 **Storm Drums** from NASA SVS 5011 (*Lightning Events Detected from the ISS 2017–2023*, a challenge
  Resource): twelve 2022 frames extracted from NASA's Science On a Sphere movie with its `labels.txt`. Side A: each
  month a note for the world's lightning, then 18 drums sweep west to east; Side B: a place's storm months.
  [docs/STORM-DRUMS.md](docs/STORM-DRUMS.md).

### Added
- Submission kit: a 30-second demo shot list, English captions and title/end cards in `docs/video/`, and the portal
  text for all eight fields in `docs/PORTAL-DRAFT.md` (official limit: video ≤ 30 s or ≤ 7 slides).

### Changed
- AI-generated images (vinyl record art, TerraJuke icon and artwork) now carry a visible "AI-GENERATED" watermark or
  "AI" badge, as the Space Apps rules require (`scripts/watermark-si.mjs`).

## [9.0.0] - 2026-11-15 02:15 · PRs #32, #33

The Warming Map and the Aurora Broadcast identity. Production: https://terrajuke.vercel.app, merge `4b9d8a2`,
bundle `index-DuYvgp-e.js`. Notes: [docs/releases/v9.0.0.md](docs/releases/v9.0.0.md).

### Changed
- **New visual identity, "Aurora Broadcast"**, replacing the Apple-style look (Jacy: "scrap the Apple-like design").
  A night-radio jukebox lit by the northern lights: deep indigo night with aurora accents (teal, violet, magenta,
  amber) and a warm cream "Daylight Radio" light mode; condensed display headlines with aurora-gradient words; a
  drifting aurora sky and starfield behind every page; chasing marquee lights under the header; the player framed as
  a jukebox arch whose aurora rim breathes while it plays; glowing gradient transport buttons; sleeves that spin on
  hover; a live equalizer under the Home hero. All motion stops under reduced motion; text keeps WCAG AA contrast.

### Added
- Record 07 **The Warming Map** from NASA SVS 5450 (*Global Temperature Anomalies from 1880 to 2024*, GISTEMP v4),
  replacing *Temperature Through Time*. Every colour is read back to °C on NASA's printed −2 to +2 °C bar. Side A:
  34 bands pole to pole for any decade (the Arctic rings highest). Side B: touch a place to hear its 15 decades,
  1890 to 2024. Global means read from colour agree with NASA's GISTEMP within 0.06 °C on average.
  [docs/WARMING-MAP.md](docs/WARMING-MAP.md).

### Removed
- *Temperature Through Time* from the shelf, the jukebox data deck, and Mystery Record's measurement round (Mystery
  now draws from Climate Spiral and Moving Earth). The GISTEMP numbers stay as Climate Spiral's Side B.
- With this, every record on the shelf is built from an original NASA visualization (Moving Earth via an attributed
  mirror of an EIC animation).

## [8.0.0] - 2026-11-15 00:46 · PRs #29, #30

The Ice Year, About this sound, and the Sound setting. Production: https://terrajuke.vercel.app, merge `208d678`,
bundle `index-CFCACNwB.js`. Notes: [docs/releases/v8.0.0.md](docs/releases/v8.0.0.md).

### Added
- Record 06 **The Ice Year** from NASA SVS 5046 (*Daily Arctic Sea Ice*, JAXA AMSR2, 2024), replacing the
  NSIDC-derived *Arctic September*. Side A: twelve months, the ice area NASA drew north of 50°N (measured through
  NASA's own RenderMan camera) sets pitch: 13.6 million km² in March to 3.9 in September. Side B: touch or arrow-key
  any Arctic place to hear its ice season. [docs/ARCTIC-ICE.md](docs/ARCTIC-ICE.md).
- **Sound: Note by note or Continuous** under Play on every record (remembered on the device). Note by note
  strikes each value as its own note (• • •); Continuous joins them into one line that glides from value to value
  (━━━), with rests where there is no value. Pitches, timing, loudness and stereo still come from each record's fixed
  rules; only how notes join changes. Applies from the next Play; single taps and Scratch always strike.
- **About this sound (5W1H)** under every record: What, Who, When, Where, Why and How, from each record's
  provenance (`src/data/soundStories.ts`).

### Removed
- *Arctic September* from the shelf, the jukebox data deck and Mystery Record (Mystery now draws from Climate Spiral,
  Moving Earth and Temperature Through Time). The NSIDC series stays only in the Arctic guided story.

## [7.0.1] - 2026-11-14 23:22 · PR #28 · docs only

### Added
- Change records: this changelog, release notes in `docs/releases/`, the decision log, and
  [docs/SOURCE-VERIFICATION.md](docs/SOURCE-VERIFICATION.md) (all seven records checked on 14 Nov 2026).
- CLAUDE.md rule: every pull request updates `[Unreleased]`; every merge to `main` that changes the app cuts a release.

## [7.0.0] - 2026-11-14 22:58 · PR #27

Two-page redesign. Production: https://terrajuke.vercel.app, merge `8ec8e34`, bundle `index-MnTVyrhU.js`.
Notes: [docs/releases/v7.0.0.md](docs/releases/v7.0.0.md).

### Changed
- Home (`/`) is an introduction instead of a player: what TerraJuke does for the challenge, a "follow the light"
  guide (a glowing dot moves across a drawn player: choose, play, follow the scan, explore by hand), the two kinds
  of sound, and the seven-record shelf linking to `/listen?record=<id>`.
- Listen (`/listen`) is the jukebox with every player. `?station=climate|arctic` and `?visual=motion` still open the
  guided stories.

### Added
- **Guide me** on Listen (and `/listen?guide=1`): a spotlight on the real controls, one at a time; silent, skips
  hidden controls, Escape closes and returns focus.
- `tests/home.e2e.spec.ts`: 7 screens × light/dark (no sideways scroll, ≥44 px targets, axe), also in the opt-in
  emulated WebKit/Android projects.

### Removed
- The station directory (`/listen?station=all` now shows the jukebox), `StudioWelcome`, `StationLibrary`.

### Fixed
- "Guide me" hidden on phones by an older rule; landscape tour never auto-played; guide card off-screen at 320 px.

## [6.0.1] - 2026-11-14 22:19 · PRs #24, #25, #26

### Added
- Currents of Heat responsive and accessibility test, 320–1440 px (#24).
- [docs/TEAM-HANDOFF.md](docs/TEAM-HANDOFF.md): Jacy's Claude takes over; tasks and two-session rules (#25, #26).

## [6.0.0] - 2026-11-14 20:25 · PR #23 · "TerraJuke 6"

### Added
- Record 04 **Currents of Heat** from NASA SVS 3912 (ECCO2): temperature read from NASA's 0–32 °C colour bar,
  pole to pole on Side A, touch the ocean on Side B. [docs/OCEAN.md](docs/OCEAN.md).

### Changed
- The 3D record rack loads when the page is idle, and not at all under Save-Data.

## [5.0.0] - 2026-11-14 19:30 · PR #22 · "TerraJuke 5"

### Added
- **Play the whole jukebox** (Jukebox Show): every record in turn with title cards, announcements and a show bar.
- **Meet the four instruments** on The Air We Share.

## [4.0.1] - 2026-11-14 19:17 · PR #21

### Changed
- Browser tests run against a production build in two phases (`@timing` tests gentler); quick mode; silent audio.

### Fixed
- Earth Looper replay no longer aborts on a single late note (threshold 120 → 500 ms).

## [4.0.0] - 2026-11-14 18:06 · PR #20 · "TerraJuke 4"

### Added
- Record 03 **The Air We Share** from NASA SVS 5669 (GEOS aerosols): four aerosols, four instruments, a turning
  Three.js Earth, NASA's six stories on Side B. [docs/AIR.md](docs/AIR.md).
- **Record Journey** strip ("from orbit to your ears"); new TerraJuke icon (AI artwork, credited).

### Changed
- Appearance is a segmented Auto · Light · Dark control.

### Removed
- Simplified Chinese; the interface is English only.

## [3.1.0] - 2026-11-14 17:06 · PR #19

### Changed
- Renamed Earth FM → TerraJuke (display names, package, storage keys with `earth-fm-*` fallback); CLAUDE.md replaces AGENTS.md.

## [3.0.0] - 2026-11-14 16:24 · PR #18 · "TerraJuke 3"

### Added
- Record 02 **Night Lights** from NASA SVS 5313 (EIC Version): change map on Side A, NASA's twelve yearly frames
  on Side B, Mystery Place, SVS 5276 cross-check. [docs/NIGHT-LIGHTS.md](docs/NIGHT-LIGHTS.md).
- Tempo and meter as labelled musical choices; the Three.js 3D jukebox stage. (Stack #8–#17 included.)

## [2.2.0] - 2026-11-08 · Earth FM Jukebox Day and Night
- Jukebox layout with day and night appearance; final visual polish.

## [2.1.0] - 2026-11-02 · Earth FM five pages
- Five pages (Home, Listen, Create, Explore Data, About), NASA observatory visuals, guided learning, Earth Stations
  with Arctic listening.

## [2.0.0] - 2026-11-01 · Earth Symphony Studio beta
- Selectable tones, unified visual and climate listening, English/Chinese interface.

## [1.0.0] - 2026-10-14 · Earth FM
- First visual and climate sonification, connected to GitHub and Vercel; `main` is the single production branch.

[Unreleased]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/compare/v10.4.1...main
[10.4.1]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v10.4.1
[10.4.0]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v10.4.0
[10.3.0]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v10.3.0
[10.2.0]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v10.2.0
[10.1.1]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v10.1.1
[10.1.0]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v10.1.0
[10.0.1]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v10.0.1
[10.0.0]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v10.0.0
[9.0.0]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v9.0.0
[8.0.0]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v8.0.0
[7.0.0]: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox/releases/tag/v7.0.0
