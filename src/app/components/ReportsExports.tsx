import { useState, useEffect } from 'react';
import { FileText, FileSpreadsheet, Download, Filter } from 'lucide-react';
import { vendorApi } from '../lib/api';
import { isDemoMode, demoVendors } from '../lib/demoData';

// Helper function to calculate vendor status client-side
function calculateVendorStatus(insuranceExpiry: string | undefined): string {
  if (!insuranceExpiry || insuranceExpiry === 'Invalid Date' || insuranceExpiry.trim() === '') {
    return 'non-compliant'; // No insurance or invalid date = non-compliant
  }
  
  const expiryDate = new Date(insuranceExpiry);
  
  // Check if date is valid
  if (isNaN(expiryDate.getTime())) {
    return 'non-compliant'; // Invalid date = non-compliant
  }
  
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'non-compliant'; // Expired
  } else if (daysUntilExpiry <= 30) {
    return 'at-risk'; // Expiring within 30 days
  } else {
    return 'compliant'; // Valid and not expiring soon
  }
}

export default function ReportsExports() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState('compliance');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let vendorData = [];
      
      if (isDemoMode()) {
        console.log('📊 Demo mode enabled - using mock data for Reports');
        vendorData = demoVendors;
      } else {
        const response = await vendorApi.getAll();
        vendorData = response.vendors || [];
      }

      // Recalculate status for each vendor to ensure accuracy
      const vendorsWithUpdatedStatus = (vendorData || []).map(vendor => ({
        ...vendor,
        status: calculateVendorStatus(vendor.insuranceExpiry)
      }));
      setVendors(vendorsWithUpdatedStatus);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return '#10b981';
      case 'at-risk':
        return '#f59e0b';
      case 'non-compliant':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadge = (status: string) => {
    const labels = {
      'compliant': 'Compliant',
      'at-risk': 'At Risk',
      'non-compliant': 'Non-Compliant',
      'pending': 'Pending'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const generatePDFReport = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(58, 79, 106); // --primary color
    doc.text('Covera Compliance Report', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Vendors: ${vendors.length}`, 14, 33);
    
    // Statistics
    const compliantCount = vendors.filter(v => v.status === 'compliant').length;
    const atRiskCount = vendors.filter(v => v.status === 'at-risk').length;
    const nonCompliantCount = vendors.filter(v => v.status === 'non-compliant').length;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary', 14, 43);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Compliant: ${compliantCount}`, 14, 50);
    doc.text(`At Risk: ${atRiskCount}`, 14, 56);
    doc.text(`Non-Compliant: ${nonCompliantCount}`, 14, 62);
    
    // Table
    const tableData = vendors.map(v => [
      v.name,
      v.contactName || '-',
      v.vendorType,
      getStatusBadge(v.status),
      v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString() : 'N/A'
    ]);
    
    autoTable(doc, {
      startY: 72,
      head: [['Vendor Name', 'Contact', 'Type', 'Status', 'Insurance Expiry']],
      body: tableData,
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [58, 79, 106],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      didParseCell: (data: any) => {
        if (data.column.index === 3 && data.section === 'body') {
          const status = vendors[data.row.index].status;
          const color = getStatusColor(status);
          const rgb = hexToRgb(color);
          data.cell.styles.textColor = rgb;
        }
      }
    });
    
    // Save
    doc.save(`Covera_Compliance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSVReport = () => {
    const headers = ['Vendor Name', 'Contact Name', 'Email', 'Phone', 'Type', 'Status', 'Insurance Expiry', 'Last Contact'];
    const rows = vendors.map(v => [
      v.name,
      v.contactName || '',
      v.email || '',
      v.phone || '',
      v.vendorType,
      getStatusBadge(v.status),
      v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString() : '',
      v.lastContact ? new Date(v.lastContact).toLocaleDateString() : ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Covera_Vendor_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const generateExcelReport = async () => {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(
      vendors.map(v => ({
        'Vendor Name': v.name,
        'Contact Name': v.contactName || '',
        'Email': v.email || '',
        'Phone': v.phone || '',
        'Type': v.vendorType,
        'Status': getStatusBadge(v.status),
        'Insurance Expiry': v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString() : '',
        'Last Contact': v.lastContact ? new Date(v.lastContact).toLocaleDateString() : ''
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');
    
    XLSX.writeFile(workbook, `Covera_Vendor_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      switch (selectedFormat) {
        case 'pdf':
          generatePDFReport();
          break;
        case 'csv':
          generateCSVReport();
          break;
        case 'excel':
          generateExcelReport();
          break;
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const quickExport = async (type: 'all' | 'compliant' | 'expiring' | 'audit', format: 'pdf' | 'csv' | 'excel') => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      switch (format) {
        case 'pdf':
          generatePDFReport();
          break;
        case 'csv':
          generateCSVReport();
          break;
        case 'excel':
          generateExcelReport();
          break;
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const compliantCount = vendors.filter(v => v.status === 'compliant').length;
  const atRiskCount = vendors.filter(v => v.status === 'at-risk').length;
  const nonCompliantCount = vendors.filter(v => v.status === 'non-compliant').length;

  return (
    <div className="p-6 md:p-8 lg:p-12 h-full overflow-y-auto bg-slate-50/50">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="mb-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Reports & Exports</h1>
        <p className="text-base text-slate-500">
          Generate compliance reports and export data for audits and stakeholders
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="text-3xl font-semibold mb-2 text-slate-900">{vendors.length}</div>
          <div className="text-sm font-medium text-slate-500">Total Vendors</div>
        </div>
        
        <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="text-3xl font-semibold mb-2 text-emerald-600">{compliantCount}</div>
          <div className="text-sm font-medium text-slate-500">Compliant</div>
        </div>
        
        <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="text-3xl font-semibold mb-2 text-amber-500">{atRiskCount}</div>
          <div className="text-sm font-medium text-slate-500">At Risk</div>
        </div>
        
        <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="text-3xl font-semibold mb-2 text-red-600">{nonCompliantCount}</div>
          <div className="text-sm font-medium text-slate-500">Non-Compliant</div>
        </div>
      </div>

      {/* Quick Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => quickExport('all', 'csv')}
          disabled={isGenerating}
          className="p-6 rounded-2xl border border-slate-100 bg-white text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <FileSpreadsheet className="w-6 h-6 mb-4 text-[#3A4F6A]" />
          <div className="text-sm font-semibold mb-1 text-slate-900">Export all vendors</div>
          <div className="text-xs text-slate-500 group-hover:text-slate-600">CSV format • {vendors.length} records</div>
        </button>

        <button 
          onClick={() => quickExport('compliant', 'pdf')}
          disabled={isGenerating}
          className="p-6 rounded-2xl border border-slate-100 bg-white text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <FileText className="w-6 h-6 mb-4 text-[#3A4F6A]" />
          <div className="text-sm font-semibold mb-1 text-slate-900">Compliance summary</div>
          <div className="text-xs text-slate-500 group-hover:text-slate-600">PDF report • Ready to print</div>
        </button>

        <button 
          onClick={() => quickExport('expiring', 'excel')}
          disabled={isGenerating}
          className="p-6 rounded-2xl border border-slate-100 bg-white text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <FileSpreadsheet className="w-6 h-6 mb-4 text-[#3A4F6A]" />
          <div className="text-sm font-semibold mb-1 text-slate-900">Expiring COIs</div>
          <div className="text-xs text-slate-500 group-hover:text-slate-600">Excel format • Next 30 days</div>
        </button>

        <button 
          onClick={() => quickExport('audit', 'pdf')}
          disabled={isGenerating}
          className="p-6 rounded-2xl border border-slate-100 bg-white text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <FileText className="w-6 h-6 mb-4 text-[#3A4F6A]" />
          <div className="text-sm font-semibold mb-1 text-slate-900">Audit package</div>
          <div className="text-xs text-slate-500 group-hover:text-slate-600">Full documentation • PDF</div>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Custom Report Builder */}
        <div className="w-full lg:w-[400px] flex-none">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm h-full">
            <h3 className="text-lg font-semibold mb-6 text-slate-900">Custom report builder</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2.5 text-slate-700">Report type</label>
                <div className="relative">
                  <select 
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900"
                  >
                    <option value="compliance">Compliance summary</option>
                    <option value="vendors">Vendor list</option>
                    <option value="insurance">Insurance tracking</option>
                    <option value="risk">Risk assessment</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5 text-slate-700">Date range (optional)</label>
                <div className="flex flex-col gap-3">
                  <input 
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900"
                  />
                  <input 
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5 text-slate-700">Format</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  {['pdf', 'csv', 'excel'].map((fmt) => (
                    <button 
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt as any)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${
                        selectedFormat === fmt 
                          ? 'bg-[#3A4F6A] text-white shadow-sm' 
                          : 'text-slate-500 hover:text-[#3A4F6A] hover:bg-slate-200/50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 bg-[#3A4F6A] text-white hover:bg-[#2c3b4f] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate custom report'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Data Preview */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm h-full flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex-none">
              <h3 className="text-lg font-semibold text-slate-900">Data preview</h3>
              <p className="text-sm mt-1 text-slate-500">
                {vendors.length} vendor records ready to export
              </p>
            </div>

            <div className="flex-1 overflow-x-auto p-0">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Vendor</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.slice(0, 10).map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{vendor.name}</td>
                      <td className="px-6 py-4 capitalize text-slate-500">
                        {vendor.vendorType?.replace('-', ' ')}
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center min-w-[90px]"
                          style={{
                            backgroundColor: `${getStatusColor(vendor.status)}15`,
                            color: getStatusColor(vendor.status)
                          }}
                        >
                          {getStatusBadge(vendor.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 tabular-nums">
                        {vendor.insuranceExpiry ? new Date(vendor.insuranceExpiry).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vendors.length > 10 && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 text-center text-sm text-slate-500">
                  + {vendors.length - 10} more records included in export
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}