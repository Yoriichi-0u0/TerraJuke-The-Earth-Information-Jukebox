import {expect,test} from '@playwright/test';
import type {Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {chooseAppearance} from './appearanceControl';

// Storm Drums (record 08): NASA SVS 5011. Emulated browsers; audio renders to a silent fake output in Chromium.
const events=(page:Page)=>page.evaluate(()=>window.terrajukeStorm?.events??[]);
async function open(page:Page){
  await page.goto('/listen?record=storm');
  await expect(page.getByRole('heading',{name:'Storm Drums',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Play the storm year',exact:true})).toBeEnabled();
}

test('the shelf opens Storm Drums with NASA’s August frame, its source and 5W1H',async({page})=>{
  await open(page);
  await expect(page.getByRole('img',{name:/NASA world map of lightning detected from the International Space Station in the ten days around 15 August 2022/})).toBeVisible();
  const shown=page.locator('.storm-map img.is-shown');await expect(shown).toHaveAttribute('src','/nasa/svs5011/2022-08.webp');
  await expect.poll(()=>shown.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth),{timeout:15_000}).toBe(2048);
  const mapBox=(await page.locator('.storm-map').boundingBox())!;expect(mapBox.height/mapBox.width).toBeGreaterThan(0.45);expect(mapBox.height/mapBox.width).toBeLessThan(0.6);
  await expect(page.getByRole('list',{name:'Lightning worldwide, month by month'}).getByRole('button')).toHaveCount(12);
  const story=page.getByRole('region',{name:/Storm Drums: what you are hearing/});
  await expect(story).toContainText('Lightning Imaging Sensor');await expect(story.getByRole('link',{name:/NASA SVS 5011/})).toHaveAttribute('href','https://svs.gsfc.nasa.gov/5011/');
  await expect(page.locator('.jb-record')).toHaveCount(8);
});

test('Side A plays the storm year: a month note, then 18 drums, twelve times',{tag:'@timing'},async({page})=>{
  test.setTimeout(60_000);await open(page);
  await page.getByLabel('Tempo',{exact:true}).fill('180');
  await page.getByRole('button',{name:'Play the storm year',exact:true}).click();
  await expect(page.getByTestId('storm-announcer')).toHaveText('The storm year is complete: the lightning followed the sun north and back.',{timeout:40_000});
  const e=await events(page);
  expect(e.filter(x=>x.kind==='month').map(x=>x.month)).toEqual([0,1,2,3,4,5,6,7,8,9,10,11]);
  expect(e.filter(x=>x.kind==='drum')).toHaveLength(12*18);
});

test('months can be heard one at a time by button or arrow key',async({page})=>{
  await open(page);
  await page.getByRole('button',{name:/^January:/}).click();
  await expect(page.getByTestId('storm-caption')).toHaveText(/^15 January 2022: lightning across the world, \d+% of it over land, centred near \d+°S$/);
  const map=page.getByRole('application',{name:/Lightning map, the storm year/});
  await map.focus();await map.press('End');await expect(page.getByTestId('storm-caption')).toContainText('15 December 2022');
});

test('Side B: touching the Congo plays twelve months of storms',async({page})=>{
  await open(page);
  await page.getByRole('button',{name:'Side B: touch a place',exact:true}).click();
  const map=page.getByRole('application',{name:/Lightning map\. Arrow keys/}),box=(await map.boundingBox())!;
  await map.click({position:{x:(25+180)/360*box.width,y:(90+5)/180*box.height}}); // the centre of the 0–10°S, 20–30°E place
  await expect(page.getByTestId('storm-announcer')).toHaveText(/^Africa, 5°S 25°E: lightning in 12 of 12 months, most in \w+$/);
  await expect.poll(async()=>(await events(page)).length,{timeout:15_000}).toBe(12);
  await map.press('Escape');await expect(page.locator('.jb-deck')).not.toHaveClass(/is-playing/);
});

for(const theme of ['dark','light'])test(`Storm Drums fits phones and passes axe (${theme})`,{tag:'@full'},async({page})=>{
  test.setTimeout(60_000);
  for(const size of [{width:320,height:640},{width:390,height:844},{width:1280,height:800}]){
    await page.setViewportSize(size);await open(page);await chooseAppearance(page,theme);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.locator('.storm-notes summary').click();
    const scan=await new AxeBuilder({page}).include('.jb-player').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(scan.violations.map(v=>({size:size.width,id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
});
