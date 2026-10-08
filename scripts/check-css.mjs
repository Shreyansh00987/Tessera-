import http from 'http';

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const match = data.match(/href="(\/_next\/static\/css\/[^"]+)"/);
    if (!match) {
      console.log('No CSS match found');
      return;
    }
    const cssPath = match[1];
    console.log('Found CSS path:', cssPath);
    http.get('http://localhost:3000' + cssPath, (cRes) => {
      console.log('CSS HTTP Status:', cRes.statusCode);
      console.log('CSS Content-Type:', cRes.headers['content-type']);
      let cssData = '';
      cRes.on('data', chunk => { cssData += chunk; });
      cRes.on('end', () => {
        console.log('CSS Byte Length:', cssData.length);
        console.log('CSS First 300 chars:\n', cssData.slice(0, 300));
      });
    });
  });
});
