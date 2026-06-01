import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Worker 응답 본문 캡처
page.on('response', async r => {
  if (r.url().includes('workers.dev')) {
    const body = await r.text().catch(() => '');
    console.log('Worker 응답 (앞 500자):\n', body.slice(0, 500));
  }
});

await page.goto('https://utilmoeum.pages.dev/realestate.html', {
  waitUntil: 'networkidle',
  timeout: 30000,
});

// 전월(202605)로 변경 후 조회
await page.selectOption('#dealMonth', '202605');
await page.click('#searchBtn');

await Promise.race([
  page.waitForSelector('#resultBody tr', { timeout: 20000 }),
  page.waitForSelector('#errorArea:not([style*="none"])', { timeout: 20000 }),
]).catch(() => {});

const title        = await page.$eval('#resultTitle', el => el.textContent).catch(() => '');
const totalCount   = await page.$eval('#totalCount',  el => el.textContent).catch(() => '');
const errorVisible = await page.$eval('#errorArea',   el => el.style.display !== 'none').catch(() => false);
const errorMsg     = await page.$eval('#errorMsg',    el => el.textContent).catch(() => '');
const rowCount     = await page.$$eval('#resultBody tr', trs => trs.length).catch(() => 0);
const firstRows    = await page.$$eval('#resultBody tr', trs =>
  trs.slice(0, 5).map(tr =>
    Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
  )
).catch(() => []);

console.log('\n=== 전월(202605) 결과 ===');
console.log('타이틀:', title);
console.log('총 건수:', totalCount);
console.log('렌더된 행 수:', rowCount);
console.log('오류:', errorVisible, errorMsg || '없음');
console.log('첫 5행:');
firstRows.forEach((r, i) => console.log(`  [${i+1}]`, r.join(' | ')));

await page.screenshot({ path: '/tmp/realestate_202605.png' });
await browser.close();
