import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sweet, SweetFormData } from '@/types/sweet';
import { useCreateSweet, useUpdateSweet } from '@/hooks/useSweets';
import { z } from 'zod';

const sweetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1, 'Category is required').max(50),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  image_url: z.string().url().optional().or(z.literal('')),
});

interface SweetFormProps {
  sweet?: Sweet;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SweetForm({ sweet, onSuccess, onCancel }: SweetFormProps) {
  const [formData, setFormData] = useState<SweetFormData>({
    name: sweet?.name || '',
    description: sweet?.description || '',
    category: sweet?.category || '',
    price: sweet?.price || 0,
    quantity: sweet?.quantity || 0,
    image_url: sweet?.image_url || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const createMutation = useCreateSweet();
  const updateMutation = useUpdateSweet();
  
  const isEditing = !!sweet;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const dataToValidate = {
      ...formData,
      description: formData.description || undefined,
      image_url: formData.image_url || undefined,
    };
    
    const result = sweetSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: sweet.id, ...formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onSuccess?.();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleChange = (field: keyof SweetFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Chocolate Truffle"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Chocolate, Candy, Gummy..."
            className={errors.category ? 'border-destructive' : ''}
          />
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe this delicious treat..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            className={errors.price ? 'border-destructive' : ''}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
            className={errors.quantity ? 'border-destructive' : ''}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => handleChange('image_url', e.target.value)}
            placeholder="https://..."
            className={errors.image_url ? 'border-destructive' : ''}
          />
          {errors.image_url && (
            <p className="text-sm text-destructive">{errors.image_url}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="candy" disabled={isPending}>
          {isPending ? 'Saving...' : isEditing ? 'Update Sweet' : 'Add Sweet'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </motion.form>
  );
}
