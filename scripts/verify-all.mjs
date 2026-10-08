import http from 'http';

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          size: data.length,
          content: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

const routes = [
  { path: '/', expected: ['TESSERA', 'DBC', 'STOCKLANA', 'Conviction'] },
  { path: '/marketplace', expected: ['Marketplace', 'Conviction Ladder', 'xStocks'] },
  { path: '/leaderboard', expected: ['Leaderboard', 'Tessera Score', 'Rank'] },
  { path: '/curvelab', expected: ['Curve Lab', 'Segments', 'DAMM v2'] },
  { path: '/curvelab?strategy=xstocks-equity-discovery', expected: ['xStocks', 'Curve Lab'] },
  { path: '/curvelab?strategy=conviction-ladder', expected: ['Conviction Ladder', 'Curve Lab'] },
  { path: '/replay', expected: ['Replay', 'Historical', 'Simulation'] },
  { path: '/copilot', expected: ['Copilot', 'Meteora', 'Zod'] },
  { path: '/launch', expected: ['Launch Terminal', 'Identity', 'Strategy'] },
  { path: '/launch?strategy=conviction-ladder', expected: ['Conviction Ladder', 'Quote'] },
  { path: '/terminal', expected: ['Asset Terminal', 'Swap', 'Orderbook'] },
  { path: '/lifecycle', expected: ['DAMM v2', 'Graduation', 'Keeper'] },
  { path: '/author', expected: ['Author Dashboard', 'Monetization'] },
  { path: '/developer', expected: ['Developer', 'WebSocket', 'Invent'] },
];

async function runVerification() {
  console.log('====================================================');
  console.log('   TESSERA COMPLETE END-TO-END VERIFICATION AUDIT   ');
  console.log('====================================================\n');

  let passCount = 0;
  let failCount = 0;

  for (const route of routes) {
    const fullUrl = `http://localhost:3000${route.path}`;
    try {
      const res = await checkUrl(fullUrl);
      if (res.statusCode !== 200) {
        console.error(`❌ [FAIL] ${route.path} - HTTP ${res.statusCode}`);
        failCount++;
        continue;
      }

      let contentMissing = [];
      for (const exp of route.expected) {
        if (!res.content.toLowerCase().includes(exp.toLowerCase())) {
          contentMissing.push(exp);
        }
      }

      if (contentMissing.length > 0) {
        console.error(`❌ [FAIL] ${route.path} - Missing expected content: ${contentMissing.join(', ')}`);
        failCount++;
      } else {
        console.log(`✅ [PASS] ${route.path} - HTTP 200 OK (${(res.size / 1024).toFixed(1)} KB) - All checks passed`);
        passCount++;
      }
    } catch (err) {
      console.error(`❌ [FAIL] ${route.path} - Connection error:`, err.message);
      failCount++;
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`Total Routes Verified: ${routes.length}`);
  console.log(`Passed: ${passCount} | Failed: ${failCount}`);
  console.log('----------------------------------------------------');

  if (failCount > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 14 ROUTES & PARAMETER STATES VERIFIED 100% OPERATIONAL!');
    process.exit(0);
  }
}

runVerification();
