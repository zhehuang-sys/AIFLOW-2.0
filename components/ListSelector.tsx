
import React, { useState } from 'react';
import { Users2, Sparkles, ChevronDown, Loader2, Search, CheckSquare, Square, FileText, Calendar, Database, FileSpreadsheet, ChevronUp, Globe } from 'lucide-react';
import { PitchStrategySection, PitchData } from './PitchStrategySection';
import { BlacklistOption } from './CampaignFormUI';
import { AVAILABLE_LANGUAGES } from '../types';

interface ListSelectorProps {
  onConfirm: () => void;
  onBack: () => void;
  emailContentLanguage: string;
  setEmailContentLanguage: (lang: string) => void;
  fallbackLanguage: string;
  setFallbackLanguage: (lang: string) => void;
}

// Mock Data for Lists
const AVAILABLE_LISTS = [
    { id: '1', name: 'Q3 Conference Attendees', count: 1240, date: 'Oct 12, 2023' },
    { id: '2', name: 'SaaS Founders - US (Seed/Series A)', count: 540, date: 'Nov 01, 2023' },
    { id: '3', name: 'Churned Customers 2024', count: 85, date: 'Jan 15, 2024' },
    { id: '4', name: 'Waitlist Signups - Product Hunt', count: 2100, date: 'Feb 10, 2024' },
    { id: '5', name: 'Linkedin Scrape - "Head of Sales"', count: 320, date: 'Feb 12, 2024' },
    { id: '6', name: 'Webinar Registrants (No Show)', count: 150, date: 'Feb 14, 2024' },
];

export const ListSelector: React.FC<ListSelectorProps> = ({ 
  onConfirm, 
  onBack,
  emailContentLanguage,
  setEmailContentLanguage,
  fallbackLanguage,
  setFallbackLanguage
}) => {
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter lists based on search
  const filteredLists = AVAILABLE_LISTS.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleList = (id: string) => {
    setSelectedListIds(prev => 
        prev.includes(id) 
            ? prev.filter(item => item !== id)
            : [...prev, id]
    );
  };

  const totalSelectedContacts = AVAILABLE_LISTS
    .filter(list => selectedListIds.includes(list.id))
    .reduce((sum, list) => sum + list.count, 0);

  const handleGeneratePitch = () => {
      if(!websiteUrl) return;
      setIsAnalyzing(true);
      setTimeout(() => {
          setPitchData({
            valueProp: "Empower your team with real-time data.",
            benchmarkBrands: ["Segment", "Rudderstack"],
            painPoints: ["Stale data", "Missing contact info", "Privacy concerns"],
            solutions: ["Real-time enrichment", "GDPR Compliance", "API First"],
            proofPoints: ["Processed 1B+ records", "Used by Fortune 500"],
            ctas: ["Get API Key", "Read Documentation"],
            leadMagnets: ["Data Hygiene Checklist", "Enrichment Guide"]
          });
          setIsAnalyzing(false);
      }, 1000);
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fadeIn">
      
      {/* --- LIST SELECTION --- */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Saved Lists</label>
        <p className="text-xs text-slate-400 mb-4">Choose one or more lists to enroll in this campaign.</p>
        
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            {/* Search Bar */}
            <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    placeholder="Search lists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List Items */}
            <div className="max-h-[240px] overflow-y-auto scrollbar-thin">
                {filteredLists.length > 0 ? (
                    filteredLists.map(list => {
                        const isSelected = selectedListIds.includes(list.id);
                        return (
                            <div 
                                key={list.id} 
                                onClick={() => toggleList(list.id)}
                                className={`flex items-center justify-between p-4 cursor-pointer transition-colors border-b last:border-0 border-slate-50
                                    ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {isSelected ? (
                                        <CheckSquare className="w-5 h-5 text-blue-600 fill-blue-50" />
                                    ) : (
                                        <Square className="w-5 h-5 text-slate-300" />
                                    )}
                                    <div>
                                        <div className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                            {list.name}
                                        </div>
                                        <div className="text-xs text-slate-400">Created {list.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                        {list.count.toLocaleString()} contacts
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No lists found.
                    </div>
                )}
            </div>
            
            {/* Footer Summary */}
            <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                    {selectedListIds.length} list{selectedListIds.length !== 1 && 's'} selected
                </span>
                <span className="text-sm font-bold text-blue-600">
                    Total: {totalSelectedContacts.toLocaleString()} Contacts
                </span>
            </div>
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
        <button 
            onClick={onConfirm} 
            disabled={selectedListIds.length === 0}
            className={`px-8 py-2.5 rounded-full text-white shadow-md transition-all font-medium min-w-[140px]
                ${selectedListIds.length === 0 ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}
            `}
        >
            Next
        </button>
      </div>
    </div>
  );
};
