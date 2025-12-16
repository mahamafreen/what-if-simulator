import React from 'react';

const VivaDocs = () => {
  return (
    <div className="bg-deep-900/40 p-10 rounded-3xl border border-white/5 max-w-4xl mx-auto mt-6 text-slate-300 leading-relaxed shadow-xl backdrop-blur-sm">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">
        Project Documentation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section>
            <h2 className="text-lg font-bold text-white mb-4">
                1. Project Overview
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed text-justify">
                A simulation system that models the impact of daily habits on student performance using core Data Structures.
                It strictly relies on deterministic algorithms like DFS, BFS, and DP to predict states.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">
                2. Core Algorithms
            </h2>
            <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
                <li><strong>DFS</strong> for Tree Traversal</li>
                <li><strong>0/1 Knapsack</strong> for Scheduling</li>
                <li><strong>Min-Heap</strong> for Ranking</li>
            </ul>
          </section>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6">3. Data Structures & Complexity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5">
                <h3 className="text-magenta-400 font-bold mb-2">Decision Tree (N-ary)</h3>
                <p className="text-xs text-slate-500 mb-2">Models "What-If" scenarios. Pruning used for "Burnout" branches.</p>
                <div className="text-[10px] font-mono bg-black/30 p-2 rounded text-slate-400">Time: O(b^d) | Space: O(b^d)</div>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5">
                <h3 className="text-cyan-400 font-bold mb-2">State Graph</h3>
                <p className="text-xs text-slate-500 mb-2">Finite State Machine using Adjacency List for macro-states.</p>
                <div className="text-[10px] font-mono bg-black/30 p-2 rounded text-slate-400">Time: O(1) Lookup | Space: O(V+E)</div>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5">
                <h3 className="text-yellow-400 font-bold mb-2">Priority Queue</h3>
                <p className="text-xs text-slate-500 mb-2">Max Heap to efficiently retrieve top 3 best strategies.</p>
                <div className="text-[10px] font-mono bg-black/30 p-2 rounded text-slate-400">Insert: O(log N) | Pop: O(log N)</div>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5">
                <h3 className="text-emerald-400 font-bold mb-2">Dynamic Programming</h3>
                <p className="text-xs text-slate-500 mb-2">Tabulation method for the Knapsack problem.</p>
                <div className="text-[10px] font-mono bg-black/30 p-2 rounded text-slate-400">Time: O(N*W) | Space: O(N*W)</div>
            </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-6">4. Viva Questions Bank</h2>
        <div className="space-y-4">
            <div className="bg-slate-900/40 p-4 rounded-lg border-l-2 border-slate-700">
                <div className="font-bold text-slate-200 text-sm mb-1">Q: Why use DP instead of Greedy for scheduling?</div>
                <div className="text-xs text-slate-400">A: Greedy might choose a high-value task that consumes too much time, blocking other optimal tasks. DP mathematically guarantees the maximum total value by checking all valid combinations.</div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-lg border-l-2 border-slate-700">
                <div className="font-bold text-slate-200 text-sm mb-1">Q: How do you handle infinite loops in the simulation?</div>
                <div className="text-xs text-slate-400">A: The Decision Tree is strictly depth-limited (Depth = 3). We do not explore indefinitely, preventing stack overflow or infinite recursion.</div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default VivaDocs;