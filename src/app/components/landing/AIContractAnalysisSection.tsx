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
  ArrowRight,
  BrainCircuit,
  ScanLine
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
              Intelligent Analysis
            </div>
            
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight mb-6">
              It reads the fine print <br/>
              <span className="text-[#3A4F6A]">so you don't have to.</span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Our AI is trained specifically on ACORD 25 forms, Service Agreements, and legal documents. It instantly extracts limits, dates, and obligations while flagging risks before they become liabilities.
            </p>

            <div className="space-y-8">
              {[
                { 
                  icon: ScanLine, 
                  title: "Instant Data Extraction", 
                  desc: "Upload PDFs and get structured data in seconds. We extract limits, expiration dates, and payment terms automatically." 
                },
                { 
                  icon: AlertTriangle, 
                  title: "Automated Risk Flags", 
                  desc: "Spot auto-renewals, weak indemnification, and missing insurance clauses before you sign." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "Actionable Guidance", 
                  desc: "Get a clear Low/Medium/High risk score with specific recommendations on what to negotiate." 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-[#3A4F6A]">
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
             {/* The Visual Masterpiece */}
            <div 
              className="relative w-full max-w-md mx-auto aspect-[3/4] bg-white rounded-2xl border border-slate-100 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Document Header (Simulating ACORD 25) */}
              <div className="p-8 space-y-6 opacity-80 select-none pointer-events-none">
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                  <div className="w-24 h-8 bg-slate-800/10 rounded" />
                  <div className="space-y-2 text-right">
                    <div className="w-32 h-4 bg-slate-200 rounded ml-auto" />
                    <div className="w-24 h-3 bg-slate-100 rounded ml-auto" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="w-20 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-24 bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
                      <div className="w-3/4 h-3 bg-slate-200 rounded" />
                      <div className="w-1/2 h-3 bg-slate-200 rounded" />
                      <div className="w-2/3 h-3 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-20 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-24 bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
                       {/* Contract Terms Box */}
                       <div className="flex gap-2 items-center mb-1">
                         <div className="w-16 h-3 bg-slate-300 rounded" />
                       </div>
                       <div className="space-y-1.5">
                         <div className="w-full h-2 bg-slate-200 rounded" />
                         <div className="w-full h-2 bg-slate-200 rounded" />
                         <div className="w-2/3 h-2 bg-slate-200 rounded" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Mixed Content Grid */}
                <div className="space-y-4">
                  <div className="w-full h-6 bg-slate-800/10 rounded flex items-center px-2 justify-between">
                    <div className="w-32 h-2 bg-slate-400 rounded" />
                    <div className="w-16 h-2 bg-slate-300 rounded" />
                  </div>
                  
                  {/* Row 1: General Liability (Insurance) */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 w-4 h-4 border border-slate-300 rounded" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-3 h-3 bg-slate-300 rounded relative group-highlight-target-1" />
                  </div>
                  
                  {/* Row 2: Payment Terms (Contract) */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 w-4 h-4 border border-slate-300 rounded bg-slate-100" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-7 h-3 bg-blue-100/50 rounded border border-blue-100 relative group-highlight-target-2" />
                  </div>

                  {/* Row 3: SLA / Milestones (Contract) */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 w-4 h-4 border border-slate-300 rounded" />
                    <div className="col-span-3 h-3 bg-slate-200 rounded" />
                    <div className="col-span-8 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>

              {/* Scanning Laser */}
              <div 
                className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] z-20 animate-scan-down"
              />
              
              {/* Scan Overlay Gradient */}
              <div
                className="absolute left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent z-10 pointer-events-none animate-scan-down"
                style={{ animationDelay: '0.1s' }} // Slight delay for trailing effect
              />

              {/* Extracted Data Cards Popups - Now Static/Permanent for performance */}
              
              {/* Card 1: GL Limit */}
              <div
                className="absolute top-[45%] right-4 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg shadow-lg z-30 flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-1000 delay-500 fill-mode-both"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-[10px] text-emerald-600 font-bold uppercase">General Liability</div>
                  <div className="text-sm font-bold text-emerald-800">$2,000,000</div>
                </div>
              </div>

              {/* Card 2: Expiration */}
              <div
                className="absolute bottom-16 left-8 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg shadow-lg z-30 flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-1000 delay-1000 fill-mode-both"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-[10px] text-blue-600 font-bold uppercase">Payment Terms</div>
                  <div className="text-sm font-bold text-blue-800">Net 30</div>
                </div>
              </div>

            </div>

            {/* Decorative "Scanning" Grid behind document - Simplified */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 opacity-30">
               <div className="absolute inset-0 border border-dashed border-blue-200 rounded-full" />
               <div className="absolute inset-[10%] border border-dashed border-slate-200 rounded-full" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}