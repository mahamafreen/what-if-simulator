import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { StudentState, LifeState } from './types';
import { DecisionTree } from './dsa/DecisionTree';
import { ScenarioHeap } from './dsa/PriorityQueue';
import { StateGraph } from './dsa/StateGraph';
import { SimulationCache } from './dsa/HashMap';
import DecisionTreeVis from './components/DecisionTreeVis';
import GraphVis from './components/GraphVis';
import DPSchedule from './components/DPSchedule';
import GPACalculator from './components/GPACalculator';

const App: React.FC = () => {
  // Input State
  const [study, setStudy] = useState(4);
  const [sleep, setSleep] = useState(7);
  const [social, setSocial] = useState(2);
  const [activeTab, setActiveTab] = useState<'sim' | 'gpa'>('sim');

  // Computed State
  const [currentLifeState, setCurrentLifeState] = useState<LifeState>(LifeState.FRESH);
  const [decisionTree, setDecisionTree] = useState<DecisionTree | null>(null);
  const [topScenarios, setTopScenarios] = useState<any[]>([]);
  
  // DSA Instances
  const heap = new ScenarioHeap();
  const graph = new StateGraph();
  const cache = new SimulationCache<string>();

  // Run Simulation
  const runSimulation = () => {
    // 1. Determine Current Graph State
    const stress = Math.max(0, (study * 5) - (sleep * 3) - (social * 2)); // Simple formula
    const newState = graph.determineState(study, sleep, stress);
    setCurrentLifeState(newState);

    // 2. Build Decision Tree (What if we change habits from here?)
    const baseState: StudentState = {
      studyHours: study,
      sleepHours: sleep,
      socialHours: social,
      exerciseHours: 1,
      stressLevel: stress,
      gpa: 3.5,
      energy: 80,
      day: 1
    };
    
    // Check Cache first (Demonstrating Hash Map)
    const cacheKey = cache.generateKey(baseState);
    if (!cache.get(cacheKey)) {
        cache.set(cacheKey, "Computed");
    }

    const tree = new DecisionTree(baseState, 3); // Depth 3
    setDecisionTree(tree);

    // 3. Populate Heap with Scenarios (Simulating variations)
    const variations = [
      { name: "Focus Study", study: study + 2, sleep: sleep, score: 0 },
      { name: "More Sleep", study: study, sleep: sleep + 2, score: 0 },
      { name: "More Social", study: study - 1, sleep: sleep, score: 0 },
      { name: "Balanced", study: study, sleep: sleep, score: 0 },
    ];

    variations.forEach(v => {
        // Simple scoring function
        const vStress = Math.max(0, (v.study * 5) - (v.sleep * 3));
        const vGpa = Math.min(4.0, 3.0 + (v.study * 0.1));
        const score = (vGpa * 20) + (v.sleep * 5) - (vStress * 0.5);
        
        heap.insert({
            score: score,
            description: v.name,
            state: { ...baseState, studyHours: v.study, sleepHours: v.sleep, gpa: vGpa, stressLevel: vStress }
        });
    });

    setTopScenarios(heap.getAllSorted().slice(0, 3));
  };

  useEffect(() => {
    runSimulation();
  }, [study, sleep, social]);

  // Helper for input buttons
  const adjustValue = (setter: React.Dispatch<React.SetStateAction<number>>, value: number, delta: number, min: number, max: number) => {
    const newValue = Math.min(Math.max(value + delta, min), max);
    setter(newValue);
  };

  return (
    <div className="min-h-screen p-6 font-sans text-slate-300">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto border-b border-white/5 pb-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              What-If Simulator
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Data Structures & Algorithms Project
            </p>
          </div>
        </div>
        
        <div className="flex bg-deep-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
            <button 
                onClick={() => setActiveTab('sim')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  activeTab === 'sim' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
                Daily Simulation
            </button>
            <button 
                onClick={() => setActiveTab('gpa')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'gpa' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
                GPA Calculator
            </button>
        </div>
      </header>

      {activeTab === 'gpa' && <GPACalculator />}
      
      {activeTab === 'sim' && (
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INPUTS & STATE */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls - Updated to not be bars */}
          <div className="bg-deep-900/40 rounded-2xl p-6 border border-white/5 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
            <h2 className="text-lg font-bold text-white mb-6">
                Daily Habits
            </h2>
            
            <div className="space-y-6 relative z-10">
              {/* Study Input */}
              <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Study Hours
                </label>
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => adjustValue(setStudy, study, -1, 0, 14)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-mono font-bold text-white">{study}h</span>
                    <button 
                        onClick={() => adjustValue(setStudy, study, 1, 0, 14)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {/* Sleep Input */}
              <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Sleep Hours
                </label>
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => adjustValue(setSleep, sleep, -1, 0, 12)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-mono font-bold text-white">{sleep}h</span>
                    <button 
                        onClick={() => adjustValue(setSleep, sleep, 1, 0, 12)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {/* Social Input */}
              <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Social Hours
                </label>
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => adjustValue(setSocial, social, -1, 0, 10)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-mono font-bold text-white">{social}h</span>
                    <button 
                        onClick={() => adjustValue(setSocial, social, 1, 0, 10)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current State Indicator */}
          <div className="bg-deep-900/40 rounded-2xl p-6 border border-white/5 shadow-2xl backdrop-blur-sm text-center relative overflow-hidden">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Current Status</h2>
            <div className={`text-3xl font-black tracking-tight ${
                currentLifeState === LifeState.BURNOUT ? 'text-red-500' : 
                currentLifeState === LifeState.FLOW ? 'text-emerald-400' : 'text-magenta-400'
            }`}>
                {currentLifeState}
            </div>
            {currentLifeState === LifeState.BURNOUT && (
                <div className="mt-4 text-xs font-bold text-red-200 bg-red-500/20 border border-red-500/30 p-2 rounded-lg flex items-center justify-center gap-2">
                    TAKE A BREAK
                </div>
            )}
          </div>

          {/* Heap Results */}
          <div className="bg-deep-900/40 rounded-2xl p-6 border border-white/5 shadow-2xl backdrop-blur-sm">
             <h2 className="text-lg font-bold text-white mb-6">
                Recommended Shifts
            </h2>
            <div className="space-y-3">
                {topScenarios.map((sc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-600">#{idx+1}</span>
                            <div>
                                <div className="text-sm font-bold text-slate-200">{sc.description}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Proj. GPA: {sc.state.gpa.toFixed(2)}</div>
                            </div>
                        </div>
                        <div className="text-lg font-mono font-bold text-yellow-500 drop-shadow-sm">
                            {sc.score.toFixed(0)}
                        </div>
                    </div>
                ))}
            </div>
          </div>

        </div>

        {/* MIDDLE: VISUALIZATION */}
        <div className="lg:col-span-6 space-y-6">
            
            {/* Tree View */}
            <div className="bg-deep-900/40 rounded-2xl border border-white/5 shadow-2xl overflow-hidden min-h-[450px] relative">
                 <div className="absolute top-0 left-0 right-0 bg-slate-900/80 backdrop-blur border-b border-white/5 p-4 z-20 flex justify-between items-center">
                    <h2 className="font-bold text-white">
                        Decision Tree
                    </h2>
                 </div>
                 <div className="p-8 pt-20 overflow-x-auto flex items-center justify-center min-h-[450px]">
                    {decisionTree && decisionTree.root && (
                        <div className="min-w-max scale-90 origin-top">
                            <DecisionTreeVis node={decisionTree.root} />
                        </div>
                    )}
                 </div>
            </div>

            {/* Graph View */}
             <div className="bg-deep-900/40 rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative h-[400px]">
                 <div className="absolute top-0 left-0 right-0 bg-slate-900/80 backdrop-blur border-b border-white/5 p-4 z-20 flex justify-between items-center">
                    <h2 className="font-bold text-white">
                        State Graph
                    </h2>
                 </div>
                 <div className="p-4 pt-16 h-full">
                    <GraphVis currentState={currentLifeState} />
                 </div>
             </div>

        </div>

        {/* RIGHT COLUMN: DP & INFO */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-deep-900/40 rounded-2xl p-6 border border-white/5 shadow-2xl backdrop-blur-sm">
                 <h2 className="text-lg font-bold text-white mb-2">
                    Schedule Optimization
                </h2>
                <div className="text-xs text-slate-500 font-medium mb-6 uppercase tracking-wider">
                   Suggested Tasks (DP)
                </div>
                <DPSchedule availableHours={Math.max(0, 24 - study - sleep - social - 2)} /> 
            </div>
        </div>

      </main>
      )}
    </div>
  );
};

export default App;