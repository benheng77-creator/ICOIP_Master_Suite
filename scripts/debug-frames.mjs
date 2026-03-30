import { chromium } from '@playwright/test';

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ bypassCSP: true });
const p = await ctx.newPage();

await p.goto(
  'https://script.google.com/macros/s/AKfycbwvqQ8UlVOoXN4UVvCnRmNnVKL99Jp9t6DsBZCrDMFqErNwdP_VmcLm0ahU6dx2-hI/exec',
  { waitUntil: 'networkidle', timeout: 45000 }
);

await p.waitForTimeout(3000);

for (const [i, f] of p.frames().entries()) {
  const loginCnt = await f.locator('#loginModal').count().catch(() => -1);
  if (loginCnt < 0) continue;
  console.log(`\n=== Frame [${i}]: ${f.url()} ===`);
  console.log('  #loginModal count:', loginCnt);

  // Check if evaluate works cross-origin
  const evalWorks = await f.evaluate(() => 'ok').catch(e => 'FAILED: ' + e.message);
  console.log('  frame.evaluate():', evalWorks);

  // Check if mock is installed
  const mockState = await f.evaluate(() => ({
    hasMock: typeof window.__gasMockInstalled !== 'undefined' && window.__gasMockInstalled,
    hasGoogle: typeof window.google !== 'undefined',
    googleScriptType: typeof (window.google && window.google.script && window.google.script.run),
  })).catch(e => ({ err: e.message }));
  console.log('  mock state:', mockState);

  if (loginCnt > 0) {
    // Inject full mock and verify it fires
    await f.evaluate(() => {
      window.__gasMockInstalled = false; // force reinstall
      window.google = window.google || {};
      window.google.script = {
        run: new Proxy({}, {
          get: function(t, prop) {
            if (prop === 'withSuccessHandler') {
              return function(fn) {
                return {
                  withFailureHandler: function() { return this; },
                  getAppState: function() {
                    setTimeout(function() {
                      fn({ ok: true, currentUser: { fullName: 'MOCK_ADMIN', role: 'Admin', email: 'admin@icoip.demo', department: 'Management' }, permissions: ['view','create'], stats: [], records: [], recentActivity: [], notifications: [] });
                    }, 50);
                  },
                  listRecords: function() { setTimeout(function() { fn({ ok:true, records:[] }); }, 50); },
                  saveRecord: function(d) { setTimeout(function() { fn({ ok:true, record: d }); }, 50); },
                  getRecordBundle: function(id) { setTimeout(function() { fn({ ok:true, record:{id:id}, attachments:[], timeline:[] }); }, 50); },
                  transitionRecord: function() { setTimeout(function() { fn({ ok:true }); }, 50); },
                  sendRecordEmail: function() { setTimeout(function() { fn({ ok:true }); }, 50); },
                  resetDemoData: function() { setTimeout(function() { fn({ ok:true }); }, 50); },
                  uploadAttachment: function(d) { setTimeout(function() { fn({ ok:true, attachment:d }); }, 50); },
                };
              };
            }
            return function() {};
          }
        }),
        history: { push: function(){}, replace: function(){} },
        host: { close: function(){}, setHeight: function(){}, setWidth: function(){} },
        url: { getLocation: function(cb){ cb({ href: window.location.href, hash:'', parameter:{}, parameters:{} }); } }
      };
      window.__gasMockInstalled = true;
      console.log('[DEBUG] Mock injected via evaluate');
    });

    // Verify mock is in place
    const afterMock = await f.evaluate(() => ({
      hasMock: window.__gasMockInstalled,
      runType: typeof (window.google && window.google.script && window.google.script.run),
    }));
    console.log('  after mock inject:', afterMock);

    // Click Admin card and check currentUserName after
    await f.locator('.user-card').filter({ hasText: 'Admin' }).first().click();
    await f.waitForTimeout(2000);
    const userName = await f.locator('#currentUserName').textContent().catch(() => 'NOT FOUND');
    console.log('  #currentUserName after Admin click:', userName);
  }

  if (loginCnt > 0) {
    // Check APP_CONFIG
    const appConfig = await f.evaluate(() => {
      return {
        hasConfig: typeof window.APP_CONFIG !== 'undefined',
        configType: typeof window.APP_CONFIG,
        demoUsersLen: window.APP_CONFIG?.demoUsers?.length || 0,
        pageTitle: window.APP_CONFIG?.pageTitle || 'MISSING',
      };
    }).catch(e => ({ err: e.message }));
    console.log('  APP_CONFIG:', appConfig);

    // Check state
    const stateInfo = await f.evaluate(() => {
      return {
        hasState: typeof window.state !== 'undefined',
        configDemoUsers: window.state?.config?.demoUsers?.length || 0,
        configPageTitle: window.state?.config?.pageTitle || 'MISSING',
      };
    }).catch(e => ({ err: e.message }));
    console.log('  state:', stateInfo);

    // Check user cards rendered
    const cardCount = await f.locator('.user-card').count();
    console.log('  .user-card count:', cardCount);

    // HTML snippet around demoUserGrid
    const gridHtml = await f.evaluate(() => {
      const el = document.getElementById('demoUserGrid');
      return el ? el.outerHTML.slice(0, 300) : 'NOT FOUND';
    }).catch(e => e.message);
    console.log('  demoUserGrid HTML:', gridHtml);
  }
}

await b.close();
