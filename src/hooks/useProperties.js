'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useProperties(params = {}) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: async () => {
      const { data } = await api.get('/properties', { params });
      return data;
    },
  });
}

export function useProperty(id) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data } = await api.get(`/properties/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}
