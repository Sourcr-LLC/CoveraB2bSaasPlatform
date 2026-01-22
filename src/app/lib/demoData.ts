// Demo mode data for screenshots and marketing materials
// This provides realistic mockup data for the dashboard

export interface DemoVendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  insuranceExpiry: string;
  status: 'compliant' | 'at-risk' | 'non-compliant';
  policyNumber?: string;
  coverageAmount?: string;
  lastUpdated?: string;
  site?: string;
  address?: string;
  insurancePolicies?: any[];
  documents?: any[];
}

export interface DemoContract {
  id: string;
  vendorId: string;
  vendorName: string;
  contractName: string;
  startDate: string;
  endDate: string;
  value: string;
  status: 'active' | 'expiring' | 'expired';
  autoRenew: boolean;
  propertyName: string;
  documentName?: string;
  documentType?: string;
  documentSize?: string;
  documentUrl?: string;
}

// Calculate dates relative to today for realistic demo data
const today = new Date();
const addDays = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const addMonths = (months: number) => {
  const date = new Date(today);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
};

// Demo vendors with realistic data
export const demoVendors: DemoVendor[] = [
  {
    id: 'demo-1',
    name: 'Atlas Construction Co.',
    email: 'contact@atlasconstruction.com',
    phone: '(555) 234-5678',
    category: 'Construction',
    insuranceExpiry: addMonths(8),
    status: 'compliant',
    policyNumber: 'POL-2024-4521',
    coverageAmount: '$2,000,000',
    lastUpdated: addDays(-12),
    site: 'Downtown Renovation',
    address: '123 Builder Way, Constructville, CA 90210',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'Liberty Mutual', coverageLimit: 2000000, expiryDate: addMonths(8), status: 'compliant' },
      { type: 'Workers Compensation', carrier: 'Travelers', coverageLimit: 1000000, expiryDate: addMonths(10), status: 'compliant' }
    ],
    documents: [
      { name: 'COI_2024_2025.pdf', type: 'PDF', size: '1.2 MB', uploaded: addDays(-12), path: 'demo-doc-1' }
    ]
  },
  {
    id: 'demo-2',
    name: 'Premier Cleaning Services',
    email: 'info@premierclean.com',
    phone: '(555) 876-5432',
    category: 'Facilities',
    insuranceExpiry: addMonths(6),
    status: 'compliant',
    policyNumber: 'POL-2024-7823',
    coverageAmount: '$1,000,000',
    lastUpdated: addDays(-8),
    site: 'Headquarters',
    address: '456 Sparkle Ln, Cleantown, NY 10001',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'Chubb', coverageLimit: 1000000, expiryDate: addMonths(6), status: 'compliant' }
    ],
    documents: [
      { name: 'COI_Premier_2024.pdf', type: 'PDF', size: '0.8 MB', uploaded: addDays(-8), path: 'demo-doc-2' }
    ]
  },
  {
    id: 'demo-3',
    name: 'TechPro IT Solutions',
    email: 'support@techproit.com',
    phone: '(555) 345-9876',
    category: 'Technology',
    insuranceExpiry: addMonths(4),
    status: 'compliant',
    policyNumber: 'POL-2024-3347',
    coverageAmount: '$3,000,000',
    lastUpdated: addDays(-5),
    site: 'Remote / Cloud',
    address: '789 Silicon Blvd, Tech City, TX 94000',
    insurancePolicies: [
      { type: 'Professional Liability', carrier: 'Hiscox', coverageLimit: 3000000, expiryDate: addMonths(4), status: 'compliant' },
      { type: 'Cyber Liability', carrier: 'Beazley', coverageLimit: 5000000, expiryDate: addMonths(12), status: 'compliant' }
    ],
    documents: [
      { name: 'COI_TechPro_Liability.pdf', type: 'PDF', size: '1.5 MB', uploaded: addDays(-5), path: 'demo-doc-3' }
    ]
  },
  {
    id: 'demo-4',
    name: 'SafeGuard Security Systems',
    email: 'contact@safeguardsec.com',
    phone: '(555) 789-0123',
    category: 'Security',
    insuranceExpiry: addDays(25),
    status: 'at-risk',
    policyNumber: 'POL-2024-8901',
    coverageAmount: '$2,500,000',
    lastUpdated: addDays(-18),
    site: 'West Campus',
    address: '321 Secure St, Safetyville, FL 33101',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'AIG', coverageLimit: 2500000, expiryDate: addDays(25), status: 'at-risk' }
    ],
    documents: [
      { name: 'COI_SafeGuard_Expiring.pdf', type: 'PDF', size: '1.1 MB', uploaded: addDays(-120), path: 'demo-doc-4' }
    ]
  },
  {
    id: 'demo-5',
    name: 'GreenScape Landscaping',
    email: 'info@greenscape.com',
    phone: '(555) 456-7890',
    category: 'Landscaping',
    insuranceExpiry: addDays(18),
    status: 'at-risk',
    policyNumber: 'POL-2024-5632',
    coverageAmount: '$1,500,000',
    lastUpdated: addDays(-22),
    site: 'Exterior Grounds',
    address: '555 Garden Ave, Plant City, OR 97000',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'Nationwide', coverageLimit: 1500000, expiryDate: addDays(18), status: 'at-risk' }
    ],
    documents: [
      { name: 'COI_GreenScape.pdf', type: 'PDF', size: '0.9 MB', uploaded: addDays(-300), path: 'demo-doc-5' }
    ]
  },
  {
    id: 'demo-6',
    name: 'Rapid Delivery Logistics',
    email: 'dispatch@rapiddelivery.com',
    phone: '(555) 567-8901',
    category: 'Logistics',
    insuranceExpiry: addMonths(-2),
    status: 'non-compliant',
    policyNumber: 'POL-2023-9045',
    coverageAmount: '$5,000,000',
    lastUpdated: addDays(-35),
    site: 'Distribution Center',
    address: '999 Transit Rd, Logistics Bay, NJ 07000',
    insurancePolicies: [
      { type: 'Auto Liability', carrier: 'Progressive', coverageLimit: 5000000, expiryDate: addMonths(-2), status: 'non-compliant' }
    ],
    documents: [
      { name: 'COI_Rapid_Expired.pdf', type: 'PDF', size: '1.3 MB', uploaded: addDays(-370), path: 'demo-doc-6' }
    ]
  },
  {
    id: 'demo-7',
    name: 'Elite HVAC Services',
    email: 'service@elitehvac.com',
    phone: '(555) 678-9012',
    category: 'Facilities',
    insuranceExpiry: addMonths(-3),
    status: 'non-compliant',
    policyNumber: 'POL-2023-7712',
    coverageAmount: '$1,000,000',
    lastUpdated: addDays(-45),
    site: 'East Wing',
    address: '777 Cool St, Airflow, AZ 85000',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'Farmers', coverageLimit: 1000000, expiryDate: addMonths(-3), status: 'non-compliant' }
    ],
    documents: [
      { name: 'COI_Elite_Old.pdf', type: 'PDF', size: '1.0 MB', uploaded: addDays(-380), path: 'demo-doc-7' }
    ]
  },
  {
    id: 'demo-8',
    name: 'ProPaint Contractors',
    email: 'jobs@propaint.com',
    phone: '(555) 890-1234',
    category: 'Construction',
    insuranceExpiry: addMonths(10),
    status: 'compliant',
    policyNumber: 'POL-2024-2289',
    coverageAmount: '$1,500,000',
    lastUpdated: addDays(-3),
    site: 'Interior Renovation',
    address: '222 Color Blvd, Paint City, WA 98000',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'State Farm', coverageLimit: 1500000, expiryDate: addMonths(10), status: 'compliant' }
    ],
    documents: [
      { name: 'COI_ProPaint_2025.pdf', type: 'PDF', size: '1.4 MB', uploaded: addDays(-3), path: 'demo-doc-8' }
    ]
  },
  {
    id: 'demo-9',
    name: 'DataSecure Cloud Services',
    email: 'hello@datasecure.com',
    phone: '(555) 901-2345',
    category: 'Technology',
    insuranceExpiry: addMonths(7),
    status: 'compliant',
    policyNumber: 'POL-2024-6654',
    coverageAmount: '$10,000,000',
    lastUpdated: addDays(-7),
    site: 'Data Center A',
    address: '888 Server Dr, Cloudville, VA 20100',
    insurancePolicies: [
      { type: 'Cyber Liability', carrier: 'CNA', coverageLimit: 10000000, expiryDate: addMonths(7), status: 'compliant' }
    ],
    documents: [
      { name: 'COI_DataSecure.pdf', type: 'PDF', size: '2.1 MB', uploaded: addDays(-7), path: 'demo-doc-9' }
    ]
  },
  {
    id: 'demo-10',
    name: 'QuickFix Plumbing',
    email: 'emergency@quickfixplumbing.com',
    phone: '(555) 012-3456',
    category: 'Facilities',
    insuranceExpiry: addDays(22),
    status: 'at-risk',
    policyNumber: 'POL-2024-4498',
    coverageAmount: '$2,000,000',
    lastUpdated: addDays(-14),
    site: 'Main Building',
    address: '101 Pipe Ln, Waterworks, MI 48000',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'Allstate', coverageLimit: 2000000, expiryDate: addDays(22), status: 'at-risk' }
    ],
    documents: [
      { name: 'COI_QuickFix.pdf', type: 'PDF', size: '0.7 MB', uploaded: addDays(-340), path: 'demo-doc-10' }
    ]
  },
  {
    id: 'demo-11',
    name: 'Sunrise Catering Co.',
    email: 'events@sunrisecatering.com',
    phone: '(555) 123-4567',
    category: 'Food Service',
    insuranceExpiry: addMonths(5),
    status: 'compliant',
    policyNumber: 'POL-2024-8821',
    coverageAmount: '$2,000,000',
    lastUpdated: addDays(-9),
    site: 'Cafeteria',
    address: '333 Food Ct, Tastyville, IL 60000',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'Hartford', coverageLimit: 2000000, expiryDate: addMonths(5), status: 'compliant' }
    ],
    documents: [
      { name: 'COI_Sunrise.pdf', type: 'PDF', size: '1.1 MB', uploaded: addDays(-9), path: 'demo-doc-11' }
    ]
  },
  {
    id: 'demo-12',
    name: 'Metro Electrical Services',
    email: 'info@metroelectrical.com',
    phone: '(555) 234-5679',
    category: 'Construction',
    insuranceExpiry: addDays(-15),
    status: 'non-compliant',
    policyNumber: 'POL-2023-3376',
    coverageAmount: '$3,000,000',
    lastUpdated: addDays(-40),
    site: 'North Expansion',
    address: '444 Voltage Rd, Spark City, OH 44000',
    insurancePolicies: [
      { type: 'General Liability', carrier: 'Zurich', coverageLimit: 3000000, expiryDate: addDays(-15), status: 'non-compliant' }
    ],
    documents: [
      { name: 'COI_Metro_Expired.pdf', type: 'PDF', size: '1.6 MB', uploaded: addDays(-375), path: 'demo-doc-12' }
    ]
  }
];

