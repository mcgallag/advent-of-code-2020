import * as fs from "fs";

export function GetPuzzleInput(day: number, index: number): string {
  function leftPad(x: number): string {
    return (x < 10) ? "0" + x : "" + x;
  }
  let path = "./day-" + leftPad(day) + "/input" + leftPad(index) + ".txt";
  return fs.readFileSync(path, "utf8");
}