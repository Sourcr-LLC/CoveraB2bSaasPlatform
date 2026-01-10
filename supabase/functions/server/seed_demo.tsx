import * as kv from "./kv_store.tsx";

// Sample vendor names and types
const SAMPLE_VENDORS = [
  { name: "Acme Construction", type: "contractor", service: "General Contracting" },
  { name: "Summit Roofing", type: "subcontractor", service: "Roofing" },
  { name: "Pinnacle Electrical", type: "subcontractor", service: "Electrical" },
  { name: "City Maintenance", type: "service-provider", service: "Janitorial" },
  { name: "Green Landscaping", type: "service-provider", service: "Landscaping" },
  { name: "Safety First Security", type: "service-provider", service: "Security" },
  { name: "Elite HVAC", type: "subcontractor", service: "HVAC" },
  { name: "Reliable Plumbing", type: "subcontractor", service: "Plumbing" },
  { name: "Metro Glass", type: "supplier", service: "Glazing" },
  { name: "Quality Carpentry", type: "contractor", service: "Carpentry" },
  { name: "Urban Elevators", type: "service-provider", service: "Elevator Maintenance" },
  { name: "Global Logistics", type: "supplier", service: "Logistics" }
];

function getRandomDate(status: 'compliant' | 'at-risk' | 'non-compliant') {
  const today = new Date();
  const date = new Date(today);
  
  if (status === 'compliant') {
    // 3 to 12 months in future
    date.setDate(today.getDate() + 90 + Math.floor(Math.random() * 270));
  } else if (status === 'at-risk') {
    // 5 to 25 days in future
    date.setDate(today.getDate() + 5 + Math.floor(Math.random() * 20));
  } else {
    // 1 to 60 days in past
    date.setDate(today.getDate() - 1 - Math.floor(Math.random() * 59));
  }
  
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

export const seedDemoData = async (userId: string) => {
  const vendors = [];
  
  for (const sample of SAMPLE_VENDORS) {
    // Determine status randomly
    const rand = Math.random();
    let status: 'compliant' | 'at-risk' | 'non-compliant' = 'compliant';
    
    if (rand > 0.8) status = 'non-compliant';
    else if (rand > 0.6) status = 'at-risk';
    
    const expiryDate = getRandomDate(status);
    const vendorId = `vendor_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    const vendor = {
      id: vendorId,
      name: sample.name,
      vendorType: sample.type,
      contactName: `Manager ${sample.name.split(' ')[0]}`,
      email: `contact@${sample.name.toLowerCase().replace(/\s/g, '')}.com`,
      phone: `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      status,
      insuranceExpiry: expiryDate,
      nextExpiry: expiryDate,
      notes: `Demo vendor for ${sample.service}`,
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      insurancePolicies: [
        {
          type: "General Liability",
          expiryDate: expiryDate,
          status: status,
          insurer: "Demo Insurance Co",
          policyNumber: `GL-${Math.floor(100000 + Math.random() * 900000)}`,
          limits: {
            eachOccurrence: Math.random() > 0.85 ? 500000 : 1000000, // 15% chance of being under-insured ($500k vs $1M)
            aggregate: 2000000
          }
        },
        {
          type: "Workers Compensation",
          expiryDate: getRandomDate('compliant'), // Usually not the one failing
          status: 'compliant',
          insurer: "Demo Insurance Co",
          policyNumber: `WC-${Math.floor(100000 + Math.random() * 900000)}`,
          limits: {
            eachOccurrence: 500000,
            aggregate: 500000
          }
        }
      ]
    };
    
    vendors.push(vendor);
    await kv.set(`vendor:${userId}:${vendorId}`, vendor);
    
    // Log creation activity
    const activityId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`activity:${userId}:${vendorId}:${activityId}`, {
      id: activityId,
      vendorId,
      action: 'created',
      detail: `Imported demo vendor ${sample.name}`,
      status: 'neutral',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
  }
  
  return vendors;
};