import {expect,test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {chooseAppearance} from './appearanceControl';

// Learn: one listen-for prompt and one question per record; answers follow each record's fixed sound rule.
test('Learn asks one question per record and explains every answer',async({page})=>{
  await page.goto('/learn');
  await expect(page.getByRole('heading',{level:1})).toHaveText('What did you hear?');
  await expect(page.getByRole('navigation').getByRole('link',{name:'Learn',exact:true})).toHaveAttribute('aria-current','page');
  const cards=page.locator('.ln-card');await expect(cards).toHaveCount(8);
  const ice=page.getByRole('group',{name:'In which month is the note lowest?'});
  await ice.getByRole('radio',{name:'March'}).check();
  const iceCard=cards.filter({hasText:'The Ice Year'});
  await expect(iceCard.locator('.ln-why')).toContainText('Not quite.');await expect(iceCard.locator('.ln-why')).toContainText('Less sea ice plays a lower note');
  await ice.getByRole('radio',{name:'September'}).check();
  await expect(iceCard.locator('.ln-why')).toContainText('Yes!');
  await page.getByRole('group',{name:/a brighter frame means/}).getByRole('radio',{name:'Earth got hotter'}).check();
  await expect(page.getByRole('status').filter({hasText:'Answered'})).toHaveText(/Answered 2 of 8 · 1 right/);
  await expect(iceCard.getByRole('link',{name:/Hear it/})).toHaveAttribute('href','/listen?record=ice');
  await page.getByRole('button',{name:'Start again',exact:true}).click();
  await expect(page.getByText('Pick any question to start.')).toBeVisible();
  await expect(ice.getByRole('radio',{name:'September'})).not.toBeChecked();
});

for(const theme of ['dark','light'])test(`Learn fits a small phone and passes axe (${theme})`,async({page})=>{
  await page.setViewportSize({width:320,height:640});await page.goto('/learn');await chooseAppearance(page,theme);
  await page.getByRole('group',{name:'Which part of the world rings highest?'}).getByRole('radio',{name:'the Arctic'}).check();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});

test('every record links to its own Learn question, which opens in view and highlighted',async({page})=>{
  await page.goto('/listen?record=ice');
  const link=page.getByRole('region',{name:/The Ice Year: what you are hearing/}).getByRole('link',{name:/Test your ears/});
  await expect(link).toHaveAttribute('href','/learn#learn-ice');
  await link.click();await expect(page).toHaveURL(/\/learn#learn-ice$/);
  const card=page.locator('#learn-ice');await expect(card).toBeInViewport();await expect(card).toContainText('In which month is the note lowest?');
  await expect(card).toHaveClass(/is-arrived/);await expect(page.locator('.ln-card.is-arrived')).toHaveCount(1);
});

test('Home leads to Learn from its "Explore together" card',async({page})=>{
  await page.goto('/');
  const link=page.getByRole('link',{name:/Then test your ears on Learn/});
  await expect(link).toHaveAttribute('href','/learn');
  await link.click();await expect(page).toHaveURL(/\/learn$/);await expect(page.getByRole('heading',{level:1})).toHaveText('What did you hear?');
});

test('answering all eight shows what the records share',async({page})=>{
  await page.goto('/learn');
  await expect(page.getByRole('region',{name:'What all eight records share'})).toHaveCount(0);
  const groups=page.locator('.ln-card fieldset');await expect(groups).toHaveCount(8);
  for(let i=0;i<8;i++)await groups.nth(i).getByRole('radio').first().check();
  const summary=page.getByRole('region',{name:'What all eight records share'});
  await expect(summary).toContainText('more of something plays higher or louder');await expect(summary).toContainText('a brighter picture is not a measurement');
});

test('Learn’s Climate Spiral link opens the record on Side B, as the question asks',async({page})=>{
  await page.goto('/learn');
  const link=page.locator('#learn-spiral').getByRole('link',{name:/Hear it/});
  await expect(link).toHaveAttribute('href','/listen?record=spiral&side=b');
  await link.click();
  await expect(page.getByRole('button',{name:'Side B: hear the measurements',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button',{name:'Play record',exact:true})).toBeEnabled();
});
