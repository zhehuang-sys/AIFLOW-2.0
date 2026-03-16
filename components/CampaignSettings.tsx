
import React, { useState } from 'react';
import { Link, Clock, Calendar, MessageSquare, CalendarCheck, ShieldCheck, Bot, Forward, MousePointerClick, Edit3, Sparkles, ChevronDown, Settings, ExternalLink } from 'lucide-react';

interface CampaignSettingsProps {
  onBack: () => void;
  onLaunch: () => void;
  hasMeetingRouters?: boolean;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const PROMPTS = {
    meeting: `You are an AI Sales Development Representative (SDR).
Your task: Read the prospect's incoming email reply and respond with the goal of booking a meeting.
- If the sentiment is positive, suggest 2 specific times based on the calendar availability provided in the context.
- If they ask a question, answer it in 1 sentence and pivot back to the meeting request.
- Keep your response under 50 words.
- Be casual but professional.`,
    link: `You are a helpful AI Assistant.
Your task: Read the prospect's incoming email reply and drive traffic to a specific URL.
- Acknowledge their message.
- Provide the resource link: [INSERT URL HERE].
- Explain the value of clicking in 1 sentence.
- Do NOT ask for a meeting yet.
- Keep your response under 50 words.`,
    qualify: `You are an AI Lead Qualification Agent.
Your task: Read the prospect's incoming email reply and verify if they match our Ideal Customer Profile (ICP).
- If they haven't provided their team size or tech stack, ask for it politely.
- If they are not interested, respect their decision and close the conversation.
- Keep your response under 40 words.`,
    custom: `You are an AI Agent.
Your task: Read the prospect's reply and achieve the following goal:
[INSERT CUSTOM GOAL HERE]
- Keep responses short (under 50 words).
- Focus on moving the conversation forward.`
};

const MEETING_ROUTERS = [
    { name: "Default Router", type: "one on one", duration: "30 mins" },
    { name: "Global Sales Router", type: "round robin", duration: "45 mins" },
    { name: "SDR North America Router", type: "one on one", duration: "15 mins" },
    { name: "Enterprise Demo Router", type: "collective", duration: "60 mins" },
    { name: "Customer Success Router", type: "one on one", duration: "30 mins" }
];

export const CampaignSettings: React.FC<CampaignSettingsProps> = ({ onBack, onLaunch, hasMeetingRouters = true }) => {
  const [activeDays, setActiveDays] = useState([0, 1, 2, 3, 4]); // M-F default
  const [automatedApproval, setAutomatedApproval] = useState(false);
  const [replyAgentEnabled, setReplyAgentEnabled] = useState(false);
  
  const [agentGoal, setAgentGoal] = useState<'meeting' | 'link' | 'qualify' | 'custom'>('meeting');
  const [agentPrompt, setAgentPrompt] = useState(PROMPTS.meeting);
  const [selectedRouter, setSelectedRouter] = useState("Do not use meeting router");
  const [isRouterOpen, setIsRouterOpen] = useState(false);

  const toggleDay = (index: number) => {
    if (activeDays.includes(index)) {
        setActiveDays(activeDays.filter(d => d !== index));
    } else {
        setActiveDays([...activeDays, index].sort());
    }
  };

  const handleGoalChange = (goal: 'meeting' | 'link' | 'qualify' | 'custom') => {
      setAgentGoal(goal);
      setAgentPrompt(PROMPTS[goal]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-fadeIn">
      
      {/* 1. Automated Approval */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
            <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                    Automated Approval
                </label>
                <p className="text-xs text-slate-500">
                    If enabled, AI generated emails will be sent automatically without manual review.
                </p>
            </div>
            <div 
                onClick={() => setAutomatedApproval(!automatedApproval)}
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out flex-shrink-0 ${automatedApproval ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${automatedApproval ? 'translate-x-7' : 'translate-x-0'}`} />
            </div>
        </div>
      </div>

      {/* 2. AI Reply Agent */}
      <div className="mb-10 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
            <div>
                <label className="block text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    AI Reply Agent
                </label>
                <p className="text-xs text-slate-500">
                    Autonomous agent to scan replies, handle objections, and book meetings.
                </p>
            </div>
            <div 
                onClick={() => setReplyAgentEnabled(!replyAgentEnabled)}
                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out flex-shrink-0 ${replyAgentEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${replyAgentEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
            </div>
        </div>

        {replyAgentEnabled && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 space-y-6 animate-slideDown">
                
                {/* Goal Selection */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Agent Goal Strategy</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <GoalCard 
                            icon={<Calendar className="w-5 h-5" />} 
                            label="Book Meeting" 
                            active={agentGoal === 'meeting'} 
                            onClick={() => handleGoalChange('meeting')}
                        />
                        <GoalCard 
                            icon={<MousePointerClick className="w-5 h-5" />} 
                            label="Drive Traffic" 
                            active={agentGoal === 'link'} 
                            onClick={() => handleGoalChange('link')}
                        />
                        <GoalCard 
                            icon={<MessageSquare className="w-5 h-5" />} 
                            label="Qualify Lead" 
                            active={agentGoal === 'qualify'} 
                            onClick={() => handleGoalChange('qualify')}
                        />
                         <GoalCard 
                            icon={<Sparkles className="w-5 h-5" />} 
                            label="Custom Goal" 
                            active={agentGoal === 'custom'} 
                            onClick={() => handleGoalChange('custom')}
                        />
                    </div>
                </div>

                {/* Prompt Editor */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Agent System Instruction
                        </label>
                        <span className="text-xs text-indigo-600 font-medium bg-indigo-100 px-2 py-0.5 rounded">
                            {agentGoal === 'custom' ? 'Custom Mode' : 'Preset Mode (Editable)'}
                        </span>
                    </div>
                    <div className="relative">
                        <textarea 
                            value={agentPrompt}
                            onChange={(e) => setAgentPrompt(e.target.value)}
                            className="w-full h-40 p-4 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm text-slate-700 font-mono leading-relaxed resize-none shadow-sm"
                            placeholder="Define the AI agent's behavior here..."
                        />
                    </div>
                </div>

                {/* Meeting Router Selector (Conditional) */}
                {agentGoal === 'meeting' && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-700">Select Meeting Router</label>
                            <a 
                                href="https://info.flashlabs.ai/engage/meetings/meetingRouter" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                                title="Manage Meeting Routers"
                            >
                                <Settings className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="relative">
                            {hasMeetingRouters ? (
                                <>
                                    <button 
                                        type="button"
                                        onClick={() => setIsRouterOpen(!isRouterOpen)}
                                        className="w-full p-3.5 pl-12 pr-10 bg-white border border-indigo-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 text-slate-700 font-medium shadow-sm flex items-center justify-between text-left"
                                    >
                                        <span className={selectedRouter === "Do not use meeting router" ? "text-slate-400" : ""}>{selectedRouter}</span>
                                    </button>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
                                        <CalendarCheck className="w-5 h-5" />
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown className={`w-4 h-4 transition-transform ${isRouterOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isRouterOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-indigo-100 rounded-xl shadow-xl overflow-hidden animate-slideDown">
                                            {[ { name: "Do not use meeting router", type: "none", duration: "" }, ...MEETING_ROUTERS ].map((router) => (
                                                <div 
                                                    key={router.name}
                                                    onClick={() => {
                                                        setSelectedRouter(router.name);
                                                        setIsRouterOpen(false);
                                                    }}
                                                    className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex items-center justify-between group transition-colors"
                                                >
                                                    <span className={`text-sm font-medium group-hover:text-indigo-700 ${router.name === "Do not use meeting router" ? "text-slate-400" : "text-slate-700"}`}>{router.name}</span>
                                                    {router.type !== "none" && (
                                                        <span className="text-[11px] text-slate-400 group-hover:text-indigo-400 font-medium">
                                                            {router.type}, {router.duration}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <a 
                                    href="https://info.flashlabs.ai/engage/meetings/create"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full p-3.5 pl-12 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 font-medium shadow-sm flex items-center justify-between text-left cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all group"
                                >
                                    <span className="group-hover:text-indigo-600 transition-colors">Create a meeting scheduler</span>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-400 transition-colors">
                                        <CalendarCheck className="w-5 h-5" />
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-400 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </a>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 ml-1 leading-relaxed">
                            The agent will use this router to check availability and generate dynamic booking links in responses.
                        </p>
                    </div>
                )}
                
                {/* Capabilities List */}
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Capabilities</label>
                    <div className="space-y-2 bg-white rounded-lg border border-indigo-100 p-4">
                        <CapabilityRow icon={<ShieldCheck className="w-4 h-4 text-green-500" />} text="Detects and handles objections (Pricing, Competitors, Timing)" />
                        <CapabilityRow icon={<Forward className="w-4 h-4 text-blue-500" />} text="Forwards complex or negative replies to your inbox" />
                        <CapabilityRow icon={<Bot className="w-4 h-4 text-indigo-500" />} text="Uses campaign context to personalize responses" />
                    </div>
                </div>

            </div>
        )}
      </div>

      {/* 3. Schedule */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          <span className="text-red-500 mr-1">*</span>Schedule
        </label>
        <p className="text-xs text-slate-400 mb-3">Days and times when emails will be sent to respect prospect timezones.</p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                     <span className="text-xs font-semibold text-slate-900 mr-2">Available on</span>
                     <span className="text-xs text-slate-400">(Your Timezone: UTC+08)</span>
                     
                     <div className="flex gap-2 mt-3">
                        {DAYS.map((day, idx) => {
                            const isActive = activeDays.includes(idx);
                            return (
                                <button 
                                    key={idx}
                                    onClick={() => toggleDay(idx)}
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                        ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-white opacity-50 hover:opacity-100 hover:bg-blue-200'}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                     </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-sm text-slate-600 px-2">From</span>
                    <div className="flex items-center gap-2 border border-slate-200 rounded px-3 py-1.5 text-slate-600 text-sm">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        10:00
                        <ChevronDownIcon />
                    </div>
                    <span className="text-sm text-slate-600 px-2">To</span>
                    <div className="flex items-center gap-2 border border-slate-200 rounded px-3 py-1.5 text-slate-600 text-sm">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        17:00
                        <ChevronDownIcon />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 4. Select Mailbox */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          <span className="text-red-500 mr-1">*</span>Select Mailbox
        </label>
        <p className="text-xs text-slate-400 mb-3">The email address your campaigns will be sent from. We recommend using a dedicated subdomain.</p>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all font-medium text-sm">
            <Link className="w-4 h-4" />
            Add Sending Mailbox
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-slate-200">
        <button onClick={onBack} className="px-8 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium min-w-[140px]">
          Previous
        </button>
        <button onClick={onLaunch} className="px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all font-medium min-w-[160px]">
          Launch AIFlow
        </button>
      </div>

    </div>
  );
};

// Helper Components
const GoalCard = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${active ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600 text-indigo-700' : 'bg-white border-indigo-100 text-slate-600 hover:border-indigo-300'}`}
    >
        <div className={`mb-2 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{icon}</div>
        <span className="text-xs font-bold text-center">{label}</span>
    </div>
);

const CapabilityRow = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <span className="text-sm text-slate-600">{text}</span>
    </div>
);

const ChevronDownIcon = () => (
    <ChevronDown className="w-3 h-3 text-slate-300" />
);
