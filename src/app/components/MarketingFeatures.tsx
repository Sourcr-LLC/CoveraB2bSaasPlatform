import { motion } from 'motion/react';
import { 
  Search, 
  Database, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Mail,
  Bell,
  BarChart3,
  Sparkles,
  Bot,
  ScanLine,
  AlertCircle,
  Upload
} from 'lucide-react';

export default function MarketingFeatures() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-stone-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* SECTION 2: HOW IT WORKS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-32"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#3A4F6A] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                <Sparkles className="w-3 h-3" />
                Simple Workflow
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight">
                From Upload to Compliance<br className="hidden md:block"/> <span className="text-[#3A4F6A]">in Seconds.</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group">
              <div className="bg-stone-100 rounded-2xl h-64 mb-6 overflow-hidden relative border border-stone-200 transition-all group-hover:shadow-lg">
                <div className="absolute inset-x-8 top-8 bottom-0 bg-white rounded-t-xl shadow-lg border border-stone-200 p-4">
                  {/* Mock Upload UI */}
                  <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-stone-200 rounded-lg bg-stone-50">
                    <Upload className="w-8 h-8 text-stone-400 mb-2" />
                    <div className="h-2 w-24 bg-stone-200 rounded mb-1" />
                    <div className="h-1.5 w-16 bg-stone-100 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-500 shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">Centralize Documents</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Upload ACORD 25 forms directly or sync with Procore and QuickBooks.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group">
              <div className="bg-stone-100 rounded-2xl h-64 mb-6 overflow-hidden relative border border-stone-200 transition-all group-hover:shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-stone-200 transform group-hover:scale-105 transition-transform">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 relative flex items-center justify-center">
                         <Search className="w-6 h-6 text-stone-500" />
                         <div className="absolute -right-2 -bottom-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                           SCANNED
                         </div>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="flex justify-between text-xs text-stone-500"><span>Limits</span> <span className="text-green-600">✓</span></div>
                      <div className="flex justify-between text-xs text-stone-500"><span>Dates</span> <span className="text-green-600">✓</span></div>
                      <div className="flex justify-between text-xs text-stone-500"><span>Insured</span> <span className="text-green-600">✓</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-500 shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">AI Extraction & Verify</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Instantly pull policy limits, expiration dates, and endorsements.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group">
              <div className="bg-stone-100 rounded-2xl h-64 mb-6 overflow-hidden relative border border-stone-200 transition-all group-hover:shadow-lg flex items-center justify-center p-8">
                <div className="w-full h-full bg-white rounded-xl shadow-sm border border-stone-200 p-4 space-y-3 relative">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full bg-stone-200" />
                     <div className="flex-1">
                        <div className="h-2 w-20 bg-stone-200 rounded mb-1" />
                        <div className="h-1.5 w-12 bg-stone-100 rounded" />
                     </div>
                  </div>
                  <div className="h-16 bg-blue-50 rounded-lg p-2 border border-blue-100">
                     <div className="h-1.5 w-full bg-blue-200 rounded mb-2" />
                     <div className="h-1.5 w-2/3 bg-blue-200 rounded" />
                  </div>
                  
                  <div className="absolute bottom-6 right-6">
                     <button className="bg-[#3A4F6A] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform cursor-default flex items-center gap-1">
                       <Mail className="w-3 h-3" /> Sent
                     </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-500 shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">Automate Action</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Auto-send emails for expired policies and missing documents.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: BENTO GRID FEATURES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#3A4F6A] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                <Zap className="w-3 h-3" />
                Features
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight">
                Everything You Need to<br className="hidden md:block"/> <span className="text-[#3A4F6A]">Protect Your Business</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Large Blue Card */}
            <div className="md:col-span-2 md:row-span-2 bg-[#3A4F6A] rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10 h-full flex flex-col">
                 <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-sm aspect-square bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 transform group-hover:scale-105 transition-transform duration-500">
                      <div className="bg-[#2c3e53] rounded-xl p-4 mb-4 shadow-inner flex justify-between items-center">
                        <span className="text-sm font-medium text-white/80">Compliance Status</span>
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-xs text-white/60 pb-2 border-b border-white/10">
                            <span>General Liability</span>
                            <span className="text-green-400">Active</span>
                         </div>
                         <div className="flex justify-between items-center text-xs text-white/60 pb-2 border-b border-white/10">
                            <span>Workers Comp</span>
                            <span className="text-green-400">Active</span>
                         </div>
                         <div className="flex justify-between items-center text-xs text-white/60 pb-2 border-b border-white/10">
                            <span>Auto Liability</span>
                            <span className="text-green-400">Active</span>
                         </div>
                         <div className="flex justify-between items-center text-xs text-white/60 pb-2 border-b border-white/10">
                            <span>Umbrella / Excess</span>
                            <span className="text-amber-400">Expiring Soon</span>
                         </div>
                      </div>
                    </div>
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold mb-2">Comprehensive Tracking</h3>
                   <p className="text-white/70">Track GL, Auto, Umbrella, Workers Comp, and specialized policies in one dashboard.</p>
                 </div>
              </div>
            </div>

            {/* Wide Card */}
            <div className="md:col-span-2 bg-stone-100 rounded-3xl p-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-stone-50/50 pointer-events-none" />
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                     <div className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-stone-100">Audit Log</div>
                     <div className="bg-[#3A4F6A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                       <Sparkles className="w-3 h-3" /> Auto-Logged
                     </div>
                  </div>
                  <div className="mt-8">
                     <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Audit-Ready History</h3>
                     <p className="text-stone-500 text-sm">Full history of every document, verification attempt, and email sent for every vendor.</p>
                  </div>
               </div>
            </div>

            {/* Small Card 1 */}
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100 hover:shadow-lg transition-shadow">
               <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-stone-100 flex items-center justify-center mb-4 text-[#3A4F6A]">
                  <ScanLine className="w-5 h-5" />
               </div>
               <h3 className="font-bold text-[#1a1a1a] mb-1">OCR Precision</h3>
               <p className="text-xs text-stone-500">99% accuracy on ACORD 25 forms and insurance docs</p>
            </div>

            {/* Small Card 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 border border-blue-100 hover:shadow-lg transition-shadow relative overflow-hidden">
               <div className="absolute top-4 right-4 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-lg">
                 Risk High
               </div>
               <div className="mt-8">
                  <div className="w-16 h-16 rounded-full bg-[#3A4F6A] mb-4 opacity-10 blur-xl absolute" />
                  <h3 className="font-bold text-[#1a1a1a] mb-1 relative z-10">Risk Scoring</h3>
                  <p className="text-xs text-stone-500 relative z-10">Identify non-compliant vendors before they step on site</p>
               </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}