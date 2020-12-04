import * as fs from "fs/promises";

const input = [
  "input00.txt", "input01.txt"
];
const input_index = 1;

fs.readFile("./day-02/" + input[input_index], "utf8")
  .then(txt => {
    let passwords = txt.split('\n');
    let valid = getValidSledPasswords(passwords);
    console.log("Number of valid sled passwords: " + valid.length);

    valid = getValidTobogganPasswords(passwords);
    console.log("Number of valid toboggan passwords: " + valid.length);
  });

/**
 * Parses line from puzzle input into a useable object
 * @param str line from puzzle input file
 */
function parseLine(str: string): {
  low: number,
  high: number,
  password: string,
  char: string
} {
  // 5-14 l: lmlmnrzlglflll
  let [minmax, char, password] = str.split(' ');
  let [low, high] = minmax.split("-").map(num => parseInt(num));
  char = char[0];

  return {
    low, high, password, char
  };
}

/**
 * Parses each password and sled rental policy. Returns an array of passwords
 * that are valid for the policy.
 * @param arr list of passwords and policies to check against
 */
function getValidSledPasswords(arr: string[]): string[] {
  let valid: string[] = arr.filter(line => {
    let o = parseLine(line);

    let passwordLetters = o.password.split("");
    let charMatches = passwordLetters.filter(letter => (letter == o.char));

    return (charMatches.length >= o.low) && (charMatches.length <= o.high);
  });

  return valid;
}

/**
 * Parses each password and toboggan rental policy. Returns an array of passwords
 * that are valid for the policy.
 * @param arr list of passwords and policies to check against
 */
function getValidTobogganPasswords(arr: string[]): string[] {
  let valid: string[] = arr.filter(line => {
    let o = parseLine(line);
    let ch1 = o.password[o.low - 1];
    let ch2 = o.password[o.high - 1];
    return (
      // XOR
      (ch1 == o.char || ch2 == o.char) && !(ch1 == o.char && ch2 == o.char)
    );
  });

  return valid;
}