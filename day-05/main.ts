import { GetPuzzleInput } from "../common";

interface AirplaneSeat {
  code: string,
  row: number,
  column: number,
  id: number
}

interface NumberSpan {
  min: number,
  max: number
}

/**
 * Parses puzzle input to determine seat row/column/id
 * @param input encoded string from input
 */
function ParseAirplaneCode(input: string): AirplaneSeat {
  function ParseChar(span: NumberSpan, ch: string): NumberSpan {
    // just in case, shouldn't ever trigger due to puzzle definition
    if (span.min == span.max) {
      return span;
    }
    if (ch == "F" || ch == "L") {
      return {
        min: span.min,
        max: span.min + Math.floor((span.max - span.min) / 2)
      };
    } else if (ch == "B" || ch == "R") {
      return {
        min: span.min + Math.ceil((span.max - span.min) / 2),
        max: span.max
      };
    }
    // just in case puzzle input is invalid
    throw "Unrecognized input char: " + ch;
  }
  let rowSpan: NumberSpan = {
    min: 0,
    max: 127
  };
  for (let ch = 0; ch < 7; ch++) {
    rowSpan = ParseChar(rowSpan, input[ch]);
  }
  let colSpan: NumberSpan = {
    min: 0,
    max: 7
  };
  for (let ch = 7; ch < 10; ch++) {
    colSpan = ParseChar(colSpan, input[ch]);
  }
  return {
    code: input,
    row: rowSpan.min,
    column: colSpan.min,
    id: rowSpan.min * 8 + colSpan.min
  };
}

let lines = GetPuzzleInput(5, 0).split("\r\n");

// parse every boarding pass
let seats = lines.map(line => ParseAirplaneCode(line));
// sort by ID
seats.sort((a, b) => {
  return a.id - b.id;
});

console.log("Maximum seat ID is: " + seats[seats.length-1].id);

// find missing seat, should trigger twice, for both previous and next seat
// won't work if missing seat is the first or last, but puzzle states
// missing seat is not in the first or last row
for (let i = 0; i < (seats.length - 1); i++) {
  if (seats[i].row != 1) {
    // check surrounding IDs for an unassigned seat
    if (seats[i - 1].id != (seats[i].id - 1)) {
      console.log("Anomaly detected!");
      console.log("Missing seat ID is: " + (seats[i].id - 1))
    } else if (seats[i + 1].id != (seats[i].id + 1)) {
      console.log("Anomaly detected!");
      console.log("Missing seat ID is: " + (seats[i].id + 1))
    }
  }
}
