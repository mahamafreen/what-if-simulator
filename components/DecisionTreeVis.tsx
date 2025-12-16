import React from 'react';
import { TreeNode } from '../dsa/DecisionTree';
import { StudentState } from '../types';

interface Props {
  node: TreeNode;
}

const DecisionTreeVis: React.FC<Props> = ({ node }) => {
  const getStyle = (state: StudentState) => {
    if (state.stressLevel > 85) return 'border-red-500/50 bg-red-950/30 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    if (state.gpa > 3.85) return 'border-emerald-500/50 bg-emerald-950/30 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.2)]';
    return 'border-magenta-500/30 bg-slate-900/80 text-slate-200 hover:border-magenta-500 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all';
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`
        p-3 rounded-xl border backdrop-blur-sm 
        ${getStyle(node.state)} 
        text-[10px] w-28 mb-6 relative z-10 text-center
        transition-all duration-300
      `}>
        <div className="font-bold text-white mb-1.5 uppercase tracking-wide border-b border-white/10 pb-1">{node.actionTaken}</div>
        <div className="space-y-0.5 font-mono opacity-80">
            <div className="flex justify-between"><span>GPA</span> <span>{node.state.gpa.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>STR</span> <span>{node.state.stressLevel}</span></div>
            <div className="flex justify-between"><span>NRG</span> <span>{node.state.energy}</span></div>
        </div>
      </div>
      
      {node.children.length > 0 && (
        <div className="flex gap-6 relative">
          {node.children.map((child, idx) => (
            <div key={idx} className="flex flex-col items-center relative">
              {/* Connector Line */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-px bg-slate-700"></div>
              {/* Horizontal Bar for multiple children - simplified visual approximation */}
              {node.children.length > 1 && (
                  <div className={`absolute -top-6 h-px bg-slate-700
                    ${idx === 0 ? 'w-1/2 right-0 translate-x-px' : ''}
                    ${idx === node.children.length - 1 ? 'w-1/2 left-0 -translate-x-px' : ''}
                    ${idx > 0 && idx < node.children.length - 1 ? 'w-full' : ''}
                  `}></div>
              )}
              <DecisionTreeVis node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DecisionTreeVis;