// Demo contracts
export const demoContracts: DemoContract[] = [
  {
    id: 'contract-1',
    vendorId: 'demo-1',
    vendorName: 'Atlas Construction Co.',
    contractName: 'Building Renovation Project',
    startDate: addMonths(-6),
    endDate: addMonths(18),
    value: '$450,000',
    status: 'active',
    autoRenew: false,
    propertyName: 'Downtown Renovation',
    documentName: 'Contract_Atlas_2024.pdf',
    documentType: 'PDF',
    documentSize: '2.4 MB',
    documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000' // Placeholder
  },
  {
    id: 'contract-2',
    vendorId: 'demo-2',
    vendorName: 'Premier Cleaning Services',
    contractName: 'Annual Facilities Maintenance',
    startDate: addMonths(-3),
    endDate: addMonths(9),
    value: '$84,000',
    status: 'active',
    autoRenew: true,
    propertyName: 'Headquarters',
    documentName: 'Service_Agreement_Premier.pdf',
    documentType: 'PDF',
    documentSize: '1.1 MB',
    documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'contract-3',
    vendorId: 'demo-3',
    vendorName: 'TechPro IT Solutions',
    contractName: 'Network Infrastructure Support',
    startDate: addMonths(-8),
    endDate: addMonths(4),
    value: '$120,000',
    status: 'active',
    autoRenew: true,
    propertyName: 'Corporate IT Hub'
  },
  {
    id: 'contract-4',
    vendorId: 'demo-4',
    vendorName: 'SafeGuard Security Systems',
    contractName: 'Security System Monitoring',
    startDate: addMonths(-12),
    endDate: addDays(45),
    value: '$36,000',
    status: 'expiring',
    autoRenew: false,
    propertyName: 'West Campus',
    documentName: 'Security_Contract_2023.pdf',
    documentType: 'PDF',
    documentSize: '0.9 MB',
    documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'contract-5',
    vendorId: 'demo-6',
    vendorName: 'Rapid Delivery Logistics',
    contractName: 'Delivery Services Agreement',
    startDate: addMonths(-18),
    endDate: addDays(-15),
    value: '$96,000',
    status: 'expired',
    autoRenew: false,
    propertyName: 'Logistics Bay'
  },
  {
    id: 'contract-6',
    vendorId: 'demo-9',
    vendorName: 'DataSecure Cloud Services',
    contractName: 'Cloud Storage & Backup',
    startDate: addMonths(-4),
    endDate: addMonths(8),
    value: '$72,000',
    status: 'active',
    autoRenew: true,
    propertyName: 'Data Center A',
    documentName: 'SLA_DataSecure.pdf',
    documentType: 'PDF',
    documentSize: '3.2 MB',
    documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'contract-7',
    vendorId: 'demo-11',
    vendorName: 'Sunrise Catering Co.',
    contractName: 'Corporate Events Catering',
    startDate: addMonths(-2),
    endDate: addMonths(10),
    value: '$48,000',
    status: 'active',
    autoRenew: false,
    propertyName: 'Central Cafeteria'
  },
  {
    id: 'contract-8',
    vendorId: 'demo-8',
    vendorName: 'ProPaint Contractors',
    contractName: 'Office Painting & Maintenance',
    startDate: addMonths(-1),
    endDate: addMonths(5),
    value: '$28,500',
    status: 'active',
    autoRenew: false,
    propertyName: 'Interior Renovation'
  }
];

