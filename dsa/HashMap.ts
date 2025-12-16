/**
 * DSA: Hash Map
 * Purpose: Cache simulation results to prevent re-computation O(1) Access.
 */
export class SimulationCache<T> {
  private cache: Map<string, T>;

  constructor() {
    this.cache = new Map();
  }

  // Create a unique key based on simulation parameters
  public generateKey(params: any): string {
    return JSON.stringify(params);
  }

  public get(key: string): T | undefined {
    return this.cache.get(key);
  }

  public set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  public clear() {
    this.cache.clear();
  }

  public size() {
    return this.cache.size;
  }
}