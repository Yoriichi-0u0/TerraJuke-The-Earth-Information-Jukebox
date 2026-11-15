# Submission checklist: 15 November 2026 (MYT)

## Final verification (15 Nov 2026, 19:05 MYT)

The project **was submitted for judging at 16:56** ("Project Submitted for Judging" banner; screenshot kept by
Chia) and **resubmitted at 19:13** with typo and link fixes only (see below). The 19:13 submission is the one judged. Edits and resubmission stay open until **23:59**; only the last submission is judged. Claude checked
everything that can be checked without signing in to the portal:

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Final project link opens signed out | ✅ | https://terrajuke.vercel.app returns 200; all five pages load |
| 2 | Live site is the latest `main` | ✅ | TerraJuke 10.4.0; live bundle `index-CataseTm.js` equals a fresh build of `main` (`beb0561`) |
| 3 | Source code is public | ✅ | GitHub repo `PUBLIC`, opens signed out |
| 4 | Demo video is public, plays signed out, 30 s or less | ✅ | https://youtu.be/bZC6O_t4LHc: Public, not private or unlisted, playability OK, 29 s; title "TerraJuke: The Earth Information Jukebox (NASA Space Apps 2026, Team BoboMimi)" |
| 5 | At least one NASA data source | ✅ | Seven SVS visualizations (5190, 5313, 5046, 3912, 5669, 5450, 5011) and GISTEMP v4, listed in [PORTAL-DRAFT.md](PORTAL-DRAFT.md) |
| 6 | NASA files are the pinned originals | ✅ | 112 hashes in the provenance files match the bundled files (0 mismatches) |
| 7 | AI use disclosed; AI images watermarked; no NASA logos | ✅ | SI section of the portal draft (code, watermarked icon and vinyl art, AI narration voice); watermarks since 10.0.0 |
| 8 | Everything in English | ✅ | App is English only; video has English captions |
| 9 | Eligibility | ✅ | This repository is the submission (DECISION-LOG, 14 Nov 21:10; Jacy) |
| 10 | Submitted project page shows **this** project (checked 19:20 in the signed-in browser pane, read-only, at Jacy's request) | ✅ | Team page `spaceappschallenge.org/2026/find-a-team/bobomimi/?tab=project`: title "TerraJuke: The Earth Information Jukebox"; summary, Project Demonstration https://youtu.be/bZC6O_t4LHc, Project https://terrajuke.vercel.app, details with the code link, SI text, NASA data and references all match [PORTAL-DRAFT.md](PORTAL-DRAFT.md). The 14 Nov draft text is gone. The page is also public signed out (title and both links served) |
| 11 | Team, event, challenge | ✅ | Members: Chia Yuen Kai (owner) and Jacy Chiong; Local Event Bintulu, Malaysia; challenge The Earth Information Jukebox; profile shows "Projects Submitted: 1" |

**Still for a person (Claude cannot see the signed-in portal):**

- [x] ~~Open the submitted project page signed in and read every field.~~ Done by Claude at 19:20 (rows 10–11).
  **Typos found on the live project page** (letters lost when pasting; the meaning is clear, and nothing else is
  wrong): NASA Data: "Visulizations" → Visualizations, "Temprature" → Temperature, "from the IS 2017-2023" → ISS,
  "from 180 to 2024" → 1880, "exhibitanimation" → exhibit animation, "Next Generation globe view)" → "(globe view)";
  references: "as visualied" → visualized, "Eplore Data" → Explore Data, "deo video" → demo video,
  "watermarkedartwork" → watermarked artwork. **Fixed and resubmitted at 19:13** by Claude at Jacy's request ("Yes,
  fix and resubmit"), together with an eleventh fix: the Blue Marble link pointed to `.../ble-marble-...` (404) and
  now points to `.../blue-marble-next-generation/base-topography/` (200). Only those 11 entries were changed; the
  summary, details, demo and project links and the declarations were left as submitted. The panel shows "Last
  Submitted: 15 November 2026 19:13" and the banner "Project Submitted for Judging!"; the public page (signed out)
  shows every correction and none of the old typos. Every other link on the page returns 200 (the Internet Archive
  and Natural Earth only refuse automated checks).
- [ ] ~~(old item kept for the record)~~ **Open the submitted project page signed in and read every field.** On 14 Nov a *different* draft was saved
  there (name "TerraJuke: One Earth. Every Sense. Everyone.", link terrajuke-2026.vercel.app, NASA data only
  SVS 5313). Make sure the submitted page shows **this** project: name "TerraJuke: The Earth Information Jukebox",
  Final Project https://terrajuke.vercel.app, Demo https://youtu.be/bZC6O_t4LHc, and the summary, description,
  SI, NASA data and references from [PORTAL-DRAFT.md](PORTAL-DRAFT.md).
- [x] Team roster (Chia Yuen Kai, Jacy Chiong Yet Suu), Local Event Bintulu, challenge *The Earth Information
  Jukebox* (row 11).
- [ ] **SSC, before 21:00:** team photo posted in Discord `#team-photo`.
- [ ] Open the video in a private window and turn on subtitles: English subtitles appear.
- [ ] Optional, before 23:59: paste the refreshed "What it does" and "Validity" text from
  [PORTAL-DRAFT.md](PORTAL-DRAFT.md) (section "Optional refresh"), then press **Submit for Judging** again and wait
  for the banner. Skip this if anything is unclear: the 16:56 submission is valid as it is.
- [ ] Optional: a real-phone check and a VoiceOver check, logged in `docs/evidence/`.

Details of each step follow.


Two separate tracks. **SSC** (Sarawak Space Challenge, local XP) counts the NASA submission automatically, but its
deadline is earlier. **Do everything before 21:00 MYT.** Tick each box in this file or in the team chat.

| When | Track | Item |
|---|---|---|
| **before 21:00** | SSC | Team photo posted in Discord `#team-photo` (no one under 18 in anything sent to NASA) |
| **before 21:00** | SSC + NASA | NASA project submitted (SSC counts it for the final-submission XP) |
| before 23:59 | NASA | Last chance to edit and resubmit on the NASA portal |

## 1. The app (done by Claude; re-check in 2 minutes)

- [x] https://terrajuke.vercel.app opens with no sign-in (checked 19:05). Home → **Open the jukebox** → Listen.
- [ ] Press **Play record** on Climate Spiral: you hear sound. Try one more record (The Warming Map).
- [ ] On a real phone: the page fits, Play is visible, a Side B tap works.
- [x] Source: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox is **public** (checked 15 Nov 19:05).

## 2. Demo video (30 seconds or less; longer = ineligible)

- [ ] Watch the narrated cut: `TerraJuke-video-studio/terrajuke-30s/out/terrajuke-demo-30s-narrated.mp4` on
  Jacy's Mac (30.0 s, real app footage and sound, AI narration voice, captions). Listen for how "TerraJuke" and
  "BoboMimi" are pronounced. Or record your own with `docs/video/SHOT-LIST.md`. Check:
  - [ ] Duration **≤ 0:30** (check the exported file, not the editor timeline)
  - [ ] English captions on screen
  - [ ] Team name **BoboMimi** and both names appear; challenge named; title **TerraJuke**
  - [ ] Shows the real app and real sound; no NASA logo added; AI-generated art only with its watermark
  - [ ] The end card's small print mentions AI assistance. The narration voice is AI: say so in the YouTube description
  and the portal's SI field (already in `docs/PORTAL-DRAFT.md`); the MP4's own metadata says so too.
  - [ ] No person under 18 visible or heard
- [x] Done 15 Nov: **https://youtu.be/bZC6O_t4LHc**, Public, with `docs/video/terrajuke-demo-29s.srt` as English subtitles. The 30.0 s file showed as 0:31 on YouTube, so it was sped up 2% to 29.4 s (shows 0:30; nothing cut, metadata kept): `terrajuke-demo-29s-narrated.mp4`. The 0:31 upload stays a private draft.
- [x] Upload to **YouTube (Public or Unlisted)** or Google Drive ("Anyone with the link"). Title: "TerraJuke: The Earth
  Information Jukebox (NASA Space Apps 2026, Team BoboMimi)". On YouTube, also upload
  `docs/video/terrajuke-demo.srt` as English subtitles. Description line: "Footage and music: the live TerraJuke
  app. Narration: AI text-to-speech (Kokoro). Edited with AI assistance (Claude Code)."
- [ ] Open the link in a **private window**: it must play without signing in.

## 3. NASA portal (a signed-in team member does this)

Paste from [`docs/PORTAL-DRAFT.md`](PORTAL-DRAFT.md), field by field:

- [ ] Project Name
- [ ] High-Level Project Summary
- [ ] Link to Project Demo → https://youtu.be/bZC6O_t4LHc
- [ ] Link to Final Project → https://terrajuke.vercel.app (and the GitHub link in the description)
- [ ] Detailed Project Description
- [ ] Use of Super Intelligence (SI): answer honestly (Claude, Codex/ChatGPT, ChatGPT images with watermarks; any AI voice in the video)
- [ ] NASA Data (SVS 5190, 5313, 5046, 3912, 5669, 5450, 5011; GISTEMP v4)
- [ ] Space Agency Partner Data and Other References (JAXA AMSR2 via SVS 5046; NSIDC; Natural Earth; libraries)
- [ ] Everything in English
- [ ] Team roster correct (Chia Yuen Kai, Jacy Chiong Yet Suu), Local Event Bintulu, challenge *The Earth Information Jukebox*
- [x] Press **Submit for Judging** and **wait for the success message**. Take a screenshot of it. Done: "Project Submitted for Judging", last submitted **15 November 2026, 16:56** (screenshot kept by Chia, not in the repo).
- [x] Submitted 15 Nov 2026 16:56 MYT with https://terrajuke.vercel.app and https://youtu.be/bZC6O_t4LHc. Note the time and the live version (TerraJuke 10.1.0 or later) in `project-library/challenge-plan/TerraJuke-Submission-Tracker-2026.md`.

## 4. After submitting

- [ ] Reopen the project page logged out: the demo and project links work.
- [ ] Do not replace a valid submission with something unfinished. If you resubmit an improvement, re-check every link.
- [ ] Optional, if time allows: a VoiceOver check (see `docs/USER_TEST_PROTOCOL.md`), logged in `docs/evidence/`.
