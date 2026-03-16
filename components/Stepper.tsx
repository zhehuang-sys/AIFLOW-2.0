
import React from 'react';
import { Target, Mic, Search, Zap, Settings, Compass, ArrowLeft } from 'lucide-react';
import { Step, StepStatus } from '../types';

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onBack?: () => void;
  showTitleInfo?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onBack, showTitleInfo }) => {
  const getIcon = (label: string) => {
    switch (label) {
      case 'Strategy': return <Compass className="w-4 h-4" />;
      case 'Targeting': return <Target className="w-4 h-4" />;
      case 'Pitch': return <Mic className="w-4 h-4" />;
      case 'Research': return <Search className="w-4 h-4" />;
      case 'AIFlow': return <Zap className="w-4 h-4" />;
      case 'Settings': return <Settings className="w-4 h-4" />;
      default: return null;
    }
  };

  const currentStepData = steps.find(s => s.id === currentStep);

  return (
    <div className="w-full py-4 px-4 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between w-full">
          
          {/* Left Title Section */}
          {showTitleInfo && (
            <div className="flex items-center gap-4 mr-8 pr-8 border-r border-slate-100">
              {onBack && (
                <button 
                  onClick={onBack}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 bg-white border border-slate-200 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="whitespace-nowrap">
                <h2 className="text-sm font-bold text-slate-900">Create New AIFlow</h2>
                <p className="text-[11px] text-slate-500 font-medium">Step {currentStep} : {currentStepData?.label}</p>
              </div>
            </div>
          )}

          {/* Progress Steps Section */}
          <div className="flex-1 flex items-center justify-between relative">
            {/* Connecting Line Background */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -z-10" />

            {steps.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center bg-white px-2">
                  <div 
                    className={`
                      flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-300
                      ${isCurrent 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105' 
                        : isCompleted
                          ? 'bg-white border-blue-200 text-blue-600'
                          : 'bg-white border-slate-200 text-slate-400'
                      }
                    `}
                  >
                    {getIcon(step.label)}
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
