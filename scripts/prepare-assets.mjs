import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
// Export approved pixels without changing the identity geometry.
await sharp('public/assets/approved-identity.png').extract({left:1080,top:610,width:1410,height:390}).resize(705).webp({quality:90}).toFile('public/assets/wordmark.webp');
await sharp('public/assets/approved-identity.png').extract({left:1090,top:610,width:270,height:380}).resize(180).webp({quality:90}).toFile('public/assets/mark.webp');
const icon = await sharp('public/assets/approved-identity.png').extract({left:1090,top:610,width:270,height:380}).resize(112,150,{fit:'contain',background:'#0d0f0d'}).extend({left:40,right:40,top:21,bottom:21,background:'#0d0f0d'}).png().toBuffer();
await writeFile('app/icon.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192"><image href="data:image/png;base64,${icon.toString('base64')}" width="192" height="192"/></svg>`);
await writeFile('app/apple-icon.png',icon);
await sharp('public/assets/mascot-study.png').webp({quality:85}).toFile('public/assets/mascot-study.webp');
