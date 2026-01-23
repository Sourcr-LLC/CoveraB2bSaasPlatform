import { useState, useEffect } from 'react';
import { FileText, FileSpreadsheet, Download, Filter } from 'lucide-react';
import { vendorApi } from '../lib/api';

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
      const { vendors: vendorData } = await vendorApi.getAll();
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
    <div className="p-4 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="mb-3 text-2xl md:text-3xl tracking-tight" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Reports & Exports</h1>
        <p className="text-base" style={{ color: 'var(--foreground-muted)' }}>
          Generate compliance reports and export data for audits and stakeholders
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          className="p-6 rounded-2xl border border-slate-100"
          style={{
            backgroundColor: 'var(--card)',
          }}
        >
          <div className="text-2xl mb-2" style={{ color: 'var(--foreground)' }}>{vendors.length}</div>
          <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Total Vendors</div>
        </div>
        
        <div 
          className="p-6 rounded-2xl border border-slate-100"
          style={{
            backgroundColor: 'var(--card)',
          }}
        >
          <div className="text-2xl mb-2" style={{ color: 'var(--status-compliant)' }}>{compliantCount}</div>
          <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Compliant</div>
        </div>
        
        <div 
          className="p-6 rounded-2xl border border-slate-100"
          style={{
            backgroundColor: 'var(--card)',
          }}
        >
          <div className="text-2xl mb-2" style={{ color: 'var(--status-at-risk)' }}>{atRiskCount}</div>
          <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>At Risk</div>
        </div>
        
        <div 
          className="p-6 rounded-2xl border border-slate-100"
          style={{
            backgroundColor: 'var(--card)',
          }}
        >
          <div className="text-2xl mb-2" style={{ color: 'var(--status-non-compliant)' }}>{nonCompliantCount}</div>
          <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Non-Compliant</div>
        </div>
      </div>

      {/* Quick Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => quickExport('all', 'csv')}
          disabled={isGenerating}
          className="p-6 rounded-2xl border border-slate-100 text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: 'var(--card)',
          }}
        >
          <FileSpreadsheet className="w-6 h-6 mb-4" style={{ color: 'var(--primary)' }} />
          <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>Export all vendors</div>
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>CSV format • {vendors.length} records</div>
        </button>

        <button 
          onClick={() => quickExport('compliant', 'pdf')}
          disabled={isGenerating}
          className="p-6 rounded-2xl border border-slate-100 text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: 'var(--card)',
          }}
        >
          <FileText className="w-6 h-6 mb-4" style={{ color: 'var(--primary)' }} />
          <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>Compliance summary</div>
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>PDF report • Ready to print</div>
        </button>

        <button 
          onClick={() => quickExport('expiring', 'excel')}
          disabled={isGenerating}
          className="p-6 rounded-2xl border border-slate-100 text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: 'var(--card)',
          }}
        >
          <FileSpreadsheet className="w-6 h-6 mb-4" style={{ color: 'var(--primary)' }} />
          <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>Expiring COIs</div>
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Excel format • Next 30 days</div>
        </button>

        <button 
          onClick={() => quickExport('audit', 'pdf')}
          disabled={isGenerating}
          className="p-6 rounded-2xl border border-slate-100 text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: 'var(--card)',
          }}
        >
          <FileText className="w-6 h-6 mb-4" style={{ color: 'var(--primary)' }} />
          <div className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>Audit package</div>
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Full documentation • PDF</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Custom Report Builder */}
        <div className="lg:col-span-5">
          <div 
            className="rounded-2xl border p-8 border-slate-100"
            style={{
              backgroundColor: 'var(--card)',
            }}
          >
            <h3 className="text-lg mb-6">Custom report builder</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm mb-2.5">Report type</label>
                <select 
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value="compliance">Compliance summary</option>
                  <option value="vendors">Vendor list</option>
                  <option value="insurance">Insurance tracking</option>
                  <option value="risk">Risk assessment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2.5 text-center md:text-left">Date range (optional)</label>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  <input 
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <span className="text-sm text-center md:text-left" style={{ color: 'var(--foreground-muted)' }}>to</span>
                  <input 
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2.5">Format</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedFormat('pdf')}
                    className="flex-1 py-3 rounded-lg border text-sm transition-all"
                    style={{ 
                      backgroundColor: selectedFormat === 'pdf' ? 'var(--primary)' : 'var(--panel)',
                      borderColor: selectedFormat === 'pdf' ? 'var(--primary)' : 'var(--border)',
                      color: selectedFormat === 'pdf' ? 'var(--primary-foreground)' : 'var(--foreground)'
                    }}
                  >
                    PDF
                  </button>
                  <button 
                    onClick={() => setSelectedFormat('csv')}
                    className="flex-1 py-3 rounded-lg border text-sm transition-all"
                    style={{ 
                      backgroundColor: selectedFormat === 'csv' ? 'var(--primary)' : 'var(--panel)',
                      borderColor: selectedFormat === 'csv' ? 'var(--primary)' : 'var(--border)',
                      color: selectedFormat === 'csv' ? 'var(--primary-foreground)' : 'var(--foreground)'
                    }}
                  >
                    CSV
                  </button>
                  <button 
                    onClick={() => setSelectedFormat('excel')}
                    className="flex-1 py-3 rounded-lg border text-sm transition-all"
                    style={{ 
                      backgroundColor: selectedFormat === 'excel' ? 'var(--primary)' : 'var(--panel)',
                      borderColor: selectedFormat === 'excel' ? 'var(--primary)' : 'var(--border)',
                      color: selectedFormat === 'excel' ? 'var(--primary-foreground)' : 'var(--foreground)'
                    }}
                  >
                    Excel
                  </button>
                </div>
              </div>

              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-lg text-sm transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate custom report'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Data Preview */}
        <div className="lg:col-span-7">
          <div 
            className="rounded-2xl border overflow-hidden border-slate-100"
            style={{
              backgroundColor: 'var(--card)',
            }}
          >
            <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="text-lg">Data preview</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
                {vendors.length} vendor records ready to export
              </p>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th className="text-left pb-3 pr-4" style={{ color: 'var(--foreground-muted)' }}>Vendor</th>
                      <th className="text-left pb-3 pr-4" style={{ color: 'var(--foreground-muted)' }}>Type</th>
                      <th className="text-left pb-3 pr-4" style={{ color: 'var(--foreground-muted)' }}>Status</th>
                      <th className="text-left pb-3" style={{ color: 'var(--foreground-muted)' }}>Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.slice(0, 8).map((vendor) => (
                      <tr key={vendor.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td className="py-3 pr-4" style={{ color: 'var(--foreground)' }}>{vendor.name}</td>
                        <td className="py-3 pr-4 capitalize" style={{ color: 'var(--foreground-muted)' }}>
                          {vendor.vendorType.replace('-', ' ')}
                        </td>
                        <td className="py-3 pr-4">
                          <span 
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: `${getStatusColor(vendor.status)}15`,
                              color: getStatusColor(vendor.status)
                            }}
                          >
                            {getStatusBadge(vendor.status)}
                          </span>
                        </td>
                        <td className="py-3" style={{ color: 'var(--foreground-muted)' }}>
                          {vendor.insuranceExpiry ? new Date(vendor.insuranceExpiry).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {vendors.length > 8 && (
                  <div className="mt-4 text-sm text-center" style={{ color: 'var(--foreground-muted)' }}>
                    + {vendors.length - 8} more records
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}