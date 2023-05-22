import { down, left, mouse, right, up } from "@nut-tree/nut-js";

export const drawShape = async (width: number, height: number) => {
  await mouse.drag(right(Number(width)));
  await mouse.drag(down(Number(height)));
  await mouse.drag(left(Number(width)));
  await mouse.drag(up(Number(height)));
};