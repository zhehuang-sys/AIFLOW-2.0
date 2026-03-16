
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Loader2, Check, Globe, MapPin, Link as LinkIcon, Sparkles, X, Linkedin, Facebook, Twitter, 
  Briefcase, TrendingUp, Code2, Newspaper, ChevronDown, User, Users, Target,
  ChevronUp, FileText, Calendar, Database, FileSpreadsheet, Building2, UserPlus, Megaphone, Instagram, Camera, MessageCircleHeart, Youtube, Music, AlertCircle
} from 'lucide-react';
import { MatchingMode, AVAILABLE_LANGUAGES } from '../types';
import { Tooltip, AccuracyCard, BlacklistOption, SignalCard } from './CampaignFormUI';
import { PitchStrategySection, PitchData, IndustryType } from './PitchStrategySection';

interface IcpAnalyzerProps {
  onConfirm: () => void;
  onBack: () => void;
  emailContentLanguage: string;
  setEmailContentLanguage: (lang: string) => void;
  fallbackLanguage: string;
  setFallbackLanguage: (lang: string) => void;
}

const AVAILABLE_COUNTRIES = [
  'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China', 'Czech Republic', 'Denmark', 'Finland', 
  'France', 'Germany', 'Greece', 'Hong Kong', 'Hungary', 'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 
  'Korea', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Philippines', 'Poland', 'Portugal', 'Romania', 
  'Russia', 'Singapore', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 
  'Ukraine', 'United Kingdom', 'United States', 'Vietnam'
];

const COMPANY_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];
const REVENUE_RANGE_OPTIONS = ["<$1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"];

