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

export function WriteOut(id: number, output: string) {
  let filename: string;
  if (id < 10) {
    filename = "000" + id + ".txt";
  } else if (id < 100) {
    filename = "00" + id + ".txt";
  } else if (id < 1000) {
    filename = "0" + id + ".txt";
  } else {
    filename = id + ".txt";
  }
  fs.writeFileSync("debug/" + filename, output);
}

export function WriteJson(filename: string, output: any) {
  fs.writeFileSync("debug/" + filename, JSON.stringify(output));
}