import { LifeState } from '../types';

/**
 * DSA: Directed Graph (Adjacency List)
 * Purpose: Model complex state transitions (Finite State Machine).
 */

export class StateGraph {
  adjacencyList: Map<LifeState, LifeState[]>;

  constructor() {
    this.adjacencyList = new Map();
    this.initGraph();
  }

  private initGraph() {
    // Initialize nodes
    Object.values(LifeState).forEach(state => {
      this.adjacencyList.set(state, []);
    });

    // Define Transitions (Edges)
    this.addEdge(LifeState.FRESH, LifeState.BALANCED);
    this.addEdge(LifeState.FRESH, LifeState.TIRED);
    
    this.addEdge(LifeState.BALANCED, LifeState.FLOW);
    this.addEdge(LifeState.BALANCED, LifeState.TIRED);
    this.addEdge(LifeState.BALANCED, LifeState.STRESSED);

    this.addEdge(LifeState.TIRED, LifeState.FRESH); // After rest
    this.addEdge(LifeState.TIRED, LifeState.STRESSED);
    this.addEdge(LifeState.TIRED, LifeState.BURNOUT);

    this.addEdge(LifeState.STRESSED, LifeState.TIRED);
    this.addEdge(LifeState.STRESSED, LifeState.BURNOUT);
    
    this.addEdge(LifeState.FLOW, LifeState.TIRED); // Flow consumes energy
    this.addEdge(LifeState.FLOW, LifeState.BALANCED);

    this.addEdge(LifeState.BURNOUT, LifeState.FRESH); // Recovery
  }

  public addEdge(from: LifeState, to: LifeState) {
    this.adjacencyList.get(from)?.push(to);
  }

  // Determine next state based on inputs
  public determineState(study: number, sleep: number, stress: number): LifeState {
    if (stress > 80) return LifeState.BURNOUT;
    if (stress > 60) return LifeState.STRESSED;
    if (sleep < 5) return LifeState.TIRED;
    if (study > 6 && stress < 40 && sleep > 7) return LifeState.FLOW;
    if (sleep > 7 && study > 2) return LifeState.BALANCED;
    return LifeState.FRESH;
  }

  public getTransitions(state: LifeState): LifeState[] {
    return this.adjacencyList.get(state) || [];
  }
}