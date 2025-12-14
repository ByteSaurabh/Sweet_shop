import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsAPI } from '@/lib/api';
import { Sweet, SweetFormData } from '@/types/sweet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useSweets(searchQuery?: string, category?: string, minPrice?: number, maxPrice?: number) {
  return useQuery({
    queryKey: ['sweets', searchQuery, category, minPrice, maxPrice],
    queryFn: async () => {
      // If any filters are provided, use search endpoint
      if (searchQuery || category || minPrice !== undefined || maxPrice !== undefined) {
        const response = await sweetsAPI.search({
          name: searchQuery,
          category,
          minPrice,
          maxPrice,
        });
        return response.data as Sweet[];
      }
      
      // Otherwise get all sweets
      const response = await sweetsAPI.getAll();
      return response.data as Sweet[];
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await sweetsAPI.getCategories();
      return response.data as string[];
    },
  });
}

export function useCreateSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (sweet: SweetFormData) => {
      const response = await sweetsAPI.create(sweet);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Sweet added!",
        description: "The new sweet has been added to the shop.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...sweet }: SweetFormData & { id: string }) => {
      const response = await sweetsAPI.update(id, sweet);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Sweet updated!",
        description: "The sweet has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await sweetsAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Sweet deleted",
        description: "The sweet has been removed from the shop.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    },
  });
}

export function usePurchaseSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ sweetId, quantity }: { sweetId: string; quantity: number }) => {
      const response = await sweetsAPI.purchase(sweetId, quantity);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast({
        title: "Purchase successful! 🍬",
        description: `Total: $${data.totalPrice.toFixed(2)}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase failed",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRestockSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await sweetsAPI.restock(id, quantity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast({
        title: "Stock updated!",
        description: "The inventory has been restocked.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    },
  });
}
