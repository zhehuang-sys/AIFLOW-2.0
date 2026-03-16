import React from 'react';
import { Info, Plus, Trash2, Check } from 'lucide-react';

// --- Tooltip ---
export const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-block ml-1.5 align-middle z-10">
    <Info className="w-4 h-4 text-slate-400 cursor-help" />
    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs leading-relaxed rounded-lg shadow-xl z-50 text-center pointer-events-none">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

// --- Dynamic List Section ---
interface DynamicListProps {
    title: string;
    description: string;
    items: string[];
    onAdd: () => void;
    onChange: (list: string[], index: number, value: string) => void;
    onRemove: (list: string[], index: number) => void;
    tooltip?: string;
}

export const DynamicListSection: React.FC<DynamicListProps> = ({ title, description, items, onAdd, onChange, onRemove, tooltip }) => (
    <div>
        <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
            {title}
            {tooltip && <Tooltip content={tooltip} />}
        </label>
        <p className="text-xs text-slate-400 mb-2">{description}</p>
        
        {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center group">
                 <input 
                    type="text" 
                    className="flex-1 p-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-all text-slate-800 placeholder:text-slate-300 text-sm"
                    placeholder={`Input ${title}`}
                    value={item}
                    onChange={(e) => onChange(items, idx, e.target.value)}
                />
                <button 
                    onClick={() => onRemove(items, idx)}
                    className="p-3 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ))}

        <button 
            onClick={onAdd}
            className="flex items-center gap-2 mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
            <Plus className="w-4 h-4" />
            Add {title}
        </button>
    </div>
);

// --- Accuracy Card ---
interface AccuracyCardProps {
    title: string;
    icon: React.ReactNode;
    description: string;
    isSelected: boolean;
    onClick: () => void;
    isOrange?: boolean;
}

export const AccuracyCard: React.FC<AccuracyCardProps> = ({ title, icon, description, isSelected, onClick, isOrange }) => {
    const activeBorder = isOrange ? 'border-[#ff5722]' : 'border-slate-900';
    const activeBg = isOrange ? 'bg-[#ff5722]' : 'bg-slate-900';

    return (
        <div 
            onClick={onClick}
            className={`
                relative p-5 rounded-lg border cursor-pointer transition-all flex flex-col h-full
                ${isSelected ? activeBorder : 'border-slate-200 hover:border-slate-300'}
                ${isSelected ? 'bg-white' : 'bg-white'}
            `}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-slate-800">{icon}</span>
                    <span className="font-semibold text-slate-900">{title}</span>
                </div>
                <div className={`
                    w-5 h-5 rounded border flex items-center justify-center
                    ${isSelected ? activeBg + ' border-transparent' : 'border-slate-300'}
                `}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

// --- Blacklist Option ---
interface BlacklistOptionProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const BlacklistOption: React.FC<BlacklistOptionProps> = ({ icon, label, checked, onChange }) => {
  return (
    <div 
        onClick={onChange}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all select-none bg-white
            ${checked 
                ? 'border-blue-600 shadow-sm ring-1 ring-blue-600' 
                : 'border-slate-200 hover:border-slate-300'
            }
        `}
    >
        {icon}
        <span className={`text-sm font-medium ${checked ? 'text-slate-900' : 'text-slate-600'}`}>
            {label}
        </span>
        <div className={`
            w-5 h-5 rounded border ml-2 flex items-center justify-center transition-colors
            ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}
        `}>
            {checked && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
    </div>
  );
};

// --- Signal Card ---
interface SignalCardProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ icon, label, active, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all bg-white
                ${active ? 'border-blue-600 ring-1 ring-blue-600 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}
            `}
        >
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-xs font-semibold">{label}</span>
            </div>
             <div className={`
                w-4 h-4 rounded-full border flex items-center justify-center
                ${active ? 'bg-blue-600 border-transparent' : 'border-slate-300'}
            `}>
                {active && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
        </div>
    );
};