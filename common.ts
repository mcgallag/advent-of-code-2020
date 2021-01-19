import * as fs from "fs";

export function GetPuzzleInput(day: number, index: number): string {
  function leftPad(x: number): string {
    return (x < 10) ? "0" + x : "" + x;
  }
  let path = "./day-" + leftPad(day) + "/input" + leftPad(index) + ".txt";
  return fs.readFileSync(path, "utf8");
}

export function GetPuzzleInputAsLines(day: number, index: number): string[] {
  let input = GetPuzzleInput(day, index);
  if (input.includes("\r\n")) {
    return input.split("\r\n");
  } else {
    return input.split("\n");
  }
}