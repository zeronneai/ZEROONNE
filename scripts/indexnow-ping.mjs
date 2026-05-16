const INDEXNOW_KEY = 'a7f3c9e2b8d4f6a1c5e9b7d3f8a2c6e4';
const HOST = 'primostudio.us';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

const URLS = [
  'https://primostudio.us/',
  'https://primostudio.us/blog',
  'https://primostudio.us/blog/complete-2026-ai-guide-el-paso-small-businesses',
];

const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS,
};

const endpoints = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/IndexNow',
  'https://yandex.com/indexnow',
];

console.log('🚀 IndexNow — notifying search engines...');
console.log(`📋 URLs: ${URLS.length}`);

for (const endpoint of endpoints) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Host': new URL(endpoint).host,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`✅ ${endpoint}: ${res.status} OK`);
    } else {
      const text = await res.text();
      console.log(`⚠️  ${endpoint}: ${res.status} — ${text.slice(0, 100)}`);
    }
  } catch (err) {
    console.log(`❌ ${endpoint}: ${err.message}`);
  }
}

console.log('✅ IndexNow notification complete');
