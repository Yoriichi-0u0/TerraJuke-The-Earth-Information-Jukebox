// Burn a visible "AI-generated" watermark into TerraJuke's AI-generated images (Space Apps rule: SI images must carry
// a visible watermark). Draws on a canvas in headless Chromium so no image library is needed.
// Usage: node scripts/watermark-si.mjs   (idempotent only on the originals: keep them in git history)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const jobs = [
  { file: 'public/art/terrajuke-vinyl-surface.jpg', type: 'image/jpeg', text: 'AI-GENERATED ART', badge: false },
  { file: 'public/brand/terrajuke-art-1200.jpg', type: 'image/jpeg', text: 'AI-GENERATED ARTWORK', badge: false },
  { file: 'public/brand/terrajuke-touch-180.png', type: 'image/png', text: 'AI', badge: true },
  { file: 'public/brand/terrajuke-mark-512.png', type: 'image/png', text: 'AI', badge: true },
  { file: 'public/brand/terrajuke.png', type: 'image/png', text: 'AI', badge: true },
];
const browser = await chromium.launch(); const page = await browser.newPage();
for (const job of jobs) {
  const src = `data:${job.type};base64,${readFileSync(job.file).toString('base64')}`;
  const out = await page.evaluate(async ({ src, job }) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const g = c.getContext('2d');
    g.drawImage(img, 0, 0); const w = c.width, h = c.height;
    if (job.badge) {
      // A round badge in the lower right corner: white "AI" on near-black, readable even at 16 px.
      const r = Math.round(w * 0.2), cx = w - r - Math.round(w * 0.02), cy = h - r - Math.round(h * 0.02);
      g.fillStyle = '#0b0820'; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
      g.lineWidth = Math.max(1, w * 0.012); g.strokeStyle = '#ffffff'; g.stroke();
      g.fillStyle = '#ffffff'; g.font = `700 ${Math.round(r * 1.05)}px Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(job.text, cx, cy + r * 0.04);
    } else {
      const size = Math.round(w * 0.045), pad = Math.round(size * 0.6); g.font = `700 ${size}px Arial, sans-serif`;
      const tw = g.measureText(job.text).width, bw = tw + pad * 2, bh = size + pad, x = (w - bw) / 2, y = h * 0.86;
      g.fillStyle = 'rgba(11,8,32,0.78)'; g.beginPath(); g.roundRect(x, y, bw, bh, bh / 2); g.fill();
      g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(job.text, w / 2, y + bh / 2 + size * 0.04);
    }
    return c.toDataURL(job.type, 0.9);
  }, { src, job });
  writeFileSync(job.file, Buffer.from(out.split(',')[1], 'base64')); console.log('watermarked', job.file);
}
await browser.close();
