// Start the app with NEXT_PUBLIC_ARTEMIS_CHAT_ENABLED=true at build time.
// Requires Playwright; PLAYWRIGHT_MODULE can point to an existing index.mjs.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.CHAT_TEST_BASE_URL || 'http://localhost:3000';
const article = '/blog/how-i-built-artemis-agentforce-demo';
const bootstrap = '**/ESWArtemisWebChat1790750116762/assets/js/bootstrap.min.js';
const results = [];
const mock = `
  window.embeddedservice_bootstrap = new Proxy({
    settings: {},
    init(...args) {
      window.chatInitCount = (window.chatInitCount || 0) + 1;
      window.chatInitArgs = args;
      localStorage.setItem('mock-artemis-session', 'preserved');
      const root = document.createElement('div');
      root.id = 'embedded-messaging';
      root.style = 'position:fixed;bottom:20px;right:20px;z-index:10000';
      const button = document.createElement('button');
      button.textContent = 'Mock Artemis launcher';
      button.onclick = () => {
        root.textContent = 'Mock open conversation';
        document.body.classList.add('embeddedMessagingPreventScrolling');
      };
      root.appendChild(button);
      document.body.appendChild(root);
      window.dispatchEvent(new Event('onEmbeddedMessagingReady'));
    },
    userVerificationAPI: {
      clearSession() {
        localStorage.removeItem('mock-artemis-session');
        throw new Error('Navigation must never clear sessions');
      }
    }
  }, {
    get(target, name) {
      if (!(name in target)) throw new Error('Unsupported SDK property: ' + String(name));
      return target[name];
    }
  });
`;
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext();
  await context.route(bootstrap, route => route.fulfill({ contentType: 'text/javascript', body: mock }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let sdkRequests = 0;
  page.on('request', request => {
    if (request.url().includes('/assets/js/bootstrap.min.js')) sdkRequests++;
  });
  const checkArticle = async () => {
    await page.getByRole('button', { name: 'Mock Artemis launcher' }).waitFor();
    assert.equal(await page.evaluate(() => window.chatInitCount), 1);
    assert.equal(await page.locator('#artemis-chat-bootstrap').count(), 1);
  };
  const checkAbsent = async () => {
    assert.equal(await page.locator('#embedded-messaging').count(), 0);
    assert.equal(await page.locator('#artemis-chat-bootstrap').count(), 0);
    assert.equal(await page.evaluate(() => !!window.embeddedservice_bootstrap), false);
    assert.equal(await page.evaluate(() => document.body.classList.contains('embeddedMessagingPreventScrolling')), false);
  };

  await page.goto(base + '/blog');
  await page.waitForFunction(() => !!window.next?.router?.isReady);
  assert.equal(sdkRequests, 0);
  await checkAbsent();
  results.push('Fresh unrelated page: no SDK request, script, global, or launcher');

  await page.getByRole('link', { name: 'How I Built the Artemis Agentforce Demo' }).click();
  await checkArticle();
  assert.equal(sdkRequests, 1);
  const args = await page.evaluate(() => window.chatInitArgs);
  assert.equal(args[0], '00DgK00000b0lxi');
  assert.equal(args[1], 'Artemis_Web_Chat');
  results.push('Next client entry: one initialization with verified deployment');

  await page.reload();
  await checkArticle();
  results.push('Hard refresh: exactly one initialization');

  const token = await page.evaluate(() => window.documentToken = Math.random());
  await page.evaluate(path => window.next.router.push(path + '#chat'), article);
  assert.equal(await page.evaluate(() => window.documentToken), token);
  await checkArticle();
  results.push('Same-article hash navigation: document and single SDK preserved');

  const secondTab = await context.newPage();
  await secondTab.goto(base + article);
  await secondTab.getByRole('button', { name: 'Mock Artemis launcher' }).waitFor();
  await page.getByRole('button', { name: 'Mock Artemis launcher' }).click();
  await page.getByRole('link', { name: 'Blog', exact: true }).click();
  await page.waitForURL(base + '/blog');
  await page.waitForLoadState('load');
  await checkAbsent();
  assert.equal(await secondTab.evaluate(() => localStorage.getItem('mock-artemis-session')), 'preserved');
  assert.equal(await secondTab.locator('#embedded-messaging').count(), 1);
  results.push('Leave with chat open: fresh document, no chat/scroll lock; second tab/session untouched');

  await page.goBack();
  await checkArticle();
  await page.goForward();
  await checkAbsent();
  results.push('Browser Back/Forward across article boundary: restored once, then absent');

  await page.goto(base + article);
  await checkArticle();
  await page.evaluate(() => { window.next.router.push('/about'); });
  await page.waitForURL(base + '/about');
  await page.waitForLoadState('load');
  await checkAbsent();
  results.push('Programmatic Next navigation: SDK removed by document unload');

  // A Next history entry already exists when entering from Blog, so this also
  // exercises beforePopState (rather than only cross-document browser history).
  await page.goto(base + '/blog');
  await page.getByRole('link', { name: 'How I Built the Artemis Agentforce Demo' }).click();
  await checkArticle();
  await page.goBack();
  await page.waitForURL(base + '/blog');
  await page.waitForLoadState('load');
  await checkAbsent();
  results.push('Back after SPA entry: beforePopState unloads SDK');

  // Reuse an actual second MDX slug so route scoping is tested within [slug].
  await page.goto(base + '/blog');
  const otherHref = await page.locator(`a[href^="/blog/"]:not([href="${article}"])`).first().getAttribute('href');
  await page.goto(base + otherHref);
  await checkAbsent();
  results.push('Other MDX article: no chat');

  const failurePage = await context.newPage();
  await failurePage.route(bootstrap, route => route.abort());
  await failurePage.goto(base + article);
  await failurePage.getByRole('status').waitFor();
  assert.match(await failurePage.getByRole('status').innerText(), /Chat couldn't load/);
  results.push('Bootstrap network failure: accessible fallback to public demo');

  const slowPage = await context.newPage();
  await slowPage.route(bootstrap, async route => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await route.fulfill({ contentType: 'text/javascript', body: mock }).catch(() => {});
  });
  await slowPage.goto(base + article, { waitUntil: 'domcontentloaded' });
  await slowPage.locator('#artemis-chat-bootstrap').waitFor({ state: 'attached' });
  await slowPage.getByRole('link', { name: 'Blog', exact: true }).click();
  await slowPage.waitForURL(base + '/blog');
  await slowPage.waitForLoadState('load');
  assert.equal(await slowPage.locator('#embedded-messaging').count(), 0);
  results.push('Leave during delayed bootstrap: no late initialization on destination');

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.route(bootstrap, route => route.fulfill({ contentType: 'text/javascript', body: mock }));
  const phone = await mobile.newPage();
  await phone.goto(base + article);
  const launcher = phone.getByRole('button', { name: 'Mock Artemis launcher' });
  await launcher.waitFor();
  const box = await launcher.boundingBox();
  assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= 390 && box.y + box.height <= 844);
  await launcher.tap();
  await phone.getByRole('link', { name: 'Blog', exact: true }).tap();
  await phone.waitForURL(base + '/blog');
  await phone.waitForLoadState('load');
  assert.equal(await phone.locator('#embedded-messaging').count(), 0);
  results.push('390px mobile viewport: mocked launcher usable; departure removes it');
  assert.deepEqual(errors, []);
  results.push('No uncaught JavaScript errors in primary lifecycle scenarios');
  console.log(JSON.stringify({ mode: 'mock SDK integration (not live Salesforce)', results }, null, 2));
} finally {
  await browser.close();
}
