import { motion } from 'framer-motion';
import { Sweet } from '@/types/sweet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { usePurchaseSweet } from '@/hooks/useSweets';
import { useAuth } from '@/hooks/useAuth';

interface SweetCardProps {
  sweet: Sweet;
  index: number;
}

export function SweetCard({ sweet, index }: SweetCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const purchaseMutation = usePurchaseSweet();
  
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

  const handlePurchase = () => {
    if (!user) return;
    purchaseMutation.mutate({
      sweetId: sweet.id,
      quantity,
      userId: user.id,
    });
    setQuantity(1);
  };

  const categoryColors: Record<string, string> = {
    chocolate: 'bg-candy-chocolate text-primary-foreground',
    candy: 'bg-candy-pink text-primary-foreground',
    gummy: 'bg-candy-orange text-primary-foreground',
    mint: 'bg-candy-mint text-primary-foreground',
    lollipop: 'bg-candy-rose text-primary-foreground',
    caramel: 'bg-candy-peach text-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', damping: 20 }}
      whileHover={{ 
        y: -8,
        rotateY: 5,
        rotateX: 5,
        scale: 1.02,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-card rounded-2xl shadow-card overflow-hidden border border-border/50 transform-gpu"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 gradient-candy opacity-0 blur-2xl"
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-secondary to-muted overflow-hidden">
        {sweet.image_url ? (
          <motion.img 
            src={sweet.image_url} 
            alt={sweet.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Category Badge */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.08 + 0.2 }}
        >
          <Badge 
            className={`absolute top-3 left-3 ${categoryColors[sweet.category.toLowerCase()] || 'bg-primary text-primary-foreground'}`}
          >
            {sweet.category}
          </Badge>
        </motion.div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-3 right-3">
            Out of Stock
          </Badge>
        )}
        {isLowStock && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Badge className="absolute top-3 right-3 bg-candy-orange text-primary-foreground">
              Only {sweet.quantity} left!
            </Badge>
          </motion.div>
        )}

        {/* Sparkle effect */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Sparkles className="h-8 w-8 text-primary-foreground/50" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 relative z-10">
        <motion.h3 
          className="font-display text-xl font-bold text-foreground mb-1"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {sweet.name}
        </motion.h3>
        {sweet.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {sweet.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <motion.span 
            className="font-display text-2xl font-bold text-primary"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            ${Number(sweet.price).toFixed(2)}
          </motion.span>
          <span className="text-sm text-muted-foreground">
            {sweet.quantity} in stock
          </span>
        </div>

        {/* Purchase Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-secondary transition-colors"
              disabled={isOutOfStock}
            >
              -
            </motion.button>
            <span className="px-4 py-2 font-medium bg-secondary/50">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
              className="px-3 py-2 hover:bg-secondary transition-colors"
              disabled={isOutOfStock || quantity >= sweet.quantity}
            >
              +
            </motion.button>
          </div>
          <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handlePurchase}
              disabled={isOutOfStock || purchaseMutation.isPending}
              className="w-full"
              variant={isOutOfStock ? "secondary" : "candy"}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {purchaseMutation.isPending ? 'Buying...' : 'Buy'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
