# Space Apps portal draft (paste field by field)

Fields and rules from the official **Project Submission Guide** (read 15 Nov 2026, 14:20 MYT): Project Name,
High-Level Project Summary, Link to Project Demo, Link to Final Project, Detailed Project Description, Use of Super
Intelligence (SI), NASA Data, Space Agency Partner Data and Other References. Everything must be in English; links
must open without sign-in; the demo is a video of 30 seconds or less or at most 7 slides. Uploading and pressing
Submit are for a person to do. Facts below match the live site (TerraJuke 9.0.0 or later).

> **Submitted 15 Nov 2026, 16:56 MYT** (TerraJuke 10.1.1 live), with the text below. Since then Create, Explore Data
> and About were redesigned for all ages (10.2.0–10.4.0) and the tests grew to 155 unit and 193 browser. Nothing
> below became untrue; if you edit before 23:59, the Validity line's counts are the only numbers to refresh.

---

## Project Name

TerraJuke: The Earth Information Jukebox

## High-Level Project Summary

TerraJuke is a web jukebox that turns NASA's Earth Information Center visualizations into music you can play, touch
and understand. Each "record" is a NASA Scientific Visualization Studio picture: climate warming, night lights, the
air we share, ocean heat, Arctic sea ice, a century of temperature change and lightning seen from the Space Station. Press Play and the browser reads the
picture's own colours, often back to real values on NASA's printed colour bars, and turns them into sound live, on
fixed scales: warmer water plays higher, less sea ice plays lower. Side B of each record lets you touch a place to hear
its story. Every note is also written as text, controls work with a keyboard and screen reader, and a 5W1H card says
what you hear, who made the data, when, where, why and how. TerraJuke brings NASA's Earth pictures to people who
cannot see them, and makes every visitor listen more closely to a changing planet.

## Link to Project Demo

https://youtu.be/bZC6O_t4LHc (Public on YouTube, 0:30 as YouTube shows it; file 29.4 s; English subtitles; kit: `docs/video/`)

## Link to Final Project

https://terrajuke.vercel.app (source: https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox)

## Detailed Project Description

**What it does.** Two pages. Home introduces the project and guides the eye with a moving light across a drawn player.
Listen is the jukebox: eight records on a 3D shelf, a player, Play the whole jukebox (every record in turn), Mystery
Record (guess a record by ear), and Your Record (turn a personal image into sound; it never leaves the device).

**How it works.** Everything runs in the browser with the Web Audio API; there are no recordings.
- *Climate Spiral* (SVS 5190): Side A scans the picture's brightness and colour; Side B plays NASA GISTEMP v4
  measurements on a fixed scale.
- *Night Lights* (SVS 5313, EIC Version): colours read on NASA's legend (more light rises, less light falls);
  Side B plays NASA's twelve yearly frames, cross-checked against SVS 5276.
- *The Air We Share* (SVS 5669): four aerosols, read from NASA's colour bar, play four instruments on a mixing desk.
- *Currents of Heat* (SVS 3912): each current's colour is read back to °C on NASA's 0–32 °C bar, pole to pole.
- *Moving Earth*: an Earth Information Center exhibit animation, sampled frame by frame.
- *The Ice Year* (SVS 5046): NASA's own render camera, stored in each frame, lets us measure the sea ice NASA drew
  each month of 2024 in km²; Side B plays any Arctic place's ice season.
- *The Warming Map* (SVS 5450): every map colour read back to a temperature anomaly on NASA's −2 to +2 °C bar;
  the global means read from colour match NASA's GISTEMP within 0.06 °C on average.
- *Storm Drums* (SVS 5011): lightning detected by the ISS Lightning Imaging Sensor, counted from NASA's dots in every
  place; each month opens with a note for the world's lightning, then drums sweep west to east. Tests confirm about
  three quarters of it falls over land and that the storm belt follows the sun north and back.

**Balancing data and music.** Pitches come only from the data, on fixed pentatonic scales so layers stay musical.
Tempo, timbre and the Sound setting (note by note, or one continuous gliding line) are labelled musical choices that
never change which value made which note.

**Accessibility.** Captions and polite screen-reader announcements for every note; every map is a keyboard
instrument; reduced motion stops all animation and 3D has 2D fallbacks; light and dark themes pass automated WCAG 2.1
AA checks. We have not run a user study and claim no learning gains or certification.

