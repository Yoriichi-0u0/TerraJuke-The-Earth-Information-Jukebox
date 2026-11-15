import {expect,test} from '@playwright/test';

// About (all ages): why a jukebox, the eight records, access, AI use, the team, and the sources.
test('About answers "why a jukebox?", lists the eight records and links the demo and the code',async({page})=>{
  await page.goto('/about');
  await expect(page.getByRole('heading',{level:1})).toHaveText('A jukebox for Earth information.');
  await expect(page.getByRole('list',{name:'How TerraJuke works'}).getByRole('listitem')).toHaveCount(3);
  const records=page.getByRole('region',{name:'The eight records'});
  await expect(records.getByRole('listitem')).toHaveCount(8);
  await expect(records.getByRole('link',{name:'Storm Drums',exact:true})).toHaveAttribute('href','/listen?record=storm');
  await expect(records).toContainText('NASA SVS 5046');
  await expect(page.getByRole('region',{name:'Made for everyone'})).toContainText('Not yet tested with real screen-reader users');
  await expect(page.getByRole('region',{name:'How we used AI'})).toContainText('narration is an AI text-to-speech voice');
  const team=page.getByRole('region',{name:'Team BoboMimi'});
  await expect(team).toContainText('Chia Yuen Kai (team leader) and Jacy Chiong Yet Suu');
  await expect(team.getByRole('link',{name:/Watch the 30-second demo/})).toHaveAttribute('href','https://youtu.be/bZC6O_t4LHc');
  await expect(team.getByRole('link',{name:/Source code/})).toHaveAttribute('href','https://github.com/Yoriichi-0u0/TerraJuke-The-Earth-Information-Jukebox');
  await expect(page.locator('#sources')).toContainText('NASA GISS GISTEMP v4');
  await records.getByRole('link',{name:'The Ice Year',exact:true}).click();
  await expect(page).toHaveURL(/\/listen\?record=ice$/);await expect(page.getByRole('heading',{name:'The Ice Year',exact:true})).toBeVisible();
});

test('About fits a small phone without sideways scrolling',async({page})=>{
  await page.setViewportSize({width:320,height:640});await page.goto('/about');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
