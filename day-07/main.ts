// Puzzle Description: https://adventofcode.com/2020/day/7
import { GetPuzzleInput } from "../common";

function main() {
  let file = GetPuzzleInput(7, 1);
  let g = AcyclicDigraph.ParseGraphFromInput(file);
  let shinyGoldId = g.get_vertex_num("shiny gold");

  // part 1
  let total = g.findAncestors(shinyGoldId).length;
  console.log("Result is: " + total);

  // part 2
  let cost = g.getCostOfBag(shinyGoldId);
  console.log("Result is: " + cost + " bags.");
}

// not fully tested
class AcyclicDigraph {
  private _adjacencyMatrix: number[][];
  private _vertexIds: string[];
  private _nextIndex: number;

  constructor() {
    this._adjacencyMatrix = [];
    this._vertexIds = [];
    this._nextIndex = 0;
  }

  /**
   * Parses puzzle input to build a directed acyclic graph with edge weights
   * @param input raw file input
   */
  static ParseGraphFromInput(input: string): AcyclicDigraph {
    let lines = input.split(input.includes("\r\n") ? "\r\n" : "\n");
    let g = new AcyclicDigraph();
    for (const line of lines) {
      let [subject, predicate] = line.split(" contain ");
      // subject
      let subjectId = subject.substring(0, subject.length - 5);
      g.add_vertex_by_id(subjectId);
      // predicate
      if (predicate != "no other bags.") {
        // remove period
        predicate = predicate.substring(0, predicate.length - 1);
        let components = predicate.split(", ");
        // 2 shiny gold bags, 9 faded blue bags
        for (const component of components) {
          // bags or bag
          let trimLength = (component[component.length - 1] == 's') ? 5 : 4;
          let trimmed = component.substring(0, component.length - trimLength);
          // 2 shiny gold, 9 faded blue
          let pivot = trimmed.indexOf(" ");
          let qty = parseInt(trimmed.slice(0, pivot));
          let componentId = trimmed.slice(pivot + 1);
          g.add_vertex_by_id(componentId);
          g.add_edge_by_id(subjectId, componentId, qty);
        }
      }
    }
    return g;
  }

  // adjacent(G, x, y): tests whether there is an edge from the vertex x to vertex y
  public adjacent(x: number, y: number): boolean {
    return this._adjacencyMatrix[x][y] !== undefined;
  }

  // neighbors(G, x): lists all vertices y such that there is an edge from the vertex x to vertex y
  public neighbors(x: number): number[] {
    let xNeighbors = this._adjacencyMatrix[x];
    let neighborIndex: number[] = [];
    for (let i = 0; i < xNeighbors.length; i++) {
      if (xNeighbors[i] !== undefined) {
        neighborIndex.push(i);
      }
    }
    return neighborIndex;
  }
  // get_sending_neighbors(G, x): lists all vertices y such that there is an edge from the vertex y to vertex x;
  public get_sending_neighbors(x: number): number[] {
    let neighborIndex: number[] = [];

    for (let i = 0; i < this._adjacencyMatrix.length; i++) {
      if (this._adjacencyMatrix[i][x] !== undefined) {
        neighborIndex.push(i);
      }
    }

    return neighborIndex;
  }

  // add_vertex(G, x): adds the vertex x, if not there already
  public add_vertices(...arg: number[]): void {
    for (let i = 0; i < arg.length; i++) {
      this.add_vertex(arg[i]);
    }
  }
  public add_vertex(x: number, id: string = ""): void {
    if (this._adjacencyMatrix[x] === undefined) {
      this._adjacencyMatrix[x] = [];
      this._vertexIds[x] = id;
    }
  }
  public add_vertex_by_id(id: string): void {
    if (!this._vertexIds.includes(id)) {
      this.add_vertex(this._nextIndex++, id);
    }
  }

  public get_vertex_id(x: number): string {
    return this._vertexIds[x];
  }
  public get_vertex_num(id: string): number {
    return this._vertexIds.indexOf(id);
  }

  // remove_vertex(G, x): removes the vertex x, if it is there
  public remove_vertex(x: number): void {
    if (this._adjacencyMatrix[x] !== undefined) {
      // get first chunk
      let first: any = this._adjacencyMatrix.slice(0, x);
      // get second chunk
      let second = this._adjacencyMatrix.slice(x + 1);
      for (let i = 0; i < second.length; i++) {
        first[x + 1 + i] = second[i];
      }
      this._adjacencyMatrix[x] = first;
    }
  }
  // add_edge(G, x, y): adds the edge from the vertex x to the vertex y, if not already there
  public add_edge(x: number, y: number, v: number = 1): void {
    if (this._adjacencyMatrix[x][y] == 0 || this._adjacencyMatrix[x][y] === undefined) {
      this._adjacencyMatrix[x][y] = v;
    }
  }
  public add_edge_by_id(x: string, y: string, v: number = 1): void {
    let numX = this.get_vertex_num(x);
    let numY = this.get_vertex_num(y);
    this.add_edge(numX, numY, v);
  }
  // remove_edge(G, x, y): removes the edge from the vertex x to the vertex y, if it is there
  public remove_edge(x: number, y: number): void {
    if (this._adjacencyMatrix[x][y] > 0) {
      this._adjacencyMatrix[x][y] = 0;
    }
  }
  // get_vertex_value(G, x): returns the value associated with the vertex x
  public get_vertex_value(x: number): number {
    throw "Not implemented";
  }
  // set_vertex_value(G, x, v): sets the value associated with the vertex x to v
  public set_vertex_value(x: number, v: number): void {
    throw "Not implemented";
  }
  /** get_edge_value(G, x, y): gets the value associated with the edge (x, y) */
  public get_edge_value(x: number, y: number): number {
    return this._adjacencyMatrix[x][y];
  }
  // set_edge_value(G, x, y, v): sets the value associated with the edge (x, y) to v
  public set_edge_value(x: number, y: number, v: number): void {
    this._adjacencyMatrix[x][y] = v;
  }

  /**
   * Returns an array of indices `y` such that there exists an edge from `y` to `num`
   * @param num vertex index to find the ancestors of
   * @param prefix for debugging
   * @param currentResults ancestor vertex index we have already explored
   */
  public findAncestors(x: number, currentResults: number[] = []): number[] {
    // get list of immediate ancestors that edge to this specific vertex
    let containsNum = this.get_sending_neighbors(x);

    // filter out any vertex we've already identified as ancestors to avoid duplicates
    containsNum = containsNum.filter(value => !currentResults.includes(value));
    // add new ancestors to results
    currentResults.push(...containsNum);

    // recurse for each new ancestor
    containsNum.forEach(parentNum => this.findAncestors(parentNum, currentResults));

    return currentResults;
  }

  /**
   * Returns the number of bags contained by a bag identified by `num`
   * @param num vertex index of parent bag
   */
  public getCostOfBag(num: number): number {
    // get the children of this particular bag
    let children = this.neighbors(num);

    let totalImmediateBagChildren = 0;
    for (const childNum of children) {
      // how many of this child bag does parent bag contain
      let numberOfChildBags = this.get_edge_value(num, childNum);
      totalImmediateBagChildren += numberOfChildBags;
      // how many bags does this child bag contain? scale by how many child bags there are
      totalImmediateBagChildren += this.getCostOfBag(childNum) * numberOfChildBags;
    }
    return totalImmediateBagChildren;
  }
}

main();