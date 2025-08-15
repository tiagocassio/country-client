// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  SIGN_UP: `${API_BASE_URL}/sign_up`,
  SIGN_IN: `${API_BASE_URL}/sign_in`,
  SIGN_OUT: `${API_BASE_URL}/sign_out`,
  COUNTRIES: `${API_BASE_URL}/v1/countries`,
  COUNTRY_BY_SLUG: (slug) => `${API_BASE_URL}/v1/countries/${slug}`,
  PASSWORD_RESET: `${API_BASE_URL}/password_reset`,
  EMAIL_VERIFICATION: `${API_BASE_URL}/email_verification`,
};

export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(endpoint, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_ENDPOINTS;
