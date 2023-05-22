import { mouse } from "@nut-tree/nut-js";

export const drawCircle = async (radius: number) => {
  const step = 0.01;
  let point = await mouse.getPosition();
  let xStart = point.x;
  let yStart = point.y;
  let points: {x:number, y:number}[] = [];
  
  for (let i = 0; i <= Math.PI * 2; i += step) {
    let x = xStart - radius + (radius * Math.cos(i));
    let y = yStart + (radius * Math.sin(i));
    points.push({x,y});
  };
  await mouse.drag(points);
};