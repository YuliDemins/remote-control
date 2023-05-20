import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

export const httpServer = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);

    const index = fs.readFileSync(file_path, 'utf8');

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(index );
});


