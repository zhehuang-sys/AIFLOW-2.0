
import React, { useState } from 'react';
import { Webhook, Code, Copy, Check, Eye, Loader2, Sparkles, FileText, Calendar, Database, FileSpreadsheet, ChevronUp, RefreshCw, Trash2, ChevronDown, Info, Plus, X, AlertCircle, Globe } from 'lucide-react';
import { PitchStrategySection, PitchData } from './PitchStrategySection';
import { BlacklistOption, Tooltip } from './CampaignFormUI';
import { AVAILABLE_LANGUAGES } from '../types';

interface InboundConfigProps {
  onConfirm: () => void;
  onBack: () => void;
  emailContentLanguage: string;
  setEmailContentLanguage: (lang: string) => void;
  fallbackLanguage: string;
  setFallbackLanguage: (lang: string) => void;
}

const INTEGRATION_TYPES = [
  "C# - HttpClient",
  "C# - RestSharp",
  "cURL",
  "Dart - dio",
  "Dart - http",
  "Go - Native",
  "HTTP",
  "Java - OkHttp"
];

export const InboundConfig: React.FC<InboundConfigProps> = ({ 
  onConfirm, 
  onBack,
  emailContentLanguage,
  setEmailContentLanguage,
  fallbackLanguage,
  setFallbackLanguage
}) => {
  const [copied, setCopied] = useState(false);
  const [integrationType, setIntegrationType] = useState('cURL');
  const [dynamicUpdate] = useState(true); // Default to true and not editable
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  const [headers, setHeaders] = useState(['First Name', 'Last Name', 'Phone Number', 'Email', 'Company', 'Title']);
  const [showAddFieldPopover, setShowAddFieldPopover] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

  const token = "74kMiFrj";
  const webhookUrl = `https://discover-api-test.flashintel.ai/api/v3/list/webhook/data/push`;
  const [websiteUrl, setWebsiteUrl] = useState('');

  const defaultCurl = `curl '${webhookUrl}' \\
  -H 'Authorization: bearer ${token}' \\
  -H 'Content-Type: application/json' \\
  --data-raw '{"campaignId": "4481","data":[]}'`;

  const [editableCode, setEditableCode] = useState(defaultCurl);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      setHeaders([...headers, newFieldName.trim()]);
      setNewFieldName('');
      setShowAddFieldPopover(false);
    }
  };

  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const handleGeneratePitch = () => {
      if(!websiteUrl) return;
      setIsAnalyzing(true);
      setTimeout(() => {
          setPitchData({
            valueProp: "Thanks for checking us out! Here is how we can help.",
            benchmarkBrands: ["Competitor A", "Competitor B"],
            painPoints: ["Looking for better pricing", "Need more features"],
            solutions: ["Transparent pricing", "Feature rich platform"],
            proofPoints: ["Rated #1 on G2", "24/7 Support"],
            ctas: ["Schedule a call", "Watch Demo"],
            leadMagnets: ["Pricing Guide", "Case Study"]
          });
          setIsAnalyzing(false);
      }, 1000);
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fadeIn">
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Inbound Setup</h2>
        <p className="text-slate-500">Configure how we should identify and enroll leads into this campaign via Webhook.</p>
      </div>

      {/* Webhook Configuration Mode Only */}
      <div className="mb-10 animate-fadeIn">
          {/* Webhook Configuration Styles matching Screenshot */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <button 
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 min-w-[160px] justify-between transition-colors"
              >
                <span className={integrationType === 'cURL' ? 'text-blue-600 font-bold' : ''}>{integrationType}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 animate-fadeIn">
                  {INTEGRATION_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setIntegrationType(type);
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${integrationType === type ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => handleCopy(editableCode)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              Copy
            </button>
          </div>

          <div className="w-full bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm overflow-hidden border-l-4 border-l-blue-100">
            <textarea
              className="w-full h-80 bg-transparent border-none outline-none text-slate-700 font-mono text-sm leading-relaxed resize-none"
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E7F9F3] border border-[#BCECDD] rounded-full">
              <span className="text-xs font-medium text-[#075F44] font-mono">{token}</span>
              <button className="text-[#075F44] hover:opacity-70"><Eye className="w-3.5 h-3.5" /></button>
            </div>
            <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            <button onClick={() => handleCopy(token)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Copy className="w-4 h-4" /></button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"><RefreshCw className="w-4 h-4" /></button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Dynamic Update</h3>
              <button 
                disabled
                className="w-12 h-6 rounded-full p-1 bg-blue-600 opacity-60 cursor-not-allowed transition-all"
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm transform translate-x-6" />
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3 border border-slate-100">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-600 leading-relaxed">
                Once enabled, FlashRev will automatically update the data of the linked list and push the updates to AIFlow.
              </p>
            </div>
          </div>

          {/* Define Contact Header Module */}
          <div className="mb-10 pt-6 border-t border-slate-100 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Define Contact Header</h3>
                <p className="text-xs text-slate-400 mt-1">Predefine contact fields received via webhook to ensure personalized emails can be generated automatically.</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowAddFieldPopover(!showAddFieldPopover)}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>
                
                {showAddFieldPopover && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Field Name</label>
                    <input 
                      autoFocus
                      className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm mb-3"
                      placeholder="e.g. phone_number"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowAddFieldPopover(false)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAddField}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {headers.length > 0 ? (
                headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg group hover:border-blue-300 transition-colors">
                     <input 
                        type="text"
                        className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-24 placeholder:text-slate-300"
                        value={header}
                        placeholder="Field Name"
                        onChange={(e) => updateHeader(index, e.target.value)}
                     />
                     <button 
                      onClick={() => removeHeader(index)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                     >
                       <X className="w-3.5 h-3.5" />
                     </button>
                  </div>
                ))
              ) : (
                <div className="w-full p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-600 font-medium">At least one contact header field must be defined to proceed.</p>
                </div>
              )}
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
          disabled={headers.length === 0}
          className={`px-8 py-2.5 rounded-full transition-all font-medium min-w-[140px]
            ${headers.length === 0 ? 'bg-slate-300 cursor-not-allowed shadow-none text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}
          `}
        >
          Verify & Next
        </button>
      </div>
    </div>
  );
};
