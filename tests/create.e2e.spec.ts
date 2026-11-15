import {expect,test} from '@playwright/test';

// Create (all ages): three steps, pick the data, what you change vs what the data decides, and a way to Your Record.
test('Create explains itself: three steps, two datasets, and what you change versus what the data decides',async({page})=>{
  await page.goto('/create');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Make the music yours.');
  await expect(page.getByRole('list',{name:'How to make your mix'}).getByRole('listitem')).toHaveCount(3);
  const data=page.getByRole('group',{name:'Choose the data'});
  await expect(data.getByRole('button')).toHaveCount(2);
  await expect(data.getByRole('button',{name:/Earth’s temperature/})).toHaveAttribute('aria-pressed','true');
  const fair=page.getByRole('region',{name:'What you change and what the data decides'});
  await expect(fair).toContainText('A warmer month plays a higher note');await expect(fair).toContainText('never add or change a measurement');
  await expect(page.getByLabel('Earth Station',{exact:true})).toHaveCount(0);
  await data.getByRole('button',{name:/Arctic sea ice/}).click();
  await expect(page).toHaveURL(/\/create\?station=arctic$/);
  await expect(page.getByRole('group',{name:'Choose the data'}).getByRole('button',{name:/Arctic sea ice/})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('region',{name:'What you change and what the data decides'})).toContainText('More sea ice plays a higher note');
  await expect(page.getByText('Arctic September · 12 selected years · 1987–2022')).toBeVisible();
});

test('Create leads to Your Record: the photo panel on Listen comes into view with its button focused',async({page})=>{
  await page.goto('/create');
  const link=page.getByRole('link',{name:/Make Your Record/});await expect(link).toHaveAttribute('href','/listen#your-record');
  await link.click();await expect(page).toHaveURL(/\/listen#your-record$/);
  await expect(page.getByRole('button',{name:'Choose image',exact:true})).toBeFocused();
  await expect(page.locator('#your-record')).toBeInViewport();
});

test('Create fits a small phone without sideways scrolling',async({page})=>{
  await page.setViewportSize({width:320,height:640});await page.goto('/create');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.getByRole('button',{name:/Play my mix/})).toBeVisible();
});
