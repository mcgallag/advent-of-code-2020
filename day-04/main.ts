import { GetPuzzleInput } from "../common";

const required = [
  "byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"
];

function main() {
  let input = GetPuzzleInput(4, 1).split('\r\n');
  let validCount = 0;
  let invalidCount = 0;
  let current: { [index: string]: string } = {};

  while (input.length != 0) {
    let line = input.shift();
    if (line) {
      if (line.length == 0) {
        // check if is valid passport and start a new one
        if (IsPassportValid(current)) {
          validCount += 1;
        } else {
          invalidCount += 1;
        }
        current = {};
      } else {
        // parse passport input
        let pairs = line.split(' ');
        for (const pair of pairs) {
          let [key, value] = pair.split(":");
          current[key] = value;
        }
      }
    }
  }
  console.log(`Found ${validCount} valid passports in input.`);
  console.log(`Found ${invalidCount} invalid passports in input.`);
}

function IsPassportValid(passport: { [index: string]: string }): boolean {
  let keys = Object.keys(passport);
  for (const requiredField of required) {
    // check if required field is present
    if (!keys.includes(requiredField)) return false;
    let value = passport[requiredField];
    // validate field entry
    switch (requiredField) {
      case "byr":
        // 4 digits, at least 1920, at most 2002
        let year = parseInt(value);
        if (value.length != 4 ||
          year == NaN ||
          year < 1920 ||
          year > 2002) return false;
        break;
      case "iyr":
        // 4 digits, at least 2010, at most 2020
        year = parseInt(value);
        if (value.length != 4 ||
          year == NaN ||
          year < 2010 ||
          year > 2020) return false;
        break;
      case "eyr":
        // 4 digits, at least 2020, at most 2030
        year = parseInt(value);
        if (value.length != 4 ||
          year < 2020 ||
          year > 2030) return false;
        break;
      case "hgt":
        // number + cm/in
        // cm at least 150, at most 193
        // in at least 59, at most 76
        let re = /(\d+)(cm|in)/;
        let match = value.match(re);
        if (match) {
          let hgt = parseInt(match[1]);
          let unit = match[2];
          let min = (unit == "cm") ? 150 : 59;
          let max = (unit == "cm") ? 193 : 76;
          if (hgt == NaN ||
            hgt < min ||
            hgt > max) return false;
        } else {
          // Regexp did not find anything valid
          return false;
        }
        break;
      case "hcl":
        // # character plus 6 characters 0-9 or A-F
        re = /#[a-fA-F0-9]{6}/;
        match = value.match(re);
        if (value.length != 7 || !match) return false;
        break;
      case "ecl":
        // must be one of provided defined values
        const validEcl = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
        if (!validEcl.includes(value)) return false;
        break;
      case "pid":
        // 9 digit number, including leading zeros
        re = /^\d{9}$/;
        match = value.match(re);
        if (value.length != 9 || match == null) return false;
        break;
      default:
        break;
    }
  }
  // all validations passed
  return true;
}

main();