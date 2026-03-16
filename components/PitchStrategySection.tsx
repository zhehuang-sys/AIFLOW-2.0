
import React from 'react';
import { Sparkles, ChevronDown, Link as LinkIcon, Loader2 } from 'lucide-react';
import { DynamicListSection, Tooltip } from './CampaignFormUI';

export type IndustryType = 'b2b' | 'recruiting' | 'vc' | 'real_estate' | 'pr' | 'influencer';

export interface PitchData {
  valueProp: string;
  benchmarkBrands: string[];
  painPoints: string[];
  solutions: string[];
  proofPoints: string[];
  ctas: string[];
  leadMagnets: string[];
}

interface PitchStrategySectionProps {
  data: PitchData;
  setData: React.Dispatch<React.SetStateAction<PitchData>>;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  industry?: IndustryType;
  // Context props for integrated URL handling
  websiteUrl?: string;
  setWebsiteUrl?: (url: string) => void;
  onGeneratePitch?: () => void;
  isAnalyzing?: boolean;
}

// Configuration for dynamic labels based on industry
const LABELS: Record<IndustryType, Record<string, { label: string; tooltip: string; placeholder?: string; desc: string }>> = {
  b2b: {
    valueProp: { label: "Value Proposition", tooltip: "The core benefit your product offers.", desc: "The core benefit your product offers to this specific audience." },
    benchmarkBrands: { label: "Benchmark Brands", tooltip: "Competitors or tools they use.", desc: "Competitors or brands your prospects likely admire or use." },
    painPoints: { label: "Pain Points", tooltip: "Problems keeping them up at night.", desc: "Specific problems or challenges your prospects face." },
    solutions: { label: "Solutions / Features", tooltip: "How you solve the pain points.", desc: "How your product or service solves the identified pain points." },
    proofPoints: { label: "Proof Points", tooltip: "Stats, case studies, or ROI.", desc: "Evidence like case studies, statistics, or testimonials." },
    ctas: { label: "Call to Actions (CTAs)", tooltip: "Low friction requests.", desc: "What you want the prospect to do (e.g., 'Book a demo')." },
    leadMagnets: { label: "Lead Magnets", tooltip: "Free value to offer.", desc: "Valuable free resources you offer (e.g., 'Whitepaper')." }
  },
  recruiting: {
    valueProp: { label: "Employer Value Prop (EVP)", tooltip: "Why join this team? Mission/Culture.", desc: "The core reason a candidate should join your company." },
    benchmarkBrands: { label: "Target Companies", tooltip: "Companies to poach talent from.", desc: "Companies with similar tech stacks or culture." },
    painPoints: { label: "Career Frustrations", tooltip: "Lack of growth, bad culture, low pay.", desc: "Why they might be looking to leave their current role." },
    solutions: { label: "Role Benefits / Perks", tooltip: "Remote work, equity, autonomy.", desc: "Key benefits that address their career frustrations." },
    proofPoints: { label: "Company Growth / Prestige", tooltip: "Funding, awards, glassdoor score.", desc: "Evidence that this is a safe and exciting career move." },
    ctas: { label: "Next Steps", tooltip: "'Open to a coffee?', 'See JD'.", desc: "Low friction interest check." },
    leadMagnets: { label: "Talent Assets", tooltip: "Engineering blog, Culture video.", desc: "Content shared to build employer brand." }
  },
  vc: {
    valueProp: { label: "Investment Thesis Match", tooltip: "Why this startup fits the portfolio.", desc: "Why we are interested in backing them now." },
    benchmarkBrands: { label: "Portfolio Portcos", tooltip: "Similar companies we invested in.", desc: "Reference points to show we understand their market." },
    painPoints: { label: "Founder Challenges", tooltip: "Fundraising, hiring, scaling.", desc: "Challenges the founder faces that capital/network solves." },
    solutions: { label: "Value Add", tooltip: "Our network, operational support.", desc: "How we help beyond just writing a check." },
    proofPoints: { label: "Track Record", tooltip: "Successful exits, top tier co-investors.", desc: "Why the founder should choose us on the cap table." },
    ctas: { label: "Meeting Ask", tooltip: "'15 min intro', 'Coffee at conference'.", desc: "Request for an intro call." },
    leadMagnets: { label: "Founder Resources", tooltip: "Market map, salary report.", desc: "Helpful data for founders." }
  },
  real_estate: {
    valueProp: { label: "Property / Service Hook", tooltip: "Exclusive listing or tenant rep service.", desc: "The unique opportunity or service you are pitching." },
    benchmarkBrands: { label: "Current Tenants / Neighbors", tooltip: "Who else is in the building/area.", desc: "Anchor tenants or comparable businesses nearby." },
    painPoints: { label: "Space/Lease Issues", tooltip: "Outgrowing space, high rent, RTO.", desc: "Issues with their current real estate situation." },
    solutions: { label: "Property Features", tooltip: "Turnkey, amenities, location.", desc: "Features of the property or service that solve their needs." },
    proofPoints: { label: "Recent Deals", tooltip: "Comparable leases signed.", desc: "Evidence of market activity and your expertise." },
    ctas: { label: "Tour Request", tooltip: "'Tour the space', 'Lease audit'.", desc: "Action to move the deal forward." },
    leadMagnets: { label: "Market Reports", tooltip: "Q3 Office Report, Sublease list.", desc: "Data relevant to CRE decisions." }
  },
  pr: {
    valueProp: { label: "Story Angle / Hook", tooltip: "The headline pitch.", desc: "The exclusive story or angle you are pitching to the journalist." },
    benchmarkBrands: { label: "Relevant Coverage", tooltip: "Articles they wrote recently.", desc: "referencing their past work to show relevance." },
    painPoints: { label: "Journalist Needs", tooltip: "Need for data, experts, exclusives.", desc: "Gaps in their current reporting beat." },
    solutions: { label: "Assets Provided", tooltip: "Data, CEO interview, B-roll.", desc: "What you provide to make their job easier." },
    proofPoints: { label: "Credibility", tooltip: "CEO credentials, previous press.", desc: "Why this source is trustworthy." },
    ctas: { label: "Media Ask", tooltip: "'Embargo review', 'Interview time'.", desc: "What you want the journalist to do." },
    leadMagnets: { label: "Exclusives", tooltip: "Embargoed release, Data set.", desc: "High value assets to secure the story." }
  },
  influencer: {
    valueProp: { label: "Collab / Sponsorship Offer", tooltip: "Paid partnership, free product.", desc: "The offer for the creator." },
    benchmarkBrands: { label: "Similar Creators", tooltip: "Who else you work with.", desc: "Social proof of other influencers in the campaign." },
    painPoints: { label: "Creator Goals", tooltip: "Monetization, Audience growth.", desc: "What the creator cares about (money, content)." },
    solutions: { label: "Campaign Perks", tooltip: "Creative freedom, long term deal.", desc: "Why this partnership is good for their brand." },
    proofPoints: { label: "Campaign Success", tooltip: "Avg payouts, viral hits.", desc: "Success stories from other creators." },
    ctas: { label: "Collab Invite", tooltip: "'Join campaign', 'Receive product'.", desc: "Call to action." },
    leadMagnets: { label: "Seeding Kit", tooltip: "Free product, exclusive access.", desc: "Incentive to reply." }
  }
};

