export enum Cell {
  Floor,
  Empty,
  Occupied,
  Invalid
}

export class Grid {
  public height: number;
  public width: number;

  public stable: boolean;

  private _grid: Cell[];

  public get Occupied(): number {
    return this.count(Cell.Occupied);
  }

  constructor(width: number, height: number, public generation: number = 0) {
    this.width = width;
    this.height = height;
    this._grid = [];
    this.stable = false;
  }

  // for debugging
  public print(): string {
    let output = "";
    for (let y = 0; y < this.height; y++) {
      let line = "";
      for (let x = 0; x < this.width; x++) {
        switch (this.get(x, y)) {
          case Cell.Empty:
            line += "L";
            break;
          case Cell.Occupied:
            line += "#";
            break;
          case Cell.Floor:
            line += ".";
            break;
        }
      }
      line += "\n";
      output += line;
    }
    return output;
  }

  // construct grid from provided input
  static From(input: string[]): Grid {
    let height = input.length;
    let width = input[0].length;
    let g = new Grid(width, height);

    for (let y = 0; y < g.height; y++) {
      for (let x = 0; x < g.width; x++) {
        switch (input[y][x]) {
          case 'L':
            g.set(x, y, Cell.Empty);
            break;
          case '.':
            g.set(x, y, Cell.Floor);
            break;
          case '#':
            g.set(x, y, Cell.Occupied);
            break;
        }
      }
    }

    return g;
  }

  get(x: number, y: number): Cell {
    // out of bounds, return invalid
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return Cell.Invalid;
    
    let index = (y * this.width) + x;
    return this._grid[index];
  }

  set(x: number, y: number, type: Cell) {
    let index = (y * this.width) + x;
    this._grid[index] = type;
  }

  // how many of given type in entire grid
  count(type: Cell): number {
    let c = 0;
    for (let i = 0; i < this._grid.length; i++) {
      c += (this._grid[i] == type) ? 1 : 0;
    }
    return c;
  }

  // how many neighbors of a given type at given coordinates
  countNeighbors(x: number, y: number, type: Cell): number {
    let c = 0;
    c += (this.get(x - 1, y - 1) == type) ? 1 : 0;
    c += (this.get(x, y - 1) == type) ? 1 : 0;
    c += (this.get(x + 1, y - 1) == type) ? 1 : 0;
    c += (this.get(x - 1, y) == type) ? 1 : 0;
    c += (this.get(x + 1, y) == type) ? 1 : 0;
    c += (this.get(x - 1, y + 1) == type) ? 1 : 0;
    c += (this.get(x, y + 1) == type) ? 1 : 0;
    c += (this.get(x + 1, y + 1) == type) ? 1 : 0;
    return c;
  }

  // produce next generation based on current state
  iterate(): Grid {
    let next = new Grid(this.width, this.height, this.generation + 1);

    let swaps = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.get(x, y) == Cell.Floor) {
          // floors never change
          next.set(x, y, Cell.Floor);
        } else if (this.get(x, y) == Cell.Empty) {
          // seat is empty, see if no occupied neighbors
          if (this.countNeighbors(x, y, Cell.Occupied) == 0) {
            swaps++;
            next.set(x, y, Cell.Occupied);
          } else {
            next.set(x, y, Cell.Empty);
          }
        } else if (this.get(x, y) == Cell.Occupied) {
          // seat is occupied, count if neighbors is less than 4
          if (this.countNeighbors(x, y, Cell.Occupied) < 4) {
            next.set(x, y, Cell.Occupied);
          } else {
            swaps++;
            next.set(x, y, Cell.Empty);
          }
        }
      }
    }

    if (swaps == 0) {
      next.stable = true;
    }

    return next;
  }
}