import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sweet } from '@/types/sweet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Package, Plus } from 'lucide-react';
import { useDeleteSweet, useRestockSweet } from '@/hooks/useSweets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AdminSweetCardProps {
  sweet: Sweet;
  onEdit: (sweet: Sweet) => void;
  index: number;
}

export function AdminSweetCard({ sweet, onEdit, index }: AdminSweetCardProps) {
  const [restockAmount, setRestockAmount] = useState(10);
  const [restockOpen, setRestockOpen] = useState(false);
  
  const deleteMutation = useDeleteSweet();
  const restockMutation = useRestockSweet();

  const handleRestock = () => {
    restockMutation.mutate({ id: sweet.id, quantity: restockAmount });
    setRestockOpen(false);
    setRestockAmount(10);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 hover:shadow-card transition-shadow"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
        {sweet.image_url ? (
          <img src={sweet.image_url} alt={sweet.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-foreground truncate">{sweet.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {sweet.category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            ${Number(sweet.price).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Stock */}
      <div className="text-center px-4">
        <p className={`font-display text-xl font-bold ${
          sweet.quantity === 0 ? 'text-destructive' : 
          sweet.quantity <= 5 ? 'text-candy-orange' : 'text-accent'
        }`}>
          {sweet.quantity}
        </p>
        <p className="text-xs text-muted-foreground">in stock</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
          <DialogTrigger asChild>
            <Button variant="mint" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Restock {sweet.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity to add</label>
                <Input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              <Button 
                onClick={handleRestock} 
                variant="candy" 
                className="w-full"
                disabled={restockMutation.isPending}
              >
                {restockMutation.isPending ? 'Restocking...' : `Add ${restockAmount} to stock`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" onClick={() => onEdit(sweet)}>
          <Pencil className="h-4 w-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">Delete {sweet.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the sweet from your shop.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(sweet.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}