// --- INDUSTRY CONFIGURATION ---
interface SignalDef {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface IndustryConfigDef {
    label: string;
    icon: React.ElementType;
    urlPlaceholder: string;
    descPlaceholder: string;
    urlLabel: string;
    descLabel: string;
    signals: SignalDef[];
    promptRole: string;
}

const INDUSTRY_CONFIG: Record<IndustryType, IndustryConfigDef> = {
    b2b: {
        label: "Generic B2B Sales",
        icon: Briefcase,
        urlLabel: "Website URL (for Extraction)",
        urlPlaceholder: "yourcompany.com",
        descLabel: "ICP Description",
        descPlaceholder: "Describe your target audience...",
        promptRole: "B2B Sales Strategist",
        signals: [
            { id: 'hiring', label: 'Hiring Trends', icon: Briefcase },
            { id: 'techStack', label: 'Tech Stack', icon: Code2 },
            { id: 'funding', label: 'Funding News', icon: TrendingUp },
            { id: 'social', label: 'Social Activity', icon: Newspaper },
        ]
    },
    recruiting: {
        label: "Recruiting & Staffing",
        icon: UserPlus,
        urlLabel: "Job Description URL",
        urlPlaceholder: "careers.company.com/job/123",
        descLabel: "Ideal Candidate Profile",
        descPlaceholder: "Describe the perfect candidate (Skills, YOE, Previous Companies)...",
        promptRole: "Executive Recruiter / Headhunter",
        signals: [
            { id: 'skills', label: 'Hard Skills Match', icon: Code2 },
            { id: 'tenure', label: 'Avg Tenure', icon: Calendar },
            { id: 'layoffs', label: 'Recent Layoffs', icon: TrendingUp },
            { id: 'open_to_work', label: 'Open to Work', icon: User },
        ]
    },
    vc: {
        label: "VC & Private Equity",
        icon: TrendingUp,
        urlLabel: "Fund / Thesis URL",
        urlPlaceholder: "yourfund.com",
        descLabel: "Investment Thesis",
        descPlaceholder: "Describe the startups you invest in (Stage, Sector, Geo)...",
        promptRole: "Venture Capital Analyst",
        signals: [
            { id: 'growth', label: 'Team Growth', icon: Users },
            { id: 'product_hunt', label: 'Product Launches', icon: Sparkles },
            { id: 'funding_history', label: 'Funding News', icon: Database },
            { id: 'github', label: 'Dev Activity', icon: Code2 },
        ]
    },
    real_estate: {
        label: "Commercial Real Estate",
        icon: Building2,
        urlLabel: "Property / Listing URL",
        urlPlaceholder: "listing.com/123-main-st",
        descLabel: "Target Tenant Profile",
        descPlaceholder: "Describe businesses that need this space (Industry, Size, Lease expiry)...",
        promptRole: "Commercial Real Estate Broker",
        signals: [
            { id: 'hiring_local', label: 'Local Hiring', icon: MapPin },
            { id: 'lease_expiry', label: 'Lease Expiry', icon: Calendar },
            { id: 'remote_policy', label: 'RTO Policy', icon: Building2 },
            { id: 'funding', label: 'Growth Capital', icon: TrendingUp },
        ]
    },
    pr: {
        label: "PR & Journalism",
        icon: Megaphone,
        urlLabel: "Press Release / Story URL",
        urlPlaceholder: "yourstory.com/draft",
        descLabel: "Target Media Outlet / Beat",
        descPlaceholder: "Describe the journalists you want to pitch (TechCrunch, Fintech beat)...",
        promptRole: "PR Strategist",
        signals: [
            { id: 'recent_articles', label: 'Recent Articles', icon: Newspaper },
            { id: 'topics', label: 'Topics Covered', icon: FileText },
            { id: 'social_engagement', label: 'Twitter Activity', icon: Twitter },
            { id: 'outlet', label: 'Outlet Tier', icon: Globe },
        ]
    },
    influencer: {
        label: "Influencer Marketing",
        icon: Camera,
        urlLabel: "Brand / Product URL",
        urlPlaceholder: "yourbrand.com/product",
        descLabel: "Creator Persona",
        descPlaceholder: "Describe the influencers (Lifestyle, Tech, GenZ, Aesthetic)...",
        promptRole: "Influencer Marketing Manager",
        signals: [
            { id: 'engagement', label: 'Engagement Rate', icon: MessageCircleHeart },
            { id: 'audience_demo', label: 'Audience Demo', icon: Users },
            { id: 'brand_affinity', label: 'Brand Affinity', icon: Sparkles },
            { id: 'content_style', label: 'Content Style', icon: Instagram },
        ]
    }
};

export const IcpAnalyzer: React.FC<IcpAnalyzerProps> = ({ 
  onConfirm, 
  onBack,
  emailContentLanguage,
  setEmailContentLanguage,
  fallbackLanguage,
  setFallbackLanguage
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('b2b');
  const [icpText, setIcpText] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [countries, setCountries] = useState<string[]>(['United States']);
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [companySizes, setCompanySizes] = useState<string[]>([]);
  const [revenueRanges, setRevenueRanges] = useState<string[]>([]);

  const [contactSources, setContactSources] = useState({
    linkedin: true,
    x: false,
    facebook: false,
    instagram: false,
    tiktok: false,
    youtube: false
  });
  
  const [activeSignals, setActiveSignals] = useState<Record<string, boolean>>({
      hiring: true,
      techStack: true,
      funding: false,
      social: true,
      skills: true,
      tenure: true,
      layoffs: false,
      open_to_work: true,
      growth: true,
      product_hunt: true,
      funding_history: true,
      github: false,
      hiring_local: true,
      lease_expiry: false,
      remote_policy: true,
      recent_articles: true,
      topics: true,
      social_engagement: true,
      outlet: true,
      engagement: true,
      audience_demo: true,
      brand_affinity: true,
      content_style: true
  });

  const [dailyLimit, setDailyLimit] = useState<string>('100');
  const [totalLimit, setTotalLimit] = useState<string>('1000');
  const [matchingMode, setMatchingMode] = useState<MatchingMode>(MatchingMode.SCALE);
  
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
  const [aiAnalysis, setAiAnalysis] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [pitchExpanded, setPitchExpanded] = useState(true);
  
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

  const toggleSource = (key: keyof typeof contactSources) => {
    setContactSources(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSignal = (signalId: string) => {
    setActiveSignals(prev => ({ ...prev, [signalId]: !prev[signalId] }));
  };

  const handleMultiSelect = (
    currentList: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    value: string
  ) => {
    if (value && !currentList.includes(value)) {
        setList([...currentList, value]);
    }
  };

  const removeMultiSelect = (
    currentList: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    valueToRemove: string
  ) => {
    setList(currentList.filter(item => item !== valueToRemove));
  };

  const handleExtractIcp = async () => {
    if (!websiteUrl && !icpText) {
      setError("Please provide a Website URL or Description to analyze.");
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
       const apiKey = process.env.API_KEY;
       if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const industryConfig = INDUSTRY_CONFIG[selectedIndustry];
        
        const prompt = `
          Act as a ${industryConfig.promptRole} for FlashRev.
          Analyze the following:
          Context URL: ${websiteUrl}
          Target Description: ${icpText}
          
          TASK 1: Identify 3 "Core Target Segments". Provide Title and Detailed Description.
          
          TASK 2: Extract Targeting Metadata.
          - Identify up to 3 "targetCountries" from this list: [${AVAILABLE_COUNTRIES.join(', ')}].
          - Identify up to 2 "targetLanguages" from this list: [${AVAILABLE_LANGUAGES.join(', ')}].
          - Identify up to 2 "likelyCompanySizes" from this list: [${COMPANY_SIZE_OPTIONS.join(', ')}].
          - Identify up to 2 "likelyRevenueRanges" from this list: [${REVENUE_RANGE_OPTIONS.join(', ')}].

          TASK 3: Extract Pitch Strategy Data for FlashRev AIFlow (Industry: ${selectedIndustry}).
          - Value Proposition / Hook (1 sentence)
          - 3 Benchmark Brands / Competitors
          - 3 Key Pain Points
          - 3 Key Solutions
          - 3 Proof Points
          - 3 Call to Actions
          - 3 Lead Magnets

          Return a JSON object with keys: "audiences", "targeting", "valueProp", "benchmarkBrands", "painPoints", "solutions", "proofPoints", "ctas", "leadMagnets".
          The "targeting" key should contain "countries", "languages", "companySizes", and "revenueRanges".
        `;

        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        
        try {
            const text = result.text || "";
            const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            const data = JSON.parse(jsonStr);
            
            // Populate State
            if (data.audiences) setAiAnalysis(data.audiences);
            
            // Auto-fill Targeting Info
            if (data.targeting) {
                if (data.targeting.countries?.length) setCountries(data.targeting.countries);
                if (data.targeting.languages?.length) setLanguages(data.targeting.languages);
                if (data.targeting.companySizes?.length) setCompanySizes(data.targeting.companySizes);
                if (data.targeting.revenueRanges?.length) setRevenueRanges(data.targeting.revenueRanges);
            }

            setPitchData({
                valueProp: data.valueProp || '',
                benchmarkBrands: data.benchmarkBrands || [''],
                painPoints: data.painPoints || [''],
                solutions: data.solutions || [''],
                proofPoints: data.proofPoints || [''],
                ctas: data.ctas || [''],
                leadMagnets: data.leadMagnets || ['']
            });

        } catch (e) {
            console.error("JSON Parse Error", e);
            throw new Error("Parsing failed");
        }
       } else {
           // Mock Data Fallback
           setTimeout(() => {
                setAiAnalysis([
                    { title: "Enterprise SaaS", description: "Companies focused on scaling their B2B operations." },
                    { title: "Mid-Market Growth", description: "Fast-growing teams needing automation." },
                    { title: "Tech Innovators", description: "Early adopters of AI-driven sales tools." }
                ]);
                
                setCountries(["United States", "United Kingdom"]);
                setLanguages(["English"]);
                setCompanySizes(["51-200", "201-500"]);
                setRevenueRanges(["$10M-$50M"]);

                setPitchData({
                    valueProp: "Automate your outbound strategy with AI-driven signals.",
                    benchmarkBrands: ["Salesforce", "HubSpot"],
                    painPoints: ["Manual prospecting", "Stale data"],
                    solutions: ["AI Scout", "Real-time signals"],
                    proofPoints: ["30% higher response rate", "Saved 20hrs/week"],
                    ctas: ["Book Demo", "Start Trial"],
                    leadMagnets: ["ICP Blueprint", "Outreach Guide"]
                });
           }, 1500);
       }
    } catch (err) {
        console.error(err);
        setError("Failed to extract data. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
      if (!dailyLimit || !totalLimit) {
          setError("Please set prospect limits.");
          return;
      }
      onConfirm();
  };

  const activeConfig = INDUSTRY_CONFIG[selectedIndustry];

  const SourceButton = ({ id, label, icon: Icon, active }: { id: keyof typeof contactSources, label: string, icon: React.ElementType, active: boolean }) => (
      <div 
        onClick={() => toggleSource(id)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
    >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
        {active && <Check className="w-3.5 h-3.5 ml-1" />}
    </div>
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fadeIn">
      
      <div className="mb-8">
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Select Campaign Industry / Use Case
          </label>
          <div className="relative">
            <select
                value={selectedIndustry}
                onChange={(e) => {
                    setSelectedIndustry(e.target.value as IndustryType);
                    setAiAnalysis(null);
                }}
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 cursor-pointer font-medium text-slate-800"
            >
                {Object.entries(INDUSTRY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
                {React.createElement(activeConfig.icon, { className: "w-5 h-5" })}
            </div>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
      </div>

      <div className="h-px bg-slate-100 w-full mb-8" />

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

      <div className="h-px bg-slate-100 w-full mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {activeConfig.urlLabel}
            </label>
            <div className="flex gap-4">
                <div className="flex-1 flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-600 transition-all bg-white">
                    <div className="px-4 py-3 bg-slate-50 border-r border-slate-200 text-slate-500 text-sm flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        https://
                    </div>
                    <input 
                        type="text" 
                        className="flex-1 px-4 py-3 outline-none text-slate-800 placeholder:text-slate-300"
                        placeholder={activeConfig.urlPlaceholder}
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleExtractIcp}
                    disabled={isAnalyzing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Analyze & Extract
                </button>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Countries
            </label>
            <div className="relative mb-2">
                <select 
                    onChange={(e) => handleMultiSelect(countries, setCountries, e.target.value)}
                    className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 cursor-pointer"
                    value=""
                >
                    <option value="" disabled>Select countries...</option>
                    {AVAILABLE_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-2">
                {countries.map(c => (
                    <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 animate-fadeIn">
                        {c}
                        <button onClick={() => removeMultiSelect(countries, setCountries, c)} className="ml-1.5 hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Languages
            </label>
            <div className="relative mb-2">
                <select 
                     onChange={(e) => handleMultiSelect(languages, setLanguages, e.target.value)}
                    className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 cursor-pointer"
                    value=""
                >
                     <option value="" disabled>Select languages...</option>
                    {AVAILABLE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-2">
                {languages.map(l => (
                    <span key={l} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 animate-fadeIn">
                        {l}
                         <button onClick={() => removeMultiSelect(languages, setLanguages, l)} className="ml-1.5 hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Size (Employees)
            </label>
            <div className="relative mb-2">
                <select 
                    onChange={(e) => handleMultiSelect(companySizes, setCompanySizes, e.target.value)}
                    className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 cursor-pointer"
                    value=""
                >
                    <option value="" disabled>Select company size...</option>
                    {COMPANY_SIZE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt} employees</option>
                    ))}
                </select>
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-2">
                {companySizes.map(s => (
                    <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 animate-fadeIn">
                        {s}
                        <button onClick={() => removeMultiSelect(companySizes, setCompanySizes, s)} className="ml-1.5 hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Revenue Range
            </label>
            <div className="relative mb-2">
                <select 
                    onChange={(e) => handleMultiSelect(revenueRanges, setRevenueRanges, e.target.value)}
                    className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 cursor-pointer"
                    value=""
                >
                    <option value="" disabled>Select revenue range...</option>
                    {REVENUE_RANGE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-2">
                {revenueRanges.map(r => (
                    <span key={r} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 animate-fadeIn">
                        {r}
                        <button onClick={() => removeMultiSelect(revenueRanges, setRevenueRanges, r)} className="ml-1.5 hover:text-blue-900"><X className="w-3 h-3" /></button>
                    </span>
                ))}
            </div>
        </div>

        <div className="md:col-span-2 bg-slate-50/50 rounded-xl p-5 border border-slate-200">
             <label className="block text-sm font-bold text-slate-900 mb-3">
                Signal Priority (Optimization)
                <Tooltip content="Improve matching accuracy by layering additional data signals relevant to your industry." />
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeConfig.signals.map(signal => (
                    <SignalCard 
                        key={signal.id}
                        icon={<signal.icon className="w-4 h-4" />}
                        label={signal.label}
                        active={activeSignals[signal.id] || false}
                        onClick={() => toggleSignal(signal.id)}
                    />
                ))}
            </div>
        </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-3">
                Contact Sources
                <Tooltip content="Select which platforms to search for prospect information." />
            </label>
            <div className="flex flex-wrap gap-4">
                <SourceButton id="linkedin" label="LinkedIn" icon={Linkedin} active={contactSources.linkedin} />
                {selectedIndustry === 'influencer' ? (
                    <>
                        <SourceButton id="instagram" label="Instagram" icon={Instagram} active={contactSources.instagram} />
                        <SourceButton id="tiktok" label="TikTok" icon={Music} active={contactSources.tiktok} />
                        <SourceButton id="youtube" label="YouTube" icon={Youtube} active={contactSources.youtube} />
                        <SourceButton id="x" label="X (Twitter)" icon={Twitter} active={contactSources.x} />
                    </>
                ) : (
                    <SourceButton id="x" label="X (Twitter)" icon={Twitter} active={contactSources.x} />
                )}
            </div>
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          <span className="text-red-500 mr-1">*</span>
          {aiAnalysis ? "Target Segments (Extracted)" : activeConfig.descLabel}
        </label>
        
        {aiAnalysis ? (
            <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                {aiAnalysis.map((audience, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-blue-100 bg-blue-50/30">
                        <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            {audience.title}
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {audience.description}
                        </p>
                    </div>
                ))}
                <button 
                    onClick={() => setAiAnalysis(null)}
                    className="text-sm text-slate-500 hover:text-blue-600 underline text-left w-fit"
                >
                    Edit manually
                </button>
            </div>
        ) : (
            <>
                <textarea
                className={`w-full h-32 p-4 rounded-xl border focus:ring-4 focus:ring-blue-50 transition-all resize-none text-slate-800 placeholder:text-slate-300 text-base outline-none
                    ${error && !icpText ? 'border-red-300' : 'border-slate-200 focus:border-blue-600'}
                `}
                placeholder={activeConfig.descPlaceholder}
                value={icpText}
                onChange={(e) => setIcpText(e.target.value)}
                />
                {error && !icpText && <p className="text-xs text-red-500 mt-2">Please input</p>}
            </>
        )}
      </div>

      <div className="h-px bg-slate-100 w-full mb-10" />

      <PitchStrategySection 
        data={pitchData} 
        setData={setPitchData} 
        isExpanded={pitchExpanded} 
        setIsExpanded={setPitchExpanded}
        industry={selectedIndustry}
      />

      <div className="h-px bg-slate-100 w-full mb-10" />

      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Matching accuracy</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-3xl">
            Choose how strict the AI should be when finding prospects.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AccuracyCard 
                title="Focus mode"
                icon={<User className="w-5 h-5" />}
                description="Highly aligned prospects. Better match accuracy but higher costs."
                isSelected={matchingMode === MatchingMode.FOCUS}
                onClick={() => setMatchingMode(MatchingMode.FOCUS)}
            />
            <AccuracyCard 
                title="Scale mode"
                icon={<Users className="w-5 h-5" />}
                description="Balances volume and relevance. Efficient and shortened cycle."
                isSelected={matchingMode === MatchingMode.SCALE}
                onClick={() => setMatchingMode(MatchingMode.SCALE)}
                isOrange={true}
            />
            <AccuracyCard 
                title="Max scale mode"
                icon={<div className="flex"><User className="w-4 h-4"/><User className="w-4 h-4 -ml-1"/><User className="w-4 h-4 -ml-1"/></div>}
                description="Maximizes reach. Semantically similar but broad."
                isSelected={matchingMode === MatchingMode.MAX_SCALE}
                onClick={() => setMatchingMode(MatchingMode.MAX_SCALE)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <span className="text-red-500 mr-1">*</span>Daily Limit
          </label>
           <p className="text-xs text-slate-400 mb-3">Maximum contacts per day.</p>
          <div className="flex gap-4">
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              placeholder="100"
              className={`w-1/2 p-3 rounded-xl border outline-none focus:ring-4 focus:ring-blue-50 transition-all ${error && !dailyLimit ? 'border-red-300' : 'border-slate-200 focus:border-blue-600'}`}
            />
            <div className="relative w-1/2">
               <select className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-700 appearance-none outline-none focus:border-blue-600 cursor-pointer">
                <option>Per Day</option>
              </select>
              <ChevronUp className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-180 pointer-events-none" />
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
              type="number"
              value={totalLimit}
              onChange={(e) => setTotalLimit(e.target.value)}
              placeholder="1000"
              className={`w-1/2 p-3 rounded-xl border outline-none focus:ring-4 focus:ring-blue-50 transition-all ${error && !totalLimit ? 'border-red-300' : 'border-slate-200 focus:border-blue-600'}`}
            />
            <div className="relative w-1/2">
              <select className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-700 appearance-none outline-none focus:border-blue-600 cursor-pointer">
                <option>In Total</option>
              </select>
               <ChevronUp className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-180 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Exclude Contacts</h3>
             <div className="h-px bg-slate-100 flex-1 ml-4"></div>
        </div>
       
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-white p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800">Manage Blacklist</span>
                <span className="text-slate-400 text-sm">Exclude specific contacts.</span>
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

      <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-slate-50">
        <button 
          onClick={onBack}
          className="px-8 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium min-w-[140px]"
        >
          Previous
        </button>
        <button 
          onClick={handleNext}
          className="px-8 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-medium min-w-[140px] flex items-center justify-center gap-2"
        >
          Next
        </button>
      </div>

    </div>
  );
};
