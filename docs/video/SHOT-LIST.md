# TerraJuke demo video: 30-second shot list

**Hard limit: 30 seconds or less.** The official Project Submission Guide says a longer video makes the project
ineligible for Global Judging. The beats below follow the guide's own structure (0:00 intro, 0:02 challenge,
0:05 title, 0:10 how it works with NASA data, 0:20–0:30 the future). Captions: [`terrajuke-demo.srt`](terrajuke-demo.srt).
Cards: [`CARDS.md`](CARDS.md).

## The produced cut (15 November 2026)

A first cut already exists: exactly 30.0 s, 1920 × 1080, recorded from the live site by Playwright with the app's
own Web Audio output as the soundtrack, cards and captions burned in. A narrated version adds an AI text-to-speech
voice (Kokoro, run locally) reading the voice lines below; the app sound ducks under it. Jacy chose the voice and asked
for no on-screen AI label; the SI section of the portal and the video metadata acknowledge it. It follows the shots below except
0:20–0:25, which shows **Storm Drums** (Play the storm year) instead of The Ice Year. It is rebuilt with the scripts in
the separate `TerraJuke-video-studio` repository, folder `terrajuke-30s/` (see its README). To add your own voices,
record to the caption timings and mix them over that soundtrack; keep the export at 30 s or less. The narrated cut's
timings are in `docs/video/terrajuke-demo.srt`.

## Before recording (a person must do this; test browsers are silent)

- Browser at **1920 × 1080**, zoom 100%, notifications off (Focus mode), cursor visible.
- Open https://terrajuke.vercel.app in one tab. **Appearance: Dark. Motion effects: on. Sound: Note by note.**
  Volume about 70%. Headphones off so the recording captures the system audio cleanly.
- Recorder with system audio: **OBS** (macOS 13+: *macOS Screen Capture* source with audio on) or QuickTime plus a
  loopback device. Plain QuickTime screen recording does not capture system audio.
- Do one silent dry run of the clicks below; then record 2–3 takes and keep the best.
- The record art on Climate Spiral is AI-generated and carries a visible "AI-GENERATED ART" watermark; the shots below
  avoid it anyway. Do not add NASA logos anywhere in the video.

## Shots

| Time | Screen (exact action) | Voice (≈ 2.4 words per second) |
|---|---|---|
| 0:00–0:02 | Title card (CARDS.md, card 1) | "Hi! We're Chia and Jacy, team BoboMimi." |
| 0:02–0:05 | https://terrajuke.vercel.app Home; the glowing guide dot moves across the drawn player | "Our challenge: the Earth Information Jukebox." |
| 0:05–0:10 | Hold on the hero headline, then click **Open the jukebox** | "This is TerraJuke. Hear NASA's view of our planet." |
| 0:10–0:15 | On Listen, click the shelf record **The Warming Map**, then **Play pole to pole**; let 4–5 bands sound, the globe turning | "Pick a NASA picture and press Play. Warmer places play higher notes." |
| 0:15–0:20 | Click **Side B: touch a place**, then tap central Europe on the map: the decades rise | "Touch any place to hear its story, from 1890 to today." |
| 0:20–0:25 | Click the shelf record **The Ice Year**, press **Play the ice year** for 3 beats; the month bars shrink to September | "Eight NASA records, with captions and keyboard control." |
| 0:25–0:30 | End card (CARDS.md, card 2) over the last notes | "Imagine every Earth Information Center screen, one you could also hear. TerraJuke!" |

Total spoken: about 60 words. If a take runs long, cut the 0:20–0:25 shot first.

## After recording

- Trim to **≤ 0:30** (check the exported duration, not the editor's timeline).
- Burn in or attach the English captions (`terrajuke-demo.srt`).
- Export 1920 × 1080 H.264, upload to YouTube (Unlisted is fine only if the link opens without sign-in; Public is
  safest) or Google Drive with "Anyone with the link".
- Open the link in a private window to confirm it plays without signing in, then paste it into the portal's
  "Link to Project Demo" field.
