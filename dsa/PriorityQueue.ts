import { StudentState } from '../types';

export interface ScoredScenario {
  score: number;
  state: StudentState;
  description: string;
}

/**
 * DSA: Priority Queue (Max Heap)
 * Purpose: Efficiently track the top N best simulation outcomes.
 * Time Complexity: Insertion O(log N), Extraction O(log N).
 */
export class ScenarioHeap {
  private heap: ScoredScenario[];

  constructor() {
    this.heap = [];
  }

  // Helper: Get parent index
  private parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  // Helper: Get left child
  private left(i: number): number {
    return 2 * i + 1;
  }

  // Helper: Get right child
  private right(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  public insert(scenario: ScoredScenario): void {
    this.heap.push(scenario);
    this.heapifyUp(this.heap.length - 1);
  }

  public extractMax(): ScoredScenario | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return root;
  }

  public peek(): ScoredScenario | undefined {
    return this.heap[0];
  }

  public size(): number {
    return this.heap.length;
  }

  public getAllSorted(): ScoredScenario[] {
    // Return a copy sorted (for display purposes)
    return [...this.heap].sort((a, b) => b.score - a.score);
  }

  private heapifyUp(i: number): void {
    let current = i;
    while (current > 0 && this.heap[current].score > this.heap[this.parent(current)].score) {
      this.swap(current, this.parent(current));
      current = this.parent(current);
    }
  }

  private heapifyDown(i: number): void {
    let largest = i;
    const l = this.left(i);
    const r = this.right(i);

    if (l < this.heap.length && this.heap[l].score > this.heap[largest].score) {
      largest = l;
    }

    if (r < this.heap.length && this.heap[r].score > this.heap[largest].score) {
      largest = r;
    }

    if (largest !== i) {
      this.swap(i, largest);
      this.heapifyDown(largest);
    }
  }
}