export const PitchStrategySection: React.FC<PitchStrategySectionProps> = ({ 
  data, 
  setData, 
  isExpanded, 
  setIsExpanded,
  industry = 'b2b',
  websiteUrl,
  setWebsiteUrl,
  onGeneratePitch,
  isAnalyzing
}) => {

  const config = LABELS[industry];

  const handleValueChange = (field: keyof PitchData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleListChange = (field: keyof PitchData, index: number, value: string) => {
    if (Array.isArray(data[field])) {
        const newList = [...(data[field] as string[])];
        newList[index] = value;
        handleValueChange(field, newList);
    }
  };

  const addListField = (field: keyof PitchData) => {
     if (Array.isArray(data[field])) {
        handleValueChange(field, [...(data[field] as string[]), '']);
    }
  };

  const removeListField = (field: keyof PitchData, index: number) => {
    if (Array.isArray(data[field])) {
        const currentList = data[field] as string[];
        if (currentList.length > 1) {
            const newList = currentList.filter((_, i) => i !== index);
            handleValueChange(field, newList);
        } else {
            const newList = [...currentList];
            newList[index] = '';
            handleValueChange(field, newList);
        }
    }
  };

  return (
    <div className="mb-10 animate-fadeIn">
        <div 
            className="flex items-center justify-between mb-6 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Pitch Strategy
             </h3>
             <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>

        {isExpanded && (
            <div className="space-y-8">
                {/* Website URL Input (if props provided) - Placed under Pitch Strategy Title */}
                {setWebsiteUrl && (
                  <div className="mb-10 p-5 bg-blue-50/50 rounded-xl border border-blue-100 animate-slideDown">
                      <div className="flex flex-col md:flex-row gap-4 items-end">
                          <div className="flex-1 w-full">
                              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                  Your Website URL
                                  <Tooltip content="We'll analyze your website to generate a relevant pitch." />
                              </label>
                              <div className="relative">
                                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input 
                                      type="text" 
                                      className="w-full pl-10 p-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-white text-slate-800"
                                      placeholder="https://yourproduct.com"
                                      value={websiteUrl || ''}
                                      onChange={(e) => setWebsiteUrl(e.target.value)}
                                  />
                              </div>
                          </div>
                          {onGeneratePitch && (
                            <button 
                                onClick={onGeneratePitch}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
                            >
                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Auto-Generate Pitch
                            </button>
                          )}
                      </div>
                  </div>
                )}

                {/* Value Prop */}
                <div>
                    <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                        {config.valueProp.label}
                        <Tooltip content={config.valueProp.tooltip} />
                    </label>
                    <p className="text-xs text-slate-400 mb-2">{config.valueProp.desc}</p>
                    <input 
                        type="text" 
                        className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all text-slate-800 placeholder:text-slate-300"
                        placeholder="e.g. Reduce cloud costs by 30% automatically..."
                        value={data.valueProp}
                        onChange={(e) => handleValueChange('valueProp', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DynamicListSection 
                        title={config.benchmarkBrands.label} 
                        tooltip={config.benchmarkBrands.tooltip}
                        description={config.benchmarkBrands.desc}
                        items={data.benchmarkBrands} 
                        onChange={(list, idx, val) => handleListChange('benchmarkBrands', idx, val)}
                        onAdd={() => addListField('benchmarkBrands')}
                        onRemove={(list, idx) => removeListField('benchmarkBrands', idx)}
                    />
                     <DynamicListSection 
                        title={config.painPoints.label} 
                        tooltip={config.painPoints.tooltip}
                        description={config.painPoints.desc}
                        items={data.painPoints} 
                        onChange={(list, idx, val) => handleListChange('painPoints', idx, val)}
                        onAdd={() => addListField('painPoints')}
                        onRemove={(list, idx) => removeListField('painPoints', idx)}
                    />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DynamicListSection 
                        title={config.solutions.label} 
                        tooltip={config.solutions.tooltip}
                        description={config.solutions.desc}
                        items={data.solutions} 
                        onChange={(list, idx, val) => handleListChange('solutions', idx, val)}
                        onAdd={() => addListField('solutions')}
                        onRemove={(list, idx) => removeListField('solutions', idx)}
                    />
                     <DynamicListSection 
                        title={config.proofPoints.label} 
                        tooltip={config.proofPoints.tooltip}
                        description={config.proofPoints.desc}
                        items={data.proofPoints} 
                        onChange={(list, idx, val) => handleListChange('proofPoints', idx, val)}
                        onAdd={() => addListField('proofPoints')}
                        onRemove={(list, idx) => removeListField('proofPoints', idx)}
                    />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DynamicListSection 
                        title={config.ctas.label} 
                        tooltip={config.ctas.tooltip}
                        description={config.ctas.desc}
                        items={data.ctas} 
                        onChange={(list, idx, val) => handleListChange('ctas', idx, val)}
                        onAdd={() => addListField('ctas')}
                        onRemove={(list, idx) => removeListField('ctas', idx)}
                    />
                     <DynamicListSection 
                        title={config.leadMagnets.label} 
                        tooltip={config.leadMagnets.tooltip}
                        description={config.leadMagnets.desc}
                        items={data.leadMagnets} 
                        onChange={(list, idx, val) => handleListChange('leadMagnets', idx, val)}
                        onAdd={() => addListField('leadMagnets')}
                        onRemove={(list, idx) => removeListField('leadMagnets', idx)}
                    />
                </div>
            </div>
        )}
      </div>
  );
};
