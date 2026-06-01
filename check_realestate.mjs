import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const messages = [];

page.on('console', m => messages.push(m.type() + ': ' + m.text()));
page.on('response', r => {
  if (r.url().includes('workers.dev')) {
    console.log('Worker 응답 상태:', r.status(), r.url().split('?')[0]);
  }
});

await page.goto('https://utilmoeum.pages.dev/realestate.html', {
  waitUntil: 'networkidle',
  timeout: 30000,
});

// 결과 or 오류 대기
await Promise.race([
  page.waitForSelector('#resultBody tr', { timeout: 20000 }),
  page.waitForSelector('#errorArea:not([style*="none"])', { timeout: 20000 }),
]).catch(() => {});

const title        = await page.$eval('#resultTitle', el => el.textContent).catch(() => '');
const totalCount   = await page.$eval('#totalCount',  el => el.textContent).catch(() => '');
const errorVisible = await page.$eval('#errorArea',   el => el.style.display !== 'none').catch(() => false);
const errorMsg     = await page.$eval('#errorMsg',    el => el.textContent).catch(() => '');
const rowCount     = await page.$$eval('#resultBody tr', trs => trs.length).catch(() => 0);

const firstRows = await page.$$eval('#resultBody tr', trs =>
  trs.slice(0, 3).map(tr =>
    Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
  )
).catch(() => []);

console.log('=== 결과 ===');
console.log('타이틀:', title);
console.log('총 건수 표시:', totalCount);
console.log('렌더된 행 수:', rowCount);
console.log('오류 표시:', errorVisible, errorMsg || '(없음)');
console.log('첫 3행:');
firstRows.forEach((r, i) => console.log(`  [${i+1}]`, r.join(' | ')));
console.log('콘솔:', messages.filter(m => m.startsWith('error')).slice(0, 3));

await page.screenshot({ path: '/tmp/realestate_result.png' });
await browser.close();
