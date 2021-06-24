import { GetPuzzleInputAsLines } from "../common";

const PREAMBLE_LENGTH = 25;

class DataSequence {
  private _data: number[];
  private readonly length: number;
  constructor(preamble: number[]) {
    this._data = [...preamble];
    this.length = preamble.length;
  }
  check(v: number): boolean {
    let result: boolean = false;
    for (let i = 0; i < this._data.length && !result; i++) {
      for (let j = i + 1; j < this._data.length && !result; j++) {
        if (this._data[i] + this._data[j] == v) {
          result = true;
        }
      }
    }
    return result;
  }

  findWeakness(v: number): number[] {
    let sum: number = 0;
    for (let i = 0; i < this._data.length; i++) {
      sum = this._data[i];
      for (let j = i+1; j < this._data.length && sum < v; j++) {
        sum += this._data[j];
        if (sum == v) {
          return this._data.slice(i, j+1);
        }
      }
    }
    throw "No result found!";
  }

  push(v: number): void {
    this._data.shift();
    this._data.push(v)
  }
}

function main() {
  let input = GetPuzzleInputAsLines(9, 1).map(str => parseInt(str));
  let originalDataSeq = new DataSequence(input);
  let preamble: number[] = [];
  for (let i = 0; i < PREAMBLE_LENGTH; i++) {
    preamble.push(input.shift() as number);
  }
  let datseq = new DataSequence(preamble);
  while (input.length > 0) {
    let value = input.shift();
    if (value !== undefined) {
      if (!datseq.check(value)) {
        console.log(`${value} return false`);
        // part 2 insertion here
        let weakness = originalDataSeq.findWeakness(value);
        weakness.sort();
        console.log(`Min: ${weakness[0]}, Max: ${weakness[weakness.length-1]}, Sum: ${weakness[0] + weakness[weakness.length-1]}`);
        return;
      }
      datseq.push(value);
    }
  }
  console.log("All values returned true");
}

main();
