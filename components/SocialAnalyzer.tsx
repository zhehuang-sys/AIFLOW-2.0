
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Loader2, Target, MessageCircleHeart, Linkedin, Link as LinkIcon, 
  Sparkles, Eye, ThumbsUp, MessageCircle, Share2, CheckCircle2, AlertCircle, Globe,
  ChevronUp, FileText, Calendar, Database, FileSpreadsheet, ChevronDown, Clock
} from 'lucide-react';
import { BlacklistOption, Tooltip } from './CampaignFormUI';
import { PitchStrategySection, PitchData } from './PitchStrategySection';
import { AVAILABLE_LANGUAGES } from '../types';

interface SocialAnalyzerProps {
  onConfirm: () => void;
  onBack: () => void;
  emailContentLanguage: string;
  setEmailContentLanguage: (lang: string) => void;
  fallbackLanguage: string;
  setFallbackLanguage: (lang: string) => void;
  isLinkedinConnected?: boolean;
}

export const SocialAnalyzer: React.FC<SocialAnalyzerProps> = ({ 
  onConfirm, 
  onBack,
  emailContentLanguage,
  setEmailContentLanguage,
  fallbackLanguage,
  setFallbackLanguage,
  isLinkedinConnected = false
}) => {
  // LinkedIn Connection State
  const [isLocalConnected, setIsLocalConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('Alex Rivera (Sales Director)');

  const MOCK_ACCOUNTS = [
    'Alex Rivera (Sales Director)',
    'Sarah Chen (Growth Lead)',
    'Marcus Thorne (Founder)'
  ];

  // Strategy State: 'posts', 'viewers', or 'competitors'
  const [strategy, setStrategy] = useState<'posts' | 'viewers' | 'competitors'>('posts');

  const isActuallyConnected = isLinkedinConnected || isLocalConnected;

  // Post Engagement State
  const [postUrls, setPostUrls] = useState('');
  const [engagementTypes, setEngagementTypes] = useState({
    likes: true,
    comments: true,
    reposts: false
  });

  // Competitor State
  const [competitorNames, setCompetitorNames] = useState('');

  // Limits State
  const [dailyLimit, setDailyLimit] = useState<string>('100');
  const [totalLimit, setTotalLimit] = useState<string>('1000');

  // Blacklist state
  const [blacklist, setBlacklist] = useState({
    list: false,
    time: false,
    crm: false,
    csv: false,
    sheet: false
  });

  // Pitch/Context State
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [pitchData, setPitchData] = useState<PitchData>({
    valueProp: '',
    benchmarkBrands: [''],
    painPoints: [''],
    solutions: [''],
    proofPoints: [''],
    ctas: [''],
    leadMagnets: ['']
  });
  
  // AI & System State
  const [isPitchAnalyzing, setIsPitchAnalyzing] = useState(false);
  const [pitchExpanded, setPitchExpanded] = useState(true);
  const [error, setError] = useState('');

  const handleConnectLinkedin = () => {
      setIsConnecting(true);
      // Simulate OAuth delay
      setTimeout(() => {
          setIsLocalConnected(true);
          setIsConnecting(false);
      }, 1200);
  };
  
  const handleGeneratePitch = async () => {
    if (!websiteUrl) {
      setError("Please provide a product/service URL first.");
      return;
    }
    
    setIsPitchAnalyzing(true);
    setError('');
    
    try {
        const apiKey = process.env.API_KEY;
        if (apiKey) {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `
            Analyze the product at this URL: ${websiteUrl}
            
            Context: The user is targeting LinkedIn users who engaged with specific posts or viewed the user's profile.
            
            Extract Pitch Strategy Data for FlashRev AIFlow.
            Return a JSON object with keys: "valueProp", "benchmarkBrands", "painPoints", "solutions", "proofPoints", "ctas", "leadMagnets".
            `;

            const result = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            const text = result.text || "";
            const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            const data = JSON.parse(jsonStr);

            setPitchData({
                valueProp: data.valueProp || '',
                benchmarkBrands: data.benchmarkBrands || [''],
                painPoints: data.painPoints || [''],
                solutions: data.solutions || [''],
                proofPoints: data.proofPoints || [''],
                ctas: data.ctas || [''],
                leadMagnets: data.leadMagnets || ['']
            });
        } else {
             // Mock Data Fallback
            setTimeout(() => {
                setPitchData({
                    valueProp: "Automate your LinkedIn outreach based on high-intent signals.",
                    benchmarkBrands: ["Taplio", "PhantomBuster"],
                    painPoints: ["Manual prospecting", "Low response rates", "Missed opportunities"],
                    solutions: ["Signal-based targeting", "Auto-engagement", "Profile enrichment"],
                    proofPoints: ["3x Response Rate", "Saved 10hrs/week"],
                    ctas: ["Start Free Trial", "See Case Study"],
                    leadMagnets: ["LinkedIn Growth Guide", "Outreach Templates"]
                });
            }, 1500);
        }
    } catch (err) {
        console.error(err);
        setError("Failed to generate pitch. Please try again.");
    } finally {
        setIsPitchAnalyzing(false);
    }
  };

  const toggleBlacklist = (key: keyof typeof blacklist) => {
    setBlacklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
      if (strategy === 'viewers' && !isActuallyConnected) {
          setError("Please connect your LinkedIn account to proceed.");
          return;
      }
      if (strategy === 'posts' && !postUrls) {
          setError("Please provide at least one post URL to analyze.");
          return;
      }
      if (strategy === 'competitors' && !competitorNames) {
          setError("Please provide at least one competitor brand name.");
          return;
      }
      onConfirm();
  };

  const toggleEngagementType = (type: keyof typeof engagementTypes) => {
      setEngagementTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const areLimitsDisabled = strategy === 'posts' || strategy === 'viewers';

  const getLimitExplanation = () => {
      if (strategy === 'posts') {
          return "Contact amount limit will be based on the number of users interacting with the posts.";
      }
      if (strategy === 'viewers') {
          return "Contact amount limit will be based on the number of users visiting your profile visiting your profile.";
      }
      return null;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fadeIn">
      
      {/* --- SECTION 1: STRATEGY SELECTION --- */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-900 mb-4">Select Signal Source</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Post Engagement Option */}
            <div 
                onClick={() => setStrategy('posts')}
                className={`
                    p-5 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden flex flex-col
                    ${strategy === 'posts' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}
                `}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${strategy === 'posts' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <MessageCircleHeart className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${strategy === 'posts' ? 'text-blue-900' : 'text-slate-700'}`}>Target Post Engagement</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                    Scrape likes, comments, and reposts from specific viral posts.
                </p>
                {strategy === 'posts' && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-blue-600" />}
            </div>

             {/* Competitor Mentions Option */}
             <div 
                onClick={() => setStrategy('competitors')}
                className={`
                    p-5 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden flex flex-col
                    ${strategy === 'competitors' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}
                `}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${strategy === 'competitors' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Globe className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${strategy === 'competitors' ? 'text-blue-900' : 'text-slate-700'}`}>Target Competitor Mentions</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                    Scan LinkedIn for recent posts discussing competitor brands.
                </p>
                {strategy === 'competitors' && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-blue-600" />}
            </div>

            {/* Profile Viewers Option */}
             <div 
                onClick={() => setStrategy('viewers')}
                className={`
                    p-5 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden flex flex-col
                    ${strategy === 'viewers' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}
                `}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${strategy === 'viewers' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Eye className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${strategy === 'viewers' ? 'text-blue-900' : 'text-slate-700'}`}>Target Profile Viewers</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                    Reach out to people who have viewed your profile recently.
                </p>
                 {strategy === 'viewers' && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-blue-600" />}
            </div>
        </div>
      </div>

      {/* --- SECTION 2: LINKEDIN BINDING (Conditional for Viewers) --- */}
      {strategy === 'viewers' && (
        <div className="mb-10 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Linkedin className="w-5 h-5 text-[#0077b5]" />
                        Connect LinkedIn Account
                    </h2>
                    <p className="text-sm text-slate-500">
                        Bind your account to access your profile viewers securely.
                    </p>
                </div>
            </div>
            
            <div className={`
                p-6 rounded-xl border transition-all flex items-center justify-between
                ${isActuallyConnected ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}
            `}>
                <div className="flex items-center gap-4 flex-1">
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        ${isActuallyConnected ? 'bg-white text-[#0077b5] shadow-sm' : 'bg-slate-200 text-slate-400'}
                    `}>
                        <Linkedin className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        {isActuallyConnected ? (
                            isLinkedinConnected ? (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Select Connected Account</label>
                                    <div className="relative max-w-xs">
                                        <select 
                                            value={selectedAccount}
                                            onChange={(e) => setSelectedAccount(e.target.value)}
                                            className="w-full p-2.5 pr-10 bg-white border border-blue-200 rounded-lg appearance-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 cursor-pointer text-sm font-medium text-slate-700 shadow-sm"
                                        >
                                            {MOCK_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="font-bold text-slate-900">LinkedIn Account Connected</h3>
                                    <p className="text-sm text-slate-500">Ready to track profile viewers.</p>
                                </div>
                            )
                        ) : (
                            <div>
                                <h3 className="font-bold text-slate-900">No Account Connected</h3>
                                <p className="text-sm text-slate-500">Connect to enable viewer tracking.</p>
                            </div>
                        )}
                    </div>
                </div>

                {isActuallyConnected ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-100 text-blue-700 text-sm font-medium shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Connected
                    </div>
                ) : (
                    <button 
                        onClick={handleConnectLinkedin}
                        disabled={isConnecting}
                        className="px-6 py-2.5 bg-[#0077b5] hover:bg-[#006097] text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Linkedin className="w-4 h-4" />}
                        Connect Account
                    </button>
                )}
            </div>
        </div>
      )}

      <div className="h-px bg-slate-100 w-full mb-10" />

      {/* --- SECTION 3: STRATEGY CONFIGURATION --- */}
      <div className="mb-10 animate-fadeIn">
        {strategy === 'posts' && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Post URLs (One per line)
                        <Tooltip content="Paste links to specific posts. We will extract users based on your interaction filters." />
                    </label>
                    <textarea
                        className="w-full min-h-[120px] p-4 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-50 outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                        placeholder="https://www.linkedin.com/posts/..."
                        value={postUrls}
                        onChange={(e) => setPostUrls(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div 
                            onClick={() => toggleEngagementType('likes')}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${engagementTypes.likes ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}
                        >
                            {engagementTypes.likes && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700 flex items-center gap-1.5">
                            <ThumbsUp className="w-3.5 h-3.5" /> Likes
                        </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div 
                            onClick={() => toggleEngagementType('comments')}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${engagementTypes.comments ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}
                        >
                             {engagementTypes.comments && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700 flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5" /> Comments
                        </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div 
                             onClick={() => toggleEngagementType('reposts')}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${engagementTypes.reposts ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}
                        >
                             {engagementTypes.reposts && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700 flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5" /> Reposts
                        </span>
                    </label>
                </div>
            </div>
        )}

        {strategy === 'competitors' && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Competitor Brand Names
                        <Tooltip content="We will search for recent posts mentioning these brands to find people discussing them." />
                    </label>
                    <textarea
                        className="w-full min-h-[100px] p-4 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-50 outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                        placeholder="e.g. Salesforce, HubSpot, Pipedrive (Separate with commas or new lines)"
                        value={competitorNames}
                        onChange={(e) => setCompetitorNames(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 text-sm text-blue-800 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                     <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Sparkles className="w-4 h-4" />
                     </div>
                     <div>
                        <span className="font-bold">AI Filtering Active</span>
                        <p className="opacity-80 mt-0.5">We automatically prioritize posts with high engagement ("Is X better than Y?", "Moving away from X") and filter out low-quality noise.</p>
                     </div>
                </div>
            </div>
        )}

        {strategy === 'viewers' && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Eye className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">Tracking Profile Views</h4>
                    <p className="text-sm text-slate-500 mt-1">
                        We will automatically identify users who viewed your profile. Ensure you have LinkedIn Premium for best results (optional but recommended).
                    </p>
                </div>
            </div>
        )}
        
        {error && <p className="text-xs text-red-500 mt-3 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
      </div>

      <div className="h-px bg-slate-100 w-full mb-10" />

      {/* --- SECTION 3.5: EMAIL LANGUAGE CONFIGURATION --- */}
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

      {/* --- SECTION 4: PRODUCT PITCH STRATEGY --- */}
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

      <div className="h-px bg-slate-100 w-full mb-10" />

      {/* --- LIMITS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 animate-fadeIn">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <span className="text-red-500 mr-1">*</span>Daily Limit
          </label>
           <p className="text-xs text-slate-400 mb-3">Maximum contacts per day.</p>
          <div className="flex gap-4">
            <input
              type="text"
              value={areLimitsDisabled ? 'N/A' : dailyLimit}
              onChange={(e) => !areLimitsDisabled && setDailyLimit(e.target.value)}
              disabled={areLimitsDisabled}
              placeholder="100"
              className={`w-1/2 p-3 rounded-xl border outline-none transition-all ${areLimitsDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-600'}`}
            />
            <div className="relative w-1/2">
               <select disabled={areLimitsDisabled} className={`w-full p-3 rounded-xl border bg-white appearance-none outline-none cursor-pointer ${areLimitsDisabled ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-200 text-slate-700 focus:border-blue-600'}`}>
                <option>Per Day</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <span className="text-red-500 mr-1">*</span>Total Limit
          </label>
          <p className="text-xs text-slate-400 mb-3">Total contacts for this campaign.</p>
          <div className="flex gap-4">
            <input
              type="text"
              value={areLimitsDisabled ? 'N/A' : totalLimit}
              onChange={(e) => !areLimitsDisabled && setTotalLimit(e.target.value)}
              disabled={areLimitsDisabled}
              placeholder="1000"
              className={`w-1/2 p-3 rounded-xl border outline-none transition-all ${areLimitsDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-600'}`}
            />
            <div className="relative w-1/2">
              <select disabled={areLimitsDisabled} className={`w-full p-3 rounded-xl border bg-white appearance-none outline-none cursor-pointer ${areLimitsDisabled ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-200 text-slate-700 focus:border-blue-600'}`}>
                <option>In Total</option>
              </select>
               <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
        {areLimitsDisabled && (
          <div className="md:col-span-2">
            <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
              {getLimitExplanation()}
            </p>
          </div>
        )}
      </div>

      {/* --- EXCLUDE CONTACTS --- */}
      <div className="mb-12 animate-fadeIn">
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

       {/* Footer */}
       <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-slate-50">
        <button onClick={onBack} className="px-8 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium min-w-[140px]">Previous</button>
        <button 
            onClick={handleNext} 
            className="px-8 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-medium min-w-[140px]"
        >
            Next
        </button>
      </div>
    </div>
  );
};
