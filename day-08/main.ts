import { GetPuzzleInputAsLines } from "../common";

function main() {
  let input = GetPuzzleInputAsLines(8, 1);
  let handheld = new Computer(input);
  // part 1
  // try {
  //   while (handheld.run());
  // } catch (err) {
  //   console.log("Infinite loop encountered.");
  //   console.log(err);
  // }
  
  // part 2
  handheld.fix();
}

enum Opcode {
  acc = "acc",
  jmp = "jmp",
  nop = "nop"
}

interface Instruction {
  operation: Opcode,
  argument: number,
  executed: boolean
}

class Computer {
  private _ax: number;
  private _pc: number;
  private _program: Instruction[]

  constructor(input: string[]) {
    this._ax = 0;
    this._pc = 0;
    this._program = input.map(Computer.parseInstruction);
  }

  private reset() {
    this._ax = 0;
    this._pc = 0;
    for (let i = 0; i < this._program.length; i++) {
      this._program[i].executed = false;
    }
  }

  private static parseInstruction(instruction: string): Instruction {
    let [instr, arg] = instruction.split(" ");
    let op: Opcode;

    if (instr == "acc") {
      op = Opcode.acc;
    } else if (instr == "jmp") {
      op = Opcode.jmp;
    } else if (instr == "nop") {
      op = Opcode.nop;
    } else {
      throw "Invalid instruction encountered: " + instr;
    }

    return {
      operation: op,
      argument: parseInt(arg),
      executed: false
    };
  }

  // part 2
  public fix() {
    for (let i = 0; i < this._program.length; i++) {
      if (this._program[i].operation == Opcode.jmp ||
        this._program[i].operation == Opcode.nop) {
        // back up the original instruction
        let original: Instruction = {
          argument: this._program[i].argument,
          executed: false,
          operation: this._program[i].operation
        };
        // make the opcode swap
        this._program[i].operation = this._program[i].operation == Opcode.nop ? Opcode.jmp : Opcode.nop;
        try {
          while (this.run());
          // if it exits without throwing then the program terminated successfully
          console.log("FIX COMPLETE");
          console.log(`Swapped instruction ${i} from ${original.operation} to ${this._program[i].operation}`);
          console.log(`Exited with accumulator value: ${this._ax}`);
          return;
        } catch (err) {
          // infinite loop encountered, swap back opcodes
          this._program[i] = original;
          this.reset();
        }
      }
    }
  }

  public run(): boolean {
    let instr: Instruction = this.fetch();

    if (instr == undefined) {
      console.log("End of program");
      return false;
    }

    // part 1 condition, check for an instruction executed twice
    if (instr.executed) {
      throw `Second instruction execution detected!\nAccumulator value is ${this._ax}`;
    }

    let delta = this.execute(instr);
    this.complete(instr, delta);
    return true;
  }

  private fetch(): Instruction {
    return this._program[this._pc];
  }

  private complete(instr: Instruction, delta: number): void {
    instr.executed = true;
    this._program[this._pc] = instr;
    this._pc += delta;
  }

  private Decode(op: Opcode): (arg: number) => number {
    if (op == Opcode.acc) {
      return (arg) => this._acc(arg);
    } else if (op == Opcode.jmp) {
      return (arg) => this._jmp(arg);
    } else if (op == Opcode.nop) {
      return (arg) => this._nop(arg);
    } else {
      throw "Invalid opcode encountered! " + op;
    }
  }

  private execute(instr: Instruction): number {
    let op = this.Decode(instr.operation);
    return op(instr.argument);
  }

  private _acc(arg: number): number {
    this._ax += arg;
    return 1;
  }

  private _jmp(arg: number): number {
    return arg;
  }

  private _nop(arg: number): number {
    return 1;
  }
}

main();