import { 
  Shield, LayoutDashboard, Users, FileCheck, Search, Bell, Filter,
  CheckCircle2, AlertCircle, Clock, TrendingDown, FileText, Calendar, AlertTriangle, BarChart3
} from 'lucide-react';
import { KpiCard } from '../dashboard/KpiCard';

export default function InteractiveHeroVisual() {
  return (
    <div className="relative w-full max-w-6xl mx-auto" style={{ fontFamily: 'Red Hat Display, sans-serif' }}>
      <div className="relative bg-white overflow-hidden">
        <DashboardContent />
      </div>
    </div>
  );
}

function DashboardContent() {
  // Realistic stats to show value proposition
  const stats = {
    atRisk: 18,
    nonCompliant: 7,
    activeContracts: 42,
    expiringContracts: 3
  };

  return (
    <div className="flex h-[700px] bg-[#fafaf9] min-w-[1024px]">
      
      {/* SIDEBAR */}
      <div className="flex w-64 flex-col bg-[#3A4F6A] border-r border-white/10 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
           {/* LOGO */}
           <svg width="100" height="22" viewBox="0 0 800 168" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-[110px] h-[24px]">
             <path d="M159.604 34.5625L146.615 44.2488C139.571 35.0027 131.077 28.0132 121.134 23.2801C111.191 18.547 100.275 16.1805 88.3874 16.1805C75.3256 16.1805 63.2544 19.2992 52.1739 25.5366C41.0934 31.774 32.4894 40.1578 26.3621 50.6879C20.2348 61.2181 17.1712 73.0875 17.1711 86.2961C17.1711 106.182 23.9956 122.198 37.6444 134.342C51.2933 146.487 68.5012 152.559 89.268 152.559C112.163 152.559 131.279 143.607 146.615 125.702L159.604 135.498C151.458 145.845 141.295 153.843 129.114 159.494C116.933 165.144 103.357 167.969 88.3874 167.969C59.7688 167.969 37.2042 158.466 20.6934 139.461C6.89781 123.39 0 105.192 0 84.8652C0 61.0163 8.38378 40.9099 25.1513 24.5459C41.9189 8.18198 62.8875 0 88.0572 0C103.32 0 117.098 3.02697 129.389 9.0809C141.68 15.1348 151.752 23.6287 159.604 34.5625ZM246.67 40.066C265.236 40.066 280.646 46.7804 292.9 60.2091C303.981 72.5371 309.521 87.1033 309.521 103.908C309.521 120.712 303.651 135.406 291.91 147.991C280.169 160.576 265.089 166.868 246.67 166.868C228.178 166.868 213.08 160.576 201.376 147.991C189.672 135.406 183.819 120.712 183.819 103.908C183.819 87.1766 189.36 72.6472 200.44 60.3192C212.695 46.8171 228.105 40.066 246.67 40.066ZM246.67 55.2559C233.829 55.2559 222.785 60.0257 213.539 69.5652C204.293 79.1047 199.67 90.6255 199.67 104.128C199.67 112.86 201.779 121.024 205.999 128.619C210.218 136.214 215.924 142.047 223.115 146.12C230.306 150.193 238.158 152.229 246.67 152.229C255.329 152.229 263.236 150.193 270.391 146.12C277.545 142.047 283.214 136.214 287.397 128.619C291.579 121.024 293.671 112.86 293.671 104.128C293.671 90.6255 289.048 79.1047 279.802 69.5652C270.556 60.0257 259.512 55.2559 246.67 55.2559ZM326.692 46.23H343.203L383.599 134.067L423.665 46.23H440.286L385.03 166.979H382.278L326.692 46.23ZM565.548 123.83L578.536 130.765C574.353 139.204 569.437 145.992 563.786 151.128C558.136 156.265 551.789 160.172 544.744 162.851C537.699 165.529 529.738 166.868 520.859 166.868C501.192 166.868 485.819 160.429 474.739 147.551C463.658 134.673 458.118 120.125 458.118 103.908C458.118 88.5709 462.814 74.922 472.207 62.9609C484.095 47.6977 500.055 40.066 520.088 40.066C540.561 40.066 556.962 47.8811 569.29 63.5113C578.022 74.5184 582.425 88.2407 582.499 104.678H474.078C474.372 118.767 478.848 130.306 487.507 139.296C496.166 148.285 506.843 152.779 519.538 152.779C525.702 152.779 531.682 151.697 537.479 149.532C543.276 147.367 548.211 144.524 552.284 141.002C556.357 137.479 560.778 131.756 565.548 123.83ZM565.548 91.3594C563.493 83.0673 560.484 76.4447 556.522 71.4915C552.559 66.5382 547.312 62.539 540.781 59.4937C534.251 56.4483 527.389 54.9257 520.198 54.9257C508.384 54.9257 498.22 58.7415 489.708 66.3731C483.544 71.9501 478.885 80.2788 475.729 91.3594H565.548ZM605.504 111.502V96.973C606.678 89.7083 608.365 83.8011 610.567 79.2515C615.704 66.63 622.601 57.384 631.26 51.5135C639.919 45.643 647.111 42.7078 652.834 42.7078C657.09 42.7078 661.64 44.102 666.483 46.8905L658.448 59.8789C651.624 57.384 644.854 59.402 638.14 65.9329C631.425 72.4638 626.784 79.5817 624.216 87.2867C622.308 94.1112 621.354 106.916 621.354 125.702V166.538H605.504V111.502ZM736.709 40.066C755.274 40.066 770.684 46.7804 782.939 60.2091C794.24 72.4638 799.89 87.0299 799.89 103.908C800.037 145.588 800.037 166.758 799.89 167.419H783.489V140.011C774.904 156.008 759.31 164.961 736.709 166.868C718.217 166.868 703.119 160.576 691.414 147.991C679.71 135.406 673.858 120.712 673.858 103.908C673.858 87.1766 679.398 72.6472 690.479 60.3192C702.733 46.8171 718.143 40.066 736.709 40.066ZM736.709 55.2559C723.867 55.2559 712.823 60.0257 703.577 69.5652C694.331 79.1047 689.708 90.6255 689.708 104.128C689.708 112.86 692.075 121.262 696.808 129.334C701.541 137.406 709.558 144.23 720.859 149.807C749.184 156.118 769.327 143.24 781.288 111.172C781.948 100.899 780.848 91.0658 777.986 81.6731C775.931 77.417 773.106 73.381 769.51 69.5652C760.484 60.0257 749.551 55.2559 736.709 55.2559Z" fill="currentColor"/>
           </svg>
        </div>
        <div className="p-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Users} label="Vendors" />
          <NavItem icon={FileText} label="Contracts" />
          <NavItem icon={Shield} label="Insurance" />
          <NavItem icon={FileCheck} label="Compliance" />
          <NavItem icon={BarChart3} label="Reports" />
        </div>
        <div className="mt-auto p-4 border-t border-white/10">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold">AD</div>
             <div className="text-sm font-medium text-white">Admin</div>
           </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-white">
        {/* HEADER */}
        <div className="h-16 border-b border-[#e7e5e4] flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-slate-400" />
            <Bell className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-4 gap-4">
            <KpiCard 
              label="Compliance Risk" 
              value={stats.atRisk} 
              change=""
              subtext="expiring within 30 days"
              percentageColor="#f59e0b"
              bgTint="rgba(245, 158, 11, 0.03)"
              borderColor="rgba(245, 158, 11, 0.2)"
              icon={Shield}
              trend="neutral"
            />
            <KpiCard 
              label="Non-Compliant" 
              value={stats.nonCompliant} 
              change=""
              subtext="expired policies"
              percentageColor="#ef4444"
              bgTint="rgba(239, 68, 68, 0.03)"
              borderColor="rgba(239, 68, 68, 0.2)"
              icon={AlertTriangle}
              trend="neutral"
            />
            <KpiCard 
              label="Active Contracts" 
              value={stats.activeContracts} 
              change=""
              subtext="managed agreements"
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
              subtext="contract renewals due"
              trend="neutral" 
              percentageColor="#f59e0b"
              bgTint="#ffffff"
              borderColor="#e7e5e4"
              icon={Calendar}
            />
          </div>

          {/* TABLE ROW */}
          <div className="bg-white border border-[#e7e5e4] rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#f5f5f4] flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <h3 className="font-bold text-slate-900 text-base">Attention Items</h3>
                 
                 {/* Tabs simulation */}
                 <div className="flex bg-[#f5f5f4] p-1 rounded-lg">
                    <div className="px-3 py-1.5 text-xs font-medium rounded-md bg-white text-slate-900 shadow-sm">
                      Insurance
                    </div>
                    <div className="px-3 py-1.5 text-xs font-medium rounded-md text-slate-500">
                      Contracts
                    </div>
                 </div>
              </div>
              <Filter className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="divide-y divide-[#f5f5f4]">
               {/* Header Row */}
               <div className="grid grid-cols-12 px-6 py-3 bg-[#fafaf9] text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-4">Vendor / Item</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-3">Deadline</div>
                  <div className="col-span-2 text-right">Action</div>
               </div>

               <VendorRow 
                 name="SkyHigh Construction" 
                 type="GL Insurance" 
                 status="Expired" 
                 date="2 days overdue"
                 action="Send Reminder"
               />
               <VendorRow 
                 name="Valley Logistics" 
                 type="Workers Comp" 
                 status="At Risk" 
                 date="Expires tomorrow"
                 action="Send Reminder"
               />
               <VendorRow 
                 name="TechPro Solutions" 
                 type="Service Agreement" 
                 status="Expiring" 
                 date="Milestone due soon"
                 action="View Details"
               />
               <VendorRow 
                 name="Metro Maintenance" 
                 type="W-9 Form" 
                 status="Missing" 
                 date="Action needed"
                 action="Request"
               />
            </div>
          </div>

        </div>
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

function VendorRow({ name, type, status, date, action }: any) {
  let statusColor = "bg-[#f5f5f4] text-slate-600";
  if (status === "Verified" || status === "Active") statusColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (status === "Expired" || status === "Missing") statusColor = "bg-red-50 text-red-700 border-red-100";
  if (status === "At Risk" || status === "Expiring") statusColor = "bg-orange-50 text-orange-700 border-orange-100";

  return (
    <div className="px-6 py-4 grid grid-cols-12 items-center group hover:bg-[#fafaf9] transition-colors duration-200">
       <div className="col-span-4 pr-4">
         <div className="font-semibold text-slate-900 text-sm truncate">{name}</div>
         <div className="text-xs text-slate-500 truncate">{type}</div>
       </div>

       <div className="col-span-3">
         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColor} w-fit`}>
           {(status === "At Risk" || status === "Expiring") && <Clock className="w-3 h-3 mr-1" />}
           {(status === "Expired" || status === "Missing") && <AlertCircle className="w-3 h-3 mr-1" />}
           {status}
         </div>
       </div>

       <div className="col-span-3">
         <div className="text-sm text-slate-700 font-medium">{date}</div>
       </div>

       <div className="col-span-2 text-right">
         <button className="text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:shadow-sm transition-all whitespace-nowrap">
            {action}
         </button>
       </div>
    </div>
  );
}