**Validity.** Every NASA file is pinned with its source URL, retrieval date and SHA-256; every mapping has unit tests
that check readings against known facts (the Arctic warms fastest, the North Pole keeps its ice, the warm pool is
warmest). 147 unit tests and 177 browser tests run before every release.

**Tools.** TypeScript, React 19, Vite, Three.js with react-three-fiber, Anime.js, lucide-react, Web Audio API,
Playwright and axe-core for testing, Vercel for hosting, macOS sips, cwebp and ffmpeg for preparing NASA images.

### Optional refresh (only if you edit before 23:59)

Replace the first paragraph of the Detailed Project Description with:

> **What it does.** Five pages, each made plain for all ages. Home introduces the project and guides the eye with a
> moving light across a drawn player. Listen is the jukebox: three steps (pick a record, press Play, flip to Side B),
> eight records on a 3D shelf, a player, Play the whole jukebox, Mystery Record and Your Record (a personal image
> that never leaves the device). Create lets you choose the instrument and style while the data still chooses every
> note. Explore Data says each number in a sentence and labels every record as NASA measurements, read from NASA's
> colour scale, counted from NASA's map, or picture brightness only, with charts and CSV downloads. About answers
> "why a jukebox?" and how AI was used.

And in **Validity**, replace the last sentence with: "155 unit tests and 193 browser tests run before every release."

## Use of Super Intelligence (SI)

- **Code and documentation:** written with AI coding assistants under the team's direction: Anthropic Claude
  (Claude Code) for most of the application, tests and documentation, and OpenAI Codex/ChatGPT in earlier development
  and for review comments. The team (Chia Yuen Kai and Jacy Chiong Yet Suu) chose the concept, the NASA sources and
  every product decision; decisions are logged in `docs/DECISION-LOG.md`.
- **Images:** the TerraJuke icon/artwork and the vinyl record surface were generated with ChatGPT image generation.
  Each carries a visible "AI-GENERATED" watermark or "AI" badge; provenance in `public/brand/` and `public/art/`.
- **Audio:** in the app, none generated by SI; all sound is synthesized live from the data by our code (itself
  AI-assisted, as above). In the demo video, the music is that live app sound, and the **narration voice is AI
  text-to-speech** (Kokoro, run locally) reading the team's script; the video was assembled with AI assistance
  (Claude Code). The video's file metadata and description say so.
- **Data:** no SI-generated data; all values come from NASA files or are read from NASA's pictures by tested code.
- No NASA logos or insignia are used.

## NASA Data

- NASA Earth Information Center Content Database (the challenge's main resource), via the SVS gallery:
  - SVS 5190 NASA Climate Spiral (Climate Vital Signs): https://svs.gsfc.nasa.gov/5190/
  - SVS 5313 Change in Night Lights 2012–2023, EIC Version: https://svs.gsfc.nasa.gov/5313/ (cross-check SVS 5276)
  - SVS 5046 Daily Arctic Sea Ice (EIC Daily Visualizations): https://svs.gsfc.nasa.gov/5046/
  - SVS 3912 Global Sea Surface Currents and Temperature: https://svs.gsfc.nasa.gov/3912/
- Other challenge resources: SVS 5669 GEOS Aerosols: https://svs.gsfc.nasa.gov/5669/; SVS 5011 Lightning Events
  Detected from the ISS 2017–2023 (made also for the EIC display): https://svs.gsfc.nasa.gov/5011/
- SVS 5450 Global Temperature Anomalies from 1880 to 2024 (GISTEMP): https://svs.gsfc.nasa.gov/5450/
- NASA GISS Surface Temperature Analysis (GISTEMP v4): https://data.giss.nasa.gov/gistemp/
- NASA Earth Observatory Blue Marble (optional globe view)
- Earth Information Center exhibit animation (Moving Earth), via an attributed archive of earth.gov assets

## Space Agency Partner Data and Other References

- **JAXA** (2026 Space Agency Partner): GCOM-W1 "SHIZUKU" AMSR2 sea-ice concentration and 89 GHz brightness
  temperature, as visualized by NASA SVS 5046 (record 06, The Ice Year).
- NSIDC Sea Ice Index (Arctic guided story under Explore Data), NOAA GHCN and ERSST (inputs to GISTEMP).
- Natural Earth 1:110m land (public domain) for coastlines and the sea-ice land mask.
- Inspiration: NASA's Data Sonification: Caldwell 73 (challenge resource).
- Open-source libraries listed under Tools; Internet Archive raw captures used to retrieve NASA files when
  svs.gsfc.nasa.gov was unreachable (hashes recorded).
