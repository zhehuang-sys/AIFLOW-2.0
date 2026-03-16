
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SelectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  badge?: string;
  hoverContent?: React.ReactNode;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  onClick,
  badge,
  hoverContent
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative group flex flex-col p-6 h-full rounded-2xl border-2 cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-blue-600 bg-blue-50/50 shadow-lg scale-[1.02]' 
          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      {/* Badge */}
      {badge && (
        <span className={`
          absolute -top-3 right-6 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm
          ${isSelected ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'}
        `}>
          {badge}
        </span>
      )}

      {/* Selection Indicator */}
      <div className={`
        absolute top-6 right-6 transition-opacity duration-300
        ${isSelected ? 'opacity-100' : 'opacity-0'}
      `}>
        <CheckCircle2 className="w-6 h-6 text-blue-600 fill-blue-100" />
      </div>

      {/* Normal Content Container */}
      <div className={`flex flex-col h-full transition-opacity duration-300 ${hoverContent ? 'group-hover:opacity-0' : ''}`}>
        {/* Icon Area */}
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300
          ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'}
        `}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
            {description}
          </p>
        </div>

        {/* Pseudo-button visual for better affordance */}
        <div className={`mt-6 pt-6 border-t ${isSelected ? 'border-blue-200' : 'border-slate-100'}`}>
          <span className={`text-sm font-semibold flex items-center ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
            {isSelected ? 'Selected' : 'Click to select'}
          </span>
        </div>
      </div>

      {/* Hover Override Content */}
      {hoverContent && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 bg-white rounded-2xl pointer-events-none">
          {hoverContent}
        </div>
      )}
    </div>
  );
};
