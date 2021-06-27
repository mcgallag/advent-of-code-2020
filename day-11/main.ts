import { GetPuzzleInputAsLines } from "../common";
import { Grid } from "./Grid";

function main() {
  let input = GetPuzzleInputAsLines(11, 1);

  let grid = Grid.From(input);

  while (!grid.stable) {
    grid = grid.iterate();
  }

  console.log(`Number of seats occupied: ${grid.Occupied}`);
}

main();