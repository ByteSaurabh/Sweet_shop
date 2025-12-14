import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SweetCard } from '@/components/sweet/SweetCard';
import { SweetFilters } from '@/components/sweet/SweetFilters';
import { useSweets } from '@/hooks/useSweets';
import { useAuth } from '@/hooks/useAuth';
import { Candy, Loader2 } from 'lucide-react';

export default function Shop() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  
  const { data: sweets, isLoading, error } = useSweets(
    searchQuery || undefined,
    category !== 'all' ? category : undefined,
    priceRange[0],
    priceRange[1]
  );

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen gradient-cream"
    >
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="font-display text-4xl md:text-5xl font-bold mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
          >
            Our <span className="text-gradient">Sweet</span> Collection
          </motion.h1>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Explore our delicious selection of candies, chocolates, and treats. 
            Find your favorites and add them to your collection!
          </motion.p>
        </motion.div>

        {/* Filters */}
        <SweetFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Loader2 className="h-10 w-10 text-primary" />
            </motion.div>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <p className="text-destructive">Error loading sweets. Please try again.</p>
          </motion.div>
        ) : sweets && sweets.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sweets.map((sweet, index) => (
              <SweetCard key={sweet.id} sweet={sweet} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div 
              className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Candy className="h-10 w-10 text-muted-foreground" />
            </motion.div>
            <h3 className="font-display text-2xl font-bold mb-2">No sweets found</h3>
            <p className="text-muted-foreground">
              {searchQuery || category !== 'all' || priceRange[0] > 0 || priceRange[1] < 100
                ? 'Try adjusting your filters to find more treats!'
                : 'Check back soon for delicious additions to our collection!'}
            </p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
