
import React, { useState } from 'react';
import { 
  Database, Loader2, Sparkles, Cloud, ArrowRight, 
  Settings2, Info, ChevronDown, FileText, Calendar, 
  FileSpreadsheet, ChevronUp, Link as LinkIcon
} from 'lucide-react';
import { PitchStrategySection, PitchData } from './PitchStrategySection';
import { BlacklistOption, Tooltip } from './CampaignFormUI';
import { AVAILABLE_LANGUAGES } from '../types';
import { Globe } from 'lucide-react';

interface CrmImporterProps {
  onConfirm: () => void;
  onBack: () => void;
  emailContentLanguage: string;
  setEmailContentLanguage: (lang: string) => void;
  fallbackLanguage: string;
  setFallbackLanguage: (lang: string) => void;
}

const CRM_PROVIDERS = [
    { 
        id: 'salesforce', 
        name: 'Salesforce', 
        email: 'zhe.huang@myflashcloud.com',
        iconColor: 'text-[#00A1E0]',
    },
    { 
        id: 'hubspot', 
        name: 'HubSpot', 
        email: 'zhe.huang@myflashcloud.com',
        iconColor: 'text-[#ff7a59]',
    }
];

export const CrmImporter: React.FC<CrmImporterProps> = ({ 
  onConfirm, 
  onBack,
  emailContentLanguage,
  setEmailContentLanguage,
  fallbackLanguage,
  setFallbackLanguage
}) => {
  const [selectedCrmId] = useState<string>('salesforce');
  const [objectType, setObjectType] = useState('Lead');
  const [selectedList, setSelectedList] = useState('All Open Leads');
  const [importColumns, setImportColumns] = useState('Default(7)');
  const [dynamicUpdate, setDynamicUpdate] = useState(true);
  
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isPitchAnalyzing, setIsPitchAnalyzing] = useState(false);
  const [pitchExpanded, setPitchExpanded] = useState(true);
  const [pitchData, setPitchData] = useState<PitchData>({
    valueProp: '',
    benchmarkBrands: [''],
    painPoints: [''],
    solutions: [''],
    proofPoints: [''],
    ctas: [''],
    leadMagnets: ['']
  });

  const [blacklist, setBlacklist] = useState({
    list: false,
    time: false,
    crm: false,
    csv: false,
    sheet: false
  });

  const activeProvider = CRM_PROVIDERS.find(p => p.id === selectedCrmId) || CRM_PROVIDERS[0];

  const handleGeneratePitch = () => {
      if(!websiteUrl) return;
      setIsPitchAnalyzing(true);
      setTimeout(() => {
          setPitchData({
            valueProp: "Seamlessly sync your CRM data for better insights.",
            benchmarkBrands: ["Zapier", "MuleSoft"],
            painPoints: ["Manual data entry", "Data silos", "Lost opportunities"],
            solutions: ["Bi-directional sync", "Real-time updates", "Custom mapping"],
            proofPoints: ["Saved 20 hours/week", "Increased close rate by 15%"],
            ctas: ["Start Sync", "View Integrations"],
            leadMagnets: ["Integration Guide", "CRM Best Practices"]
          });
          setIsPitchAnalyzing(false);
      }, 1000);
  };

  const toggleBlacklist = (key: keyof typeof blacklist) => {
    setBlacklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 animate-fadeIn overflow-hidden">
      
      {/* CRM Header */}
      <div className="p-8 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm border border-slate-100 rounded-lg">
                  <Cloud className={`w-8 h-8 ${activeProvider.iconColor} fill-current`} />
              </div>
              <div>
                  <h2 className="text-lg font-bold text-slate-900">{activeProvider.name}</h2>
                  <p className="text-sm text-slate-500">{activeProvider.email}</p>
              </div>
          </div>
      </div>

      <div className="p-8">
          {/* Main Configuration Form - Consistent width with sections below */}
          <div className="w-full space-y-8 mb-10">
              
              {/* Object Type */}
              <div className="w-full">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Object Type</label>
                  <div className="relative">
                      <select 
                        value={objectType}
                        onChange={(e) => setObjectType(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
                      >
                          <option>Lead</option>
                          <option>Contact</option>
                          <option>Account</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
              </div>

              {/* CRM List */}
              <div className="w-full">
                  <label className="block text-sm font-bold text-slate-800 mb-3">
                      <span className="text-red-500 mr-1">*</span>{activeProvider.name} List
                  </label>
                  <div className="relative">
                      <select 
                        value={selectedList}
                        onChange={(e) => setSelectedList(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
                      >
                          <option>All Open Leads</option>
                          <option>Q4 Pipeline</option>
                          <option>Recent Signups</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
              </div>

              {/* Custom Import Columns */}
              <div className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-slate-800">
                        <span className="text-red-500 mr-1">*</span>Custom Import Columns
                    </label>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <Settings2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative mb-2">
                      <select 
                        value={importColumns}
                        onChange={(e) => setImportColumns(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
                      >
                          <option>Default(7)</option>
                          <option>Advanced(12)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-sm text-slate-400">
                      Last Name, Title, Company, City, Phone, Mobile Phone, Email
                  </p>
              </div>

              {/* Dynamic Update */}
              <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-bold text-slate-800">Dynamic Update</label>
                      <button 
                        onClick={() => setDynamicUpdate(!dynamicUpdate)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${dynamicUpdate ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${dynamicUpdate ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3 border border-slate-100">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600 leading-relaxed">
                          Once enabled, FlashRev will automatically update the data of the linked list and push the updates to AIFlow.
                      </p>
                  </div>
              </div>
          </div>

          <div className="h-px bg-slate-100 w-full mb-10" />

          {/* Exclude Contacts Section */}
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

          {/* Pitch Strategy Section - Integrated URL Handling */}
          <PitchStrategySection 
              data={pitchData} 
              setData={setPitchData} 
              isExpanded={pitchExpanded} 
              setIsExpanded={setPitchExpanded}
              websiteUrl={websiteUrl}
              setWebsiteUrl={setWebsiteUrl}
              onGeneratePitch={handleGeneratePitch}
              isAnalyzing={isPitchAnalyzing}
          />

          {/* Footer Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-slate-50">
            <button 
                onClick={onBack} 
                className="px-8 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium min-w-[140px]"
            >
                Previous
            </button>
            <button 
                onClick={onConfirm} 
                className="px-8 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all font-medium min-w-[140px] flex items-center justify-center gap-2"
            >
                Import & Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
      </div>
    </div>
  );
};
