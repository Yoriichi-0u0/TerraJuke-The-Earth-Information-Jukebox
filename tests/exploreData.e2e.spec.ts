import {expect,test} from '@playwright/test';
import {readFile} from 'node:fs/promises';

// Explore Data (all ages): plain data choice, three steps, a plain sentence for the number, and all eight records.
test('Explore Data explains the number in plain words and switches data with the same two buttons as Create',async({page})=>{
  await page.goto('/data');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Every note has a number.');
  await expect(page.getByRole('list',{name:'How to explore'}).getByRole('listitem')).toHaveCount(3);
  await expect(page.getByText('January 2025 was 1.37 °C warmer than an average January in 1951–1980.',{exact:true})).toBeVisible();
  await expect(page.getByLabel('Earth Station',{exact:true})).toHaveCount(0);
  await page.getByRole('group',{name:'Choose the data'}).getByRole('button',{name:/Arctic sea ice/}).click();
  await expect(page).toHaveURL(/\/data\?station=arctic$/);
  await expect(page.getByRole('heading',{name:'Every ice note has an observation.'})).toBeVisible();
  await expect(page.getByRole('group',{name:'Choose the data'}).getByRole('button',{name:/Arctic sea ice/})).toHaveAttribute('aria-pressed','true');
});

test('all eight records say what kind of number they play, with charts, takeaways and CSVs from the pinned data',async({page})=>{
  await page.goto('/data');
  const section=page.getByRole('region',{name:'All eight records, and what their numbers are.'});
  const cards=section.getByRole('listitem');await expect(cards).toHaveCount(8);
  await expect(cards.filter({hasText:'Climate Spiral'})).toContainText('NASA measurements');
  await expect(cards.filter({hasText:'Moving Earth'})).toContainText('Picture brightness only');
  await expect(cards.filter({hasText:'Storm Drums'})).toContainText('Counted from NASA’s map');
  for(const title of ['Night Lights','The Air We Share','Currents of Heat','The Ice Year','The Warming Map'])await expect(cards.filter({hasText:title})).toContainText('Read from NASA’s colour scale');
  await expect(section.getByRole('img')).toHaveCount(4);
  await expect(cards.filter({hasText:'The Warming Map'})).toContainText('From −0.26 °C in 1890 to +1.17 °C in 2024.');
  await expect(cards.filter({hasText:'The Ice Year'})).toContainText(/Most ice in Mar .*least in Sep/);
  await expect(cards.filter({hasText:'Storm Drums'})).toContainText('Busiest month: Aug.');
  await expect(cards.filter({hasText:'Storm Drums'}).getByRole('link',{name:/Hear it/})).toHaveAttribute('href','/listen?record=storm');
  await expect(cards.filter({hasText:'Storm Drums'}).getByRole('link',{name:/NASA source/})).toHaveAttribute('href','https://svs.gsfc.nasa.gov/5011/');
  const pending=page.waitForEvent('download');await cards.filter({hasText:'The Warming Map'}).getByRole('button',{name:'Download the numbers (CSV)'}).click();
  const file=await pending;expect(file.suggestedFilename()).toBe('TerraJuke-Warming-Map-global-average.csv');
  const csv=(await readFile((await file.path())!,'utf8')).trim().split('\n');
  expect(csv[0]).toBe('map_year,global_anomaly_c_read_from_colour');expect(csv[1]).toBe('1890,-0.26');expect(csv).toHaveLength(16);
});

test('Explore Data fits a small phone without sideways scrolling',async({page})=>{
  await page.setViewportSize({width:320,height:640});await page.goto('/data');
  await expect(page.getByRole('region',{name:'All eight records, and what their numbers are.'}).getByRole('listitem')).toHaveCount(8);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('temperature charts colour warmer bars orange and cooler bars blue; other charts use one colour',async({page})=>{
  await page.goto('/data');
  const section=page.getByRole('region',{name:'All eight records, and what their numbers are.'});
  const warming=section.getByRole('listitem').filter({hasText:'The Warming Map'}).locator('svg');
  await expect(warming.locator('.rn-cool').first()).toBeVisible();await expect(warming.locator('.rn-warm').first()).toBeVisible();
  const fill=(loc:import('@playwright/test').Locator)=>loc.first().evaluate(e=>getComputedStyle(e).fill);
  const [cool,warm]=[await fill(warming.locator('.rn-cool')),await fill(warming.locator('.rn-warm'))];
  const rgb=(c:string)=>c.match(/\d+/g)!.map(Number);
  expect(rgb(cool)[2]).toBeGreaterThan(rgb(cool)[0]);expect(rgb(warm)[0]).toBeGreaterThan(rgb(warm)[2]);
  await expect(section.getByRole('listitem').filter({hasText:'The Ice Year'}).locator('svg .rn-plain')).toHaveCount(12);
});
