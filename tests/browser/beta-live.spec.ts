import { test, expect } from '@playwright/test';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

test('local signup commits before the UI reports receipt',async({page},testInfo)=>{
  const target=new URL(String(testInfo.project.use.baseURL||'http://localhost:3000'));
  test.skip(testInfo.project.name!=='chromium'||!['localhost','127.0.0.1'].includes(target.hostname)||target.port!=='3000','One development database verification, never a hosted or production signup.');
  const email=`8ntic-verification-${Date.now()}@example.invalid`;
  await page.goto('/beta');await page.getByLabel('Your name',{exact:true}).fill('8NTIC verification');await page.getByLabel('Email address',{exact:true}).fill(email);await page.getByRole('checkbox').check();
  await page.getByRole('button',{name:'Keep me in the loop'}).click();await expect(page.getByRole('heading',{name:'Your request has arrived.'})).toBeVisible();
  const db=new DatabaseSync(join(process.cwd(),'.data','beta-signups.sqlite'));
  try { const row=db.prepare('SELECT status,consent_version FROM beta_signups WHERE email_normalized=?').get(email);expect(row?.status).toBe('eligible');expect(row?.consent_version).toBe('beta-research-updates-v1');db.prepare('DELETE FROM beta_signups WHERE email_normalized=?').run(email); } finally {db.close();}
});
