import { useState, useEffect, forwardRef } from 'react';
import { 
  Shield, LayoutDashboard, Users, FileCheck, Search, Bell, Filter,
  AlertTriangle, Calendar, BarChart3, Plus,
  Send, ArrowUpRight, FileText, Check, Loader2, MousePointer2
} from 'lucide-react';
import { KpiCard } from '../dashboard/KpiCard';
import { motion, AnimatePresence } from 'motion/react';

// Helper to generate consistent colors for avatars based on name
function getAvatarColor(name: string) {
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-amber-100 text-amber-700 border-amber-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-rose-100 text-rose-700 border-rose-200'
  ];
  const index = name.length % colors.length;
  return colors[index];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export default function InteractiveHeroVisual() {
  return (
    <div className="relative w-full mx-auto" style={{ fontFamily: 'Red Hat Display, sans-serif' }}>
      <div className="relative bg-white overflow-hidden flex justify-center">
        <DashboardContent />
      </div>
    </div>
  );
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'insurance' | 'contracts'>('insurance');
  const [filterRisk, setFilterRisk] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  // Demo State
  const [cursorPos, setCursorPos] = useState({ x: '50%', y: '50%', opacity: 0, click: false });
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // The Demo Script
  useEffect(() => {
    if (!isPlaying) return;

    const script = [
      // Initial Wait
      { delay: 1000, action: () => {} }, 
      
      // Step 1: Move to "Resolve" button
      { delay: 1500, action: () => setCursorPos({ x: '89%', y: '21%', opacity: 1, click: false }) },
      
      // Step 2: Click "Resolve"
      { delay: 800, action: () => {
          setCursorPos(prev => ({ ...prev, click: true }));
          setTimeout(() => setCursorPos(prev => ({ ...prev, click: false })), 200);
          setTimeout(() => {
             setFilterRisk(true);
             showToast("Filtering for high-risk items...", "info");
          }, 300);
      }},

      // Step 3: Wait and observe
      { delay: 2500, action: () => {} },

      // Step 4: Move to "Send Reminder" on the first row (which is now an at-risk item)
      { delay: 1000, action: () => setCursorPos({ x: '92%', y: '71%', opacity: 1, click: false }) },

      // Step 5: Click "Send Reminder"
      { delay: 800, action: () => {
          setCursorPos(prev => ({ ...prev, click: true }));
          setTimeout(() => setCursorPos(prev => ({ ...prev, click: false })), 200);
          // The click logic is handled by the row component checking the demoTrigger prop? 
          // Actually, we can just trigger a global event or pass a prop.
          // For simplicity, we'll simulate it by finding the button or just letting the UI react naturally?
          // We need to trigger the specific row's action. 
          // We will use a `demoAction` state passed down.
      }},

      // Step 6: Wait for toast and success state
      { delay: 3000, action: () => {} },

      // Step 7: Move to "Contracts" tab
      { delay: 1000, action: () => setCursorPos({ x: '42%', y: '52%', opacity: 1, click: false }) },

      // Step 8: Click "Contracts"
      { delay: 800, action: () => {
          setCursorPos(prev => ({ ...prev, click: true }));
          setTimeout(() => setCursorPos(prev => ({ ...prev, click: false })), 200);
          setTimeout(() => {
             setActiveTab('contracts');
             setFilterRisk(false); // Reset filter when changing tabs naturally
          }, 300);
      }},

      // Step 9: Wait
      { delay: 2000, action: () => {} },

      // Step 10: Reset and loop
      { delay: 1000, action: () => {
         setCursorPos({ x: '50%', y: '50%', opacity: 0, click: false });
         setActiveTab('insurance');
         setFilterRisk(false);
         setDemoStep(0); // Loop
      }}
    ];

    let currentStepIndex = 0;
    let timeoutId: any;

    const runScript = async () => {
      // If we've looped or started fresh
      if (demoStep === 0) currentStepIndex = 0;
      else currentStepIndex = demoStep;

      if (currentStepIndex >= script.length) {
        setDemoStep(0); // Restart
        return;
      }

      const step = script[currentStepIndex];
      timeoutId = setTimeout(() => {
        step.action();
        setDemoStep(prev => prev + 1);
      }, step.delay);
    };

    runScript();

    return () => clearTimeout(timeoutId);
  }, [demoStep, isPlaying]);


  const stats = {
    atRisk: 18,
    nonCompliant: 7,
    activeContracts: 42,
    expiringContracts: 3
  };

  const insuranceItems = [
    { id: 1, name: "SkyHigh Construction", type: "GL Insurance", status: "Expired", date: "2 days overdue", action: "Send Reminder" },
    { id: 2, name: "Valley Logistics", type: "Workers Comp", status: "At Risk", date: "Expires tomorrow", action: "Send Reminder" },
    { id: 3, name: "Apex Maintenance", type: "Auto Liability", status: "Missing", date: "Required immediately", action: "Request COI" },
    { id: 4, name: "BlueWater Cleaning", type: "Professional Liability", status: "Active", date: "Renewed yesterday", action: "View COI" },
    { id: 5, name: "Swift Security", type: "Cyber Insurance", status: "At Risk", date: "Expires in 5 days", action: "Send Reminder" },
    { id: 6, name: "Urban Electric", type: "Excess Liability", status: "Active", date: "Valid until Jun 2025", action: "View COI" },
  ];

  const contractItems = [
    { id: 7, name: "TechPro Solutions", type: "Service Agreement", status: "Expiring", date: "Milestone due soon", action: "View Details" },
    { id: 8, name: "Modern Supplies Inc", type: "Vendor Agreement", status: "Active", date: "Valid until Dec 2024", action: "View Details" },
    { id: 9, name: "Global Systems", type: "SaaS Agreement", status: "At Risk", date: "Renewal negotiation", action: "Review Terms" },
    { id: 10, name: "Office Partners", type: "Supply Contract", status: "Expired", date: "Ended last week", action: "Archive" },
    { id: 11, name: "QuickShip Delivery", type: "Logistics MSA", status: "Active", date: "Auto-renews in 30 days", action: "View Details" },
    { id: 12, name: "SecurityFirst", type: "DPA", status: "Missing", date: "Signature pending", action: "Resend" },
  ];

  let currentItems = activeTab === 'insurance' ? insuranceItems : contractItems;

  if (filterRisk) {
    currentItems = currentItems.filter(item => 
      ['Expired', 'Missing', 'At Risk', 'Expiring'].includes(item.status)
    );
  }

  // Trigger for the row action
  // Step 5 corresponds to index 5 in the script.
  const triggerRowAction = demoStep === 6; // Because demoStep increments AFTER action. Wait, script index 5 runs, then increments to 6. So when step is 6, the action just happened.
  // Actually, we want to pass a prop "simulateClick" to the first row when we are at that specific moment.
  
  return (
    <div className="flex h-[700px] w-full max-w-[1280px] p-4 gap-4 relative select-none">
      
      {/* CURSOR OVERLAY */}
      <motion.div 
        className="absolute z-50 pointer-events-none drop-shadow-xl"
        animate={{ 
          left: cursorPos.x, 
          top: cursorPos.y, 
          opacity: cursorPos.opacity 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 80, 
          damping: 25,
          opacity: { duration: 0.2 }
        }}
      >
        <MousePointer2 
          className="w-6 h-6 text-slate-900 fill-slate-900 stroke-white" 
          style={{ 
            transform: cursorPos.click ? 'scale(0.8) translate(2px, 2px)' : 'scale(1)',
            transition: 'transform 0.1s'
          }}
        />
        <div className={`absolute top-0 left-0 w-8 h-8 rounded-full bg-blue-500/30 -translate-x-1/4 -translate-y-1/4 transition-all duration-300 ${cursorPos.click ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`} />
      </motion.div>

      {/* SIDEBAR */}
      <div className="flex w-56 flex-col bg-[#3A4F6A] rounded-2xl flex-shrink-0 shadow-xl shadow-blue-900/10 text-white">
        <div className="h-16 flex items-center px-6">
           <div className="flex items-center">
             <svg width="100" height="21" viewBox="0 0 3000 630" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M598.514 129.609L549.807 165.933C523.39 131.26 491.538 105.05 454.251 87.3005C416.965 69.5515 376.032 60.677 331.453 60.677C282.471 60.677 237.204 72.3721 195.652 95.7623C154.1 119.152 121.835 150.592 98.858 190.08C75.8805 229.568 64.3918 274.078 64.3918 323.61C64.3918 398.184 89.9834 458.242 141.167 503.784C192.35 549.326 256.879 572.097 334.755 572.097C420.611 572.097 492.295 538.525 549.807 471.381L598.514 508.118C567.969 546.918 529.857 576.913 484.177 598.101C438.497 619.29 387.589 629.884 331.453 629.884C224.133 629.884 139.516 594.249 77.6004 522.977C25.8668 462.713 0 394.469 0 318.244C0 228.811 31.4392 153.412 94.3175 92.0474C157.196 30.6825 235.828 6.10352e-05 330.215 6.10352e-05C387.452 6.10352e-05 439.117 11.3512 485.209 34.0534C531.302 56.7557 569.07 88.6077 598.514 129.609ZM925.014 150.248C994.634 150.248 1052.42 175.427 1098.38 225.784C1139.93 272.014 1160.7 326.637 1160.7 389.653C1160.7 452.669 1138.69 507.774 1094.66 554.967C1050.63 602.16 994.084 625.757 925.014 625.757C855.669 625.757 799.051 602.16 755.16 554.967C711.268 507.774 689.323 452.669 689.323 389.653C689.323 326.912 710.099 272.427 751.651 226.197C797.606 175.564 855.393 150.248 925.014 150.248ZM925.014 207.21C876.857 207.21 835.443 225.096 800.77 260.87C766.098 296.643 748.762 339.846 748.762 390.479C748.762 423.225 756.673 453.839 772.496 482.32C788.319 510.801 809.714 532.678 836.681 547.95C863.649 563.222 893.093 570.859 925.014 570.859C957.485 570.859 987.135 563.222 1013.97 547.95C1040.8 532.678 1062.05 510.801 1077.74 482.32C1093.42 453.839 1101.27 423.225 1101.27 390.479C1101.27 339.846 1083.93 296.643 1049.26 260.87C1014.58 225.096 973.17 207.21 925.014 207.21ZM1225.1 173.363H1287.01L1438.5 502.752L1588.75 173.363H1651.07L1443.86 626.17H1433.54L1225.1 173.363ZM2120.8 464.364L2169.51 490.369C2153.83 522.014 2135.39 547.468 2114.2 566.731C2093.01 585.993 2069.21 600.647 2042.79 610.691C2016.37 620.735 1986.52 625.757 1953.22 625.757C1879.47 625.757 1821.82 601.61 1780.27 553.316C1738.72 505.022 1717.94 450.468 1717.94 389.653C1717.94 332.141 1735.55 280.958 1770.78 236.104C1815.36 178.866 1875.21 150.248 1950.33 150.248C2027.11 150.248 2088.61 179.554 2134.84 238.167C2167.58 279.444 2184.09 330.903 2184.37 392.543H1777.79C1778.89 445.377 1795.68 488.649 1828.15 522.358C1860.62 556.068 1900.66 572.923 1948.27 572.923C1971.38 572.923 1993.81 568.864 2015.55 560.746C2037.29 552.628 2055.79 541.965 2071.07 528.756C2086.34 515.548 2102.92 494.084 2120.8 464.364ZM2120.8 342.598C2113.1 311.503 2101.82 286.668 2086.96 268.093C2072.1 249.518 2052.42 234.521 2027.93 223.101C2003.44 211.681 1977.71 205.971 1950.74 205.971C1906.44 205.971 1868.33 220.281 1836.41 248.899C1813.29 269.813 1795.82 301.046 1783.98 342.598H2120.8ZM2270.64 418.134V363.649C2275.04 336.406 2281.37 314.254 2289.63 297.193C2308.89 249.862 2334.76 215.19 2367.23 193.176C2399.7 171.161 2426.66 160.154 2448.13 160.154C2464.09 160.154 2481.15 165.383 2499.31 175.839L2469.18 224.546C2443.59 215.19 2418.2 222.757 2393.02 247.248C2367.85 271.739 2350.44 298.432 2340.81 327.325C2333.65 352.917 2330.08 400.936 2330.08 471.381V624.518H2270.64V418.134ZM2762.66 150.248C2832.28 150.248 2890.07 175.427 2936.02 225.784C2978.4 271.739 2999.59 326.362 2999.59 389.653C3000.14 545.955 3000.14 625.344 2999.59 627.821H2938.08V525.041C2905.89 585.03 2847.41 618.602 2762.66 625.757C2693.31 625.757 2636.7 602.16 2592.8 554.967C2548.91 507.774 2526.97 452.669 2526.97 389.653C2526.97 326.912 2547.74 272.427 2589.3 226.197C2635.25 175.564 2693.04 150.248 2762.66 150.248ZM2762.66 207.21C2714.5 207.21 2673.09 225.096 2638.42 260.87C2603.74 296.643 2586.41 339.846 2586.41 390.479C2586.41 423.225 2595.28 454.733 2613.03 485.003C2630.78 515.272 2660.84 540.864 2703.22 561.778C2809.44 585.443 2884.98 537.149 2929.83 416.896C2932.31 378.371 2928.18 341.497 2917.45 306.274C2909.74 290.314 2899.15 275.179 2885.66 260.87C2851.82 225.096 2810.81 207.21 2762.66 207.21Z" fill="currentColor"/>
             </svg>
           </div>
        </div>
        <div className="p-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Users} label="Vendors" />
          <NavItem icon={FileText} label="Contracts" />
          <NavItem icon={Shield} label="Insurance" />
          <NavItem icon={FileCheck} label="Compliance" />
          <NavItem icon={BarChart3} label="Reports" />
        </div>
        <div className="mt-auto p-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold border border-white/20">AD</div>
             <div className="text-sm font-medium text-white">Admin</div>
           </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100/50 relative">
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-slate-50">
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#3A4F6A] text-white text-xs font-medium rounded-md shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              Add Vendor
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <Search className="w-5 h-5 text-slate-400" />
            <Bell className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        
        {/* Action Banner */}
        <div className="px-6 pt-6 -mb-2">
          <AnimatePresence mode="wait">
            {!filterRisk ? (
              <motion.div 
                key="alert"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative p-5 rounded-2xl bg-white flex items-center justify-between overflow-hidden group shadow-sm shadow-red-100/50 border border-red-100/30 transition-all duration-200 ${cursorPos.click && demoStep === 2 ? 'scale-[0.99] bg-slate-50' : ''}`}
              >
                 <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        7 vendors are non-compliant
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Resolve this now to reduce exposure.
                      </p>
                    </div>
                 </div>
                 <button 
                   className="text-xs font-semibold bg-red-50 text-red-700 px-4 py-2 rounded-xl transition-colors"
                 >
                   Resolve issue →
                 </button>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative p-5 rounded-2xl bg-[#f0fdf4] flex items-center justify-between overflow-hidden border border-[#dcfce7]"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#16a34a]">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#166534]">
                        Focusing on critical items
                      </p>
                      <p className="text-xs text-[#15803d] mt-0.5">
                        Showing expired and at-risk vendors.
                      </p>
                    </div>
                 </div>
                 <button 
                   className="text-xs font-semibold bg-white border border-[#bbf7d0] text-[#166534] px-4 py-2 rounded-xl"
                 >
                   Show all
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-4 gap-4 flex-shrink-0">
            <KpiCard 
              label="Compliance Risk" 
              value={stats.atRisk} 
              change=""
              compact={true}
              percentageColor="#d97706"
              bgTint="rgba(217, 119, 6, 0.03)"
              borderColor="rgba(217, 119, 6, 0.2)"
              icon={Shield}
              trend="neutral"
            />
            <KpiCard 
              label="Non-Compliant" 
              value={stats.nonCompliant} 
              change=""
              compact={true}
              percentageColor="#dc2626"
              bgTint="rgba(220, 38, 38, 0.03)"
              borderColor="rgba(220, 38, 38, 0.2)"
              icon={AlertTriangle}
              trend="neutral"
            />
            <KpiCard 
              label="Active Contracts" 
              value={stats.activeContracts} 
              change=""
              compact={true}
              percentageColor="#3A4F6A"
              bgTint="rgba(58, 79, 106, 0.03)"
              borderColor="rgba(58, 79, 106, 0.2)"
              trend="neutral"
              icon={FileText}
            />
            <KpiCard 
              label="Upcoming Milestones" 
              value={stats.expiringContracts} 
              change=""
              compact={true}
              trend="neutral" 
              percentageColor="#d97706"
              bgTint="#ffffff"
              borderColor="#e7e5e4"
              icon={Calendar}
            />
          </div>

          {/* COMBINED ROW: Risk & Table */}
          <div className="flex-1 min-h-0">
             
             {/* Attention Items Table */}
             <div id="attention-items-visual" className="h-full bg-white rounded-2xl overflow-hidden flex flex-col border border-slate-100">
                <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <div className="flex items-center gap-4 mb-1">
                       <h3 className="font-bold text-slate-900 text-base">Attention Items</h3>
                       {/* Tabs simulation */}
                       <div className="flex bg-[#f5f5f4] p-1 rounded-lg scale-90 origin-left">
                          <button 
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                              activeTab === 'insurance' 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-slate-500'
                            }`}
                          >
                            Insurance
                          </button>
                          <button 
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                              activeTab === 'contracts' 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-slate-500'
                            }`}
                          >
                            Contracts
                          </button>
                       </div>
                    </div>
                    <p className="text-xs text-slate-500">Items that could expose your organization to risk if left unresolved</p>
                  </div>
                  <Filter className={`w-4 h-4 transition-colors ${filterRisk ? 'text-[#3A4F6A]' : 'text-slate-400'}`} />
                </div>
                
                <div className="flex-1 overflow-hidden">
                   {/* Header Row */}
                   <div className="grid grid-cols-12 px-6 py-3 border-b border-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                      <div className="col-span-4">Vendor / Item</div>
                      <div className="col-span-3 text-center">Status</div>
                      <div className="col-span-3">Deadline</div>
                      <div className="col-span-2 text-right">Action</div>
                   </div>

                   <div className="overflow-y-auto h-full pb-10 custom-scrollbar">
                     <AnimatePresence mode="popLayout">
                       {currentItems.slice(0, 6).map((item, index) => (
                         <VendorRow 
                           key={item.id}
                           {...item}
                           isFirst={index === 0}
                           triggerAction={index === 0 && triggerRowAction}
                           onAction={(msg: string) => showToast(msg, "success")}
                         />
                       ))}
                     </AnimatePresence>
                     {currentItems.length === 0 && (
                       <div className="py-12 text-center text-slate-400 text-sm">
                         No items found matching your filter.
                       </div>
                     )}
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl shadow-slate-900/20"
          >
            {toast.type === 'success' ? (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Bell className="w-3 h-3 text-white" />
              </div>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur text-[10px] text-slate-400 px-2 py-1 rounded border border-slate-100 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Live Preview
      </div>

    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/15 text-white' : 'text-white hover:bg-white/5'}`}>
      <Icon className="w-4 h-4" />
      {label}
    </div>
  );
}

