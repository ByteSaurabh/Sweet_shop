import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { AdminSweetCard } from '@/components/admin/AdminSweetCard';
import { SweetForm } from '@/components/admin/SweetForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSweets } from '@/hooks/useSweets';
import { useAuth } from '@/hooks/useAuth';
import { Sweet } from '@/types/sweet';
import { Plus, Search, Loader2, ShieldAlert, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function Admin() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | undefined>();
  
  const { data: sweets, isLoading } = useSweets(searchQuery || undefined);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-cream">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 className="h-10 w-10 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen gradient-cream"
      >
        <Header />
        <div className="container py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <motion.div 
              className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8">
              You don't have permission to access the admin panel.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => navigate('/shop')} variant="candy">
                Go to Shop
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSweet(undefined);
  };

  const lowStockSweets = sweets?.filter(s => s.quantity <= 5 && s.quantity > 0) || [];
  const outOfStockSweets = sweets?.filter(s => s.quantity === 0) || [];
  const inStockSweets = sweets?.filter(s => s.quantity > 5) || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen gradient-cream"
    >
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your sweet shop inventory and products.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="candy" onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              Add Sweet
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-card transform-gpu"
            style={{ perspective: '1000px' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-candy flex items-center justify-center">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Products</p>
                <p className="font-display text-2xl font-bold">{sweets?.length || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-card transform-gpu"
            style={{ perspective: '1000px' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">In Stock</p>
                <p className="font-display text-2xl font-bold text-accent">{inStockSweets.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-card transform-gpu"
            style={{ perspective: '1000px' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-candy-orange flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Low Stock</p>
                <p className="font-display text-2xl font-bold text-candy-orange">{lowStockSweets.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="bg-card rounded-2xl p-6 border border-border/50 shadow-card transform-gpu"
            style={{ perspective: '1000px' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive flex items-center justify-center">
                <Package className="h-6 w-6 text-destructive-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Out of Stock</p>
                <p className="font-display text-2xl font-bold text-destructive">{outOfStockSweets.length}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock ({lowStockSweets.length})</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock ({outOfStockSweets.length})</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border/50 rounded-xl"
              />
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Loader2 className="h-10 w-10 text-primary" />
                </motion.div>
              </div>
            ) : sweets && sweets.length > 0 ? (
              sweets.map((sweet, index) => (
                <AdminSweetCard 
                  key={sweet.id} 
                  sweet={sweet} 
                  onEdit={handleEdit}
                  index={index}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-muted-foreground">No products found. Add your first sweet!</p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="low-stock" className="space-y-4">
            {lowStockSweets.map((sweet, index) => (
              <AdminSweetCard 
                key={sweet.id} 
                sweet={sweet} 
                onEdit={handleEdit}
                index={index}
              />
            ))}
            {lowStockSweets.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-muted-foreground">No low stock items. Great inventory management!</p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="out-of-stock" className="space-y-4">
            {outOfStockSweets.map((sweet, index) => (
              <AdminSweetCard 
                key={sweet.id} 
                sweet={sweet} 
                onEdit={handleEdit}
                index={index}
              />
            ))}
            {outOfStockSweets.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-muted-foreground">All items are in stock!</p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </DialogTitle>
          </DialogHeader>
          <SweetForm 
            sweet={editingSweet} 
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
