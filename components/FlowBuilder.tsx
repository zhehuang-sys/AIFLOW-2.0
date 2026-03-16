import React, { useState } from 'react';
import { 
  Clock, ChevronDown, Mail, Edit3, RefreshCw, MoreVertical, Plus, 
  Bot, MessageSquare, Linkedin, Smartphone, AlertCircle, Trash2
} from 'lucide-react';

interface FlowBuilderProps {
  onNext: () => void;
  onBack: () => void;
  emailContentLanguage: string;
  fallbackLanguage: string;
}

type StepType = 'email' | 'linkedin' | 'sms' | 'wait';

interface Step {
  id: string;
  type: StepType;
  title?: string;
  content?: string;
  config?: any;
}

export const FlowBuilder: React.FC<FlowBuilderProps> = ({ 
  onNext, 
  onBack,
  emailContentLanguage,
  fallbackLanguage
}) => {
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', type: 'wait', config: { value: 1, unit: 'Hours' } },
    { id: '2', type: 'email', title: 'Email', content: 'Event follow-up' },
  ]);
  
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const addStep = (type: StepType) => {
    const newStep: Step = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: type === 'linkedin' ? 'LinkedIn Message' : type === 'sms' ? 'SMS Message' : 'Email',
      config: type === 'wait' ? { value: 1, unit: 'Days' } : {}
    };
    // Insert before the last item or just append? Appending is fine.
    setSteps([...steps, newStep]);
    setShowAddMenu(false);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleConnectLinkedIn = () => {
    setIsConnecting(true);
    setTimeout(() => {
        setLinkedinConnected(true);
        setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-fadeIn">
      
      {/* Steps Loop */}
      <div className="flex flex-col items-center">
         
         {steps.map((step, index) => (
            <React.Fragment key={step.id}>
                {/* Connector Line (except for first item if it's top) */}
                {index > 0 && <div className="h-8 w-px bg-slate-200 border-l border-dashed"></div>}

                {/* Render Step based on Type */}
                
                {/* WAIT STEP */}
                {step.type === 'wait' && (
                    <div className="bg-white border border-slate-200 rounded-lg px-6 py-3 flex items-center gap-4 shadow-sm z-10 relative group">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                            <Clock className="w-4 h-4" />
                            Wait for
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                            <span className="text-sm font-medium">{step.config.value}</span>
                            <div className="w-px h-4 bg-slate-200"></div>
                            <div className="flex items-center gap-1 cursor-pointer">
                                <span className="text-sm">{step.config.unit}</span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </div>
                        </div>
                        <span className="text-slate-600 text-sm font-medium">Then</span>
                        
                        {/* Remove Action */}
                        <button 
                            onClick={() => removeStep(step.id)}
                            className="absolute -right-10 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* EMAIL STEP */}
                {step.type === 'email' && (
                    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative z-10 group">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-slate-800">Email</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-sm text-slate-500 mb-2 font-medium">Subject: <span className="text-slate-800">Event follow-up</span></div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed">
                                Amy, scaling global events at Databricks is impressive...
                            </div>
                        </div>
                        <button 
                            onClick={() => removeStep(step.id)}
                            className="absolute top-4 right-12 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* LINKEDIN STEP */}
                {step.type === 'linkedin' && (
                    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative z-10 group border-l-4 border-l-[#0077b5]">
                         {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#0077b5]/10 flex items-center justify-center border border-[#0077b5]/20">
                                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                </div>
                                <h3 className="font-semibold text-slate-800">LinkedIn</h3>
                            </div>
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Connection Request</span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </div>
                        </div>
                        <div className="p-6">
                            {!linkedinConnected ? (
                                <div className="flex flex-col items-center justify-center p-6 bg-amber-50 border border-amber-100 rounded-xl text-center">
                                    <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                                    <h4 className="font-bold text-amber-900 mb-1">Account Not Connected</h4>
                                    <p className="text-xs text-amber-700 mb-4 max-w-xs">Connect your LinkedIn account to automate connection requests and messages.</p>
                                    <button 
                                        onClick={handleConnectLinkedIn}
                                        disabled={isConnecting}
                                        className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                                    >
                                        {isConnecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Linkedin className="w-3 h-3" />}
                                        Connect LinkedIn
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-slate-500 font-medium">Account Connected: <strong>Amy Mackreth</strong></span>
                                    </div>
                                    <textarea 
                                        className="w-full h-24 p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none"
                                        placeholder="Hi {{firstName}}, I saw your post about..."
                                        defaultValue="Hi {{firstName}}, I'd love to connect and share some insights on AI automation."
                                    />
                                </div>
                            )}
                        </div>
                         <button 
                            onClick={() => removeStep(step.id)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* SMS STEP */}
                {step.type === 'sms' && (
                     <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative z-10 group border-l-4 border-l-green-500">
                         {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                                    <Smartphone className="w-4 h-4 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-slate-800">SMS</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <textarea 
                                className="w-full h-20 p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-green-100 focus:border-green-400 outline-none resize-none font-mono text-slate-600"
                                placeholder="Write your SMS message..."
                                defaultValue="Hey {{firstName}}, just sent you an email regarding the event. Let me know what you think!"
                            />
                            <div className="mt-2 text-xs text-slate-400 text-right">
                                84 / 160 characters
                            </div>
                        </div>
                         <button 
                            onClick={() => removeStep(step.id)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

            </React.Fragment>
         ))}

       </div>

       {/* Flow Connector */}
       <div className="flex flex-col items-center mt-0">
          <div className="h-8 w-px bg-slate-200 border-l border-dashed"></div>
       </div>

       {/* Add Button */}
       <div className="flex flex-col items-center relative z-20 mb-8">
           <div className="relative">
                <button 
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border
                        ${showAddMenu ? 'bg-slate-800 text-white border-slate-800 rotate-45' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-500'}
                    `}
                >
                    <Plus className="w-5 h-5" />
                </button>
                
                {/* Add Menu */}
                {showAddMenu && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-48 animate-fadeIn flex flex-col gap-1">
                        <button onClick={() => addStep('email')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 font-medium text-left">
                            <Mail className="w-4 h-4 text-blue-500" /> Email
                        </button>
                        <button onClick={() => addStep('linkedin')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 font-medium text-left">
                            <Linkedin className="w-4 h-4 text-[#0077b5]" /> LinkedIn
                        </button>
                        <button onClick={() => addStep('sms')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 font-medium text-left">
                            <Smartphone className="w-4 h-4 text-green-500" /> SMS
                        </button>
                         <div className="h-px bg-slate-100 my-1"></div>
                        <button onClick={() => addStep('wait')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 font-medium text-left">
                            <Clock className="w-4 h-4 text-slate-400" /> Wait
                        </button>
                    </div>
                )}
           </div>
       </div>

       {/* AI Reply Agent Visual */}
       <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 w-full max-w-sm mx-auto flex items-center gap-4 relative shadow-sm mb-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-100 rounded-full">On Reply</div>
            <div className="w-10 h-10 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                <Bot className="w-5 h-5" />
            </div>
            <div>
                <div className="text-sm font-bold text-slate-700">AI Reply Agent</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Handles objections & books meetings
                </div>
            </div>
            <div className="ml-auto">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
       </div>

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