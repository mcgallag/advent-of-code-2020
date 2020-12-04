const fs = require('fs/promises');

const input = [
  "input00.txt", "input01.txt"
];
const input_index = 1;

fs.readFile("./day-01/" + input[input_index], "utf8")
  .then(txt => {
    let expenses = txt.split("\n").map(str => parseInt(str)).sort((a, b) => (a - b));
    let addends = searchForSum3(expenses, 2020);
    // let [x, y] = addends;
    // console.log(`${x} * ${y} = ${x * y}`);
    let [x, y, z] = addends;
    console.log(`${x} * ${y} * ${z} = ${x * y * z}`);
  });

/**
 * Searches array `arr` for two entries that sum to `search`
 * Returns an array containing the two addends
 */
function searchForSum(arr, search) {
  for (let i = 0; i < arr.length; i++) {
    let x = arr[i];
    for (let j = i + 1; j < arr.length && x + arr[j] <= search; j++) {
      let y = arr[j];
      if (x + y == search) {
        return [x, y];
      }
    }
  }
}

/**
 * Searches array `arr` for three entries that sum to `search`
 * Returns an array containing the three addends
 */
function searchForSum3(arr, search) {
  for (let i = 0; i < arr.length; i++) {
    let x = arr[i];
    for (let j = i + 1; j < arr.length && (x + arr[j] <= search); j++) {
      let y = arr[j];
      for (let k = j + 1; k < arr.length && (x + y + arr[k] <= search); k++) {
        let z = arr[k];
        if (x + y + z == search) {
          return [x, y, z];
        }
      }
    }
  }
}