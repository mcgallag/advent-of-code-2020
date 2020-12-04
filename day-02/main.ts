import * as fs from "fs/promises";

const input = [
  "input00.txt", "input01.txt"
];
const input_index = 1;

fs.readFile("./day-02/" + input[input_index], "utf8")
  .then(txt => {
    let passwords = txt.split('\n');
    let valid = getValidPasswords(passwords);
    console.log("Number of valid passwords: " + valid.length);
  });

/**
 * Parses each password and policy. Returns an array of passwords
 * that are valid for the policy. 
 * @param arr list of passwords and policies to check against
 */
function getValidPasswords(arr: string[]): string[] {
  let valid: string[] = arr.filter(line => {
    // 5-14 l: lmlmnrzlglflll
    let [minmax, char, password] = line.split(' ');
    let [min, max] = minmax.split("-").map(str => parseInt(str));
    char = char[0];

    let passwordLetters = password.split("");
    let charMatches = passwordLetters.filter(letter => (letter == char));

    return (charMatches.length >= min) && (charMatches.length <= max);
  });

  return valid;
}