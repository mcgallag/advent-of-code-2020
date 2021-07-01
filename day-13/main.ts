import { GetPuzzleInputAsLines } from "../common";

interface BusDeparture {
  id: number;
  time: number;
}

class BusProcessor {
  public readonly StartTime: number;
  public BusIDs: number[];


  public get Earliest(): BusDeparture {
    for (let time = this.StartTime; true; time++) {
      for (let index = 0; index < this.BusIDs.length; index++) {
        if (time % this.BusIDs[index] == 0) {
          return {
            id: this.BusIDs[index],
            time: time
          };
        }
      }
    }
  }

  private constructor(start: number, ids: string[]) {
    this.StartTime = start;
    this.BusIDs = ids.filter(str => (str != 'x')).map(str => parseInt(str));
  }

  static From(input: string[]): BusProcessor {
    let bp = new BusProcessor(parseInt(input[0]), input[1].split(','));

    return bp;
  }
}

function main() {
  let input0 = GetPuzzleInputAsLines(13, 0);
  let input1 = GetPuzzleInputAsLines(13, 1);
  let bp0 = BusProcessor.From(input0);
  let bp1 = BusProcessor.From(input1);
  let departure0 = bp0.Earliest;
  console.log("Part 1, Input 1");
  console.log(`The earliest bus is ID ${departure0.id} and will leave at ${departure0.time}.`);
  console.log(`Puzzle output is ${departure0.id * (departure0.time - bp0.StartTime)}.`);
  console.log("\nPart 1, Input 2");
  let departure1 = bp1.Earliest;
  console.log(`The earliest bus is ID ${departure1.id} and will leave at ${departure1.time}.`);
  console.log(`Puzzle output is ${departure1.id * (departure1.time - bp1.StartTime)}.`);
}

main();