const VendorRow = forwardRef(({ name, type, status, date, action, onAction, triggerAction, isFirst }: any, ref: any) => {
  const [actionState, setActionState] = useState<'idle' | 'loading' | 'success'>('idle');

  // React to the demo trigger
  useEffect(() => {
    if (triggerAction && actionState === 'idle') {
      handleAction();
    }
  }, [triggerAction]);

  let style = { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };

  if (status === "Verified" || status === "Active") {
    style = { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
  } else if (status === "Expired" || status === "Missing") {
    style = { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
  } else if (status === "At Risk" || status === "Expiring") {
    style = { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
  }

  const handleAction = () => {
    if (actionState !== 'idle') return;

    if (action === "Send Reminder" || action === "Resend") {
      setActionState('loading');
      setTimeout(() => {
        setActionState('success');
        onAction(`Reminder sent to ${name}`);
        // Reset after a while
        setTimeout(() => setActionState('idle'), 3000);
      }, 1200);
    } else {
      onAction(`Viewing details for ${name}...`);
    }
  };

  return (
    <motion.div 
      ref={ref}
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="px-6 py-3 grid grid-cols-12 items-center group hover:bg-[#fafaf9] transition-colors duration-200 border-b border-slate-50 last:border-0"
    >
       <div className="col-span-4 pr-4">
         <div className="flex items-center gap-3">
            {/* Added Avatar to match Dashboard.tsx */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(name)}`}>
              {getInitials(name)}
            </div>
            <div className="overflow-hidden">
               <div className="font-semibold text-slate-900 text-sm truncate">{name}</div>
               <div className="text-xs text-slate-500 truncate">{type}</div>
            </div>
         </div>
       </div>

       <div className="col-span-3 flex justify-center">
         <div 
           className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium w-fit min-w-[90px]"
           style={{ backgroundColor: style.bg, color: style.text }}
         >
           {status}
         </div>
       </div>

       <div className="col-span-3">
         <div className="text-sm text-slate-700 font-medium">{date}</div>
       </div>

       <div className="col-span-2 text-right">
         <button 
           className={`group/btn relative inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border-0 shadow-none ${
             actionState === 'success' 
              ? 'text-green-600 bg-green-50' 
              : 'text-slate-500 hover:text-[#3A4F6A] hover:bg-[#3A4F6A]/10'
           } ${triggerAction && actionState === 'idle' ? 'scale-95 bg-slate-100' : ''}`} // Visual press effect during demo
         >
            {actionState === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : actionState === 'success' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Sent</span>
              </>
            ) : action === "Send Reminder" || action === "Resend" ? (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{action === "Resend" ? "Resend" : "Send"}</span>
              </>
            ) : (
               <>
                 <span>View</span>
                 <ArrowUpRight className="w-3.5 h-3.5" />
               </>
            )}
         </button>
       </div>
    </motion.div>
  );
});
