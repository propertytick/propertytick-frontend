'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data } = await api.get('/wallet/me');
      return data.data.wallet;
    },
  });
}

export function useWalletPacks() {
  return useQuery({
    queryKey: ['wallet-packs'],
    queryFn: async () => {
      const { data } = await api.get('/wallet/packs');
      return data.data;
    },
  });
}
