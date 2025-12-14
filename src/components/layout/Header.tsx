import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Candy, LogOut, User, Shield, ShoppingBag, History } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <Candy className="h-8 w-8 text-primary" />
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
          <span className="font-display text-2xl font-bold text-gradient">
            Sweet Shop
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/shop">
                <Button 
                  variant={isActive('/shop') ? 'secondary' : 'ghost'}
                  className="gap-2 relative"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop
                  {isActive('/shop') && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 gradient-candy rounded-full"
                    />
                  )}
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button 
                    variant={isActive('/admin') ? 'secondary' : 'ghost'} 
                    className="gap-2 relative"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                    {isActive('/admin') && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 gradient-candy rounded-full"
                      />
                    )}
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 ml-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <User className="h-4 w-4" />
                    </motion.div>
                    {profile?.full_name || user.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="text-muted-foreground text-sm">
                    {user.email}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem className="text-accent font-medium">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/purchases')} className="cursor-pointer">
                    <History className="h-4 w-4 mr-2" />
                    My Purchases
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="candy">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
