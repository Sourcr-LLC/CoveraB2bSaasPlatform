import { LayoutDashboard, Users, FileText, Shield, FileCheck, AlertCircle, TrendingUp, Settings, CreditCard, LogOut } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="w-full bg-[#fafaf9] rounded-lg overflow-hidden shadow-sm" style={{ fontFamily: 'Red Hat Display, system-ui, sans-serif' }}>
      {/* Main Layout */}
      <div className="flex h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px]">
        {/* Left Sidebar - Scaled proportionally */}
        <div className="flex w-[70px] sm:w-[100px] md:w-[130px] lg:w-[160px] bg-[#f5f5f4] border-r flex-col" style={{ borderColor: '#e7e5e4' }}>
          {/* Logo */}
          <div className="px-1.5 sm:px-2 md:px-2.5 lg:px-3 pt-1.5 sm:pt-2 md:pt-2.5 lg:pt-3 pb-1.5 sm:pb-2 md:pb-2.5 lg:pb-3">
            <svg className="w-8 sm:w-11 md:w-14 lg:w-16 h-2 sm:h-2.5 md:h-3.5 lg:h-4" viewBox="0 0 3000 630" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M598.514 129.609L549.807 165.933C523.39 131.26 491.538 105.05 454.251 87.3005C416.965 69.5515 376.032 60.677 331.453 60.677C282.471 60.677 237.204 72.3721 195.652 95.7623C154.1 119.152 121.835 150.592 98.858 190.08C75.8805 229.568 64.3918 274.078 64.3918 323.61C64.3918 398.184 89.9834 458.242 141.167 503.784C192.35 549.326 256.879 572.097 334.755 572.097C420.611 572.097 492.295 538.525 549.807 471.381L598.514 508.118C567.969 546.918 529.857 576.913 484.177 598.101C438.497 619.29 387.589 629.884 331.453 629.884C224.133 629.884 139.516 594.249 77.6004 522.977C25.8668 462.713 0 394.469 0 318.244C0 228.811 31.4392 153.412 94.3175 92.0474C157.196 30.6825 235.828 6.10352e-05 330.215 6.10352e-05C387.452 6.10352e-05 439.117 11.3512 485.209 34.0534C531.302 56.7557 569.07 88.6077 598.514 129.609ZM925.014 150.248C994.634 150.248 1052.42 175.427 1098.38 225.784C1139.93 272.014 1160.7 326.637 1160.7 389.653C1160.7 452.669 1138.69 507.774 1094.66 554.967C1050.63 602.16 994.084 625.757 925.014 625.757C855.669 625.757 799.051 602.16 755.16 554.967C711.268 507.774 689.323 452.669 689.323 389.653C689.323 326.912 710.099 272.427 751.651 226.197C797.606 175.564 855.393 150.248 925.014 150.248ZM925.014 207.21C876.857 207.21 835.443 225.096 800.77 260.87C766.098 296.643 748.762 339.846 748.762 390.479C748.762 423.225 756.673 453.839 772.496 482.32C788.319 510.801 809.714 532.678 836.681 547.95C863.649 563.222 893.093 570.859 925.014 570.859C957.485 570.859 987.135 563.222 1013.97 547.95C1040.8 532.678 1062.05 510.801 1077.74 482.32C1093.42 453.839 1101.27 423.225 1101.27 390.479C1101.27 339.846 1083.93 296.643 1049.26 260.87C1014.58 225.096 973.17 207.21 925.014 207.21ZM1225.1 173.363H1287.01L1438.5 502.752L1588.75 173.363H1651.07L1443.86 626.17H1433.54L1225.1 173.363ZM2120.8 464.364L2169.51 490.369C2153.83 522.014 2135.39 547.468 2114.2 566.731C2093.01 585.993 2069.21 600.647 2042.79 610.691C2016.37 620.735 1986.52 625.757 1953.22 625.757C1879.47 625.757 1821.82 601.61 1780.27 553.316C1738.72 505.022 1717.94 450.468 1717.94 389.653C1717.94 332.141 1735.55 280.958 1770.78 236.104C1815.36 178.866 1875.21 150.248 1950.33 150.248C2027.11 150.248 2088.61 179.554 2134.84 238.167C2167.58 279.444 2184.09 330.903 2184.37 392.543H1777.79C1778.89 445.377 1795.68 488.649 1828.15 522.358C1860.62 556.068 1900.66 572.923 1948.27 572.923C1971.38 572.923 1993.81 568.864 2015.55 560.746C2037.29 552.628 2055.79 541.965 2071.07 528.756C2086.34 515.548 2102.92 494.084 2120.8 464.364ZM2120.8 342.598C2113.1 311.503 2101.82 286.668 2086.96 268.093C2072.1 249.518 2052.42 234.521 2027.93 223.101C2003.44 211.681 1977.71 205.971 1950.74 205.971C1906.44 205.971 1868.33 220.281 1836.41 248.899C1813.29 269.813 1795.82 301.046 1783.98 342.598H2120.8ZM2270.64 418.134V363.649C2275.04 336.406 2281.37 314.254 2289.63 297.193C2308.89 249.862 2334.76 215.19 2367.23 193.176C2399.7 171.161 2426.66 160.154 2448.13 160.154C2464.09 160.154 2481.15 165.383 2499.31 175.839L2469.18 224.546C2443.59 215.19 2418.2 222.757 2393.02 247.248C2367.85 271.739 2350.44 298.432 2340.81 327.325C2333.65 352.917 2330.08 400.936 2330.08 471.381V624.518H2270.64V418.134ZM2762.66 150.248C2832.28 150.248 2890.07 175.427 2936.02 225.784C2978.4 271.739 2999.59 326.362 2999.59 389.653C3000.14 545.955 3000.14 625.344 2999.59 627.821H2938.08V525.041C2905.89 585.03 2847.41 618.602 2762.66 625.757C2693.31 625.757 2636.7 602.16 2592.8 554.967C2548.91 507.774 2526.97 452.669 2526.97 389.653C2526.97 326.912 2547.74 272.427 2589.3 226.197C2635.25 175.564 2693.04 150.248 2762.66 150.248ZM2762.66 207.21C2714.5 207.21 2673.09 225.096 2638.42 260.87C2603.74 296.643 2586.41 339.846 2586.41 390.479C2586.41 423.225 2595.28 454.733 2613.03 485.003C2630.78 515.272 2660.84 540.864 2703.22 561.778C2809.44 585.443 2884.98 537.149 2929.83 416.896C2932.31 378.371 2928.18 341.497 2917.45 306.274C2909.74 290.314 2899.15 275.179 2885.66 260.87C2851.82 225.096 2810.81 207.21 2762.66 207.21Z" fill="#1c1917"/>
            </svg>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-1 sm:px-1.5 md:px-1.5 lg:px-2 space-y-0.5">
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium bg-white" style={{ color: '#1c1917' }}>
              <LayoutDashboard className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Dashboard</span>
            </div>
            
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <Users className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Vendors</span>
            </div>
            
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <Shield className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Insurance</span>
            </div>
            
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <FileText className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Contracts</span>
            </div>
            
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <FileCheck className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Compliance</span>
            </div>
            
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <AlertCircle className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Alerts</span>
            </div>
            
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <TrendingUp className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Reports</span>
            </div>
          </nav>
          
          {/* Bottom section */}
          <div className="p-1 sm:p-1.5 md:p-1.5 lg:p-2 border-t space-y-0.5" style={{ borderColor: '#e7e5e4' }}>
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <CreditCard className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Billing</span>
            </div>
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <Settings className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Settings</span>
            </div>
            <div className="px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-normal hover:bg-white/50 transition-colors cursor-pointer" style={{ color: '#78716c' }}>
              <LogOut className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-2 sm:h-2.5 md:h-3 lg:h-3.5" strokeWidth={2} />
              <span>Sign out</span>
            </div>
          </div>
          
          {/* User profile */}
          <div className="p-1.5 sm:p-2 md:p-2.5 lg:p-3 border-t flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2" style={{ borderColor: '#e7e5e4' }}>
            <div className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 rounded-full flex items-center justify-center text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold" style={{ backgroundColor: '#1c1917', color: 'white' }}>
              TL
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold truncate" style={{ color: '#1c1917' }}>Taylor, LLC</div>
              <div className="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] truncate" style={{ color: '#a8a29e' }}>Enterprise</div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 p-1.5 sm:p-2.5 md:p-3 lg:p-4 overflow-hidden">
            {/* Header */}
            <div className="mb-1 sm:mb-1.5 md:mb-2 lg:mb-2.5">
              <h1 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold mb-0.5" style={{ color: '#1c1917' }}>Dashboard</h1>
              <p className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>Real-time overview of your vendor compliance status</p>
            </div>
            
            {/* Stats Cards - Always 4 columns */}
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
              {/* Total Vendors */}
              <div className="rounded-lg p-1 sm:p-1.5 md:p-2 lg:p-2.5 bg-white border" style={{ borderColor: '#e7e5e4' }}>
                <div className="text-[5px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-medium mb-0.5 sm:mb-0.5 md:mb-0.5 lg:mb-1 uppercase tracking-wider" style={{ color: '#78716c' }}>TOTAL VENDORS</div>
                <div className="flex items-baseline gap-0.5 sm:gap-0.5 md:gap-1 lg:gap-1 mb-0.5">
                  <div className="text-xs sm:text-base md:text-xl lg:text-2xl font-semibold" style={{ color: '#1c1917' }}>12</div>
                  <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>of 250</div>
                </div>
                <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>Active vendors</div>
              </div>
              
              {/* Compliant */}
              <div className="rounded-lg p-1 sm:p-1.5 md:p-2 lg:p-2.5 bg-white border" style={{ borderColor: '#e7e5e4' }}>
                <div className="text-[5px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-medium mb-0.5 sm:mb-0.5 md:mb-0.5 lg:mb-1 uppercase tracking-wider" style={{ color: '#78716c' }}>COMPLIANT</div>
                <div className="flex items-baseline gap-0.5 sm:gap-0.5 md:gap-1 lg:gap-1 mb-0.5">
                  <div className="text-xs sm:text-base md:text-xl lg:text-2xl font-semibold" style={{ color: '#1c1917' }}>6</div>
                  <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>vendors</div>
                </div>
                <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>All requirements met</div>
              </div>
              
              {/* At Risk */}
              <div className="rounded-lg p-1 sm:p-1.5 md:p-2 lg:p-2.5 bg-white border" style={{ borderColor: '#e7e5e4' }}>
                <div className="text-[5px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-medium mb-0.5 sm:mb-0.5 md:mb-0.5 lg:mb-1 uppercase tracking-wider" style={{ color: '#78716c' }}>AT RISK</div>
                <div className="flex items-baseline gap-0.5 sm:gap-0.5 md:gap-1 lg:gap-1 mb-0.5">
                  <div className="text-xs sm:text-base md:text-xl lg:text-2xl font-semibold" style={{ color: '#1c1917' }}>3</div>
                  <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>vendors</div>
                </div>
                <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>Expiring within 30 days</div>
              </div>
              
              {/* Non-Compliant */}
              <div className="rounded-lg p-1 sm:p-1.5 md:p-2 lg:p-2.5 bg-white border" style={{ borderColor: '#e7e5e4' }}>
                <div className="text-[5px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-medium mb-0.5 sm:mb-0.5 md:mb-0.5 lg:mb-1 uppercase tracking-wider whitespace-nowrap" style={{ color: '#78716c' }}>NON-COMPLIANT</div>
                <div className="flex items-baseline gap-0.5 sm:gap-0.5 md:gap-1 lg:gap-1 mb-0.5">
                  <div className="text-xs sm:text-base md:text-xl lg:text-2xl font-semibold" style={{ color: '#1c1917' }}>3</div>
                  <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>vendors</div>
                </div>
                <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px]" style={{ color: '#a8a29e' }}>Action required</div>
              </div>
            </div>
            
            {/* Main Content Grid - Always 3 column layout */}
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2 lg:gap-3">
              {/* High-risk vendors table */}
              <div className="col-span-2 rounded-lg bg-white border" style={{ borderColor: '#e7e5e4' }}>
                <div className="p-1 sm:p-1.5 md:p-2 lg:p-2.5 border-b" style={{ borderColor: '#e7e5e4' }}>
                  <h3 className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold mb-0.5" style={{ color: '#1c1917' }}>High-risk vendors</h3>
                  <p className="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px]" style={{ color: '#a8a29e' }}>Vendors requiring immediate attention</p>
                </div>
                
                <div className="overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1.5 lg:py-2 text-[5px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-medium uppercase tracking-wider" style={{ color: '#78716c', backgroundColor: '#fafaf9' }}>
                    <div className="col-span-4">VENDOR</div>
                    <div className="col-span-3">STATUS</div>
                    <div className="col-span-3">EXPIRY</div>
                    <div className="col-span-2">ACTION</div>
                  </div>
                  
                  {/* Table Rows */}
                  {[
                    { vendor: 'SafeGuard Security Systems', status: 'At risk', statusColor: '#f59e0b', expiry: '1/25/2026', days: '19 days' },
                    { vendor: 'GreenScapes Landscaping', status: 'At risk', statusColor: '#f59e0b', expiry: '1/22/2026', days: '16 days' },
                    { vendor: 'Rapid Delivery Logistics', status: 'Non-compliant', statusColor: '#ef4444', expiry: '12/18/2025', days: '19 days overdue' },
                    { vendor: 'Elite HVAC Services', status: 'Non-compliant', statusColor: '#ef4444', expiry: '12/3/2025', days: '34 days overdue' },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-12 gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 px-1 sm:px-1.5 md:px-2 lg:px-2.5 py-0.5 sm:py-1 md:py-1.5 lg:py-2 border-t" style={{ borderColor: '#f5f5f4' }}>
                      <div className="col-span-4 text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium truncate" style={{ color: '#1c1917' }}>{row.vendor}</div>
                      <div className="col-span-3">
                        <span className="inline-flex items-center px-0.5 sm:px-1 md:px-1.5 lg:px-2 py-0.5 rounded-full text-[5px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-medium whitespace-nowrap" style={{ backgroundColor: `${row.statusColor}15`, color: row.statusColor }}>
                          {row.status}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium" style={{ color: '#1c1917' }}>{row.expiry}</div>
                        <div className="text-[5px] sm:text-[7px] md:text-[8px] lg:text-[9px]" style={{ color: '#a8a29e' }}>{row.days}</div>
                      </div>
                      <div className="col-span-2">
                        <button className="text-[5px] sm:text-[7px] md:text-[8px] lg:text-[10px] font-medium underline hover:no-underline" style={{ color: '#3A4F6A' }}>Send reminder</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:space-y-2.5">
                {/* Upcoming expirations */}
                <div className="rounded-lg bg-white border p-1 sm:p-1.5 md:p-2 lg:p-2.5" style={{ borderColor: '#e7e5e4' }}>
                  <h3 className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold mb-1 sm:mb-1.5 md:mb-2 lg:mb-2.5" style={{ color: '#1c1917' }}>Upcoming expirations</h3>
                  <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5 lg:space-y-2">
                    {[
                      { title: 'Within 7 days', count: '0', color: '#ef4444' },
                      { title: 'Within 30 days', count: '3', color: '#f59e0b' },
                      { title: 'Within 60 days', count: '3', color: '#78716c' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2">
                          <div className="w-1 sm:w-1 md:w-1.5 lg:w-1.5 h-1 sm:h-1 md:h-1.5 lg:h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium" style={{ color: '#78716c' }}>{item.title}</span>
                        </div>
                        <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold" style={{ color: '#1c1917' }}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-1 sm:mt-1.5 md:mt-2 lg:mt-3 text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium text-center py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded hover:bg-gray-50 transition-colors" style={{ color: '#3A4F6A' }}>
                    View all expirations →
                  </button>
                </div>
                
                {/* Quick actions */}
                <div className="rounded-lg bg-white border p-1 sm:p-1.5 md:p-2 lg:p-2.5" style={{ borderColor: '#e7e5e4' }}>
                  <h3 className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold mb-1 sm:mb-1.5 md:mb-1.5 lg:mb-2" style={{ color: '#1c1917' }}>Quick actions</h3>
                  <div className="space-y-0.5 sm:space-y-1 md:space-y-1 lg:space-y-1.5">
                    <button className="w-full px-1 sm:px-2 md:px-2.5 lg:px-3 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: '#3A4F6A' }}>
                      Add new vendor
                    </button>
                    <button className="w-full px-1 sm:px-2 md:px-2.5 lg:px-3 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium bg-white border transition-all hover:bg-gray-50" style={{ color: '#1c1917', borderColor: '#e7e5e4' }}>
                      Upload COI
                    </button>
                    <button className="w-full px-1 sm:px-2 md:px-2.5 lg:px-3 py-0.5 sm:py-1 md:py-1 lg:py-1.5 rounded text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium bg-white border transition-all hover:bg-gray-50" style={{ color: '#1c1917', borderColor: '#e7e5e4' }}>
                      Export compliance report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
