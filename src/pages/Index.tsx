import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { Candy, Sparkles, ShoppingBag, Shield, Zap, Heart } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Candy,
      title: 'Delicious Selection',
      description: 'Browse our curated collection of the finest sweets and candies.',
      color: 'from-candy-pink to-candy-rose',
    },
    {
      icon: ShoppingBag,
      title: 'Easy Shopping',
      description: 'Simple and fast checkout process to get your treats quickly.',
      color: 'from-candy-orange to-candy-peach',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Only the best quality sweets make it to our shelves.',
      color: 'from-candy-mint to-accent',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen gradient-cream overflow-hidden"
    >
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-24 md:py-32">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-center gap-2 mb-6">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="h-6 w-6 text-candy-orange" />
                </motion.div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Welcome to the sweetest place online
                </span>
                <motion.div
                  animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                >
                  <Sparkles className="h-6 w-6 text-candy-mint" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="font-display text-5xl md:text-7xl font-bold mb-6"
              style={{ perspective: '1000px' }}
            >
              <motion.span 
                className="text-gradient inline-block"
                animate={{ rotateY: [0, 5, 0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              >
                Sweet Shop
              </motion.span>
              <br />
              <span className="text-foreground">Management System</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              A delightful full-stack application for managing your candy empire. 
              Built with React, MongoDB, and lots of sugar! 🍬
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {user ? (
                <Link to="/shop">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="hero" size="xl">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Browse Sweets
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <>
                  <Link to="/auth?mode=signup">
                    <motion.div whileHover={{ scale: 1.05, rotateZ: 1 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="hero" size="xl">
                        <Zap className="h-5 w-5 mr-2" />
                        Get Started
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/auth">
                    <motion.div whileHover={{ scale: 1.05, rotateZ: -1 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="xl">
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* 3D Floating decorative elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-candy-pink/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.5, 0.3],
            rotateZ: [0, 45, 0],
          }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-candy-mint/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.3, 0.4, 0.3],
            rotateZ: [0, -30, 0],
          }}
          transition={{ repeat: Infinity, duration: 8, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/3 right-10 w-32 h-32 bg-candy-orange/20 rounded-full blur-2xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="font-display text-4xl font-bold mb-4"
              whileInView={{ scale: [0.9, 1.02, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose <span className="text-gradient">Sweet Shop</span>?
            </motion.h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the joy of managing your sweet inventory with our modern, 
              feature-rich platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: 'spring', damping: 20 }}
                whileHover={{ 
                  y: -10, 
                  rotateY: 5,
                  rotateX: 5,
                  scale: 1.02,
                }}
                className="group p-8 bg-card rounded-3xl shadow-card border border-border/50 transform-gpu"
                style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
              >
                <motion.div 
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-candy`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </motion.div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative overflow-hidden gradient-hero rounded-3xl p-12 md:p-16 text-center transform-gpu"
            style={{ perspective: '1000px' }}
          >
            <div className="relative z-10">
              <motion.h2 
                className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                Ready to Sweeten Your Day?
              </motion.h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Join our sweet community and start managing your candy inventory today.
              </p>
              {!user && (
                <Link to="/auth?mode=signup">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateZ: 2 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="xl" 
                      className="bg-card text-foreground hover:bg-card/90 shadow-lg"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Create Account
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>
            
            {/* 3D decorative circles */}
            <motion.div 
              className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-muted-foreground">
          <motion.p 
            className="flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            Made with <motion.span 
              className="text-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >♥</motion.span> and lots of 
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Candy className="h-4 w-4 text-candy-pink" />
            </motion.div>
          </motion.p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;
