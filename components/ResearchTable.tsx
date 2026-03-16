import React, { useState } from 'react';
import { Trash2, Download, Plus, Search, MoreVertical, Phone, Mail, Linkedin, Twitter, ThumbsUp, ThumbsDown, Zap, RefreshCw, ChevronRight, ChevronLeft, ArrowUp, ArrowDown, X, Building, MapPin, Globe, History, ExternalLink, Newspaper, MessageCircle } from 'lucide-react';
import { Tooltip } from './CampaignFormUI';

interface ResearchTableProps {
  onNext: () => void;
  onBack: () => void;
}

// Enhanced Mock Data for AI Scouting
const INITIAL_DATA = [
    { 
        id: 1, 
        name: 'Amy Mackreth', 
        title: 'VP of Engineering', 
        company: 'TechFlow', 
        score: 98, 
        rationale: 'Hiring heavily in React', 
        feedback: null as 'good' | 'bad' | null, 
        platform: 'linkedin', 
        hasEmail: true, 
        hasPhone: true,
        location: 'San Francisco, CA',
        about: 'Engineering leader with 15+ years experience scaling SaaS teams. Passionate about DX and React.',
        recentActivity: [
            { type: 'post', content: 'Just published our new engineering handbook regarding React Server Components. Check it out!', date: '2 days ago' },
            { type: 'comment', content: 'Great insights on state management patterns.', date: '5 days ago' }
        ],
        companyNews: [
            { title: 'TechFlow raises $50M Series B to scale AI ops', source: 'TechCrunch', date: '1 month ago' },
            { title: 'TechFlow named top workplace for engineers', source: 'BuiltIn', date: '3 months ago' }
        ]
    },
    { 
        id: 2, 
        name: 'Thai Mach', 
        title: 'Head of Product', 
        company: 'Databricks', 
        score: 95, 
        rationale: 'Posted about API scaling', 
        feedback: null as 'good' | 'bad' | null, 
        platform: 'linkedin', 
        hasEmail: true, 
        hasPhone: false,
        location: 'New York, NY',
        about: 'Product strategist focused on data platforms and AI adoption.',
        recentActivity: [
            { type: 'post', content: 'The future of data warehouses is lakehouses. Here is why.', date: '1 week ago' }
        ],
        companyNews: [
            { title: 'Databricks launches new SQL serverless offering', source: 'Press Release', date: '2 weeks ago' }
        ]
    },
    { id: 3, name: 'Tiffani Neilson', title: 'CTO', company: 'Startup.io', score: 92, rationale: 'Match on "SaaS" & "Scale"', feedback: null as 'good' | 'bad' | null, platform: 'twitter', hasEmail: true, hasPhone: true, location: 'Austin, TX', about: 'Building the next gen of dev tools.', recentActivity: [], companyNews: [] },
    { id: 4, name: 'Harry Friedman', title: 'Director of Dev', company: 'CloudScale', score: 88, rationale: 'Tech stack matches', feedback: null as 'good' | 'bad' | null, platform: 'linkedin', hasEmail: true, hasPhone: false, location: 'Remote', about: 'Cloud architecture enthusiast.', recentActivity: [], companyNews: [] },
    { id: 5, name: 'Suzanne Tegen', title: 'Engineering Manager', company: 'EduTech', score: 85, rationale: 'Recently funded Series B', feedback: null as 'good' | 'bad' | null, platform: 'linkedin', hasEmail: false, hasPhone: true, location: 'Boston, MA', about: 'EdTech veteran.', recentActivity: [], companyNews: [] },
    { id: 6, name: 'Ty Mallard', title: 'Senior VP', company: 'LogiCorp', score: 78, rationale: 'Title match (imperfect industry)', feedback: null as 'good' | 'bad' | null, platform: 'twitter', hasEmail: true, hasPhone: true, location: 'Chicago, IL', about: 'Logistics and supply chain tech.', recentActivity: [], companyNews: [] },
    { id: 7, name: 'Johanna Flower', title: 'Founder', company: 'FlowerDev', score: 72, rationale: 'Keywords present, small team', feedback: null as 'good' | 'bad' | null, platform: 'linkedin', hasEmail: true, hasPhone: false, location: 'Seattle, WA', about: 'Founder mode activated.', recentActivity: [], companyNews: [] },
    { id: 8, name: 'Marcus Chen', title: 'Lead Architect', company: 'BuildWise', score: 65, rationale: 'Stack unknown, high intent title', feedback: null as 'good' | 'bad' | null, platform: 'linkedin', hasEmail: false, hasPhone: false, location: 'Denver, CO', about: 'Architecting scalable solutions.', recentActivity: [], companyNews: [] },
    { id: 9, name: 'Sarah Jones', title: 'VP Growth', company: 'Marketify', score: 60, rationale: 'Borderline ICP fit', feedback: null as 'good' | 'bad' | null, platform: 'linkedin', hasEmail: true, hasPhone: true, location: 'Los Angeles, CA', about: 'Growth hacking 101.', recentActivity: [], companyNews: [] },
    { id: 10, name: 'David Smith', title: 'CEO', company: 'SmallBiz', score: 55, rationale: 'Low employee count', feedback: null as 'good' | 'bad' | null, platform: 'twitter', hasEmail: true, hasPhone: false, location: 'Miami, FL', about: 'Small business advocate.', recentActivity: [], companyNews: [] },
];

