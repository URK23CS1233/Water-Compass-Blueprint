const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Well API
export const wellApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/wells`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/wells/${id}`);
    return response.json();
  },

  getNearby: async (lng: number, lat: number, maxDistance = 10000) => {
    const response = await fetch(
      `${API_BASE_URL}/wells/nearby/${lng}/${lat}?maxDistance=${maxDistance}`
    );
    return response.json();
  },

  create: async (well: any) => {
    const response = await fetch(`${API_BASE_URL}/wells`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(well),
    });
    return response.json();
  },

  update: async (id: string, well: any) => {
    const response = await fetch(`${API_BASE_URL}/wells/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(well),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/wells/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Reading API
export const readingApi = {
  getForWell: async (wellId: string) => {
    const response = await fetch(`${API_BASE_URL}/readings/well/${wellId}`);
    return response.json();
  },

  getLatest: async (wellId: string) => {
    const response = await fetch(`${API_BASE_URL}/readings/well/${wellId}/latest`);
    return response.json();
  },

  getRange: async (wellId: string, startDate: string, endDate: string) => {
    const response = await fetch(
      `${API_BASE_URL}/readings/well/${wellId}/range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.json();
  },

  create: async (reading: any) => {
    const response = await fetch(`${API_BASE_URL}/readings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reading),
    });
    return response.json();
  },
};

// Alert API
export const alertApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    return response.json();
  },

  getUnread: async () => {
    const response = await fetch(`${API_BASE_URL}/alerts/unread`);
    return response.json();
  },

  getForWell: async (wellId: string) => {
    const response = await fetch(`${API_BASE_URL}/alerts/well/${wellId}`);
    return response.json();
  },

  create: async (alert: any) => {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
    return response.json();
  },

  markAsRead: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}/read`, {
      method: 'PUT',
    });
    return response.json();
  },
};

// Forecast API
export const forecastApi = {
  getForWell: async (wellId: string) => {
    const response = await fetch(`${API_BASE_URL}/forecasts/well/${wellId}`);
    return response.json();
  },

  create: async (forecast: any) => {
    const response = await fetch(`${API_BASE_URL}/forecasts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forecast),
    });
    return response.json();
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};
