import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function AIContractAnalysisSection() {
  return (
    <section className="py-24 md:py-32 bg-[#fafaf9] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Content */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A4F6A]/10 text-[#3A4F6A] text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              New Feature
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-[1.1] mb-6 font-display">
              Contract risk analysis <br/>
              <span className="text-[#3A4F6A]">without the hourly rate.</span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Don't let hidden clauses become expensive problems. Our AI scans every contract for common risks, missing insurance requirements, and unfavorable terms giving you a preliminary health check before you call legal.
            </p>

            <div className="space-y-8">
              {[
                { 
                  icon: FileSearch, 
                  title: "Plain-English Summaries", 
                  desc: "Understand exactly what you're signing. We break down vendor vs. buyer responsibilities instantly." 
                },
                { 
                  icon: AlertTriangle, 
                  title: "Automated Risk Flags", 
                  desc: "Spot auto-renewals, weak indemnification, and missing insurance clauses in seconds." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "Actionable Guidance", 
                  desc: "Get a clear Low/Medium/High risk score with specific recommendations on what to negotiate." 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0 text-[#3A4F6A]">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a1a] text-lg mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-2 text-xs text-slate-400">
              <AlertCircle className="w-4 h-4" />
              <span>Note: This tool provides preliminary risk analysis and does not replace professional legal advice.</span>
            </div>
          </div>

          {/* Right Visual - Interactive Analysis Card */}
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px]">
              
              {/* Shadow Stack Effect */}
              <div className="absolute top-4 -right-4 w-full h-full bg-slate-200/50 rounded-3xl transform rotate-3" />
              
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10">
                
                {/* Header */}
                <div className="p-6 pb-4 border-b border-slate-50 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#3A4F6A]/5 rounded-xl flex items-center justify-center text-[#3A4F6A]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1a1a1a]">Master Service Agreement.pdf</div>
                      <div className="text-xs text-slate-400 mt-0.5">Analyzed just now</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <AlertTriangle className="w-3.5 h-3.5" /> Medium Risk
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  
                  {/* Findings */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Key Findings</h4>
                    <div className="space-y-3">
                      
                      {/* Critical */}
                      <div className="p-4 bg-red-50/80 rounded-xl border border-red-100 flex gap-3.5">
                        <div className="bg-white p-1.5 rounded-lg border border-red-100 h-fit shadow-sm">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-red-900">Auto-renewal clause detected</div>
                          <div className="text-xs text-red-700/90 mt-1 leading-relaxed">
                            Contract renews automatically for 12 months unless cancelled 90 days prior.
                          </div>
                        </div>
                      </div>
                      
                      {/* Warning */}
                      <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-100 flex gap-3.5">
                        <div className="bg-white p-1.5 rounded-lg border border-amber-100 h-fit shadow-sm">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-amber-900">Indemnification favors vendor</div>
                          <div className="text-xs text-amber-700/90 mt-1 leading-relaxed">
                            Language limits vendor liability to 50% of contract value.
                          </div>
                        </div>
                      </div>

                      {/* Good */}
                      <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-100 flex gap-3.5">
                        <div className="bg-white p-1.5 rounded-lg border border-emerald-100 h-fit shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-emerald-900">Payment terms standard</div>
                          <div className="text-xs text-emerald-700/90 mt-1 leading-relaxed">
                            Net 30 terms match your company policy.
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended Action</h4>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Consider legal review before execution. Negotiate removal of auto-renewal clause.
                    </p>
                  </div>

                </div>

                {/* Footer Button */}
                <button className="w-full bg-[#3A4F6A] hover:bg-[#2c3e53] text-white py-4 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  View Full Analysis Report
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}