import { useState, useEffect } from 'react';
import { adminApi, supabase } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Users, ShieldCheck, Mail, Lock, DollarSign, Search, Trash2, Ban, MoreHorizontal, UserX, AlertTriangle, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Badge } from './ui/badge';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
  // Action states
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToCancel, setUserToCancel] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();

    // Subscribe to real-time updates from server with proper connection handling
    let channel: any = null;
    let presenceChannel: any = null;
    
    // Delay subscription to ensure Supabase is fully initialized
    const setupRealtimeSubscription = async () => {
      try {
        // Wait for auth to be ready
        await supabase.auth.getSession();
        
        // Channel for data updates (broadcasts)
        channel = supabase
          .channel('admin-dashboard', {
            config: {
              broadcast: { self: true },
            },
          })
          .on(
            'broadcast',
            { event: 'users-updated' },
            (payload) => {
              console.log('Real-time update detected:', payload);
              // Reload data when update is received
              checkAdminAndLoad();
            }
          )
          .subscribe();

        // Channel for tracking online users (presence)
        presenceChannel = supabase
          .channel('online-users')
          .on('presence', { event: 'sync' }, () => {
            const newState = presenceChannel.presenceState();
            const onlineIds = new Set(Object.keys(newState));
            setOnlineUsers(onlineIds);
          })
          .subscribe();

      } catch (error) {
        console.error('Failed to setup realtime subscription:', error);
      }
    };

    // Setup subscription after a brief delay to ensure everything is initialized
    const timeoutId = setTimeout(setupRealtimeSubscription, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (channel) supabase.removeChannel(channel);
      if (presenceChannel) supabase.removeChannel(presenceChannel);
    };
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.email !== 'admin@covera.co') {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      setIsAdmin(true);
      await loadUsers();
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      // Sort users by created date desc
      const sortedUsers = (response.users || []).sort((a: any, b: any) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setUsers(sortedUsers);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userToCancel) return;
    setActionLoading(true);
    try {
      await adminApi.cancelSubscription(userToCancel);
      toast.success('Subscription cancelled successfully');
      await loadUsers();
    } catch (error) {
      console.error('Cancel failed:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
      setUserToCancel(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setActionLoading(true);
    try {
      await adminApi.deleteUser(userToDelete);
      toast.success('User deleted successfully');
      await loadUsers();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(false);
      setUserToDelete(null);
    }
  };

  // Calculations
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.organizationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSubscribers = users.filter(u => 
    u.subscriptionStatus === 'active' || u.subscriptionStatus === 'trialing'
  );

  // Calculate MRR
  // Logic: Core = $399, Essentials = $199, Enterprise = $1200 (est)
  const calculateMRR = () => {
    return activeSubscribers.reduce((acc, user) => {
      // If admin, ignore
      if (user.email === 'admin@covera.co') return acc;
      
      const plan = user.plan?.toLowerCase();
      if (plan === 'core') return acc + 399;
      if (plan === 'essentials') return acc + 199;
      if (plan === 'enterprise') return acc + 1200;
      return acc;
    }, 0);
  };

  const mrr = calculateMRR();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading admin dashboard...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-4">
        <div className="bg-red-100 p-4 rounded-full">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500 max-w-md">
          You do not have permission to view this page. This area is restricted to administrators only.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Master Admin</h1>
          <p className="text-gray-500 mt-1">Manage users, subscriptions, and revenue.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={loadUsers} disabled={isLoading} className="w-full md:w-auto">
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineUsers.size}</div>
            <p className="text-xs text-muted-foreground">
              Active users currently
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all plans
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscribers.length}</div>
            <p className="text-xs text-muted-foreground">
              Paying or trialing customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue (MRR)</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mrr.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Estimated recurring revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table / List */}
      <Card className="border-t-4 border-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>Manage all registered users and their subscriptions</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={`${user.id || 'no-id'}-${user.email || 'no-email'}-${index}`}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name || 'N/A'}</span>
                          {onlineUsers.has(user.id) && (
                            <div className="relative flex h-2 w-2" title="Online now">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {user.organizationName || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize font-medium">
                        {user.plan || 'Free'}
                        {user.plan === 'core' && <span className="ml-2 text-xs text-blue-600">($399)</span>}
                        {user.plan === 'essentials' && <span className="ml-2 text-xs text-blue-600">($199)</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getSubscriptionBadge(user.subscriptionStatus)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminActionMenu 
                        user={user} 
                        onCancel={() => setUserToCancel(user.id)}
                        onDelete={() => setUserToDelete(user.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found matching "{searchQuery}"
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden space-y-4">
            {filteredUsers.map((user, index) => (
              <div key={`${user.id || 'mobile'}-${index}`} className="p-4 border border-slate-100 rounded-2xl bg-white space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-900">{user.name || 'N/A'}</div>
                      {onlineUsers.has(user.id) && (
                        <div className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground break-all">{user.email}</div>
                  </div>
                  {getSubscriptionBadge(user.subscriptionStatus)}
                </div>
                
                <div className="flex justify-between items-center text-sm pt-2">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {user.organizationName || 'N/A'}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="capitalize">Plan: {user.plan || 'Free'}</span>
                  <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>

                <div className="flex justify-end pt-3 border-t mt-2">
                  <AdminActionMenu 
                     user={user} 
                     onCancel={() => setUserToCancel(user.id)}
                     onDelete={() => setUserToDelete(user.id)}
                  />
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                No users found matching "{searchQuery}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={!!userToCancel} onOpenChange={(open) => !open && setUserToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately cancel the user's subscription in Stripe and downgrade them to the Free plan. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleCancelSubscription(); }}
              className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-600"
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Yes, Cancel Subscription'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete User Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is <span className="font-bold text-red-600">IRREVERSIBLE</span>. 
              It will permanently delete the user account, all associated data, files, and cancel any active subscriptions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleDeleteUser(); }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Yes, Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Extracted Action Menu to re-use in both views
function AdminActionMenu({ user, onCancel, onDelete }: { user: any, onCancel: () => void, onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
          Copy Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {(user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing') && user.email !== 'admin@covera.co' && (
          <DropdownMenuItem 
            onClick={onCancel}
            className="text-orange-600 focus:text-orange-600"
          >
            <Ban className="mr-2 h-4 w-4" />
            Cancel Subscription
          </DropdownMenuItem>
        )}
        
        {user.email !== 'admin@covera.co' && (
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-red-600 focus:text-red-600"
          >
            <UserX className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getSubscriptionBadge(status: string | undefined) {
  if (!status) return <Badge variant="secondary">Unknown</Badge>;
  
  switch (status) {
    case 'active':
      return <Badge className="bg-[var(--status-compliant-bg)] text-[var(--status-compliant)] border-[var(--status-compliant-border)] hover:bg-[var(--status-compliant-bg)]">Active</Badge>;
    case 'trialing':
      return <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50">Trial</Badge>;
    case 'canceled':
      return <Badge variant="destructive" className="bg-[var(--status-non-compliant-bg)] text-[var(--status-non-compliant)] border-[var(--status-non-compliant-border)] hover:bg-[var(--status-non-compliant-bg)]">Cancelled</Badge>;
    case 'past_due':
      return <Badge variant="outline" className="text-[var(--status-at-risk)] border-[var(--status-at-risk-border)] bg-[var(--status-at-risk-bg)]">Past Due</Badge>;
    case 'inactive':
    case 'free':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Free</Badge>;
    default:
      return <Badge variant="outline" className="capitalize">{status}</Badge>;
  }
}