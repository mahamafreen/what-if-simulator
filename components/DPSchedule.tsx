import React, { useMemo, useState } from 'react';
import { ScheduleOptimizer } from '../dsa/DP';
import { Task } from '../types';
import { Plus, Trash2, Calendar, Settings } from 'lucide-react';

interface Props {
  availableHours: number;
}

const DPSchedule: React.FC<Props> = ({ availableHours }) => {
  // Initial Task Pool - State allows adding/removing
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Review Algorithm Notes', cost: 3, value: 15 },
    { id: '2', name: 'Write Lab Report', cost: 2, value: 10 },
    { id: '3', name: 'Group Project Meeting', cost: 2, value: 8 },
    { id: '4', name: 'Yoga / Self Care', cost: 1, value: 6 },
    { id: '5', name: 'Read Literature', cost: 4, value: 12 },
    { id: '6', name: 'Power Nap', cost: 1, value: 5 },
    { id: '7', name: 'Watch Netflix / Chill', cost: 2, value: 3 },
    { id: '8', name: 'Coding Assignment', cost: 5, value: 25 },
  ]);

  const [view, setView] = useState<'schedule' | 'manage'>('schedule');
  
  // Add Task Form State
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState(1);
  const [newValue, setNewValue] = useState(10);

  // Derived State: Solve Knapsack with current tasks
  const result = useMemo(() => {
    const optimizer = new ScheduleOptimizer();
    return optimizer.solve(tasks, Math.floor(availableHours));
  }, [tasks, availableHours]);

  // Handlers
  const addTask = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newName.trim()) return;

      const newTask: Task = {
          id: Math.random().toString(36).substring(2, 9),
          name: newName,
          cost: newCost,
          value: newValue
      };

      setTasks([...tasks, newTask]);
      setNewName('');
      setNewCost(1);
      setNewValue(10);
  };

  const removeTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex p-1 bg-slate-900/50 rounded-lg border border-white/5">
        <button 
            onClick={() => setView('schedule')}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 ${
                view === 'schedule' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
            <Calendar className="w-3 h-3" /> Schedule
        </button>
        <button 
            onClick={() => setView('manage')}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 ${
                view === 'manage' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
            <Settings className="w-3 h-3" /> Manage Tasks
        </button>
      </div>

      {view === 'schedule' ? (
        <>
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <div className="text-3xl font-black text-white">{result.maxValue}</div>
                <div className="text-right">
                    <div className="text-xs text-emerald-400 font-bold uppercase mb-0.5">Productivity Score</div>
                    <div className="text-[10px] text-slate-500">
                        {result.selectedTasks.length} tasks fit in {Math.floor(availableHours)}h
                    </div>
                </div>
            </div>
            
            <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1">
                {result.selectedTasks.length > 0 ? (
                    result.selectedTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border-l-4 border-emerald-500 hover:bg-emerald-500/10 transition-colors group">
                            <div>
                                <div className="font-bold text-slate-200 text-sm group-hover:text-emerald-300 transition-colors">{task.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{task.cost} hrs</div>
                            </div>
                            <div className="bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold text-emerald-400 border border-emerald-500/20">
                                +{task.value}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-600 py-8 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-800 rounded-lg">
                        Not enough time available
                    </div>
                )}
            </div>
        </>
      ) : (
        <div className="space-y-4">
            {/* Add Task Form */}
            <form onSubmit={addTask} className="bg-slate-900/50 p-3 rounded-lg border border-white/5 space-y-3">
                <div>
                    <input 
                        type="text" 
                        placeholder="Task Name (e.g., Gym)" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Hours</label>
                        <input 
                            type="number" 
                            min="1" max="10"
                            value={newCost}
                            onChange={(e) => setNewCost(Number(e.target.value))}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Value</label>
                        <input 
                            type="number" 
                            min="1" max="100"
                            value={newValue}
                            onChange={(e) => setNewValue(Number(e.target.value))}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                    <div className="flex items-end">
                        <button 
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded transition-colors shadow-lg shadow-emerald-900/20"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </form>

            {/* Task List */}
            <div className="max-h-[200px] overflow-y-auto pr-1 space-y-2">
                {tasks.map(task => (
                    <div key={task.id} className="flex justify-between items-center bg-slate-900/30 p-2 rounded border border-white/5 group hover:border-white/10 transition-colors">
                        <div>
                             <div className="text-xs font-bold text-slate-300">{task.name}</div>
                             <div className="text-[10px] text-slate-500 font-mono">{task.cost}h | Value: {task.value}</div>
                        </div>
                        <button 
                            onClick={() => removeTask(task.id)}
                            className="text-slate-600 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-all p-1"
                            title="Remove Task"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default DPSchedule;