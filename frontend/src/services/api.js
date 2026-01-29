const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include', // Include cookies
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.errors?.[0] || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

// Auth Services
export const requestOTP = (endpoint, payload) => {
  return api(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const verifyOTP = (payload) => {
  return api('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

// Application Services
export const getApplication = (appId) => {
  return api(`/application/${appId}`, {
    method: 'GET'
  });
};

export const updateApplicationForm = (appId, formData) => {
  return api(`/application/${appId}/form`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  });
};

export const uploadFiles = async (appId, files) => {
  const formData = new FormData();
  
  if (files.photo) formData.append('photo', files.photo);
  if (files.firCopy) formData.append('firCopy', files.firCopy);
  if (files.paymentReceipt) formData.append('paymentReceipt', files.paymentReceipt);

  const response = await fetch(`${API_BASE_URL}/application/${appId}/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data;
};

export const submitApplication = (appId) => {
  return api(`/application/${appId}/submit`, {
    method: 'POST'
  });
};

// Admin Services
export const adminLogin = (credentials) => {
  return api('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const adminLogout = () => {
  return api('/admin/logout', {
    method: 'POST'
  });
};

export const getDashboardStats = () => {
  return api('/admin/dashboard/stats', {
    method: 'GET'
  });
};

export const getApplications = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api(`/admin/applications?${queryString}`, {
    method: 'GET'
  });
};

export const getApplicationDetail = (appId) => {
  return api(`/admin/applications/${appId}`, {
    method: 'GET'
  });
};

export const approveApplication = (appId, notes = '') => {
  return api(`/admin/applications/${appId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ adminNotes: notes })
  });
};

export const rejectApplication = (appId, rejectionReason, notes = '') => {
  return api(`/admin/applications/${appId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ rejectionReason, adminNotes: notes })
  });
};

export const softDeleteApplication = (appId) => {
  return api(`/admin/applications/${appId}/soft-delete`, {
    method: 'PUT'
  });
};

export const hardDeleteApplication = (appId) => {
  return api(`/admin/applications/${appId}/hard-delete`, {
    method: 'DELETE'
  });
};

export default api;