// Demo mode utilities
export const isDemoMode = (): boolean => {
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('demo') === 'true') {
    return true;
  }
  
  // Check localStorage
  return localStorage.getItem('covera_demo_mode') === 'true';
};

export const enableDemoMode = () => {
  localStorage.setItem('covera_demo_mode', 'true');
  // Add demo parameter to URL without reloading
  const url = new URL(window.location.href);
  url.searchParams.set('demo', 'true');
  window.history.replaceState({}, '', url.toString());
};

export const disableDemoMode = () => {
  localStorage.removeItem('covera_demo_mode');
  // Remove demo parameter from URL
  const url = new URL(window.location.href);
  url.searchParams.delete('demo');
  window.history.replaceState({}, '', url.toString());
};

// Get demo stats
export const getDemoStats = () => {
  const compliantCount = demoVendors.filter(v => v.status === 'compliant').length;
  const atRiskCount = demoVendors.filter(v => v.status === 'at-risk').length;
  const nonCompliantCount = demoVendors.filter(v => v.status === 'non-compliant').length;
  
  return {
    totalVendors: demoVendors.length,
    compliant: compliantCount,
    atRisk: atRiskCount,
    nonCompliant: nonCompliantCount,
    complianceRate: Math.round((compliantCount / demoVendors.length) * 100)
  };
};
