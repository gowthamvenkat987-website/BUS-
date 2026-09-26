import React, { useState } from 'react';
import { Recommendation } from '../types';
import { 
  Lightbulb, 
  Bus, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle,
  Zap
} from 'lucide-react';

interface RecommendationsPageProps {
  recommendations: Recommendation[];
  onApplyRecommendation: (id: string) => Promise<any>;
  onNavigateTab: (tab: any) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  onApplyRecommendation,
  onNavigateTab
}) => {
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleApply = async (id: string) => {
    setApplyingId(id);
    await onApplyRecommendation(id);
    setApplyingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              AI Recommendation Engine
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Prescriptive Fleet Optimization
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Data-backed transportation interventions that dynamically resolve overcrowding and rebalance NRIIT campus bus capacity.
          </p>
        </div>

        <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-slate-600">Dynamic Fleet Reallocation:</span>
          <span className="font-bold text-emerald-600">Active</span>
        </div>
      </div>

      {/* Hero Recommendation Card: Deploy Standby Vehicle D */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isApplied = rec.status === 'applied';

          return (
            <div
              key={rec.id}
              className={`bg-white rounded-2xl border-2 p-4 sm:p-6 shadow-sm transition-all min-w-0 ${
                isApplied
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isApplied ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {isApplied ? <CheckCircle2 className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 font-['Outfit'] break-anywhere">
                        {rec.title}
                      </h2>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0">
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 break-anywhere">
                      Target Corridor: <strong className="text-slate-800">{rec.routeName}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                    isApplied
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {isApplied ? 'Status: APPLIED & RESOLVED' : `Target Risk: ${rec.riskTarget}`}
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown: WHY & WHAT ACTION */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Why Section */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    AI Reasoning: Why is this action recommended?
                  </span>
                  <p className="text-slate-700 leading-relaxed break-anywhere">
                    “{rec.explanation}”
                  </p>
                </div>

                {/* What Action Section */}
                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    Recommended Transportation Action
                  </span>
                  <p className="text-slate-800 leading-relaxed font-semibold break-anywhere">
                    {rec.action}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-2 break-anywhere">
                    Expected Outcome: {rec.impact}
                  </p>
                </div>
              </div>

              {/* Action Button Strip */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Urgency: <strong className="text-slate-800">{rec.urgency}</strong> • Verified by NRIIT Fleet Dispatcher
                </span>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  {isApplied ? (
                    <div className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2.5 min-h-[44px] rounded-xl font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Action Deployed • Corridor Safely Rebalanced</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(rec.id)}
                      disabled={applyingId === rec.id}
                      id={`btn-apply-${rec.id}`}
                      className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <Bus className="w-4 h-4" />
                      <span>{applyingId === rec.id ? 'Deploying Fleet...' : 'Approve & Dispatch Vehicle Now'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => onNavigateTab('live-monitoring')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 min-h-[44px] rounded-xl font-semibold transition flex items-center justify-center"
                  >
                    View Live Route Map
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
