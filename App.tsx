
import React, { useState } from 'react';
import { Stepper } from './components/Stepper';
import { SelectionCard } from './components/SelectionCard';
import { IcpAnalyzer } from './components/IcpAnalyzer';
import { SocialAnalyzer } from './components/SocialAnalyzer';
import { CsvImporter } from './components/CsvImporter';
import { CrmImporter } from './components/CrmImporter';
import { ListSelector } from './components/ListSelector';
import { InboundConfig } from './components/InboundConfig';
import { ResearchTable } from './components/ResearchTable';
import { FlowBuilder } from './components/FlowBuilder';
import { CampaignSettings } from './components/CampaignSettings';
import { TargetingSource, StepStatus, AVAILABLE_LANGUAGES } from './types';
// Fixed: Added 'Settings' to the lucide-react imports
import { BrainCircuit, FileSpreadsheet, Users2, MessageCircleHeart, ArrowLeft, UploadCloud, Eye, Webhook, Target, Magnet, Sparkles, Database, TrendingUp, Briefcase, Code2, Globe, ShieldCheck, Settings, CalendarCheck, Linkedin } from 'lucide-react';

const PLAYBOOKS = [
  { title: "Reach out to content downloaders", desc: "Use Inbound Form/Webhook to trigger outreach instantly.", icon: Webhook, color: "text-purple-600", bg: "bg-purple-50", source: TargetingSource.INBOUND_FORM },
  { title: "Monetize LinkedIn network", desc: "Use Social Signal Scout to target profile viewers & post engagers.", icon: MessageCircleHeart, color: "text-blue-600", bg: "bg-blue-50", source: TargetingSource.SOCIAL },
  { title: "Turn free trial to paid", desc: "Sync 'Active Users' lists via CRM Import to drive conversions.", icon: Database, color: "text-blue-500", bg: "bg-blue-50", source: TargetingSource.CRM },
  { title: "Target hiring intent", desc: "Enable 'Hiring Trends' signal in ICP Scout to find growing teams.", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50", source: TargetingSource.ICP },
  { title: "Turn demos into pipeline", desc: "Import 'Completed Demos' reports from CRM for follow-up.", icon: Database, color: "text-blue-500", bg: "bg-blue-50", source: TargetingSource.CRM },
  { title: "Event lead nurturing", desc: "Follow up with conference attendees via CSV or FlashRev List.", icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50", source: TargetingSource.CSV },
  { title: "Fill events with leads", desc: "Use ICP Scout with 'Drive Traffic' goal in Settings.", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50", source: TargetingSource.ICP },
  { title: "Competitor tech users", desc: "Enable 'Tech Stack' signal in ICP Scout to find users of specific tools.", icon: Code2, color: "text-indigo-600", bg: "bg-indigo-50", source: TargetingSource.ICP },
  { title: "Lookalike prospecting", desc: "Use 'Max Scale' mode in ICP Scout to find companies similar to clients.", icon: Users2, color: "text-indigo-600", bg: "bg-indigo-50", source: TargetingSource.ICP },
  { title: "Reactivate closed-lost", desc: "Import 'Closed-Lost' reports from CRM to re-engage old deals.", icon: Database, color: "text-blue-500", bg: "bg-blue-50", source: TargetingSource.CRM },
  { title: "Competitor brand mentions", desc: "Use Social Signal Scout to find people discussing competitors.", icon: Globe, color: "text-blue-600", bg: "bg-blue-50", source: TargetingSource.SOCIAL },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<TargetingSource | null>(null);
  const [isCrmConnected, setIsCrmConnected] = useState(false);
  const [hasMeetingRouters, setHasMeetingRouters] = useState(true);
  const [isLinkedinConnected, setIsLinkedinConnected] = useState(false);
  const [emailContentLanguage, setEmailContentLanguage] = useState('');
  const [fallbackLanguage, setFallbackLanguage] = useState('');
  
  // Conditionally enable Research step only for SuperAgent ICP Scout
  const isResearchEnabled = selectedSource === TargetingSource.ICP;

  // Dynamically generate steps based on selected source
  const rawSteps = [
    { label: 'Strategy' },
    ...(isResearchEnabled ? [{ label: 'Research' }] : []),
    { label: 'AIFlow' },
    { label: 'Settings' },
  ];

  const steps = rawSteps.map((step, index) => {
    const id = index + 1;
    let status = StepStatus.UPCOMING;
    if (currentStep === id) status = StepStatus.CURRENT;
    if (currentStep > id) status = StepStatus.COMPLETED;
    
    return { id, label: step.label, status };
  });

  const handleSelectSource = (source: TargetingSource) => {
    if (source === TargetingSource.CRM && !isCrmConnected) {
      alert("Please connect your CRM in the Dev Control panel first (Bottom Left).");
      return;
    }
    setSelectedSource(source);
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (currentStep === 1 && selectedSource) {
      setSelectedSource(null);
    }
  };

  const renderStepContent = () => {
    // Step 1: Strategy Selection & Configuration
    if (currentStep === 1) {
        if (!selectedSource) {
          return (
             <div className="animate-fadeIn pb-20 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-10 pt-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                      Create New AIFlow
                    </h1>
                    <p className="text-lg text-slate-600 font-medium">
                        Select a data source to launch your autonomous outreach campaign.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN - OUTBOUND STRATEGIES */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        
                        {/* PRIORITY SECTION: OWN DATA */}
                        <div className="bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden transition-shadow hover:shadow-lg">
                             <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                 <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-600">
                                        <Database className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <h2 className="text-lg font-bold text-slate-900">Target Your Own Data</h2>
                                        <p className="text-sm text-slate-500 font-medium">Activate existing contacts from your system.</p>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200 shadow-sm whitespace-nowrap">
                                     <TrendingUp className="w-3.5 h-3.5" />
                                     Highest Success Rate
                                 </div>
                             </div>

                             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SelectionCard
                                    title="Import from CRM"
                                    description="Sync live lists from Salesforce, HubSpot, or Pipedrive."
                                    icon={<Database className="w-6 h-6" />}
                                    isSelected={false}
                                    onClick={() => handleSelectSource(TargetingSource.CRM)}
                                    hoverContent={!isCrmConnected ? (
                                      <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                          <Database className="w-6 h-6" />
                                        </div>
                                        <span className="text-lg font-bold text-blue-600">Connect your CRM</span>
                                      </div>
                                    ) : undefined}
                                />
                                <SelectionCard
                                    title="Upload CSV"
                                    description="Upload a structured list to enrich and engage."
                                    icon={<FileSpreadsheet className="w-6 h-6" />}
                                    isSelected={false}
                                    onClick={() => handleSelectSource(TargetingSource.CSV)}
                                />
                                <SelectionCard
                                    title="FlashRev List"
                                    description="Use a saved segment from your FlashRev account."
                                    icon={<Users2 className="w-6 h-6" />}
                                    isSelected={false}
                                    onClick={() => handleSelectSource(TargetingSource.LIST)}
                                />
                             </div>
                        </div>

                        {/* SECONDARY SECTION: AI PROSPECTING */}
                        <div className="px-2">
                             <div className="flex items-center gap-3 mb-5 px-2">
                                 <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                                    <Target className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <h2 className="text-lg font-bold text-slate-900">Find New Prospects</h2>
                                    <p className="text-sm text-slate-500 font-medium">Use AI to scout net-new leads matching your ICP.</p>
                                 </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectionCard
                                    title="SuperAgent ICP Scout"
                                    description="Deep analysis. Our LLM scrapes websites & signals to find high-fit accounts."
                                    icon={<BrainCircuit className="w-7 h-7" />}
                                    isSelected={false}
                                    onClick={() => handleSelectSource(TargetingSource.ICP)}
                                    badge="Deep Match"
                                />
                                <SelectionCard
                                    title="SuperAgent Social Signal Scout"
                                    description="Target LinkedIn post engagers (likes/comments) or capture your own profile viewers."
                                    icon={<MessageCircleHeart className="w-7 h-7" />}
                                    isSelected={false}
                                    onClick={() => handleSelectSource(TargetingSource.SOCIAL)}
                                    badge="High Intent"
                                />
                             </div>
                        </div>
                    </div>

                    {/* DIVIDER (Mobile only) */}
                    <div className="lg:hidden h-px bg-slate-200 w-full my-2"></div>

                    {/* RIGHT COLUMN - INBOUND */}
                    <div className="lg:col-span-4 flex flex-col gap-6 pl-0 lg:pl-4 lg:border-l lg:border-slate-200 min-h-full">
                        <div className="flex items-center gap-3 px-1 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-600">
                                <Magnet className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Inbound Harvesting</h2>
                                <p className="text-sm text-slate-500 font-medium">Capture & engage warm leads.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                             <SelectionCard
                                title="Inbound Form / Webhook"
                                description="Connect your Typeform or HubSpot forms. Enroll leads instantly."
                                icon={<Webhook className="w-7 h-7" />}
                                isSelected={false}
                                onClick={() => handleSelectSource(TargetingSource.INBOUND_FORM)}
                                badge="Speed to Lead"
                            />
                            
                            {/* Disabled Website Visitors */}
                            <div className="opacity-60 pointer-events-none grayscale relative">
                                <SelectionCard
                                    title="Website Visitors"
                                    description="Deanonymize companies visiting your high-intent pages."
                                    icon={<Eye className="w-7 h-7" />}
                                    isSelected={false}
                                    onClick={() => {}}
                                />
                                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-200 shadow-sm z-10">
                                    Coming Soon
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* PLAYBOOKS SECTION - UPDATED TO MARQUEE */}
                <div className="mt-20 border-t border-slate-200 pt-10 pb-10 overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Supported Use Cases & Playbooks</h3>
                    <p className="text-slate-500 mb-8 max-w-2xl">
                        AIFlow supports a wide range of outbound and inbound strategies. Click to launch a playbook.
                    </p>
                    
                    <div className="relative w-full">
                        {/* Gradient Masks */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>

                        {/* Scrolling Container */}
                        <div className="flex animate-scroll w-max gap-6 hover:pause-animation">
                            {/* Render list twice for seamless loop */}
                            {[...PLAYBOOKS, ...PLAYBOOKS].map((pb, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleSelectSource(pb.source)}
                                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer min-w-[320px] max-w-[320px] group"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${pb.bg} ${pb.color}`}>
                                        <pb.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-700 transition-colors">{pb.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{pb.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          );
        }
        
        // Detailed Configuration based on source
        switch (selectedSource) {
            case TargetingSource.ICP:
                return <IcpAnalyzer 
                    onConfirm={nextStep} 
                    onBack={() => setSelectedSource(null)} 
                    emailContentLanguage={emailContentLanguage}
                    setEmailContentLanguage={setEmailContentLanguage}
                    fallbackLanguage={fallbackLanguage}
                    setFallbackLanguage={setFallbackLanguage}
                />;
            case TargetingSource.SOCIAL:
                return <SocialAnalyzer 
                    onConfirm={nextStep} 
                    onBack={() => setSelectedSource(null)} 
                    emailContentLanguage={emailContentLanguage}
                    setEmailContentLanguage={setEmailContentLanguage}
                    fallbackLanguage={fallbackLanguage}
                    setFallbackLanguage={setFallbackLanguage}
                    isLinkedinConnected={isLinkedinConnected}
                />;
            case TargetingSource.CSV:
                return <CsvImporter 
                    onConfirm={nextStep} 
                    onBack={() => setSelectedSource(null)} 
                    emailContentLanguage={emailContentLanguage}
                    setEmailContentLanguage={setEmailContentLanguage}
                    fallbackLanguage={fallbackLanguage}
                    setFallbackLanguage={setFallbackLanguage}
                />;
            case TargetingSource.CRM:
                return <CrmImporter 
                    onConfirm={nextStep} 
                    onBack={() => setSelectedSource(null)} 
                    emailContentLanguage={emailContentLanguage}
                    setEmailContentLanguage={setEmailContentLanguage}
                    fallbackLanguage={fallbackLanguage}
                    setFallbackLanguage={setFallbackLanguage}
                />;
            case TargetingSource.LIST:
                return <ListSelector 
                    onConfirm={nextStep} 
                    onBack={() => setSelectedSource(null)} 
                    emailContentLanguage={emailContentLanguage}
                    setEmailContentLanguage={setEmailContentLanguage}
                    fallbackLanguage={fallbackLanguage}
                    setFallbackLanguage={setFallbackLanguage}
                />;
            case TargetingSource.INBOUND_FORM:
            case TargetingSource.WEBSITE_VISITORS:
                return <InboundConfig 
                    onConfirm={nextStep} 
                    onBack={() => setSelectedSource(null)} 
                    emailContentLanguage={emailContentLanguage}
                    setEmailContentLanguage={setEmailContentLanguage}
                    fallbackLanguage={fallbackLanguage}
                    setFallbackLanguage={setFallbackLanguage}
                />;
            default:
                return null;
        }
    }

    // Determine Logic based on dynamic step index
    // Note: We use the labels to determine which component to render because ID shifts
    const currentStepLabel = steps.find(s => s.id === currentStep)?.label;

    if (currentStepLabel === 'Research') {
        return <ResearchTable onNext={nextStep} onBack={prevStep} />;
    }

    if (currentStepLabel === 'AIFlow') {
        return <FlowBuilder 
            onNext={nextStep} 
            onBack={prevStep} 
            emailContentLanguage={emailContentLanguage}
            fallbackLanguage={fallbackLanguage}
        />;
    }

    if (currentStepLabel === 'Settings') {
        return <CampaignSettings 
            onBack={prevStep} 
            onLaunch={() => alert("AIFlow Launched!")} 
            hasMeetingRouters={hasMeetingRouters}
        />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Header / Stepper */}
      <Stepper 
        steps={steps} 
        currentStep={currentStep} 
        onBack={(currentStep > 1 || selectedSource !== null) ? prevStep : undefined}
        showTitleInfo={true}
      />

      {/* Global Dev Control Panel (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-64 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dev Control</span>
          </div>

          {/* CRM Connection Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${isCrmConnected ? 'text-green-500' : 'text-slate-300'}`} />
                  <span className="text-sm font-medium text-slate-700">CRM Bound</span>
              </div>
              <div 
                  onClick={() => setIsCrmConnected(!isCrmConnected)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${isCrmConnected ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${isCrmConnected ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
          </div>

          {/* Meeting Router Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                  <CalendarCheck className={`w-4 h-4 ${hasMeetingRouters ? 'text-indigo-500' : 'text-slate-300'}`} />
                  <span className="text-sm font-medium text-slate-700">Has Routers</span>
              </div>
              <div 
                  onClick={() => setHasMeetingRouters(!hasMeetingRouters)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${hasMeetingRouters ? 'bg-indigo-500' : 'bg-slate-300'}`}
              >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${hasMeetingRouters ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
          </div>

          {/* LinkedIn Account Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                  <Linkedin className={`w-4 h-4 ${isLinkedinConnected ? 'text-[#0077b5]' : 'text-slate-300'}`} />
                  <span className="text-sm font-medium text-slate-700">Linkedin ACCOUNT</span>
              </div>
              <div 
                  onClick={() => setIsLinkedinConnected(!isLinkedinConnected)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${isLinkedinConnected ? 'bg-[#0077b5]' : 'bg-slate-300'}`}
              >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${isLinkedinConnected ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Step Title Header removed from here - moved into Stepper component */}

        <div className="transition-all duration-300 ease-in-out">
            {renderStepContent()}
        </div>
      </main>
    </div>
  );
}
