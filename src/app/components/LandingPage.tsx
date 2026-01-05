import { Link } from 'react-router-dom';
import { CheckCircle2, Shield, Bell, FileText, TrendingUp, ArrowRight, Menu, X, ChevronDown, Building2, Hospital, Store, Truck, MapPin, FileCheck, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import DemoModal from './DemoModal';
import ContactSalesModal from './ContactSalesModal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SEO, { SEO_CONFIGS } from './SEO';
import { analytics } from './GoogleAnalytics';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isContactSalesModalOpen, setIsContactSalesModalOpen] = useState(false);
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false);
  const [isMobileIndustriesOpen, setIsMobileIndustriesOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect screen size for testimonials
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Dropdown handlers with delay
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsIndustriesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsIndustriesOpen(false);
    }, 300);
  };

  // Testimonials data
  const testimonials = [
    {
      quote: "Before Covera, tracking vendor insurance was a full-time nightmare. Now our compliance rate is 98% and our team spends zero time chasing COIs. It's eliminated a massive liability risk.",
      author: "Jessica Martinez",
      title: "Director of Operations, Summit Properties",
      initials: "JM"
    },
    {
      quote: "We manage 200+ subcontractors across active job sites. Covera's automated reminders and vendor portal mean we never miss an expiration. Our legal team can finally sleep at night.",
      author: "David Kim",
      title: "VP of Risk Management, BuildRight Construction",
      initials: "DK"
    },
    {
      quote: "As a healthcare administrator managing vendor compliance across 14 facilities, Covera has been transformative. The audit exports alone have saved us countless hours during regulatory reviews.",
      author: "Sarah Chen",
      title: "Compliance Director, MedCore Health Systems",
      initials: "SC"
    },
    {
      quote: "We went from 60% compliance to 97% in just 3 months. The automated workflows and vendor portal eliminated the constant back-and-forth. Our insurance broker was genuinely impressed.",
      author: "Michael Torres",
      title: "Operations Manager, FastFleet Logistics",
      initials: "MT"
    },
    {
      quote: "Managing franchise vendor compliance used to require a dedicated FTE. Now it's completely automated. The dashboard gives our corporate team instant visibility across all 50+ locations.",
      author: "Rachel Williams",
      title: "Head of Franchise Operations, FranchiseCo",
      initials: "RW"
    },
    {
      quote: "The ROI was immediate. Between avoided liability exposure and recovered staff time, Covera paid for itself in the first month. Our general counsel calls it essential infrastructure.",
      author: "James Patterson",
      title: "CFO, Apex Development Group",
      initials: "JP"
    }
  ];

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    swipeToSlide: true,
    draggable: true,
    touchMove: true,
    swipe: true,
    centerMode: true,
    centerPadding: '280px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: '120px'
        }
      },
      {
        breakpoint: 768,
        settings: {
          centerMode: false,
          centerPadding: '0px',
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <SEO {...SEO_CONFIGS.landing} />
      
      {/* Global Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(58, 79, 106, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(58, 79, 106, 0.5) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
        
        {/* Static gradient orbs - removed animations for performance */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)' }}
        />
        
        <div 
          className="absolute top-1/3 right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(58, 79, 106, 0.5), transparent 70%)' }}
        />
        
        <div 
          className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35), transparent 70%)' }}
        />
        
        <div 
          className="absolute top-2/3 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent 70%)' }}
        />
        
        {/* Static industry icons - removed animations for performance */}
        <div 
          className="absolute top-1/4 right-1/3 opacity-[0.06]"
        >
          <Shield className="w-32 h-32" strokeWidth={1} style={{ color: '#3A4F6A' }} />
        </div>
        
        <div 
          className="absolute top-1/2 left-1/4 opacity-[0.06]"
        >
          <FileCheck className="w-40 h-40" strokeWidth={1} style={{ color: '#10B981' }} />
        </div>
        
        <div 
          className="absolute bottom-1/4 right-1/4 opacity-[0.06]"
        >
          <Building2 className="w-36 h-36" strokeWidth={1} style={{ color: '#3A4F6A' }} />
        </div>
        
        <div 
          className="absolute top-3/4 left-1/3 opacity-[0.06]"
        >
          <CheckCircle className="w-28 h-28" strokeWidth={1} style={{ color: '#10B981' }} />
        </div>
        
        {/* Static document/certificate rectangles - removed animations for performance */}
        <div 
          className="absolute top-1/3 left-1/2 w-48 h-32 rounded-lg opacity-[0.04] border"
          style={{ 
            borderColor: 'rgba(58, 79, 106, 0.3)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(58, 79, 106, 0.05))'
          }}
        />
        
        <div 
          className="absolute bottom-1/3 left-1/5 w-40 h-28 rounded-lg opacity-[0.04] border"
          style={{ 
            borderColor: 'rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))'
          }}
        />
      </div>

      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      <ContactSalesModal isOpen={isContactSalesModalOpen} onClose={() => setIsContactSalesModalOpen(false)} />
      
      {/* Modern Fixed Navigation with Glassmorphism */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full px-4 md:px-6 pt-4 md:pt-6" style={{ backgroundColor: 'var(--background)' }}>
        <nav 
          className="max-w-7xl mx-auto rounded-2xl border backdrop-blur-xl"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(58, 79, 106, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div className="px-6 md:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <svg className="w-28 h-6 md:w-32 md:h-7" viewBox="0 0 3000 630" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M598.514 129.609L549.807 165.933C523.39 131.26 491.538 105.05 454.251 87.3005C416.965 69.5515 376.032 60.677 331.453 60.677C282.471 60.677 237.204 72.3721 195.652 95.7623C154.1 119.152 121.835 150.592 98.858 190.08C75.8805 229.568 64.3918 274.078 64.3918 323.61C64.3918 398.184 89.9834 458.242 141.167 503.784C192.35 549.326 256.879 572.097 334.755 572.097C420.611 572.097 492.295 538.525 549.807 471.381L598.514 508.118C567.969 546.918 529.857 576.913 484.177 598.101C438.497 619.29 387.589 629.884 331.453 629.884C224.133 629.884 139.516 594.249 77.6004 522.977C25.8668 462.713 0 394.469 0 318.244C0 228.811 31.4392 153.412 94.3175 92.0474C157.196 30.6825 235.828 6.10352e-05 330.215 6.10352e-05C387.452 6.10352e-05 439.117 11.3512 485.209 34.0534C531.302 56.7557 569.07 88.6077 598.514 129.609ZM925.014 150.248C994.634 150.248 1052.42 175.427 1098.38 225.784C1139.93 272.014 1160.7 326.637 1160.7 389.653C1160.7 452.669 1138.69 507.774 1094.66 554.967C1050.63 602.16 994.084 625.757 925.014 625.757C855.669 625.757 799.051 602.16 755.16 554.967C711.268 507.774 689.323 452.669 689.323 389.653C689.323 326.912 710.099 272.427 751.651 226.197C797.606 175.564 855.393 150.248 925.014 150.248ZM925.014 207.21C876.857 207.21 835.443 225.096 800.77 260.87C766.098 296.643 748.762 339.846 748.762 390.479C748.762 423.225 756.673 453.839 772.496 482.32C788.319 510.801 809.714 532.678 836.681 547.95C863.649 563.222 893.093 570.859 925.014 570.859C957.485 570.859 987.135 563.222 1013.97 547.95C1040.8 532.678 1062.05 510.801 1077.74 482.32C1093.42 453.839 1101.27 423.225 1101.27 390.479C1101.27 339.846 1083.93 296.643 1049.26 260.87C1014.58 225.096 973.17 207.21 925.014 207.21ZM1225.1 173.363H1287.01L1438.5 502.752L1588.75 173.363H1651.07L1443.86 626.17H1433.54L1225.1 173.363ZM2120.8 464.364L2169.51 490.369C2153.83 522.014 2135.39 547.468 2114.2 566.731C2093.01 585.993 2069.21 600.647 2042.79 610.691C2016.37 620.735 1986.52 625.757 1953.22 625.757C1879.47 625.757 1821.82 601.61 1780.27 553.316C1738.72 505.022 1717.94 450.468 1717.94 389.653C1717.94 332.141 1735.55 280.958 1770.78 236.104C1815.36 178.866 1875.21 150.248 1950.33 150.248C2027.11 150.248 2088.61 179.554 2134.84 238.167C2167.58 279.444 2184.09 330.903 2184.37 392.543H1777.79C1778.89 445.377 1795.68 488.649 1828.15 522.358C1860.62 556.068 1900.66 572.923 1948.27 572.923C1971.38 572.923 1993.81 568.864 2015.55 560.746C2037.29 552.628 2055.79 541.965 2071.07 528.756C2086.34 515.548 2102.92 494.084 2120.8 464.364ZM2120.8 342.598C2113.1 311.503 2101.82 286.668 2086.96 268.093C2072.1 249.518 2052.42 234.521 2027.93 223.101C2003.44 211.681 1977.71 205.971 1950.74 205.971C1906.44 205.971 1868.33 220.281 1836.41 248.899C1813.29 269.813 1795.82 301.046 1783.98 342.598H2120.8ZM2270.64 418.134V363.649C2275.04 336.406 2281.37 314.254 2289.63 297.193C2308.89 249.862 2334.76 215.19 2367.23 193.176C2399.7 171.161 2426.66 160.154 2448.13 160.154C2464.09 160.154 2481.15 165.383 2499.31 175.839L2469.18 224.546C2443.59 215.19 2418.2 222.757 2393.02 247.248C2367.85 271.739 2350.44 298.432 2340.81 327.325C2333.65 352.917 2330.08 400.936 2330.08 471.381V624.518H2270.64V418.134ZM2762.66 150.248C2832.28 150.248 2890.07 175.427 2936.02 225.784C2978.4 271.739 2999.59 326.362 2999.59 389.653C3000.14 545.955 3000.14 625.344 2999.59 627.821H2938.08V525.041C2905.89 585.03 2847.41 618.602 2762.66 625.757C2693.31 625.757 2636.7 602.16 2592.8 554.967C2548.91 507.774 2526.97 452.669 2526.97 389.653C2526.97 326.912 2547.74 272.427 2589.3 226.197C2635.25 175.564 2693.04 150.248 2762.66 150.248ZM2762.66 207.21C2714.5 207.21 2673.09 225.096 2638.42 260.87C2603.74 296.643 2586.41 339.846 2586.41 390.479C2586.41 423.225 2595.28 454.733 2613.03 485.003C2630.78 515.272 2660.84 540.864 2703.22 561.778C2809.44 585.443 2884.98 537.149 2929.83 416.896C2932.31 378.371 2928.18 341.497 2917.45 306.274C2909.74 290.314 2899.15 275.179 2885.66 260.87C2851.82 225.096 2810.81 207.21 2762.66 207.21Z" fill="currentColor"/>
              </svg>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/about-us" 
                className="text-sm transition-all hover:opacity-70"
                style={{ color: '#3A4F6A', fontWeight: 500 }}
              >
                About
              </Link>
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="text-sm transition-all hover:opacity-70 flex items-center gap-1"
                  style={{ color: '#3A4F6A', fontWeight: 500 }}
                >
                  Industries
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isIndustriesOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 rounded-xl border backdrop-blur-xl py-2 z-50"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(58, 79, 106, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link 
                      to="/solutions-property-management"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Property Management
                    </Link>
                    <Link 
                      to="/solutions-construction"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Construction & Contractors
                    </Link>
                    <Link 
                      to="/industries-franchise"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Franchises & Multi-Location
                    </Link>
                    <Link 
                      to="/industries-healthcare"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Healthcare & Clinics
                    </Link>
                    <Link 
                      to="/industries-logistics"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Logistics & Warehousing
                    </Link>
                    <Link 
                      to="/industries-facilities"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Facilities Management
                    </Link>
                    <Link 
                      to="/industries-government"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Government & Public Sector
                    </Link>
                    <Link 
                      to="/industries-education"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Education & Schools
                    </Link>
                    <Link 
                      to="/industries-retail"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Retail & Multi-Location
                    </Link>
                    <Link 
                      to="/industries-hospitality"
                      className="block px-4 py-2 text-sm transition-all hover:bg-gray-50"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                    >
                      Hospitality & Hotels
                    </Link>
                  </div>
                )}
              </div>
              <Link 
                to="/blog" 
                className="text-sm transition-all hover:opacity-70"
                style={{ color: '#3A4F6A', fontWeight: 500 }}
              >
                Blog
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm transition-all hover:opacity-70"
                style={{ color: '#3A4F6A', fontWeight: 500 }}
              >
                Pricing
              </Link>
              <Link 
                to="/login" 
                className="px-6 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg"
                style={{ 
                  backgroundColor: '#3A4F6A', 
                  color: '#ffffff',
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(58, 79, 106, 0.2)'
                }}
              >
                Start free trial
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-all"
              style={{ color: '#3A4F6A' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div 
              className="md:hidden border-t overflow-y-auto"
              style={{ 
                borderColor: 'rgba(58, 79, 106, 0.1)',
                maxHeight: 'calc(100vh - 100px)'
              }}
            >
              <div className="px-6 py-6 space-y-4">
                <Link 
                  to="/about-us" 
                  className="block text-sm py-2 transition-all hover:translate-x-1"
                  style={{ color: '#3A4F6A', fontWeight: 500 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                
                {/* Industries submenu */}
                <div>
                  <button
                    onClick={() => setIsMobileIndustriesOpen(!isMobileIndustriesOpen)}
                    className="flex items-center justify-between w-full text-sm py-2 transition-all hover:translate-x-1"
                    style={{ color: '#3A4F6A', fontWeight: 500 }}
                  >
                    <span>Industries</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${isMobileIndustriesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isMobileIndustriesOpen && (
                    <div className="space-y-2 pl-3 mt-2">
                    <Link 
                      to="/solutions-property-management"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Property Management
                    </Link>
                    <Link 
                      to="/solutions-construction"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Construction & Contractors
                    </Link>
                    <Link 
                      to="/industries-franchise"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Franchises & Multi-Location
                    </Link>
                    <Link 
                      to="/industries-healthcare"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Healthcare & Clinics
                    </Link>
                    <Link 
                      to="/industries-logistics"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Logistics & Warehousing
                    </Link>
                    <Link 
                      to="/industries-facilities"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Facilities Management
                    </Link>
                    <Link 
                      to="/industries-government"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Government & Public Sector
                    </Link>
                    <Link 
                      to="/industries-education"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Education & Schools
                    </Link>
                    <Link 
                      to="/industries-retail"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Retail & Multi-Location
                    </Link>
                    <Link 
                      to="/industries-hospitality"
                      className="block text-sm py-1.5 transition-all hover:translate-x-1"
                      style={{ color: '#3A4F6A', fontWeight: 500 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Hospitality & Hotels
                    </Link>
                  </div>
                  )}
                </div>

                <Link 
                  to="/blog" 
                  className="block text-sm py-2 transition-all hover:translate-x-1"
                  style={{ color: '#3A4F6A', fontWeight: 500 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  to="/pricing" 
                  className="block text-sm py-2 transition-all hover:translate-x-1"
                  style={{ color: '#3A4F6A', fontWeight: 500 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  to="/login" 
                  className="block w-full px-6 py-3 rounded-xl text-sm text-center transition-all"
                  style={{ 
                    backgroundColor: '#3A4F6A', 
                    color: '#ffffff',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(58, 79, 106, 0.2)'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Start free trial
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Adjust spacing below nav */}
      <div className="h-24 md:h-28"></div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-12 pt-12 md:pt-24 pb-16 md:pb-32 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div 
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(59, 130, 246, 0.08), transparent 70%)'
          }}
        />
        
        <div className="max-w-3xl mx-auto text-center">
          
          <h1 
            className="mb-6 md:mb-8 text-3xl sm:text-4xl md:text-6xl leading-tight md:leading-none" 
            style={{ 
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: 'var(--foreground)' 
            }}
          >
            Vendor <span style={{ color: 'var(--primary)' }}>insurance compliance</span><br className="hidden sm:inline" /><span className="sm:hidden"> </span>without spreadsheets
          </h1>
          
          <p 
            className="text-sm sm:text-base md:text-xl mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto px-2 sm:px-0" 
            style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}
          >
            Automatically track COIs, prevent expired coverage, and stay audit-ready without chasing vendors or exposing your business to legal risk.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4 mb-4 md:mb-8 px-4 sm:px-0">
            <Link 
              to="/login"
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-md text-sm inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--primary-foreground)',
                fontWeight: 500
              }}
              onClick={() => analytics.trackButtonClick('Start Free Trial', 'Hero Section')}
            >
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-md text-sm transition-all hover:bg-gray-50"
              style={{ 
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                fontWeight: 500
              }}
              onClick={() => {
                analytics.trackDemoRequest();
                setIsDemoModalOpen(true);
              }}
            >
              Schedule demo
            </button>
          </div>

          {/* Micro proof block */}
          <p 
            className="text-xs md:text-sm mb-12 md:mb-24 px-4 sm:px-0" 
            style={{ color: 'var(--foreground-subtle)', fontWeight: 400, fontStyle: 'italic' }}
          >
            Used by property managers tracking 50+ vendors across multiple locations.
          </p>

          {/* Product mockup preview - Real Dashboard - Hidden on mobile */}
          <div className="hidden md:block relative max-w-7xl mx-auto mb-16 md:mb-20">
            <div 
              className="relative rounded-xl overflow-hidden border"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Browser chrome */}
              <div className="relative flex items-center justify-between gap-2 px-3 md:px-4 py-2 md:py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <div className="flex gap-1 md:gap-1.5 flex-shrink-0">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded text-xs" style={{ backgroundColor: 'var(--panel)', color: 'var(--foreground-muted)' }}>
                    <Shield className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span className="hidden sm:inline">getcovera.co/dashboard</span>
                    <span className="sm:hidden">covera.co</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-[24px]"></div>
              </div>

              {/* Dashboard Layout */}
              <div style={{ backgroundColor: 'var(--background)' }}>
                {/* Main Content Area */}
                <div className="overflow-hidden">
                  {/* Page Header */}
                  <div className="px-3 md:px-6 py-3 md:py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <h1 className="text-sm md:text-lg" style={{ fontWeight: 600 }}>Dashboard</h1>
                      <div className="text-xs hidden sm:block" style={{ color: 'var(--foreground-subtle)' }}>Last updated: 2 min ago</div>
                    </div>
                    <p className="text-xs text-left" style={{ color: 'var(--foreground-muted)' }}>Real-time overview of your vendor compliance status</p>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-3 md:p-6 space-y-3 md:space-y-5">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'TOTAL VENDORS', value: 847, change: '+12%', subtext: 'vs. last month', color: 'var(--foreground)', trending: 'up' },
                        { label: 'COMPLIANT', value: 782, change: '+92.3%', subtext: 'of total vendors', color: 'var(--status-compliant)', trending: 'up' },
                        { label: 'AT RISK', value: 43, change: '5.1%', subtext: 'expiring within 30 days', color: 'var(--foreground)', trending: 'neutral' },
                        { label: 'NON-COMPLIANT', value: 22, change: '-18%', subtext: 'vs. last month', color: 'var(--foreground)', trending: 'down' }
                      ].map((stat, i) => (
                        <div key={i} className="rounded-lg p-4 border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                          <div className="text-[10px] mb-3 tracking-wider" style={{ color: 'var(--foreground-subtle)', fontWeight: 500, letterSpacing: '0.05em' }}>
                            {stat.label}
                          </div>
                          <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-3xl" style={{ fontWeight: 600, color: stat.color, letterSpacing: '-0.02em' }}>
                              {stat.value}
                            </span>
                            <span className="text-xs" style={{ 
                              color: stat.trending === 'up' ? 'var(--status-compliant)' : stat.trending === 'down' ? 'var(--status-critical)' : 'var(--foreground-subtle)', 
                              fontWeight: 500 
                            }}>
                              {stat.change}
                            </span>
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--foreground-subtle)' }}>{stat.subtext}</div>
                        </div>
                      ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {/* High-risk vendors table */}
                      <div className="lg:col-span-2 rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                          <h2 className="text-sm" style={{ fontWeight: 600 }}>High-risk vendors</h2>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>Vendors requiring immediate attention</p>
                        </div>
                        
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th className="px-4 py-2.5 text-left" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>VENDOR</th>
                                <th className="px-4 py-2.5 text-center" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>STATUS</th>
                                <th className="px-4 py-2.5 text-center" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>EXPIRY</th>
                                <th className="px-4 py-2.5 text-center" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>ACTION</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { name: 'Apex Contractors LLC', status: 'At Risk', statusColor: 'var(--status-expiring)', date: 'Jan 15, 2024', days: '(8 days left)' },
                                { name: 'BuildRight Construction', status: 'Non-Compliant', statusColor: 'var(--status-critical)', date: 'Dec 28, 2023', days: '(18 days overdue)', subtitle: '2 missing documents' }
                              ].map((vendor, i) => (
                                <tr key={i} className={i < 1 ? 'border-b' : ''} style={{ borderColor: 'var(--border)' }}>
                                  <td className="px-4 py-3">
                                    <div style={{ fontWeight: 500, color: 'var(--foreground)' }}>{vendor.name}</div>
                                    {vendor.subtitle && <div className="text-[10px] mt-0.5" style={{ color: 'var(--foreground-subtle)' }}>{vendor.subtitle}</div>}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="inline-block px-2 py-0.5 rounded text-[9px] whitespace-nowrap" style={{ 
                                      backgroundColor: vendor.status === 'At Risk' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                      color: vendor.statusColor,
                                      fontWeight: 500
                                    }}>
                                      {vendor.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
                                      {vendor.date}
                                    </div>
                                    <div className="text-[10px] whitespace-nowrap" style={{ color: 'var(--foreground-subtle)' }}>{vendor.days}</div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button className="text-[10px] px-2.5 py-1 rounded whitespace-nowrap" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                                      Send reminder
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden">
                          {[
                            { name: 'Apex Contractors LLC', status: 'At Risk', statusColor: 'var(--status-expiring)', date: 'Jan 15, 2024', days: '(8 days left)' },
                            { name: 'BuildRight Construction', status: 'Non-Compliant', statusColor: 'var(--status-critical)', date: 'Dec 28, 2023', days: '(18 days overdue)', subtitle: '2 missing documents' }
                          ].map((vendor, i) => (
                            <div key={i} className={`p-4 space-y-3 ${i < 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--border)' }}>
                              {/* Vendor name and subtitle */}
                              <div>
                                <div className="text-sm mb-1" style={{ fontWeight: 500, color: 'var(--foreground)' }}>
                                  {vendor.name}
                                </div>
                                {vendor.subtitle && (
                                  <div className="text-[10px]" style={{ color: 'var(--foreground-subtle)' }}>
                                    {vendor.subtitle}
                                  </div>
                                )}
                              </div>
                              
                              {/* Status, Date, and Action row */}
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <span className="inline-block px-2 py-0.5 rounded text-[9px] flex-shrink-0 whitespace-nowrap" style={{ 
                                    backgroundColor: vendor.status === 'At Risk' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: vendor.statusColor,
                                    fontWeight: 500
                                  }}>
                                    {vendor.status}
                                  </span>
                                  <div className="text-xs">
                                    <div className="whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
                                      {vendor.date}
                                    </div>
                                    <div className="text-[10px]" style={{ color: 'var(--foreground-subtle)' }}>{vendor.days}</div>
                                  </div>
                                </div>
                                <button className="text-[10px] px-3 py-1.5 rounded border flex-shrink-0 whitespace-nowrap" style={{ 
                                  color: 'var(--primary)', 
                                  borderColor: 'var(--border)',
                                  fontWeight: 500 
                                }}>
                                  Send reminder
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-5">
                        {/* Upcoming expirations */}
                        <div className="rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                            <h2 className="text-sm" style={{ fontWeight: 600 }}>Upcoming expirations</h2>
                          </div>
                          <div className="p-4 space-y-3">
                            {[
                              { label: 'Within 7 days', count: '18' },
                              { label: 'Within 14 days', count: '25' },
                              { label: 'Within 30 days', count: '43' }
                            ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between py-1">
                                <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{item.label}</span>
                                <span className="text-base" style={{ fontWeight: 600 }}>{item.count}</span>
                              </div>
                            ))}
                            <button className="w-full text-xs py-2 mt-2" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                              View all expirations
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div 
              className="hidden md:block absolute -top-4 -right-4 rounded-lg px-4 py-2 border shadow-lg"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-compliant)' }} />
                <span className="text-xs" style={{ color: 'var(--foreground-muted)', fontWeight: 500 }}>Real-time sync active</span>
              </div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 sm:gap-8 pt-8 border-t text-xs max-w-2xl mx-auto" style={{ 
            borderColor: 'var(--border-subtle)',
            color: 'var(--foreground-subtle)',
            fontWeight: 500
          }}>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>SOC 2 Type II certified</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Audit-ready exports</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Bank-grade encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Logos Section */}
      <section className="border-t border-b py-8 md:py-16" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="text-xs text-center mb-6 md:mb-8 uppercase tracking-wider" style={{ color: 'var(--foreground-subtle)', fontWeight: 600, letterSpacing: '0.1em' }}>
            Trusted by compliance teams at
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-12 items-center opacity-40">
            {['Summit Properties', 'BuildRight', 'MedCore Health', 'FastFleet Logistics', 'FranchiseCo'].map((company, i) => (
              <div key={i} className="text-center">
                <div className="text-xs sm:text-sm md:text-base px-2" style={{ fontWeight: 600, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                  {company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Grid */}
      <section id="features" className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-16 md:py-28">
          <div 
            className="mb-12 md:mb-20 max-w-2xl"
          >
            <h2 className="mb-4 text-2xl md:text-3xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Operations-first, not insurance-first
            </h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Clear compliance status without interpretation. Remove manual admin work entirely. Designed for operations teams who manage third-party vendors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-16">
            {[
              { 
                icon: Shield, 
                title: 'Real-time compliance tracking', 
                desc: 'Know instantly which vendors are compliant, at risk, or non-compliant without interpretation. Monitor certificate of insurance (COI) status across all vendors with one dashboard view that eliminates guesswork.'
              },
              { 
                icon: Bell, 
                title: 'Automated vendor reminders', 
                desc: 'Vendors submit updated COIs on time without your team chasing emails. Professional reminders sent automatically at 30, 14, and 7 days before expiration while you focus on operations, not follow-up.'
              },
              { 
                icon: FileText, 
                title: 'Secure vendor portal', 
                desc: 'Vendors upload COIs via secure links without creating accounts or navigating complex portals. No friction, no back-and-forth emails. They upload, you stay compliant, everyone saves time.'
              },
              { 
                icon: TrendingUp, 
                title: 'Always audit-ready', 
                desc: 'Generate compliance reports instantly in PDF or CSV the moment you need them. Export audit-ready documentation at any time without spreadsheet panic, missing documents, or last-minute scrambling.'
              }
            ].map((feature, i) => (
              <div
                key={i}
              >
                <div 
                  className="mb-4 md:mb-5 w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center" 
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <feature.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-xl" style={{ fontWeight: 600 }}>
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="border-t overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-16 md:py-28">
          <div className="mb-12 md:mb-20 max-w-2xl">
            <h2 className="mb-4 text-2xl md:text-3xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Managing million-dollar risk
            </h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Property managers, construction firms, healthcare groups, logistics companies, and franchises rely on Covera to eliminate compliance blind spots.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-16 mb-12 md:mb-28">
            <div className="border-l pl-4 md:pl-6" style={{ borderColor: 'var(--border)' }}>
              <div className="mb-2 text-2xl md:text-5xl" style={{ fontWeight: 600, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                $380M+
              </div>
              <div className="text-xs md:text-sm" style={{ color: 'var(--foreground-subtle)', fontWeight: 500, letterSpacing: '0.01em' }}>
                Insurance coverage tracked
              </div>
            </div>
            <div className="border-l pl-4 md:pl-6" style={{ borderColor: 'var(--border)' }}>
              <div className="mb-2 text-2xl md:text-5xl" style={{ fontWeight: 600, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                2,400+
              </div>
              <div className="text-xs md:text-sm" style={{ color: 'var(--foreground-subtle)', fontWeight: 500, letterSpacing: '0.01em' }}>
                Active vendors monitored
              </div>
            </div>
            <div className="border-l pl-4 md:pl-6" style={{ borderColor: 'var(--border)' }}>
              <div className="mb-2 text-2xl md:text-5xl" style={{ fontWeight: 600, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                98%+
              </div>
              <div className="text-xs md:text-sm" style={{ color: 'var(--foreground-subtle)', fontWeight: 500, letterSpacing: '0.01em' }}>
                Compliance rate maintained
              </div>
            </div>
          </div>

          {/* Testimonials - Mobile: Simple Stack, Desktop: Carousel */}
          {!isDesktop ? (
            <div className="space-y-4 px-4">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-5 border"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map((star) => (
                      <div key={star} className="w-4 h-4" style={{ color: '#F59E0B' }}>★</div>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--foreground)', fontWeight: 400 }}>
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                      style={{ 
                        backgroundColor: 'var(--primary)', 
                        color: 'var(--primary-foreground)', 
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                        {testimonial.author}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full overflow-hidden">
              <div className="px-4 md:px-0">
                <Slider {...sliderSettings}>
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="px-0 md:px-3">
                      <div 
                        className="rounded-xl p-6 md:p-6 border flex flex-col"
                        style={{ 
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)',
                          minHeight: '240px',
                          maxWidth: '100%'
                        }}
                      >
                        <div className="flex-1 flex flex-col">
                          <div className="flex gap-1 mb-4">
                            {[1,2,3,4,5].map((star) => (
                              <div key={star} className="w-4 h-4" style={{ color: '#F59E0B' }}>★</div>
                            ))}
                          </div>
                          <p className="text-base md:text-base leading-relaxed flex-1" style={{ color: 'var(--foreground)', fontWeight: 400 }}>
                            "{testimonial.quote}"
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t mt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                            style={{ 
                              backgroundColor: 'var(--primary)', 
                              color: 'var(--primary-foreground)', 
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          >
                            {testimonial.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                              {testimonial.author}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                              {testimonial.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Now Section */}
      <section className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-12 py-12 md:py-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="mb-4 text-2xl md:text-3xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Why teams switch to Covera
            </h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Common triggers that drive operations teams to automate compliance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                icon: FileCheck, 
                title: 'Upcoming audits', 
                desc: 'Regulatory review scheduled and your team is scrambling to prove vendor compliance across hundreds of files.'
              },
              { 
                icon: Shield, 
                title: 'Recent insurance claims', 
                desc: 'A vendor incident exposed gaps in your insurance tracking process and legal is demanding better systems.'
              },
              { 
                icon: TrendingUp, 
                title: 'Rapid vendor growth', 
                desc: 'Your vendor count has doubled in the last year and spreadsheets are no longer sustainable or reliable.'
              },
              { 
                icon: MapPin, 
                title: 'Expanding to multiple locations', 
                desc: 'New sites mean more vendors, more complexity, and more risk without centralized compliance visibility.'
              }
            ].map((trigger, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-xl border"
                style={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="flex-shrink-0">
                  <div 
                    className="w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: 'var(--primary)'
                    }}
                  >
                    <trigger.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-base" style={{ fontWeight: 600 }}>
                    {trigger.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
                    {trigger.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel)' }}>
        <div className="max-w-3xl mx-auto px-4 md:px-12 py-12 md:py-28">
          <div className="max-w-xl text-center sm:text-left">
            <h2 className="mb-4 md:mb-6 text-xl sm:text-2xl md:text-4xl" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Ready to stop chasing vendor insurance?
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-10 leading-relaxed" style={{ color: 'var(--foreground-muted)', fontWeight: 400 }}>
              Replace spreadsheets with automated compliance in minutes.
            </p>
            <Link 
              to="/login"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-md text-sm inline-flex items-center justify-center gap-2 transition-all"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--primary-foreground)',
                fontWeight: 500
              }}
            >
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-4">
            <div className="text-xs" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>
              © 2026 Covera. All rights reserved.
            </div>
            <div className="flex items-center gap-6 md:gap-8 text-xs" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/terms-of-service">Terms</Link>
              <Link to="/security">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}