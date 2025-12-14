import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { usePurchases } from '@/hooks/usePurchases';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ShoppingBag, Package, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function Purchases() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: purchases, isLoading } = usePurchases();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalSpent = purchases?.reduce((acc, p) => acc + Number(p.total_price), 0) || 0;
  const totalItems = purchases?.reduce((acc, p) => acc + p.quantity, 0) || 0;

  return (
    <div className="min-h-screen gradient-cream">
      <Header />

      <main className="container py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient">Purchases</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track all your sweet purchases and relive those delicious moments!
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-card transform-gpu hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-candy flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="font-display text-2xl font-bold">{purchases?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-card transform-gpu hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-mint flex items-center justify-center">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Items Purchased</p>
                <p className="font-display text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-card transform-gpu hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-candy-orange flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Spent</p>
                <p className="font-display text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Purchase List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : purchases && purchases.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {purchases.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, x: -20, rotateX: -10 }}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-card transform-gpu hover:shadow-soft hover:-translate-y-1 hover:rotate-[0.5deg] transition-all duration-300"
                style={{ perspective: '1000px' }}
              >
                <div className="flex items-center gap-4">
                  {/* Sweet Image */}
                  <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden flex-shrink-0 shadow-inner">
                    {purchase.sweet?.image_url ? (
                      <img
                        src={purchase.sweet.image_url}
                        alt={purchase.sweet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground truncate">
                      {purchase.sweet?.name || 'Unknown Sweet'}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(purchase.created_at), 'MMM d, yyyy')}
                      </span>
                      <span>•</span>
                      <span>Qty: {purchase.quantity}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-primary">
                      ${Number(purchase.total_price).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${(Number(purchase.total_price) / purchase.quantity).toFixed(2)} each
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">No purchases yet</h3>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your purchase history here!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop')}
              className="gradient-candy text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-candy"
            >
              Browse Sweets
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
