import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3`;

// Singleton Supabase client instance - using window to persist across HMR
declare global {
  interface Window {
    __supabaseClient?: SupabaseClient;
  }
}

// Create Supabase client for auth (singleton pattern with HMR support)
export const supabase = (() => {
  // Check if we already have an instance in window (survives HMR)
  if (typeof window !== 'undefined' && window.__supabaseClient) {
    return window.__supabaseClient;
  }
  
  const client = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb-gpnvockmgvysulsxxtyi-auth-token',
      },
      realtime: {
        params: {
          eventsPerSecond: 2,
        },
        // Prevent realtime errors from breaking the app
        log_level: 'info',
      },
      global: {
        headers: {
          'x-application-name': 'covera',
        },
      },
    }
  );
  
  // Store in window to survive HMR
  if (typeof window !== 'undefined') {
    window.__supabaseClient = client;
  }
  
  return client;
})();

// Helper to get auth token
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || publicAnonKey;
}

// Helper for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Handle authentication errors
  if (response.status === 401 || response.status === 403) {
    console.error('🔒 Authentication error - session expired, redirecting to login');
    // Clear localStorage directly (don't call signOut API as session is already invalid)
    localStorage.removeItem('sb-gpnvockmgvysulsxxtyi-auth-token');
    sessionStorage.clear();
    // Redirect only once
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  signUpRequest: async (email: string, name: string) => {
    return apiCall('/auth/signup-request', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  },

  signUpVerify: async (email: string, code: string, password: string, name: string, organizationName?: string) => {
    // Verify and create user
    await apiCall('/auth/signup-verify', {
      method: 'POST',
      body: JSON.stringify({ email, code, password, name, organizationName }),
    });
    
    // Then sign them in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    
    return { user: data.user, session: data.session };
  },

  signUp: async (email: string, password: string, name: string, organizationName?: string) => {
    // First create the user via API
    const result = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, organizationName }),
    });
    
    // Then sign them in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    
    return { user: data.user, session: data.session };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    
    return { user: data.user, session: data.session };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  getProfile: async () => {
    return apiCall('/auth/profile');
  },

  updateProfile: async (data: { organizationName: string }) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Vendor API
export const vendorApi = {
  getAll: async () => {
    return apiCall('/vendors');
  },

  getOne: async (id: string) => {
    return apiCall(`/vendors/${id}`);
  },

  create: async (vendorData: any) => {
    return apiCall('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  },

  update: async (id: string, vendorData: any) => {
    return apiCall(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/vendors/${id}`, {
      method: 'DELETE',
    });
  },

  getActivities: async (id: string) => {
    return apiCall(`/vendors/${id}/activities`);
  },

  generateUploadLink: async (id: string) => {
    return apiCall(`/vendors/${id}/upload-link`, {
      method: 'POST',
      body: JSON.stringify({ origin: window.location.origin }),
    });
  },

  sendReminder: async (id: string) => {
    return apiCall(`/vendors/${id}/send-reminder`, {
      method: 'POST',
      body: JSON.stringify({ origin: window.location.origin }),
    });
  },

  uploadCOI: async (id: string, file: File) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error('No authentication token');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/vendors/${id}/upload-coi`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  deleteCOI: async (id: string, documentPath: string) => {
    return apiCall(`/vendors/${id}/delete-coi`, {
      method: 'DELETE',
      body: JSON.stringify({ documentPath }),
    });
  },
  
  // Analyze COI document
  analyzeCOI: async (file: File) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error('No authentication token');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/documents/analyze-coi`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    return response.json();
  },
};

// Insurance API
export const insuranceApi = {
  getAll: async () => {
    return apiCall('/insurance');
  },

  create: async (policyData: any) => {
    return apiCall('/insurance', {
      method: 'POST',
      body: JSON.stringify(policyData),
    });
  },
};

// Contract API
export const contractApi = {
  getAll: async () => {
    return apiCall('/contracts');
  },

  create: async (contractData: any) => {
    return apiCall('/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  },
  
  // Analyze contract document
  analyzeContract: async (file: File) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error('No authentication token');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/documents/analyze-contract`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    return response.json();
  },

  // Upload contract with file
  uploadContract: async (file: File, contractData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error('No authentication token');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('contractData', JSON.stringify(contractData));

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/contracts/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};

// Alert API
export const alertApi = {
  getAll: async () => {
    return apiCall('/alerts');
  },

  markAsRead: async (id: string) => {
    return apiCall(`/alerts/${id}/read`, {
      method: 'PUT',
    });
  },
};

// Admin API
export const adminApi = {
  getUsers: async () => {
    return apiCall('/admin/users');
  },
  cancelSubscription: async (userId: string) => {
    return apiCall('/admin/cancel-subscription', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
  deleteUser: async (userId: string) => {
    return apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
  ensureAdminUser: async () => {
    return apiCall('/admin/ensure-admin-user', {
      method: 'POST',
    });
  },
};