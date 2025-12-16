import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Subject, GradeEntry } from '../types';

const GRADE_OPTIONS = [
    { label: 'A', value: 4.0 },
    { label: 'A-', value: 3.7 },
    { label: 'B+', value: 3.3 },
    { label: 'B', value: 3.0 },
    { label: 'B-', value: 2.7 },
    { label: 'C+', value: 2.3 },
    { label: 'C', value: 2.0 },
    { label: 'C-', value: 1.7 },
    { label: 'D+', value: 1.3 },
    { label: 'D', value: 1.0 },
    { label: 'F', value: 0.0 },
];

// Sub-component to handle individual subject state independently
const SubjectCard: React.FC<{
    subject: Subject;
    onRemove: (id: string) => void;
    onAddGrade: (subjectId: string, grade: GradeEntry) => void;
    onRemoveGrade: (subjectId: string, gradeId: string) => void;
}> = ({ subject, onRemove, onAddGrade, onRemoveGrade }) => {
    const [assessmentName, setAssessmentName] = useState('');

    const handleGradeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = parseFloat(e.target.value);
        const option = GRADE_OPTIONS.find(o => o.value === val);
        
        if (option) {
            // Create grade entry
            const newGrade: GradeEntry = {
                id: Math.random().toString(36).substring(2, 9),
                name: assessmentName.trim() || `Assessment ${subject.grades.length + 1}`,
                label: option.label,
                value: option.value
            };
            onAddGrade(subject.id, newGrade);
            setAssessmentName(''); // Clear input after adding
        }
        e.target.value = ""; // Reset select dropdown
    };

    const avg = subject.grades.length > 0 
        ? subject.grades.reduce((a, b) => a + b.value, 0) / subject.grades.length 
        : 0;

    return (
        <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 hover:border-magenta-500/30 transition-all group flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors">{subject.name}</div>
                    <div className="text-xs text-slate-500 mt-1 flex gap-2">
                        <span className="bg-slate-800 px-1.5 rounded text-[10px] font-mono border border-slate-700">{subject.credits} Credits</span>
                        {subject.grades.length > 0 && <span className="bg-slate-800 px-1.5 rounded text-[10px] font-mono border border-slate-700">Avg: {avg.toFixed(2)}</span>}
                    </div>
                </div>
                <button 
                onClick={() => onRemove(subject.id)}
                className="text-slate-600 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Grade List */}
            <div className="bg-black/20 rounded-lg p-2 min-h-[60px] space-y-1">
                {subject.grades.length === 0 ? (
                    <div className="text-[10px] text-slate-600 text-center py-2 italic">No grades recorded</div>
                ) : (
                    subject.grades.map(g => (
                        <div key={g.id} className="flex justify-between items-center bg-slate-800/50 px-2 py-1.5 rounded border border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-400">{g.name}: <span className="text-white font-bold">{g.label}</span></span>
                            </div>
                            <button onClick={() => onRemoveGrade(subject.id, g.id)} className="text-slate-500 hover:text-red-400">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Grade Controls */}
            <div className="flex gap-2">
                <input 
                    type="text"
                    placeholder="Quiz 1..."
                    className="w-1/2 bg-slate-900/80 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                    value={assessmentName}
                    onChange={(e) => setAssessmentName(e.target.value)}
                />
                <select 
                    className="w-1/2 bg-slate-900/80 border border-slate-700 rounded-lg py-1.5 px-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                    onChange={handleGradeSelect}
                    defaultValue=""
                >
                    <option value="" disabled>+ Grade</option>
                    {GRADE_OPTIONS.map(opt => (
                        <option key={opt.label} value={opt.value}>{opt.label} ({opt.value})</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

const GPACalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  // Form State for new Subject
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCredits, setNewSubjectCredits] = useState(3);

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    
    const newSub: Subject = {
      id: Math.random().toString(36).substring(2, 9),
      name: newSubjectName,
      credits: newSubjectCredits,
      grades: []
    };
    
    setSubjects([...subjects, newSub]);
    setNewSubjectName('');
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const addGradeToSubject = (subjectId: string, grade: GradeEntry) => {
    setSubjects(subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          grades: [...sub.grades, grade]
        };
      }
      return sub;
    }));
  };

  const removeGradeFromSubject = (subjectId: string, gradeId: string) => {
    setSubjects(subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          grades: sub.grades.filter(g => g.id !== gradeId)
        };
      }
      return sub;
    }));
  };

  const calculateTotalGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(sub => {
      if (sub.grades.length > 0) {
        const avg = sub.grades.reduce((acc, g) => acc + g.value, 0) / sub.grades.length;
        totalPoints += avg * sub.credits;
        totalCredits += sub.credits;
      }
    });

    return totalCredits === 0 ? 0 : (totalPoints / totalCredits);
  };

  const currentGPA = calculateTotalGPA();
  const totalCredits = subjects.reduce((acc, curr) => acc + (curr.grades.length > 0 ? curr.credits : 0), 0);
  
  const getGpaColor = (gpa: number) => {
      if (gpa >= 3.5) return 'text-emerald-400';
      if (gpa >= 3.0) return 'text-magenta-400';
      if (gpa >= 2.0) return 'text-yellow-400';
      return 'text-red-400';
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT: INPUT FORM */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-deep-900/40 rounded-2xl p-6 border border-white/5 shadow-2xl backdrop-blur-sm relative overflow-hidden">
             
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Add New Subject
             </h2>

             <form onSubmit={addSubject} className="space-y-4 relative z-10">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Name</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            placeholder="e.g. Data Structures"
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Credits</label>
                    <input 
                        type="number" 
                        min="1" max="10"
                        value={newSubjectCredits}
                        onChange={(e) => setNewSubjectCredits(Number(e.target.value))}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg border border-slate-600 transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                    <Plus className="w-5 h-5" /> Create Subject
                </button>
             </form>
        </div>

        <div className="bg-slate-900/40 rounded-2xl p-6 border border-dashed border-slate-800 opacity-80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Algorithm Analysis</h3>
            <p className="text-xs text-slate-500 font-mono">
                Calculation: O(S * G) where S is subjects and G is grades/subject.<br/>
                Space: O(S * G) for storage.
            </p>
        </div>
      </div>

      {/* RIGHT: LIST & RESULT */}
      <div className="lg:col-span-8 space-y-6">
          
          {/* GPA Result Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-deep-900/40 col-span-2 rounded-2xl p-6 border border-white/5 shadow-2xl backdrop-blur-sm flex items-center justify-between relative overflow-hidden">
                <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Cumulative GPA</h2>
                    <div className={`text-5xl font-black tracking-tighter ${getGpaColor(currentGPA)} drop-shadow-lg`}>
                        {currentGPA.toFixed(2)}
                    </div>
                </div>
              </div>

              <div className="bg-deep-900/40 rounded-2xl p-6 border border-white/5 shadow-2xl backdrop-blur-sm flex flex-col justify-center items-center">
                  <div className="text-3xl font-bold text-white mb-1">{totalCredits}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Credits</div>
              </div>
          </div>

          {/* Subject List */}
          <div className="bg-deep-900/40 rounded-2xl border border-white/5 shadow-2xl overflow-hidden min-h-[400px]">
              <div className="bg-slate-900/80 backdrop-blur border-b border-white/5 p-4 flex justify-between items-center">
                <h2 className="font-bold text-white flex items-center gap-2">
                    Transcript
                </h2>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    {subjects.length} Subjects
                </span>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.length === 0 && (
                      <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-600 opacity-50">
                          <p className="text-sm font-medium">No subjects added yet.</p>
                      </div>
                  )}

                  {subjects.map(sub => (
                      <SubjectCard 
                        key={sub.id} 
                        subject={sub} 
                        onRemove={removeSubject} 
                        onAddGrade={addGradeToSubject} 
                        onRemoveGrade={removeGradeFromSubject} 
                      />
                  ))}
              </div>
          </div>

      </div>
    </div>
  );
};

export default GPACalculator;