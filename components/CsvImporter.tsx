
import React, { useState } from 'react';
import { 
  UploadCloud, Sparkles, Loader2, FileText, Calendar, Database, FileSpreadsheet, ChevronUp
} from 'lucide-react';
import { BlacklistOption, Tooltip } from './CampaignFormUI';
import { PitchStrategySection, PitchData } from './PitchStrategySection';
import { AVAILABLE_LANGUAGES } from '../types';
import { Globe, ChevronDown } from 'lucide-react';

interface CsvImporterProps {
  onConfirm: () => void;
  onBack: () => void;
  emailContentLanguage: string;
  setEmailContentLanguage: (lang: string) => void;
  fallbackLanguage: string;
  setFallbackLanguage: (lang: string) => void;
}

export const CsvImporter: React.FC<CsvImporterProps> = ({ 
  onConfirm, 
  onBack,
  emailContentLanguage,
  setEmailContentLanguage,
  fallbackLanguage,
  setFallbackLanguage
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  
  // Blacklist state
  const [blacklist, setBlacklist] = useState({
    list: false,
    time: false,
    crm: false,
    csv: false,
    sheet: false
  });

  const toggleBlacklist = (key: keyof typeof blacklist) => {
    setBlacklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Pitch State
  const [pitchData, setPitchData] = useState<PitchData>({
    valueProp: '',
    benchmarkBrands: [''],
    painPoints: [''],
    solutions: [''],
    proofPoints: [''],
    ctas: [''],
    leadMagnets: ['']
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pitchExpanded, setPitchExpanded] = useState(true);

  const handleGeneratePitch = () => {
      if(!websiteUrl) return;
      setIsAnalyzing(true);
      setTimeout(() => {
          setPitchData({
            valueProp: "Streamline your operations with our all-in-one platform.",
            benchmarkBrands: ["Salesforce", "HubSpot"],
            painPoints: ["Fragmented data", "Inefficient workflows", "Lack of visibility"],
            solutions: ["Centralized dashboard", "Automated reporting", "Real-time analytics"],
            proofPoints: ["Reduce costs by 20%", "Save 10 hours/week"],
            ctas: ["Book a Demo", "Start Free Trial"],
            leadMagnets: ["Efficiency Audit", "Industry Report"]
          });
          setIsAnalyzing(false);
      }, 1500);
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fadeIn">
      
      {/* --- CSV UPLOAD --- */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Contact List (CSV)</label>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-center">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <UploadCloud className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-800 mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400">CSV, XLS up to 10MB</p>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full mb-10" />

      {/* --- EXCLUDE CONTACTS --- */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Exclude Contacts</h3>
             <div className="h-px bg-slate-100 flex-1 ml-4"></div>
        </div>
       
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-white p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800">Manage Blacklist</span>
                <span className="text-slate-400 text-sm">Exclude specific contacts from your campaign.</span>
            </div>
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-wrap gap-4">
            <BlacklistOption 
              icon={<FileText className="w-5 h-5 text-orange-500" />}
              label="Exclude by List"
              checked={blacklist.list}
              onChange={() => toggleBlacklist('list')}
            />
            <BlacklistOption 
              icon={<Calendar className="w-5 h-5 text-slate-600" />}
              label="Time Range"
              checked={blacklist.time}
              onChange={() => toggleBlacklist('time')}
            />
            <BlacklistOption 
              icon={<Database className="w-5 h-5 text-blue-600" />}
              label="Exclude by CRM"
              checked={blacklist.crm}
              onChange={() => toggleBlacklist('crm')}
            />
            <BlacklistOption 
              icon={<FileSpreadsheet className="w-5 h-5 text-green-500" />}
              label="Upload CSV"
              checked={blacklist.csv}
              onChange={() => toggleBlacklist('csv')}
            />
             <BlacklistOption 
              icon={
                <div className="flex items-center justify-center w-5 h-5">
                    <span className="text-lg font-bold text-blue-500" style={{fontFamily: 'arial'}}>G</span>
                </div>
              }
              label="Google Sheet"
              checked={blacklist.sheet}
              onChange={() => toggleBlacklist('sheet')}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full mb-10" />

      {/* --- EMAIL LANGUAGE CONFIGURATION --- */}
      <div className="mb-10">
        <label className="block text-sm font-bold text-slate-900 mb-4">Email Language Settings</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Content Language
                </label>
                <div className="relative">
                    <select 
                        value={emailContentLanguage}
                        onChange={(e) => setEmailContentLanguage(e.target.value)}
                        className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 cursor-pointer text-slate-800"
                    >
                        <option value="">Select language...</option>
                        <option value="Auto">Auto(based on prospect's location)</option>
                        {AVAILABLE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {emailContentLanguage === 'Auto' && (
                <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fallback Language
                    </label>
                    <div className="relative">
                        <select 
                            value={fallbackLanguage}
                            onChange={(e) => setFallbackLanguage(e.target.value)}
                            className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 cursor-pointer text-slate-800"
                        >
                            <option value="">Select fallback language...</option>
                            {AVAILABLE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full mb-10" />

      {/* --- PITCH STRATEGY --- */}
      <PitchStrategySection 
        data={pitchData} 
        setData={setPitchData} 
        isExpanded={pitchExpanded} 
        setIsExpanded={setPitchExpanded}
        websiteUrl={websiteUrl}
        setWebsiteUrl={setWebsiteUrl}
        onGeneratePitch={handleGeneratePitch}
        isAnalyzing={isAnalyzing}
      />

       {/* Footer */}
       <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-slate-50">
        <button onClick={onBack} className="px-8 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium min-w-[140px]">Previous</button>
        <button onClick={onConfirm} className="px-8 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-medium min-w-[140px]">Next</button>
      </div>
    </div>
  );
};
