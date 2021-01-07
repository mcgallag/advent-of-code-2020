import { GetPuzzleInput } from "../common";

let input = GetPuzzleInput(6, 2);

let lines = input.split(input.includes("\r\n") ? "\r\n" : "\n");
partTwo();

function toIndex(ch: string): number {
  if (ch.length == 1) {
    return ch.charCodeAt(0) - "a".charCodeAt(0);
  }
  throw "Invalid input. ch must be single character";
}
function toChar(num: number): string {
  if (num < 0 || num > 25) throw "Invalid input. num must be between 0 and 25, inclusive."
  return String.fromCharCode(num + "a".charCodeAt(0));
}

function countVotes(answers: boolean[]): number {
  let count = 0;
  answers.forEach((curr) => {
    count += (curr) ? 1 : 0;
  });
  return count;
}


function partOne() {
  let total = 0;
  let answers: boolean[] = [];
  for (let i = 0; i < 26; i++) answers[i] = false;

  for (const line of lines) {
    if (line.length > 0) {
      // check each letter and mark true as they occur
      for (let i = 0; i < line.length; i++) {
        answers[toIndex(line[i])] = true;
      }
    } else {
      // tally the yes answers
      total += countVotes(answers);

      // reset the array for the next group
      answers = [];
    }
  }
  total += countVotes(answers);

  console.log(`Total yes answers across all passengers is ${total}`);
}

function partTwo() {
  let total = 0;
  let answers: boolean[] = [];
  for (let i = 0; i < 26; i++) answers[i] = true;

  for (const line of lines) {
    // check if we're starting a new group of passengers
    if (line.length > 0) {
      for (let i = 0; i < 26; i++) {
        if (!line.includes(toChar(i)) && answers[i] == true) {
          answers[i] = false;
        }
      }
    } else {
      // tally the votes for the group and start over for the next
      total += countVotes(answers);
      for (let i = 0; i < 26; i++) answers[i] = true;
    }
  }
  // last group
  total += countVotes(answers)
  console.log(`Total yes answers across all passengers is ${total}`);
}