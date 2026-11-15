import {expect,test} from '@playwright/test';
import type {Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {chooseAppearance} from './appearanceControl';

// The Warming Map (record 07): NASA SVS 5450. Emulated browsers; audio renders to a silent fake output in Chromium.
const events=(page:Page)=>page.evaluate(()=>window.terrajukeWarming?.events??[]);
async function open(page:Page){
  await page.goto('/listen?record=warming');
  await expect(page.getByRole('heading',{name:'The Warming Map',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Play pole to pole',exact:true})).toBeEnabled();
}

test('the shelf opens The Warming Map with NASA’s 2024 map, colour bar, source and 5W1H',async({page})=>{
  await open(page);
  await expect(page.getByRole('img',{name:/NASA world map of temperature anomalies for the 24 months to 2024/})).toBeVisible();
  const shown=page.locator('.warming-map img.is-shown');await expect(shown).toHaveAttribute('src','/nasa/svs5450/2024.webp');
  await expect.poll(()=>shown.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth),{timeout:15_000}).toBe(2048);
  const mapBox=(await page.locator('.warming-map').boundingBox())!;expect(mapBox.height/mapBox.width).toBeGreaterThan(0.45);expect(mapBox.height/mapBox.width).toBeLessThan(0.6); // the map keeps its 2:1 shape on every screen
  await expect(page.getByRole('img',{name:/Temperature Change: from −2 °C/})).toBeVisible();
  await expect(page.getByRole('list',{name:'Global average, decade by decade'}).getByRole('button')).toHaveCount(15);
  const story=page.getByRole('region',{name:/The Warming Map: what you are hearing/});
  await expect(story).toContainText('GISTEMP v4');await expect(story.getByRole('link',{name:/NASA SVS 5450/})).toHaveAttribute('href','https://svs.gsfc.nasa.gov/5450/');
  await expect(page.getByRole('button',{name:'Select record: Temperature Through Time'})).toHaveCount(0);
});

test('Side A plays 34 bands pole to pole and ends in the Arctic at the top of the scale',{tag:'@timing'},async({page})=>{
  test.setTimeout(40_000);await open(page);
  await page.getByLabel('Tempo',{exact:true}).fill('160');
  await page.getByRole('button',{name:'Play pole to pole',exact:true}).click();
  await expect(page.getByTestId('warming-announcer')).toHaveText('Pole to pole is complete for 2024.',{timeout:20_000});
  const bands=(await events(page)).filter(e=>e.kind==='band');
  expect(bands.map(e=>e.index)).toEqual(Array.from({length:34},(_,i)=>i));
  expect(bands.at(-1)!.temp).toBeGreaterThanOrEqual(1.9);
  await expect(page.getByTestId('warming-caption')).toHaveText(/^80°N to 85°N in 2024: \+(2\.0 °C|2 °C or more), far warmer than normal$/);
});

test('decades can be chosen and bands heard by keyboard',async({page})=>{
  await open(page);
  await page.getByRole('button',{name:/^1910:/}).click();
  await expect(page.locator('.warming-map img.is-shown')).toHaveAttribute('src','/nasa/svs5450/1910.webp');
  await expect(page.getByTestId('warming-caption')).toContainText('1910: global average read from NASA’s map −0.4 °C');
  const map=page.getByRole('application',{name:/Temperature map\. Up and down/});
  await map.focus();await map.press('ArrowRight');await expect(page.locator('.warming-map img.is-shown')).toHaveAttribute('src','/nasa/svs5450/1920.webp');
  await map.press('ArrowUp');await expect(page.getByTestId('warming-announcer')).toContainText('in 1920:');
});

test('Side B: touching central Europe plays its 15 decades, from cooler than normal to far warmer',async({page})=>{
  await open(page);
  await page.getByRole('button',{name:'Side B: touch a place',exact:true}).click();
  const map=page.getByRole('application',{name:/Temperature map\. Arrow keys/});
  const box=(await map.boundingBox())!;
  await map.click({position:{x:(10+180)/360*box.width,y:(90-50)/180*box.height}});
  await expect(page.getByTestId('warming-announcer')).toHaveText(/^Europe, \d+°N \d+°E: −\d\.\d °C in 1890, \+\d\.\d °C in 2024$|^Europe, \d+°N \d+°E: .* in 1890, \+2 °C or more in 2024$/);
  await expect(page.getByRole('list',{name:'This place, decade by decade'}).getByRole('button')).toHaveCount(15);
  await expect.poll(async()=>(await events(page)).filter(e=>e.kind==='decade').length,{timeout:15_000}).toBe(15);
  await map.press('Escape');await expect(page.locator('.jb-deck')).not.toHaveClass(/is-playing/);
});

for(const theme of ['dark','light'])test(`The Warming Map fits phones and passes axe (${theme})`,{tag:'@full'},async({page})=>{
  test.setTimeout(60_000);
  for(const size of [{width:320,height:640},{width:390,height:844},{width:1280,height:800}]){
    await page.setViewportSize(size);await open(page);await chooseAppearance(page,theme);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.locator('.warming-notes summary').click();
    const scan=await new AxeBuilder({page}).include('.jb-player').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(scan.violations.map(v=>({size:size.width,id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
});
