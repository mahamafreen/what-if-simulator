import React, { useMemo } from 'react';
import { ScheduleOptimizer } from '../dsa/DP';
import { Task } from '../types';

interface Props {
  availableHours: number;
}

const DPSchedule: React.FC<Props> = ({ availableHours }) => {
  const optimizer = useMemo(() => new ScheduleOptimizer(), []);
  
  // Potential tasks available to a student
  const tasks: Task[] = [
    { id: '1', name: 'Review DSA Notes', cost: 3, value: 15 },
    { id: '2', name: 'Write Lab Report', cost: 2, value: 10 },
    { id: '3', name: 'Group Project Meeting', cost: 2, value: 8 },
    { id: '4', name: 'Self Care', cost: 1, value: 6 },
    { id: '5', name: 'Read a book', cost: 4, value: 12 },
    { id: '6', name: 'Power Nap', cost: 1, value: 5 },
    { id: '7', name: 'Watch a movie', cost: 2, value: 3 },
    { id: '8', name: 'IS Assignment', cost: 5, value: 25 },
  ];

  const result = optimizer.solve(tasks, Math.floor(availableHours));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end border-b border-white/5 pb-2">
         <div className="text-3xl font-black text-white">{result.maxValue}</div>
         <div className="text-xs text-emerald-400 font-bold uppercase mb-1">Productivity Score</div>
      </div>
      
      <p className="text-xs text-slate-500">
        Knapsack algorithm selected <strong className="text-white">{result.selectedTasks.length} tasks</strong> fitting into <strong className="text-white">{Math.floor(availableHours)}h</strong>.
      </p>

      <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1">
        {result.selectedTasks.map(task => (
            <div key={task.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border-l-4 border-emerald-500 hover:bg-emerald-500/10 transition-colors group">
                <div>
                    <div className="font-bold text-slate-200 text-sm group-hover:text-emerald-300 transition-colors">{task.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{task.cost} hrs</div>
                </div>
                <div className="bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    +{task.value}
                </div>
            </div>
        ))}
      </div>
      
      {result.selectedTasks.length === 0 && (
          <div className="text-center text-slate-600 py-8 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-800 rounded-lg">
              Not enough time available
          </div>
      )}
    </div>
  );
};

export default DPSchedule;