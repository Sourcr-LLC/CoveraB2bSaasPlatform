import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck, FileSearch, BrainCircuit, ScanLine } from 'lucide-react';

export default function AIScannerSection() {
  const [scanPass, setScanPass] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPass(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-[#fafaf9] relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A4F6A]/5 text-[#3A4F6A] text-xs font-bold uppercase tracking-widest mb-6"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Intelligent Parsing</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-[#1a1a1a] mb-6 leading-[1.1]"
            >
              It reads the <br/>
              <span className="text-[#3A4F6A]">fine print</span> for you.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-10 leading-relaxed"
            >
              Our AI is trained specifically on ACORD 25 forms and complex insurance documents. It instantly extracts limits, policy numbers, and endorsements—flagging gaps before they become liabilities.
            </motion.p>

            <div className="space-y-6">
              {[
                { title: "Zero Data Entry", desc: "Upload a PDF and get structured data in seconds." },
                { title: "Audit-Proof Precision", desc: "Links every data point back to the source pixel." },
                { title: "Smart Expiration Logic", desc: "Understands policy periods and auto-renewals." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-[#3A4F6A]/50 group-hover:scale-110 transition-all duration-300">
                    <CheckCircle2 className="w-5 h-5 text-[#3A4F6A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* The Visual Masterpiece */}
          <div className="lg:w-1/2 w-full perspective-[2000px]">
            <motion.div 
              className="relative w-full max-w-md mx-auto aspect-[3/4] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
              initial={{ rotateY: 10, rotateX: 5 }}
              whileInView={{ rotateY: 0, rotateX: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
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
                       {/* Insurer Boxes */}
                       <div className="flex gap-2 items-center">
                         <div className="w-4 h-4 bg-slate-200 rounded" />
                         <div className="w-full h-3 bg-slate-200 rounded" />
                       </div>
                       <div className="flex gap-2 items-center">
                         <div className="w-4 h-4 bg-slate-200 rounded" />
                         <div className="w-full h-3 bg-slate-200 rounded" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Coverages Grid */}
                <div className="space-y-4">
                  <div className="w-full h-6 bg-slate-800/10 rounded flex items-center px-2">
                    <div className="w-32 h-2 bg-slate-400 rounded" />
                  </div>
                  
                  {/* Row 1: General Liability */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 w-4 h-4 border border-slate-300 rounded" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-3 h-3 bg-slate-300 rounded relative group-highlight-target-1" />
                  </div>
                  
                  {/* Row 2: Auto */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 w-4 h-4 border border-slate-300 rounded" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-3 h-3 bg-slate-300 rounded relative group-highlight-target-2" />
                  </div>

                  {/* Row 3: Umbrella */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 w-4 h-4 border border-slate-300 rounded" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-4 h-3 bg-slate-200 rounded" />
                    <div className="col-span-3 h-3 bg-slate-300 rounded relative group-highlight-target-3" />
                  </div>
                </div>
              </div>

              {/* Scanning Laser */}
              <motion.div 
                key={scanPass}
                className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] z-20"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
              
              {/* Scan Overlay Gradient */}
              <motion.div
                key={`grad-${scanPass}`}
                className="absolute left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent z-10 pointer-events-none"
                initial={{ top: "-10%" }}
                animate={{ top: "90%" }}
                transition={{ duration: 3, ease: "linear" }}
              />

              {/* Extracted Data Cards Popups */}
              
              {/* Card 1: GL Limit */}
              <motion.div
                key={`card1-${scanPass}`}
                className="absolute top-[45%] right-4 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg shadow-lg z-30 flex items-center gap-2"
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-[10px] text-emerald-600 font-bold uppercase">General Liability</div>
                  <div className="text-sm font-bold text-emerald-800">$2,000,000</div>
                </div>
              </motion.div>

              {/* Card 2: Expiration */}
              <motion.div
                key={`card2-${scanPass}`}
                className="absolute bottom-16 left-8 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg shadow-lg z-30 flex items-center gap-2"
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 2.2, duration: 0.4 }}
              >
                <ScanLine className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-[10px] text-blue-600 font-bold uppercase">Policy Exp</div>
                  <div className="text-sm font-bold text-blue-800">12/31/2025</div>
                </div>
              </motion.div>

            </motion.div>

            {/* Decorative "Scanning" Grid behind document */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10">
               <div className="absolute inset-0 border border-dashed border-blue-200/50 rounded-full animate-[spin_60s_linear_infinite]" />
               <div className="absolute inset-[10%] border border-dashed border-slate-200/50 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}