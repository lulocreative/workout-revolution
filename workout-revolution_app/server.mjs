import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.cwd());
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{
 try{const decoded=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const target=resolve(root,'.'+(decoded==='/'?'/index.html':decoded));if(target!==root&&!target.startsWith(root+sep)){res.writeHead(403);res.end();return}const info=await stat(target);if(!info.isFile())throw Error('not file');const body=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(body)}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found')}
}).listen(port,'0.0.0.0',()=>console.log(`Workout Revolution 2.0 → http://localhost:${port}`));
