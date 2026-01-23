import { useState, useEffect } from 'react';
import { FileText, Calendar, AlertTriangle, CheckCircle2, Upload, Clock, Eye, Plus, Filter, Download, Search, X, Building2, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { supabase } from '../lib/api';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import NewContractModal from './NewContractModal';
import UploadContractModal from './UploadContractModal';
import { toast } from 'sonner';
import { isDemoMode, demoContracts } from '../lib/demoData';

interface Contract {
  id: string;
  vendorName: string;
  contractType: string;
  propertyName: string;
  startDate: string;
  endDate: string;
  value: string;
  status: 'active' | 'expiring' | 'expired';
  autoRenewal: boolean;
  lastReviewed: string;
  documentName?: string;
  documentType?: string;
  documentSize?: string;
  documentUrl?: string;
  documentPath?: string;
  riskScore?: 'low' | 'medium' | 'high';
}

// Contract API
const contractApi = {
  getAll: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/contracts`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch contracts');
    }

    return await response.json();
  },
  updateDocument: async (contractId: string, documentData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/contracts/${contractId}/document`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update contract document');
    }

    return await response.json();
  },
};

export default function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [sortField, setSortField] = useState<'propertyName' | 'vendorName' | 'endDate' | 'value'>('endDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isUploadContractModalOpen, setIsUploadContractModalOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Contract | null>(null);
  const [uploadingContractId, setUploadingContractId] = useState<string | null>(null);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      if (isDemoMode()) {
        // Map demo contracts to the Contract interface format
        const mappedDemoContracts = demoContracts.map(dc => ({
          id: dc.id,
          vendorName: dc.vendorName,
          propertyName: dc.propertyName || 'General',
          contractType: dc.contractName,
          startDate: dc.startDate,
          endDate: dc.endDate,
          value: dc.value,
          status: dc.status,
          autoRenewal: dc.autoRenew,
          lastReviewed: dc.startDate,
          documentName: dc.documentName,
          documentType: dc.documentType,
          documentSize: dc.documentSize,
          documentUrl: dc.documentUrl,
          riskScore: 'medium' as const // Default mock risk score
        }));
        setContracts(mappedDemoContracts);
        setFilteredContracts(mappedDemoContracts);
        return;
      }

      const result = await contractApi.getAll();
      const contractsData = result.contracts || [];
      setContracts(contractsData);
      setFilteredContracts(contractsData);
    } catch (error) {
      console.error('Failed to load contracts:', error);
      toast.error('Failed to load contracts');
    }
  };

  useEffect(() => {
    let result = contracts;
    
    if (searchTerm) {
      result = result.filter(contract =>
        contract.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(contract => contract.status === filterStatus);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'propertyName':
          comparison = a.propertyName.localeCompare(b.propertyName);
          break;
        case 'vendorName':
          comparison = a.vendorName.localeCompare(b.vendorName);
          break;
        case 'value':
          // Remove currency symbols and commas for numeric comparison
          const valA = parseFloat(a.value.replace(/[^0-9.-]+/g, ""));
          const valB = parseFloat(b.value.replace(/[^0-9.-]+/g, ""));
          comparison = valA - valB;
          break;
        case 'endDate':
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredContracts(result);
  }, [searchTerm, filterStatus, contracts, sortField, sortDirection]);

  const handleContractAdded = () => {
    loadContracts();
    setIsModalOpen(false);
  };

  const getStatusConfig = (status: 'active' | 'expiring' | 'expired') => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle2,
          label: 'Active',
          bg: 'var(--status-compliant-bg)',
          text: 'var(--status-compliant)',
          border: 'var(--status-compliant-border)'
        };
      case 'expiring':
        return {
          icon: Clock,
          label: 'Expiring',
          bg: 'var(--status-at-risk-bg)',
          text: 'var(--status-at-risk)',
          border: 'var(--status-at-risk-border)'
        };
      case 'expired':
        return {
          icon: AlertTriangle,
          label: 'Expired',
          bg: 'var(--status-non-compliant-bg)',
          text: 'var(--status-non-compliant)',
          border: 'var(--status-non-compliant-border)'
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          bg: 'var(--panel)',
          text: 'var(--foreground-muted)',
          border: 'var(--border)'
        };
    }
  };

  const handleUploadDocumentToContract = async (contractId: string, file: File) => {
    setUploadingContractId(contractId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${contractId}-${Date.now()}.${fileExt}`;
      const filePath = `contracts/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('make-be7827e3-contracts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get signed URL
      const { data: { signedUrl } } = await supabase.storage
        .from('make-be7827e3-contracts')
        .createSignedUrl(filePath, 365 * 24 * 60 * 60); // 1 year

      // Update contract with document info
      await contractApi.updateDocument(contractId, {
        documentName: file.name,
        documentType: file.type.includes('pdf') ? 'PDF' : 'Document',
        documentSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        documentUrl: signedUrl,
        documentPath: filePath
      });

      toast.success('Contract document uploaded successfully!');
      await loadContracts();
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploadingContractId(null);
    }
  };

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiring: contracts.filter(c => c.status === 'expiring').length,
    expired: contracts.filter(c => c.status === 'expired').length
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div 
        className="flex-none mb-6 md:mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl md:text-3xl tracking-tight" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Contract Management
            </h1>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Monitor and manage vendor contracts across your organization
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl border appearance-none pr-10 cursor-pointer"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <option value="endDate">Sort by Date</option>
                <option value="propertyName">Sort by Property</option>
                <option value="vendorName">Sort by Other Party</option>
                <option value="value">Sort by Value</option>
              </select>
              <ArrowUpDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--foreground-muted)' }} />
            </div>

            <button
              className="px-5 py-2.5 rounded-xl border transition-colors flex items-center justify-center gap-2"
              onClick={() => setIsUploadContractModalOpen(true)}
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Contract</span>
            </button>
            <button
              onClick={() => setIsNewContractModalOpen(true)}
              className="px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              <FileText className="w-4 h-4" />
              <span>New Contract</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-none mb-6 md:mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="rounded-2xl border p-6 border-slate-100"
            style={{
              backgroundColor: 'var(--card)',
            }}
          >
            <div className="text-sm mb-1" style={{ color: 'var(--foreground-muted)' }}>
              Total Contracts
            </div>
            <div className="text-3xl" style={{ color: 'var(--foreground)' }}>
              {stats.total}
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 border-slate-100"
            style={{
              backgroundColor: 'var(--card)',
            }}
          >
            <div className="text-sm mb-1" style={{ color: 'var(--foreground-muted)' }}>
              Active
            </div>
            <div className="text-3xl" style={{ color: 'var(--status-compliant)' }}>
              {stats.active}
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 border-slate-100"
            style={{
              backgroundColor: 'var(--card)',
            }}
          >
            <div className="text-sm mb-1" style={{ color: 'var(--foreground-muted)' }}>
              Expiring
            </div>
            <div className="text-3xl" style={{ color: 'var(--status-at-risk)' }}>
              {stats.expiring}
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 border-slate-100"
            style={{
              backgroundColor: 'var(--card)',
            }}
          >
            <div className="text-sm mb-1" style={{ color: 'var(--foreground-muted)' }}>
              Expired
            </div>
            <div className="text-3xl" style={{ color: 'var(--status-non-compliant)' }}>
              {stats.expired}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex-none mb-6 md:mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: 'var(--foreground-muted)' }}
            />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border"
              style={{
                backgroundColor: 'var(--input-background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            />
          </div>
          
          {/* Mobile: Dropdown filter */}
          <div className="md:hidden">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            >
              <option value="all">All Contracts</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Desktop: Button filters */}
          <div className="hidden md:flex gap-2">
            {[
              { value: 'all', label: 'All Contracts' },
              { value: 'active', label: 'Active' },
              { value: 'expiring', label: 'Expiring' },
              { value: 'expired', label: 'Expired' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value as any)}
                className="px-4 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: filterStatus === filter.value ? 'var(--primary)' : 'var(--panel)',
                  color: filterStatus === filter.value ? 'var(--primary-foreground)' : 'var(--foreground-muted)'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:flex flex-col flex-1 min-h-0 rounded-2xl border border-slate-100 overflow-hidden bg-[var(--card)]">
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full relative">
            <thead className="sticky top-0 z-10 bg-[var(--card)] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Other Party (Vendor)
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Property / Association
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Contract Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  End Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Value
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Auto-Renewal
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Risk Score
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((contract, index) => {
                const statusConfig = getStatusConfig(contract.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr 
                    key={contract.id}
                    className="group transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all"
                        >
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {contract.vendorName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {contract.propertyName}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-slate-500">
                        {contract.contractType}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-slate-500">
                        {new Date(contract.startDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-slate-500">
                        {new Date(contract.endDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {contract.value}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div 
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium w-fit min-w-[90px]"
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.text
                        }}
                      >
                        {statusConfig.label}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-slate-500">
                        {contract.autoRenewal ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      {contract.riskScore && (
                        <div 
                          className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium w-fit min-w-[90px]"
                          style={{
                            backgroundColor: contract.riskScore === 'high' ? 'var(--status-non-compliant-bg)' : 
                                           contract.riskScore === 'medium' ? 'var(--status-at-risk-bg)' : 
                                           'var(--status-compliant-bg)',
                            color: contract.riskScore === 'high' ? 'var(--status-non-compliant)' : 
                                   contract.riskScore === 'medium' ? 'var(--status-at-risk)' : 
                                   'var(--status-compliant)'
                          }}
                        >
                          {contract.riskScore.charAt(0).toUpperCase() + contract.riskScore.slice(1)}
                        </div>
                      )}
                      {!contract.riskScore && <span className="text-xs text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="grid grid-cols-[80px_100px_32px] items-center gap-1 justify-end">
                        <div className="flex justify-center">
                          <Link
                            to={`/contracts/${contract.id}`}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            Manage
                          </Link>
                        </div>
                        <div className="flex justify-start pl-4">
                          {contract.documentUrl ? (
                            <button
                              onClick={() => setViewingDocument(contract)}
                              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                              title="View contract document"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          ) : (
                            <>
                              <label
                                htmlFor={`upload-${contract.id}`}
                                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                                title="Upload contract document"
                              >
                                {uploadingContractId === contract.id ? (
                                  'Uploading...'
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4" />
                                    Upload
                                  </>
                                )}
                              </label>
                              <input
                                id={`upload-${contract.id}`}
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                className="hidden"
                                disabled={uploadingContractId === contract.id}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUploadDocumentToContract(contract.id, file);
                                  }
                                }}
                              />
                            </>
                          )}
                        </div>
                        <div className="flex justify-center">
                          {contract.documentUrl && (
                            <a
                              href={contract.documentUrl}
                              download={contract.documentName}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                              title="Download contract document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredContracts.map((contract) => {
          const statusConfig = getStatusConfig(contract.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div
              key={contract.id}
              className="rounded-2xl border p-4 border-slate-100"
              style={{
                backgroundColor: 'var(--card)',
              }}
            >
              {/* Vendor Name & Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--panel)' }}
                  >
                    <FileText className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium" style={{ color: 'var(--foreground)' }}>
                      {contract.vendorName}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                      <Building2 className="w-3 h-3" />
                      {contract.propertyName}
                    </div>
                  </div>
                </div>
                <div 
                  className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ml-2 w-fit min-w-[90px]"
                  style={{
                    backgroundColor: statusConfig.bg,
                    color: statusConfig.text
                  }}
                >
                  {statusConfig.label}
                </div>
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <div className="text-xs mb-1" style={{ color: 'var(--foreground-subtle)' }}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Expires
                  </div>
                  <div style={{ color: 'var(--foreground)' }}>
                    {new Date(contract.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: 'var(--foreground-subtle)' }}>
                    Value
                  </div>
                  <div style={{ color: 'var(--foreground)' }}>
                    {contract.value}
                  </div>
                </div>
              </div>

              {/* Days Remaining Badge */}
              <div className="mb-3">
                {(() => {
                  const today = new Date();
                  const endDate = new Date(contract.endDate);
                  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                      style={{
                        backgroundColor: daysRemaining < 0 
                          ? 'var(--status-non-compliant-bg)'
                          : daysRemaining <= 30
                          ? 'var(--status-at-risk-bg)'
                          : 'var(--panel)',
                        color: daysRemaining < 0 
                          ? 'var(--status-non-compliant)'
                          : daysRemaining <= 30
                          ? 'var(--status-at-risk)'
                          : 'var(--foreground-muted)'
                      }}
                    >
                      {daysRemaining < 0 ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          Expired {Math.abs(daysRemaining)} days ago
                        </>
                      ) : daysRemaining <= 7 ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          Expiring within 7 days • Critical
                        </>
                      ) : daysRemaining <= 30 ? (
                        <>
                          <Clock className="w-4 h-4" />
                          {daysRemaining} days remaining
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {daysRemaining} days remaining
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Action Button */}
              <div className="flex gap-2 mb-3">
                <Link
                  to={`/contracts/${contract.id}`}
                  className="flex-1 px-3 py-2 rounded-lg text-sm transition-colors border text-center font-medium"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  Manage Details
                </Link>
              </div>

              {contract.documentUrl ? (
                <button
                  onClick={() => setViewingDocument(contract)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  <Eye className="w-4 h-4" />
                  View Contract
                </button>
              ) : (
                <>
                  <label
                    htmlFor={`upload-mobile-${contract.id}`}
                    className="w-full px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: 'var(--panel)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {uploadingContractId === contract.id ? (
                      'Uploading...'
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Contract
                      </>
                    )}
                  </label>
                  <input
                    id={`upload-mobile-${contract.id}`}
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    className="hidden"
                    disabled={uploadingContractId === contract.id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadDocumentToContract(contract.id, file);
                      }
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* New Contract Modal */}
      <NewContractModal
        isOpen={isNewContractModalOpen}
        onClose={() => setIsNewContractModalOpen(false)}
        onSuccess={() => loadContracts()}
      />

      {/* Upload Contract Modal */}
      <UploadContractModal
        isOpen={isUploadContractModalOpen}
        onClose={() => setIsUploadContractModalOpen(false)}
        onSuccess={() => loadContracts()}
      />

      {/* Document Viewer Modal */}
      {viewingDocument && viewingDocument.documentUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          onClick={() => setViewingDocument(null)}
        >
          <div 
            className="rounded-2xl border border-slate-100 max-w-5xl w-full h-[90vh] flex flex-col"
            style={{
              backgroundColor: 'var(--card)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-xl mb-1" style={{ color: 'var(--foreground)' }}>
                  {viewingDocument.documentName || 'Contract Document'}
                </h2>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                  {viewingDocument.documentType} • {viewingDocument.documentSize}
                </p>
              </div>
              <button
                onClick={() => setViewingDocument(null)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: 'var(--foreground-muted)' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {viewingDocument.documentType === 'PDF' ? (
                <iframe
                  src={viewingDocument.documentUrl}
                  className="w-full h-full rounded-lg"
                  title={viewingDocument.documentName || 'Contract'}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={viewingDocument.documentUrl}
                    alt={viewingDocument.documentName || 'Contract'}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <a
                href={viewingDocument.documentUrl}
                download={viewingDocument.documentName}
                className="px-6 py-3 rounded-lg border transition-all text-sm inline-flex items-center gap-2"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <button
                className="px-6 py-3 rounded-lg transition-all text-sm"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
                onClick={() => setViewingDocument(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}