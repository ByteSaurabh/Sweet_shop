import { useQuery } from '@tanstack/react-query';
import { purchasesAPI } from '@/lib/api';
import { useAuth } from './useAuth';

export interface PurchaseWithSweet {
  id: string;
  quantity: number;
  total_price: number;
  created_at: string;
  sweets: {
    id: string;
    name: string;
    category: string;
    price: number;
    image_url: string | null;
  } | null;
}

export function usePurchases() {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const response = await purchasesAPI.getAll(isAdmin);
      return response.data as PurchaseWithSweet[];
    },
    enabled: !!user,
  });
}
