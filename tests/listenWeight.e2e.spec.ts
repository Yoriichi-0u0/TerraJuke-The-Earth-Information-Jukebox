import {expect,test} from '@playwright/test';

// Listen stays light: the 5.3 MB Moving Earth GIF is fetched only when that record is chosen; the 3D shelf uses a
// 23 kB still taken from the same GIF (public/frames/untethered-stage-960.provenance.json).
test('Listen does not download the Moving Earth GIF until Moving Earth is chosen',async({page})=>{
  const urls:string[]=[];page.on('request',r=>urls.push(r.url()));
  await page.goto('/listen');
  await expect(page.getByRole('heading',{name:'Climate Spiral',exact:true})).toBeVisible();
  await expect(page.locator('.jb-stage')).toHaveAttribute('data-stage-labels','loaded',{timeout:20_000});
  await page.waitForLoadState('networkidle');
  expect(urls.filter(u=>u.includes('/frames/untethered-earth.gif'))).toEqual([]);
  expect(urls.some(u=>u.includes('/frames/untethered-stage-960.webp'))).toBe(true);
  await page.getByRole('button',{name:'Select record: Moving Earth',exact:true}).click();
  await expect.poll(()=>urls.some(u=>/\/frames\/untethered-earth\.(gif|webm)/.test(u)),{timeout:15_000}).toBe(true);
});
