import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const sizes=[{width:375,height:812},{width:390,height:844},{width:393,height:852},{width:402,height:874},{width:428,height:926},{width:430,height:932},{width:440,height:956}];
for(const size of sizes){test(`iPhone viewport ${size.width}: touch-ready navigation and no overflow`,async({page})=>{
  await page.setViewportSize(size);await page.goto('/');await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const cta=page.locator('.hero').getByRole('link',{name:'Explore QIP',exact:true});await expect(cta).toBeInViewport();
  await page.getByRole('button',{name:'Open menu',exact:true}).tap();await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Research',exact:true}).click();
  await expect(page).toHaveURL(/\/research$/);await expect(page.getByRole('button',{name:'Open menu',exact:true})).toHaveAttribute('aria-expanded','false');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});}

test('interactive QIP, publications, sound and motion',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:390,height:844});await page.goto('/');
  const sound=page.getByRole('button',{name:'Turn subtle sound on'});await expect(sound).toHaveAttribute('aria-pressed','false');await sound.click();await expect(page.getByRole('button',{name:'Turn sound off'})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'Turn sound off'}).click();
  await page.getByRole('button',{name:'Pause ambient motion'}).click();await expect(page.locator('html')).toHaveAttribute('data-motion','off');
  await page.getByRole('button',{name:'Use memory',exact:true}).click();await expect(page.getByRole('heading',{name:'Memory informs the work'})).toBeVisible();
  const recorder=page.getByRole('button',{name:/Capture & reflection Recorder/});await recorder.click();await expect(recorder).toHaveAttribute('aria-expanded','true');await expect(page.getByRole('link',{name:/Open Recorder/})).toHaveAttribute('href','https://recorder.8ntic.com');
  const preview=page.locator('.pub-preview').first();await preview.locator('summary').click();await expect(preview).toHaveAttribute('open','');
  await page.getByRole('link',{name:'Read the full essay',exact:true}).click();await expect(page).toHaveURL(/the-token-gap$/);await expect(page.getByRole('heading',{level:1})).toHaveText('The Token Gap');
  const result=page.getByRole('button',{name:'Show 22-second result'});await result.click();await expect(page.locator('.token-verdict')).toContainText('88 tokens');
  expect(errors).toEqual([]);
});

test('all content routes, crawlable metadata and no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:393,height:852});
  for(const path of ['/qip','/research','/experiments','/publications','/publications/the-token-gap','/publications/qip-thesis','/about','/beta','/privacy']){
    const response=await page.goto(path);expect(response?.status(),path).toBe(200);await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',`https://www.8ntic.com${path}`);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);
    expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
  }
});

test('beta validation and database failure cannot claim success',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/beta');
  if(await page.locator('.beta-prelaunch').count()){await expect(page.locator('.beta-prelaunch')).toContainText('Signups aren’t open yet.');await expect(page.getByRole('textbox')).toHaveCount(0);await expect(page.getByRole('link',{name:/Read publications/})).toHaveAttribute('href','/publications');return;}
  await page.getByRole('button',{name:'Keep me in the loop'}).click();await expect(page.locator('.form-summary[role=alert]')).toBeVisible();
  await page.getByLabel('Your name',{exact:true}).fill('Browser test');await page.getByLabel('Email address',{exact:true}).fill('browser-test@example.com');
  const consent=page.getByRole('checkbox');await expect(consent).not.toBeChecked();await consent.check();
  await page.route('**/api/beta-signups',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'We couldn’t confirm your request. Please try again.'})}));
  await page.getByRole('button',{name:'Keep me in the loop'}).click();await expect(page.locator('.form-summary[role=alert]')).toContainText('couldn’t confirm');await expect(page.getByLabel('Email address',{exact:true})).toHaveValue('browser-test@example.com');await expect(page.getByText('Your request has arrived.')).toHaveCount(0);
  expect(await page.getByLabel('Email address',{exact:true}).evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
});

test('reduced motion and no-JavaScript reading',async({browser,page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('html')).toHaveAttribute('data-motion','off');
  expect(await page.locator('.orbital-traveller').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const reader=await context.newPage();await reader.goto('/publications/the-token-gap');await expect(reader.getByRole('heading',{level:1})).toBeVisible();await expect(reader.getByText('You are reading this at roughly four tokens per second.',{exact:true})).toBeVisible();await reader.locator('.token-static-data summary').click();await expect(reader.locator('.token-data-rows')).toBeVisible();await context.close();
});

test('critical accessibility checks',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const path of ['/','/beta','/publications/the-token-gap']){await page.goto(path);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),path).toEqual([]);}
});

test('desktop, landscape and 404 recovery',async({page})=>{
  for(const size of [{width:1440,height:1000},{width:844,height:390},{width:320,height:740}]){await page.setViewportSize(size);await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('.hero').getByRole('link',{name:'Explore QIP',exact:true})).toBeVisible();}
  await page.goto('/publications/no-such-publication');await expect(page.getByRole('heading',{name:'A little off the path.'})).toBeVisible();await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);await page.getByRole('link',{name:'Back to 8NTIC'}).click();await expect(page).toHaveURL('/');
});
