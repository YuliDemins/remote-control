import { httpServer } from "./src/http_server/index.js";
import { mouse, left, right, up, down } from "@nut-tree/nut-js";
import { WebSocketServer }  from 'ws';
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
    const [command, coord, ...args] = message.toString().split(' ');
    const number = Number(coord);
    if (command == 'mouse_position') {
      let point = await mouse.getPosition()
      let pos = `mouse_position ${point.x},${point.y}`
      console.log(pos)
      connection.send(pos)
    }
    if (command == 'mouse_up') {
      await mouse.move(up(number));
    }
    if (command == 'mouse_down') {
      await mouse.move(down(number));
    }
    if (command == 'mouse_left') {
      await mouse.move(left(number));
    }
    if (command == 'mouse_right') {
      await mouse.move(right(number));
    }
    if (command == 'draw_square') {
      drawShape(number, number)
    }
    if (command == 'draw_rectangle') {
      drawShape(number, +args[0])
    }
    if (command == 'draw_circle') {
      drawCircle(number)
    }
    if (command == 'prnt_scrn') {
      console.log(1)
    }
  });

  connection.on('close', () => {
    console.log(`Disconnect`);
  });
});