export const ResearchTable: React.FC<ResearchTableProps> = ({ onNext, onBack }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isRefining, setIsRefining] = useState(false);
  const [previousScores, setPreviousScores] = useState<Record<number, number>>({});
  const [showDelta, setShowDelta] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<typeof INITIAL_DATA[0] | null>(null);

  const handleFeedback = (e: React.MouseEvent, id: number, type: 'good' | 'bad') => {
    e.stopPropagation(); // Prevent row click
    setData(prev => prev.map(item => 
        item.id === id ? { ...item, feedback: item.feedback === type ? null : type } : item
    ));
  };

  const ratedCount = data.filter(i => i.feedback !== null).length;

  const handleRefine = () => {
    setIsRefining(true);
    // Snapshot current scores before update
    const currentScoreSnapshot = data.reduce((acc, item) => ({...acc, [item.id]: item.score}), {} as Record<number, number>);
    setPreviousScores(currentScoreSnapshot);

    // Simulate AI retraining
    setTimeout(() => {
        setIsRefining(false);
        setShowDelta(true);

        // Update scores based on feedback
        setData(prev => prev.map(item => {
            let newScore = item.score;
            // Strong adjustment for rated items
            if (item.feedback === 'good') {
                newScore = Math.min(100, item.score + 5 + Math.floor(Math.random() * 4)); 
            } else if (item.feedback === 'bad') {
                newScore = Math.max(0, item.score - 15 - Math.floor(Math.random() * 5));
            } else {
                // Subtle adjustment for unrated items based on latent similarity (simulated)
                const jitter = Math.floor(Math.random() * 7) - 3; // -3 to +3
                newScore = Math.max(0, Math.min(100, item.score + jitter));
            }

            return {
                ...item,
                score: newScore,
                feedback: null // Reset feedback to allow new rounds
            };
        }).sort((a, b) => b.score - a.score));
        
        // Hide delta indicators after 5 seconds
        setTimeout(() => setShowDelta(false), 5000);

    }, 1500);
  };

  return (
    <div className="w-full animate-fadeIn pb-10 relative">
      
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                SuperAgent ICP Scout Results
            </h2>
            <p className="text-sm text-slate-500 mt-1">
                We found 30 potential prospects. Rate them to help the AI learn your preferences.
            </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Model Training</span>
                <span className="text-sm text-slate-500 font-medium">
                    {ratedCount > 0 ? `${ratedCount} rated` : 'Waiting for input...'}
                </span>
            </div>
            
            <div className="h-10 w-px bg-slate-200 mx-2"></div>

            {ratedCount > 0 ? (
                 <button 
                    onClick={handleRefine}
                    disabled={isRefining}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-bold shadow-md transition-all animate-pulse"
                >
                    {isRefining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Refine Scoring Now
                </button>
            ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
                     <RefreshCw className="w-4 h-4" />
                     Refine Scoring
                </div>
            )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm hover:border-slate-300">
                <Search className="w-4 h-4" />
                Search
            </button>
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm hover:border-slate-300">
                Score {'>'} 80
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                        <th className="p-4 w-10"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" /></th>
                        <th className="p-4 min-w-[200px]">Prospect</th>
                        <th className="p-4">Source & Data</th>
                        <th className="p-4">AI Score</th>
                        <th className="p-4">Match Rationale</th>
                        <th className="p-4 text-center">
                            Train Model
                            <Tooltip content="Thumbs up/down to teach the AI which prospects you prefer. Click 'Refine Scoring' to update the list." />
                        </th>
                        <th className="p-4 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((row) => (
                        <tr 
                            key={row.id} 
                            onClick={() => setSelectedProspect(row)}
                            className={`transition-colors cursor-pointer ${row.feedback === 'bad' ? 'bg-red-50/50' : row.feedback === 'good' ? 'bg-green-50/50' : 'hover:bg-blue-50/30'}`}
                        >
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                            </td>
                            <td className="p-4">
                                <div>
                                    <div className="font-semibold text-slate-900">{row.name}</div>
                                    <div className="text-xs text-slate-500">{row.title} @ {row.company}</div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    {/* Platform Icon */}
                                    {row.platform === 'linkedin' ? (
                                        <div className="p-1.5 bg-[#0077b5]/10 rounded text-[#0077b5]" title="Source: LinkedIn">
                                            <Linkedin className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <div className="p-1.5 bg-black/5 rounded text-black" title="Source: X (Twitter)">
                                            <Twitter className="w-4 h-4" />
                                        </div>
                                    )}
                                    
                                    {/* Data Enrichment Icons */}
                                    <div className="flex gap-1 border-l border-slate-200 pl-3">
                                        <div className={`p-1 rounded-full ${row.hasEmail ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'}`} title={row.hasEmail ? "Email Available" : "No Email"}>
                                            <Mail className="w-3 h-3" />
                                        </div>
                                        <div className={`p-1 rounded-full ${row.hasPhone ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'}`} title={row.hasPhone ? "Phone Available" : "No Phone"}>
                                            <Phone className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        px-2.5 py-1 rounded-full text-xs font-bold w-fit
                                        ${row.score >= 90 ? 'bg-green-100 text-green-700' : 
                                          row.score >= 70 ? 'bg-yellow-100 text-yellow-700' : 
                                          'bg-red-100 text-red-700'}
                                    `}>
                                        {row.score}
                                    </div>
                                    
                                    {/* Score Delta Indicator */}
                                    {showDelta && previousScores[row.id] !== undefined && previousScores[row.id] !== row.score && (
                                        <div className={`flex items-center text-xs font-bold animate-fadeIn ${
                                            row.score > previousScores[row.id] ? 'text-green-600' : 'text-red-500'
                                        }`}>
                                            {row.score > previousScores[row.id] ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                            {Math.abs(row.score - previousScores[row.id])}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-1.5 text-slate-600 text-xs bg-slate-100 w-fit px-2 py-1 rounded border border-slate-200">
                                    <Zap className="w-3 h-3 text-slate-400" />
                                    {row.rationale}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button 
                                        onClick={(e) => handleFeedback(e, row.id, 'good')}
                                        className={`p-2 rounded-lg border transition-all duration-200 ${
                                            row.feedback === 'good' 
                                            ? 'bg-green-600 border-green-600 text-white shadow-md transform scale-110' 
                                            : 'bg-white border-slate-200 text-slate-400 hover:border-green-400 hover:text-green-500 hover:bg-green-50'
                                        }`}
                                        title="Good Match"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => handleFeedback(e, row.id, 'bad')}
                                        className={`p-2 rounded-lg border transition-all duration-200 ${
                                            row.feedback === 'bad' 
                                            ? 'bg-red-600 border-red-600 text-white shadow-md transform scale-110' 
                                            : 'bg-white border-slate-200 text-slate-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                        title="Bad Match"
                                    >
                                        <ThumbsDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                <button className="text-slate-400 hover:text-blue-600">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1-{data.length} of 30 prospects</span>
            <div className="flex items-center gap-1">
                <button disabled className="p-1 rounded hover:bg-slate-200 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                <button disabled className="p-1 rounded hover:bg-slate-200 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button onClick={onBack} className="px-8 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium min-w-[140px]">
          Previous
        </button>
        <button 
            onClick={onNext} 
            className="px-8 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all font-medium min-w-[140px]"
        >
            {ratedCount > 0 ? "Approve & Next" : "Skip Review"}
        </button>
      </div>

      {/* Prospect Detail Sidebar Modal */}
      {selectedProspect && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedProspect(null)}
            ></div>
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto animate-slideInRight flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-4 border-white shadow-sm">
                                {selectedProspect.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedProspect.name}</h3>
                                <p className="text-slate-500 font-medium">{selectedProspect.title}</p>
                                <div className="flex items-center gap-2 text-sm text-blue-600 mt-1">
                                    <Building className="w-3.5 h-3.5" />
                                    {selectedProspect.company}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedProspect(null)}
                            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 shadow-sm">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {selectedProspect.location}
                        </div>
                        <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0077b5]/10 border border-[#0077b5]/20 rounded-lg text-xs font-medium text-[#0077b5] hover:bg-[#0077b5]/20 transition-colors">
                            <Linkedin className="w-3.5 h-3.5" />
                            LinkedIn Profile
                        </a>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 flex-1">
                    
                    {/* About */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            AI Summary
                        </h4>
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-700 leading-relaxed">
                            {selectedProspect.about}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <History className="w-4 h-4 text-slate-500" />
                            Recent Activity
                        </h4>
                        {selectedProspect.recentActivity.length > 0 ? (
                            <div className="space-y-3">
                                {selectedProspect.recentActivity.map((activity, idx) => (
                                    <div key={idx} className="flex gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors">
                                        <div className="mt-1">
                                            {activity.type === 'post' ? <ExternalLink className="w-4 h-4 text-blue-600" /> : <MessageCircle className="w-4 h-4 text-slate-400" />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-800 mb-1">{activity.content}</p>
                                            <span className="text-xs text-slate-400">{activity.date} • {activity.type === 'post' ? 'Posted on LinkedIn' : 'Commented'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No recent activity detected.</p>
                        )}
                    </div>

                    {/* Company News */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Newspaper className="w-4 h-4 text-slate-500" />
                            Company News
                        </h4>
                        {selectedProspect.companyNews.length > 0 ? (
                            <div className="space-y-3">
                                {selectedProspect.companyNews.map((news, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group">
                                        <h5 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">{news.title}</h5>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span>{news.source}</span>
                                            <span>•</span>
                                            <span>{news.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No recent news signals.</p>
                        )}
                    </div>
                </div>
                
                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 sticky bottom-0">
                    <div className="flex gap-3">
                        <button className="flex-1 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium text-sm hover:border-slate-300 hover:text-slate-800 shadow-sm transition-colors">
                            Ignore Prospect
                        </button>
                        <button className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-md transition-colors">
                            Approve for Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};