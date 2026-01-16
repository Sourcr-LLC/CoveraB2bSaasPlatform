import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, FileText, CheckCircle2, AlertTriangle, Clock, Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/api';
import { projectId } from '../../../utils/supabase/info';
import { toast } from 'sonner';
import { isDemoMode, demoContracts } from '../lib/demoData';

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  description?: string;
}

interface Deliverable {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
}

interface SLA {
  id: string;
  metric: string;
  target: string;
  actual: string;
  status: 'compliant' | 'breached' | 'warning';
}

interface Contract {
  id: string;
  vendorName: string;
  contractType: string;
  startDate: string;
  endDate: string;
  value: string;
  status: 'active' | 'expiring' | 'expired';
  autoRenewal: boolean;
  documentUrl?: string;
  // New detailed fields
  projectName?: string;
  description?: string;
  scopeOfWork?: string;
  milestones?: Milestone[];
  deliverables?: Deliverable[];
  slas?: SLA[];
}

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'slas'>('overview');
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedContract, setEditedContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (id) {
      loadContract();
    }
  }, [id]);

  const loadContract = async () => {
    try {
      if (isDemoMode()) {
        const demoContract = demoContracts.find(c => c.id === id);
        if (demoContract) {
          // Map demo contract to Contract interface
          const mappedContract: Contract = {
            id: demoContract.id,
            vendorName: demoContract.vendorName,
            contractType: demoContract.contractName,
            startDate: demoContract.startDate,
            endDate: demoContract.endDate,
            value: demoContract.value,
            status: demoContract.status,
            autoRenewal: demoContract.autoRenew,
            documentUrl: demoContract.documentUrl,
            projectName: demoContract.contractName,
            description: 'This is a demo contract description.',
            scopeOfWork: 'This is the scope of work for the demo contract. It includes various deliverables and milestones.',
            milestones: [
              { id: '1', title: 'Phase 1 Completion', dueDate: new Date().toISOString().split('T')[0], status: 'completed' },
              { id: '2', title: 'Phase 2 Kickoff', dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], status: 'pending' }
            ],
            slas: [
              { id: '1', metric: 'Uptime', target: '99.9%', actual: '99.95%', status: 'compliant' },
              { id: '2', metric: 'Response Time', target: '< 4 hours', actual: '2 hours', status: 'compliant' }
            ]
          };
          setContract(mappedContract);
          setEditedContract(mappedContract);
          setIsLoading(false);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/contracts/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch contract');

      const data = await response.json();
      
      // Ensure arrays exist
      if (!data.milestones) data.milestones = [];
      if (!data.deliverables) data.deliverables = [];
      if (!data.slas) data.slas = [];
      
      setContract(data);
      setEditedContract(data);
    } catch (error) {
      console.error('Error loading contract:', error);
      toast.error('Failed to load contract details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedContract) return;

    try {
      if (isDemoMode()) {
        setContract(editedContract);
        setIsEditing(false);
        toast.success('Contract updated successfully (Demo Mode)');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/contracts/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedContract),
        }
      );

      if (!response.ok) throw new Error('Failed to update contract');

      setContract(editedContract);
      setIsEditing(false);
      toast.success('Contract updated successfully');
    } catch (error) {
      console.error('Error updating contract:', error);
      toast.error('Failed to update contract');
    }
  };

  const addMilestone = () => {
    if (!editedContract) return;
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: 'New Milestone',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setEditedContract({
      ...editedContract,
      milestones: [...(editedContract.milestones || []), newMilestone]
    });
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    if (!editedContract?.milestones) return;
    const newMilestones = [...editedContract.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setEditedContract({ ...editedContract, milestones: newMilestones });
  };

  const deleteMilestone = (index: number) => {
    if (!editedContract?.milestones) return;
    const newMilestones = [...editedContract.milestones];
    newMilestones.splice(index, 1);
    setEditedContract({ ...editedContract, milestones: newMilestones });
  };

  const addSLA = () => {
    if (!editedContract) return;
    const newSLA: SLA = {
      id: Date.now().toString(),
      metric: 'New Metric',
      target: '99.9%',
      actual: '100%',
      status: 'compliant'
    };
    setEditedContract({
      ...editedContract,
      slas: [...(editedContract.slas || []), newSLA]
    });
  };

  const updateSLA = (index: number, field: keyof SLA, value: any) => {
    if (!editedContract?.slas) return;
    const newSLAs = [...editedContract.slas];
    newSLAs[index] = { ...newSLAs[index], [field]: value };
    setEditedContract({ ...editedContract, slas: newSLAs });
  };

  const deleteSLA = (index: number) => {
    if (!editedContract?.slas) return;
    const newSLAs = [...editedContract.slas];
    newSLAs.splice(index, 1);
    setEditedContract({ ...editedContract, slas: newSLAs });
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Loading contract details...</div>;
  }

  if (!contract) {
    return <div className="p-12 text-center text-gray-500">Contract not found</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <Link 
        to="/contracts"
        className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Contracts
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editedContract?.vendorName}
                onChange={(e) => setEditedContract({ ...editedContract!, vendorName: e.target.value })}
                className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              />
            ) : (
              contract.vendorName
            )}
          </h1>
          <div className="text-gray-500">
            {isEditing ? (
              <input
                type="text"
                value={editedContract?.contractType}
                onChange={(e) => setEditedContract({ ...editedContract!, contractType: e.target.value })}
                className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Contract Type"
              />
            ) : (
              contract.contractType
            )}
            <span className="mx-2">•</span>
            {contract.status === 'active' && <span className="text-green-600 font-medium">Active</span>}
            {contract.status === 'expiring' && <span className="text-amber-600 font-medium">Expiring Soon</span>}
            {contract.status === 'expired' && <span className="text-red-600 font-medium">Expired</span>}
          </div>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setEditedContract(contract);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Contract
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'milestones'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Milestones & Deliverables
          </button>
          <button
            onClick={() => setActiveTab('slas')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'slas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Service Level Agreements (SLAs)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Scope</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={editedContract?.projectName || ''}
                        onChange={(e) => setEditedContract({ ...editedContract!, projectName: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Website Redesign"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editedContract?.description || ''}
                        onChange={(e) => setEditedContract({ ...editedContract!, description: e.target.value })}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Project description..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Work</label>
                      <textarea
                        value={editedContract?.scopeOfWork || ''}
                        onChange={(e) => setEditedContract({ ...editedContract!, scopeOfWork: e.target.value })}
                        rows={6}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Detailed scope of work..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Project Name</h3>
                      <p className="text-gray-900">{contract.projectName || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                      <p className="text-gray-900">{contract.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Scope of Work</h3>
                      <p className="text-gray-900 whitespace-pre-wrap">{contract.scopeOfWork || 'No scope defined'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Dates</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Start Date</div>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedContract?.startDate}
                        onChange={(e) => setEditedContract({ ...editedContract!, startDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-900 font-medium">{new Date(contract.startDate).toLocaleDateString()}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">End Date</div>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedContract?.endDate}
                        onChange={(e) => setEditedContract({ ...editedContract!, endDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-900 font-medium">{new Date(contract.endDate).toLocaleDateString()}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Auto-Renewal</div>
                    {isEditing ? (
                      <select
                        value={editedContract?.autoRenewal ? 'true' : 'false'}
                        onChange={(e) => setEditedContract({ ...editedContract!, autoRenewal: e.target.value === 'true' })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      <div className="text-gray-900">{contract.autoRenewal ? 'Yes' : 'No'}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Financials</h2>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Contract Value</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedContract?.value}
                      onChange={(e) => setEditedContract({ ...editedContract!, value: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <div className="text-2xl font-semibold text-gray-900">{contract.value}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Project Milestones</h2>
              {isEditing && (
                <button
                  onClick={addMilestone}
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Milestone
                </button>
              )}
            </div>
            
            <div className="divide-y divide-gray-200">
              {(isEditing ? editedContract?.milestones : contract.milestones)?.map((milestone, index) => (
                <div key={milestone.id} className="p-6 flex items-start gap-4">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    milestone.status === 'completed' ? 'border-green-500 bg-green-50' : 
                    milestone.status === 'overdue' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}>
                    {milestone.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                  </div>
                  
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          className="p-2 border border-gray-300 rounded-lg"
                          placeholder="Milestone Title"
                        />
                        <input
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                          className="p-2 border border-gray-300 rounded-lg"
                        />
                        <select
                          value={milestone.status}
                          onChange={(e) => updateMilestone(index, 'status', e.target.value)}
                          className="p-2 border border-gray-300 rounded-lg"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="overdue">Overdue</option>
                        </select>
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => deleteMilestone(index)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                            milestone.status === 'overdue' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              {(!contract.milestones || contract.milestones.length === 0) && !isEditing && (
                <div className="p-8 text-center text-gray-500">
                  No milestones defined yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'slas' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Service Level Agreements (SLAs)</h2>
              {isEditing && (
                <button
                  onClick={addSLA}
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add SLA
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Performance</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {isEditing && <th className="px-6 py-4"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(isEditing ? editedContract?.slas : contract.slas)?.map((sla, index) => (
                    <tr key={sla.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={sla.metric}
                            onChange={(e) => updateSLA(index, 'metric', e.target.value)}
                            className="p-1 border border-gray-300 rounded w-full"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{sla.metric}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={sla.target}
                            onChange={(e) => updateSLA(index, 'target', e.target.value)}
                            className="p-1 border border-gray-300 rounded w-full"
                          />
                        ) : (
                          <span className="text-gray-500">{sla.target}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         {isEditing ? (
                          <input
                            type="text"
                            value={sla.actual}
                            onChange={(e) => updateSLA(index, 'actual', e.target.value)}
                            className="p-1 border border-gray-300 rounded w-full"
                          />
                        ) : (
                          <span className="text-gray-900">{sla.actual}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={sla.status}
                            onChange={(e) => updateSLA(index, 'status', e.target.value)}
                            className="p-1 border border-gray-300 rounded"
                          >
                            <option value="compliant">Compliant</option>
                            <option value="warning">Warning</option>
                            <option value="breached">Breached</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            sla.status === 'compliant' ? 'bg-green-100 text-green-800' :
                            sla.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sla.status.charAt(0).toUpperCase() + sla.status.slice(1)}
                          </span>
                        )}
                      </td>
                      {isEditing && (
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => deleteSLA(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {(!contract.slas || contract.slas.length === 0) && !isEditing && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No SLAs defined for this contract.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}