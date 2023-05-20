import { httpServer } from "./src/http_server/index.js";
import { mouse, left, right, up, down, Point, Button } from "@nut-tree/nut-js";
import { WebSocketServer  }  from 'ws';
import { drawShape } from "./src/service/drawShape.js";
import { drawCircle } from "./src/service/drawCircle.js";

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(+HTTP_PORT);

const socket = new WebSocketServer({ port: +WS_PORT });
socket.on('listening', () => console.log(WS_PORT))

socket.on('connection', async (connection) => {

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
      drawShape(num, num)
    }
    if (command == 'draw_rectangle') {
      drawShape(num, args[0])
    }
    if (command == 'draw_circle') {
      drawCircle(num)
    }
    if (command == 'prnt_scrn') {
      console.log(1)
    }
  });

  connection.on('close', () => {
    console.log(`Disconnect`);
  });
});
