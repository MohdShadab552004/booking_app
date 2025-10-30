import { useState } from 'react';
import type { BookingData, PromoValidation } from '../types';
import { bookingAPI } from '../api/api';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: BookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.create(bookingData);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const validatePromo = async (promoData: PromoValidation) => {
    try {
      const response = await bookingAPI.validatePromo(promoData);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate promo';
      throw new Error(message);
    }
  };

  return { createBooking, validatePromo, loading, error };
};