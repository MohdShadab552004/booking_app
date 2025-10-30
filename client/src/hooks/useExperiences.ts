import { useState, useEffect } from 'react';
import type { Experience } from '../types';
import { experienceAPI } from '../api/api';

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await experienceAPI.getAll();
        if (response.success) {
          setExperiences(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return { experiences, loading, error };
};

export const useExperience = (id: string) => {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await experienceAPI.getById(id);
        if (response.success) {
          setExperience(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experience');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id]);

  return { experience, loading, error };
};