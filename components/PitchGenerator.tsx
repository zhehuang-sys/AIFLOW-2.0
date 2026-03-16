import React, { useState } from 'react';
import { ChevronDown, Info, Plus } from 'lucide-react';

interface PitchGeneratorProps {
  onNext: () => void;
  onBack: () => void;
}

export const PitchGenerator: React.FC<PitchGeneratorProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    language: 'English',
    valueProp: '',
    benchmarkBrands: [''],
    painPoints: [''],
    solutions: [''],
    proofPoints: [''],
    ctas: [''],
    leadMagnets: ['']
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addField = (field: keyof typeof formData) => {
    if (Array.isArray(formData[field])) {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as string[]), '']
        }));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 animate-fadeIn">
      
      {/* Language */}
      <div className="mb-8">
        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
          <span className="text-red-500 mr-1">*</span>Language
          <Info className="w-4 h-4 ml-1.5 text-slate-400" />
        </label>
        <div className="relative">
          <select 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-slate-800"
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="flex items-center mt-3">
          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
          <span className="ml-2 text-sm text-slate-500">Set as the default language for generating email content</span>
          <Info className="w-3 h-3 ml-1 text-slate-300" />
        </div>
      </div>

      {/* Value Prop */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">Value Proposition in One Sentence</label>
        <input 
            type="text" 
            className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-slate-800 placeholder:text-slate-300"
            placeholder="Please input"
            value={formData.valueProp}
            onChange={(e) => handleChange('valueProp', e.target.value)}
        />
      </div>

      {/* Benchmark Brands - New Field */}
      <DynamicListSection 
        title="Benchmark Brands" 
        items={formData.benchmarkBrands} 
        onAdd={() => addField('benchmarkBrands')}
        onChange={(idx, val) => {
            const newItems = [...formData.benchmarkBrands];
            newItems[idx] = val;
            handleChange('benchmarkBrands', newItems);
        }}
      />

      {/* Dynamic List Sections */}
      <DynamicListSection 
        title="Pain Points" 
        items={formData.painPoints} 
        onAdd={() => addField('painPoints')}
        onChange={(idx, val) => {
            const newItems = [...formData.painPoints];
            newItems[idx] = val;
            handleChange('painPoints', newItems);
        }}
      />

      <DynamicListSection 
        title="Solutions" 
        items={formData.solutions} 
        onAdd={() => addField('solutions')}
        onChange={(idx, val) => {
            const newItems = [...formData.solutions];
            newItems[idx] = val;
            handleChange('solutions', newItems);
        }}
      />

      <DynamicListSection 
        title="Proof Points" 
        items={formData.proofPoints} 
        onAdd={() => addField('proofPoints')}
        onChange={(idx, val) => {
            const newItems = [...formData.proofPoints];
            newItems[idx] = val;
            handleChange('proofPoints', newItems);
        }}
      />
      
      <DynamicListSection 
        title="Call To Actions" 
        items={formData.ctas} 
        onAdd={() => addField('ctas')}
        onChange={(idx, val) => {
            const newItems = [...formData.ctas];
            newItems[idx] = val;
            handleChange('ctas', newItems);
        }}
      />

      <DynamicListSection 
        title="Lead Magnets" 
        items={formData.leadMagnets} 
        onAdd={() => addField('leadMagnets')}
        onChange={(idx, val) => {
            const newItems = [...formData.leadMagnets];
            newItems[idx] = val;
            handleChange('leadMagnets', newItems);
        }}
      />


      {/* Footer Navigation */}
      <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-slate-200">
        <button onClick={onBack} className="px-8 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium min-w-[140px]">
          Previous
        </button>
        <button onClick={onNext} className="px-8 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all font-medium min-w-[140px]">
          Next
        </button>
      </div>

    </div>
  );
};

interface DynamicListProps {
    title: string;
    items: string[];
    onAdd: () => void;
    onChange: (index: number, value: string) => void;
}

const DynamicListSection: React.FC<DynamicListProps> = ({ title, items, onAdd, onChange }) => (
    <div className="mb-8">
        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
            {title}
            <Info className="w-4 h-4 ml-1.5 text-slate-400" />
        </label>
        
        {items.map((item, idx) => (
             <input 
                key={idx}
                type="text" 
                className="w-full p-4 mb-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-slate-800 placeholder:text-slate-300"
                placeholder={`Input ${title}`}
                value={item}
                onChange={(e) => onChange(idx, e.target.value)}
            />
        ))}

        <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium"
        >
            <Plus className="w-4 h-4" />
            Add {title}
        </button>
    </div>
);