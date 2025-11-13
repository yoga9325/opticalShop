const puppeteer = require('puppeteer');
const fs = require('fs');

(async ()=>{
  const url = 'http://127.0.0.1:4200';
  const viewport = { width: 1910, height: 966 };
  const outDir = 'src/assets/reference/current';
  fs.mkdirSync(outDir,{recursive:true});

  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setViewport(viewport);

  // wait for server to be available
  let connected = false;
  for(let i=0;i<30;i++){
    try{
      const resp = await page.goto(url,{waitUntil:'networkidle2',timeout:5000});
      if(resp && resp.ok()){ connected = true; break; }
    }catch(e){
      console.log('Waiting for dev server... retry', i+1);
      await new Promise(r=>setTimeout(r,1000));
    }
  }

  if(!connected){
    console.error('Could not connect to dev server at', url);
    await browser.close();
    process.exit(2);
  }

  // give app a little extra time to run animations on load
  await new Promise(r=>setTimeout(r,400));

  const offsets = [500,3000,6000,10000,15000];
  const names = ['current_0005.png','current_0030.png','current_0060.png','current_1000.png','current_1500.png'];
  const start = Date.now();
  for(let i=0;i<offsets.length;i++){
    const target = start + offsets[i];
    const now = Date.now();
    if(target>now) await new Promise(r=>setTimeout(r,target-now));
    await page.screenshot({path:`${outDir}/${names[i]}`,fullPage:true});
    console.log('Captured',names[i]);
  }

  await browser.close();
})().catch(err=>{ console.error(err); process.exit(1); });
