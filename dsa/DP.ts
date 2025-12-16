import { Task } from '../types';

/**
 * DSA: Dynamic Programming (0/1 Knapsack Variant)
 * Purpose: Optimize schedule to maximize productivity points within time limit.
 * Complexity: Time O(N*W), Space O(N*W) or O(W) with optimization.
 */

export class ScheduleOptimizer {
  
  // Memoization Table
  private memo: Map<string, number> = new Map();

  public solve(tasks: Task[], capacity: number): { maxValue: number, selectedTasks: Task[] } {
    const n = tasks.length;
    // DP Table: dp[i][w] = max value using first i items with weight limit w
    const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

    // Fill table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const { cost, value } = tasks[i - 1];
        if (cost <= w) {
          dp[i][w] = Math.max(
            value + dp[i - 1][w - cost], // Include item
            dp[i - 1][w]                 // Exclude item
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find selected items
    const selectedTasks: Task[] = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedTasks.push(tasks[i - 1]);
        w -= tasks[i - 1].cost;
      }
    }

    return { maxValue: dp[n][capacity], selectedTasks };
  }
}