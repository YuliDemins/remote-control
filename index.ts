import { httpServer } from "./src/http_server/index.js";
import { mouse, left, right, up, down, Region, screen } from "@nut-tree/nut-js";
import { WebSocketServer }  from 'ws';
import { drawShape } from "./src/service/drawShape.js";
import { drawCircle } from "./src/service/drawCircle.js";
import Jimp from "jimp";

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;

console.log(`Start http-server http://localhost:${HTTP_PORT} port`);
httpServer.listen(+HTTP_PORT);

const socket = new WebSocketServer({ port: +WS_PORT });
socket.on('listening', () => console.log(`Start ws-server ${WS_PORT}`))

socket.on('connection', async (connection) => {
  console.log(`Connect`);

  connection.on('message', async message => {
    console.log(message.toString());
    const [command, coord, ...args] = message.toString().split(' ');
    const number = Number(coord);
    if (command == 'mouse_position') {
      let point = await mouse.getPosition();
      let pos = `mouse_position ${point.x},${point.y}`;
      connection.send(pos);
    }
    if (command == 'mouse_up') {
      await mouse.move(up(number));
      connection.send(command);
    }
    if (command == 'mouse_down') {
      await mouse.move(down(number));
      connection.send(command);
    }
    if (command == 'mouse_left') {
      await mouse.move(left(number));
      connection.send(command);
    }
    if (command == 'mouse_right') {
      await mouse.move(right(number));
      connection.send(command);
    }
    if (command == 'draw_square') {
      drawShape(number, number);
      connection.send(command);
    }
    if (command == 'draw_rectangle') {
      drawShape(number, +args[0]);
      connection.send(command);
    }
    if (command == 'draw_circle') {
      drawCircle(number);
      connection.send(command);
    }
    if (command == 'prnt_scrn') {
      let point = await mouse.getPosition();
      const width = 200;
      const height = 200;
      let xStart = point.x - width / 2;
      let yStart = point.y - height /2;

      const image = await screen.grabRegion(new Region(xStart, yStart, width, height));
      const base64 = await new Jimp(await image.toRGB()).getBase64Async(Jimp.MIME_PNG);
      const msg = `prnt_scrn ${base64.split(',')[1]}`;
      connection.send(msg );
    }
  });

  connection.on('close', () => {
    console.log(`Disconnect`);
  });
});

process.on('SIGINT', async () => {
  httpServer.close();
  socket.close();
  process.exit();
});
