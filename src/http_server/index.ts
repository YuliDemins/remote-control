import { createReadStream } from 'fs';
import path, { dirname } from 'path';
import { createServer, IncomingMessage, ServerResponse } from 'http';

export const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    const __dirname = path.resolve(dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);

    const rs = createReadStream(file_path, 'utf8');

    rs.on('error', (err) => {
      res.writeHead(404);
      res.end('File not found');
    });

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    rs.pipe(res);
});


