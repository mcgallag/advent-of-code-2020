import { GetPuzzleInputAsLines } from "../common";

function main() {
  let input = GetPuzzleInputAsLines(10, 2).map(str => parseInt(str));
  // part 2
  ParseInput(input);
  // part 1
  // let output = CheckAdapters(input);
  // console.log(`1-jolt differences: ${output[1]}`);
  // console.log(`2-jolt differences: ${output[2]}`);
  // console.log(`3-jolt differences: ${output[3]}`);
  // console.log(`${output[1]} * ${output[3]} = ${output[1] * output[3]}`);
}

function CheckAdapters(input: number[]): number[] {
  let result = [0, 0, 0, 0];
  input.sort((a,b) => (a-b));

  // initial from outlet
  let joltage = 0;

  for (let i = 0; i < input.length; i++) {
    let diff = input[i] - joltage;
    result[diff] += 1;
    joltage = input[i];
  }

  // final connection is always +3 jolts
  result[3] += 1;

  return result;
}

class Tree {
  private _nodes: Node[];
  public root: Node;
  constructor(root: number) {
    this.root = new Node(root);
    this._nodes = [this.root];
  }
  contains(value: number): Node | undefined {
    return this._nodes.find(node => (node.value == value));
  }
  add(v: number) {
    if (this._nodes.some(n => (n.value == v))) {
      throw `Error adding node, duplicate node value ${v}`;
    }
    let node = new Node(v);
    // check if we have +1 +2 or +3 joltage adapter
    let c1 = this.contains(v+1);
    let c2 = this.contains(v+2);
    let c3 = this.contains(v+3);
    // add them as children if we found them
    if (c1) {
      node.children.push(c1);
    }
    if (c2) {
      node.children.push(c2);
    }
    if (c3) {
      node.children.push(c3);
    }
    // if this is a leaf node, then it is itself a terminating branch
    if (node.children.length == 0) {
      node.terminations = 1;
    } else {
      // otherwise, add the child branch termination count as this parent node's termination count
      node.children.forEach(child => node.terminations += child.terminations);
    }
    // if we're within reach of the root node, then add it as a child to it
    if (v <= 3) {
      this.root.children.push(node);
      this.root.terminations += node.terminations;
    }
    // add to tree
    this._nodes.push(node);
  }
}

class Node {
  public children: Node[];
  public terminations: number;
  
  constructor(public value: number) {
    this.children = [];
    this.terminations = 0;
  }
}

function ParseInput(input: number[]) {
  input.sort((a,b) => (a-b));
  // set up tree with root node with joltage 0
  let tree = new Tree(0);
  for (let i = (input.length - 1); i >= 0; i--) {
    tree.add(input[i]);
  }
  console.log(tree.root.terminations);
}

main();