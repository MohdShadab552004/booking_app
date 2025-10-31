import type { Experience, BookingData, PromoValidation, BookingResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Common fetch function
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Experience APIs
export const experienceAPI = {
  // Get all experiences
  getAll: async (): Promise<{ success: boolean; data: Experience[] }> => {
    return fetchAPI('/experiences');
  },

  // Get single experience by ID
  getById: async (id: string): Promise<{ success: boolean; data: Experience }> => {
    return fetchAPI(`/experiences/${id}`);
  },

  // Check slot availability
  checkAvailability: async (experienceId: string, slotId: string, participants: number) => {
    return fetchAPI('/experiences/check-slot', {
      method: 'POST',
      body: JSON.stringify({ experienceId, slotId, participants }),
    });
  },
};

// Booking APIs
export const bookingAPI = {
  // Create new booking
  create: async (bookingData: BookingData): Promise<{ success: boolean; data: BookingResponse }> => {
    return fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Validate promo code
  validatePromo: async (promoData: PromoValidation) => {
    return fetchAPI('/bookings/validate-promo', {
      method: 'POST',
      body: JSON.stringify(promoData),
    });
  },

  // Get booking by ID
  getById: async (id: string) => {
    return fetchAPI(`/bookings/${id}`);
  },
};