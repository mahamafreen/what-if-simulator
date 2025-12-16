import { StudentState } from '../types';

/**
 * DSA: Tree (N-ary Tree)
 * Purpose: Explore future outcomes based on branching decisions.
 * Traversal: DFS used to build/analyze.
 */

export class TreeNode {
  state: StudentState;
  children: TreeNode[];
  actionTaken: string;
  depth: number;

  constructor(state: StudentState, action: string, depth: number) {
    this.state = state;
    this.actionTaken = action;
    this.depth = depth;
    this.children = [];
  }
}

export class DecisionTree {
  root: TreeNode | null = null;
  maxDepth: number = 3;

  constructor(initialState: StudentState, maxDepth: number = 3) {
    this.maxDepth = maxDepth;
    this.root = new TreeNode(initialState, "Start", 0);
    this.buildTree(this.root);
  }

  // Recursive DFS to build the tree
  private buildTree(node: TreeNode): void {
    if (node.depth >= this.maxDepth) return;

    // Pruning: If burnout is too high, stop exploring this path (Dead End)
    if (node.state.stressLevel > 90 || node.state.energy < 10) {
      node.children.push(new TreeNode({ ...node.state }, "BURNOUT - STOP", node.depth + 1));
      return;
    }

    // Branch 1: Study More
    const studyState = this.simulateNextDay(node.state, "study");
    const child1 = new TreeNode(studyState, "Study +2h", node.depth + 1);
    node.children.push(child1);
    this.buildTree(child1);

    // Branch 2: Sleep More
    const sleepState = this.simulateNextDay(node.state, "sleep");
    const child2 = new TreeNode(sleepState, "Sleep +2h", node.depth + 1);
    node.children.push(child2);
    this.buildTree(child2);

    // Branch 3: Socialize
    const socialState = this.simulateNextDay(node.state, "social");
    const child3 = new TreeNode(socialState, "Social +2h", node.depth + 1);
    node.children.push(child3);
    this.buildTree(child3);
  }

  private simulateNextDay(current: StudentState, focus: "study" | "sleep" | "social"): StudentState {
    const next = { ...current, day: current.day + 1 };
    
    // Logic for state transitions (Simplified physics engine)
    if (focus === "study") {
      next.studyHours += 2;
      next.energy -= 15;
      next.stressLevel += 10;
      next.gpa = Math.min(4.0, next.gpa + 0.05);
    } else if (focus === "sleep") {
      next.sleepHours += 2;
      next.energy += 20;
      next.stressLevel -= 15;
    } else if (focus === "social") {
      next.socialHours += 2;
      next.stressLevel -= 20;
      next.energy -= 5;
      next.gpa = Math.max(0, next.gpa - 0.02);
    }

    // Clamping
    next.stressLevel = Math.max(0, Math.min(100, next.stressLevel));
    next.energy = Math.max(0, Math.min(100, next.energy));

    return next;
  }

  // BFS to get all nodes for visualization
  public traverseBFS(): TreeNode[] {
    const result: TreeNode[] = [];
    if (!this.root) return result;

    const queue: TreeNode[] = [this.root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node);
      for (const child of node.children) {
        queue.push(child);
      }
    }
    return result;
  }
}