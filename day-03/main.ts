import { GetPuzzleInput } from "../common";

function main() {
  let input = GetPuzzleInput(3, 1);
  let rows = input.split('\n');
  let height = rows.length;
  let width = rows[0].length;
  let map: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    map[y] = [];
    for (let x = 0; x < width; x++) {
      map[y][x] = rows[y].charAt(x) == "#";
    }
  }
  let countA = CountTrees(map, 0, 0, 1, 1);
  let countB = CountTrees(map, 0, 0, 3, 1);
  let countC = CountTrees(map, 0, 0, 5, 1);
  let countD = CountTrees(map, 0, 0, 7, 1);
  let countE = CountTrees(map, 0, 0, 1, 2);
  let product = countA * countB * countC * countD * countE;
  console.log(`Calculated product is ${product}`);
}

function CountTrees(map: boolean[][],
  startX: number,
  startY: number,
  deltaX: number,
  deltaY: number,
  counted: number = 0): number {
  let height = map.length;
  let width = map[0].length-1;
  // end processing when we're past the bottom row
  if (startY >= height) return counted;
  // check if we're on a tree
  if (map[startY][startX]) counted += 1;
  // iterate after applying delta
  return CountTrees(map, (startX + deltaX) % width, startY + deltaY, deltaX, deltaY, counted);
}

main();