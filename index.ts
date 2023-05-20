import { httpServer } from "./src/http_server/index.js";
import { mouse, left, right, up, down, Point, Button } from "@nut-tree/nut-js";
import {  WebSocketServer  }  from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket = new WebSocketServer({ port: 8080 });
socket.on('listening', () => console.log(8080))

socket.on('connection', async (connection, req) => {

  console.log(`Connect`);

  connection.on('message', async message => {
    console.log(message.toString());
    const [command, num, ...args] = message.toString().split(' ');

    if (command == 'mouse_position') {
      let point = await mouse.getPosition()
      let pos = `mouse_position ${point.x},${point.y}`
      console.log(pos)
      connection.send(pos)
    }
    if (command == 'mouse_up') {
      await mouse.move(up(Number(num)));
    }
    if (command == 'mouse_down') {
      await mouse.move(down(Number(num)));
    }
    if (command == 'mouse_left') {
      await mouse.move(left(Number(num)));
    }
    if (command == 'mouse_right') {
      await mouse.move(right(Number(num)));
    }
    if (command == 'draw_square') {
      await mouse.drag(right(Number(num)));
      await mouse.drag(down(Number(num)));
      await mouse.drag(left(Number(num)));
      await mouse.drag(up(Number(num)));
    }
    if (command == 'draw_rectangle') {
      await mouse.drag(right(Number(num)));
      await mouse.drag(down(Number(args[0])));
      await mouse.drag(left(Number(num)));
      await mouse.drag(up(Number(args[0])));
    }
    if (command == 'draw_circle') {

    const step = 0.01 * Math.PI;
      let point = await mouse.getPosition()
      let xStart = point.x;
      let yStart = point.y;
      let radius = Number(num);

      await mouse.pressButton(Button.LEFT)
      for (let i = 0; i < Math.PI * 2; i += step) {
        let x = xStart - radius + (radius * Math.cos(i));
        let y = yStart + (radius * Math.sin(i));
        await mouse.setPosition(new Point(x, y));
      }
      await mouse.releaseButton(Button.LEFT)
    }
  });

  connection.on('close', () => {
    console.log(`Disconnect`);
  });
});
