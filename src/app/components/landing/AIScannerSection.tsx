import { CheckCircle2, ShieldCheck, BrainCircuit, ScanLine, FileText } from 'lucide-react';

export default function AIScannerSection() {
  return (
    <section className="py-16 md:py-32 bg-[#fafaf9] relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
              <BrainCircuit className="w-3 h-3" />
              Intelligent Parsing
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-6">
              It reads the <br className="hidden md:block"/>
              <span className="text-[#3A4F6A]">fine print for you.</span>
            </h2>
            
            <p 
              className="text-lg text-slate-600 mb-10 leading-relaxed"
            >
              Our AI is trained specifically on ACORD 25 forms, Service Agreements, and complex legal documents. It instantly extracts limits, contract milestones, and endorsements, flagging gaps before they become liabilities.
            </p>

            <div className="space-y-6">
              {[
                { title: "Zero Data Entry", desc: "Upload PDFs and get structured data in seconds." },
                { title: "Audit-Proof Precision", desc: "Links every data point back to the source pixel." },
                { title: "Smart Expiration Logic", desc: "Understands policy periods and contract terms." }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-[#3A4F6A]/50 group-hover:scale-110 transition-all duration-300">
                    <CheckCircle2 className="w-5 h-5 text-[#3A4F6A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Visual Masterpiece */}
          <div className="lg:w-1/2 w-full">
            <div 
              className="relative w-full max-w-md mx-auto aspect-[3/4] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]"
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