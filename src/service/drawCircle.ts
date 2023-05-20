import { Button, Point, mouse } from "@nut-tree/nut-js";

export const drawCircle = async (radius: number) => {
  const step = 0.01 * Math.PI;
  let point = await mouse.getPosition()
  let xStart = point.x;
  let yStart = point.y;
  
  for (let i = 0; i < Math.PI * 2; i += step) {
    let x = xStart - radius + (radius * Math.cos(i));
    let y = yStart + (radius * Math.sin(i));
    await mouse.pressButton(Button.LEFT)
    await mouse.setPosition(new Point(x, y));
  }
  await mouse.releaseButton(Button.LEFT)
}