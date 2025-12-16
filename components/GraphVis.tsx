import React, { useRef } from 'react';
import { StateGraph } from '../dsa/StateGraph';
import { LifeState } from '../types';

interface Props {
  currentState: LifeState;
}

const GraphVis: React.FC<Props> = ({ currentState }) => {
  const graph = useRef(new StateGraph());
  
  const positions: Record<string, { x: number, y: number }> = {
    [LifeState.FRESH]: { x: 80, y: 60 },
    [LifeState.BALANCED]: { x: 300, y: 60 },
    [LifeState.FLOW]: { x: 500, y: 60 },
    [LifeState.TIRED]: { x: 190, y: 180 },
    [LifeState.STRESSED]: { x: 390, y: 180 },
    [LifeState.BURNOUT]: { x: 290, y: 300 },
  };

  const states = Object.values(LifeState);

  return (
    <div className="relative w-full h-full">
        <svg className="w-full h-full absolute top-0 left-0 pointer-events-none">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
                </marker>
                <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#d946ef" />
                </marker>
            </defs>
            {states.map((from) => {
                const targets = graph.current.getTransitions(from);
                return targets.map((to, idx) => {
                    const start = positions[from];
                    const end = positions[to];
                    const isTransitionActive = (from === currentState); 
                    // Simple highlight logic: if we are at 'from', potential paths could be highlighted
                    // Ideally we'd highlight the edge taken, but this is a static view of structure.
                    
                    return (
                        <line 
                            key={`${from}-${to}-${idx}`}
                            x1={start.x} y1={start.y + 20}
                            x2={end.x} y2={end.y + 20}
                            stroke={isTransitionActive ? "#d946ef" : "#1e293b"}
                            strokeWidth={isTransitionActive ? "2" : "1"}
                            markerEnd={isTransitionActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                            opacity={isTransitionActive ? 0.6 : 0.4}
                            className="transition-all duration-500"
                        />
                    );
                });
            })}
        </svg>

        {states.map((state) => (
            <div
                key={state}
                className={`absolute w-36 h-12 flex items-center justify-center rounded-lg border text-sm font-bold tracking-wide transition-all duration-500 backdrop-blur-md
                    ${currentState === state 
                        ? 'bg-magenta-600/20 border-magenta-500 text-white shadow-[0_0_30px_rgba(217,70,239,0.4)] scale-110 z-20' 
                        : 'bg-slate-900/80 border-slate-800 text-slate-500 z-10'}`}
                style={{ 
                    left: positions[state].x, 
                    top: positions[state].y,
                    transform: 'translate(-50%, 0)' 
                }}
            >
                {state}
            </div>
        ))}
    </div>
  );
};

export default GraphVis;