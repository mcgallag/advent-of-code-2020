import { GetPuzzleInputAsLines, } from "../common";

interface ICommand {
  action: string;
  value: number;
}

class Vector {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `(${this.x},${this.y})`;
  }

  add(x: number, y: number): void;
  add(v: Vector): void;
  add(a: any, b?: any): void {
    if (typeof (a) == "number") {
      this.x += a;
      this.y += b;
    } else {
      this.x += a.x;
      this.y += a.y;
    }
  }

  scale(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor);
  }
}

function CreateCommand(str: string): ICommand {
  return {
    action: str.substring(0, 1),
    value: parseInt(str.substring(1))
  }
}

class ShipComputer {
  private _instructions: ICommand[];
  public complete: boolean;
  private _orientation: Vector;
  private _position: Vector;
  private _waypoint: Vector;

  private constructor() {
    this._instructions = [];
    this.complete = false;
    this._orientation = new Vector(1, 0);
    this._position = new Vector(0, 0);
    this._waypoint = new Vector(10, 1);
  }

  private _turnCW(degrees: number) {
    this._turnCCW(-degrees);
  }

  private _turnCCW(degrees: number) {
    let rad = (degrees / 180) * Math.PI;
    let x = this._orientation.x;
    let y = this._orientation.y;
    this._orientation.x = Math.round((x * Math.cos(rad)) - (y * Math.sin(rad)));
    this._orientation.y = Math.round((x * Math.sin(rad)) + (y * Math.cos(rad)));
  }

  private _rotateWaypointCW(degrees: Number) {
    this._rotateWaypointCCW(-degrees);
  }

  private _rotateWaypointCCW(degrees: number) {
    let rad = (degrees / 180) * Math.PI;
    let x = this._waypoint.x;
    let y = this._waypoint.y;
    this._waypoint.x = Math.round((x * Math.cos(rad)) - (y * Math.sin(rad)));
    this._waypoint.y = Math.round((x * Math.sin(rad)) + (y * Math.cos(rad)));
  }

  static From(input: string[]): ShipComputer {
    let sc = new ShipComputer();
    sc._instructions = input.map(CreateCommand);
    return sc;
  }

  public print() {
    console.log("Ship Status:");
    console.log(`  Position: ${this._position.toString()}`);
    console.log(`  Orientation: ${this._orientation.toString()}`);
    console.log(`  Manhattan Distance: ${Math.abs(this._position.x) + Math.abs(this._position.y)}`);
  }

  // part 1 action definitions
  public tick1() {
    let cmd = this._instructions.shift();
    if (cmd == undefined) {
      this.complete = true;
      return;
    }
    switch (cmd.action) {
      case "N":
        this._position.add(0, cmd.value);
        break;
      case "S":
        this._position.add(0, -cmd.value);
        break;
      case "E":
        this._position.add(cmd.value, 0);
        break;
      case "W":
        this._position.add(-cmd.value, 0);
        break;
      case "F":
        this._position.add(this._orientation.scale(cmd.value));
        break;
      case "L":
        this._turnCCW(cmd.value);
        break;
      case "R":
        this._turnCW(cmd.value);
        break;
    }
  }

  // part 2 action definitions
  public tick2() {
    let cmd = this._instructions.shift();
    if (cmd == undefined) {
      this.complete = true;
      return;
    }
    switch (cmd.action) {
      case "N":
        this._waypoint.add(0, cmd.value);
        break;
      case "S":
        this._waypoint.add(0, -cmd.value);
        break;
      case "E":
        this._waypoint.add(cmd.value, 0);
        break;
      case "W":
        this._waypoint.add(-cmd.value, 0);
        break;
      case "F":
        this._position.add(this._waypoint.scale(cmd.value));
        break;
      case "L":
        this._rotateWaypointCCW(cmd.value);
        break;
      case "R":
        this._rotateWaypointCW(cmd.value);
        break;
    }
  }
}

function main() {
  let input = GetPuzzleInputAsLines(12, 1);
  let computer = ShipComputer.From(input);

  // part 1
  console.log("Puzzle part 1:");
  while (!computer.complete) {
    computer.tick1();
  }
  computer.print();

  // part 2
  console.log("\nPuzzle part 2:");
  computer = ShipComputer.From(input);
  while (!computer.complete) {
    computer.tick2();
  }
  computer.print();
}

main();