import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Candy, ArrowLeft, Sparkles } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(1, 'Please enter your name').optional(),
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/shop');
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const dataToValidate = {
      email,
      password,
      ...(isSignUp && { fullName }),
    };

    const result = authSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account exists',
              description: 'This email is already registered. Please sign in instead.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Sign up failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Welcome to Sweet Shop! 🍬',
            description: 'Your account has been created successfully.',
          });
          navigate('/shop');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Sign in failed',
            description: 'Invalid email or password. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome back! 🍭',
            description: 'You have signed in successfully.',
          });
          navigate('/shop');
        }
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen gradient-cream flex items-center justify-center p-4 overflow-hidden"
    >
      <motion.div 
        className="absolute top-4 left-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md"
        style={{ perspective: '1000px' }}
      >
        <div className="bg-card rounded-3xl shadow-soft p-8 border border-border/50 transform-gpu">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2, damping: 15 }}
              className="relative w-16 h-16 gradient-candy rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-candy"
            >
              <Candy className="h-8 w-8 text-primary-foreground" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="h-4 w-4 text-candy-orange" />
              </motion.div>
            </motion.div>
            <motion.h1 
              className="font-display text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </motion.h1>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isSignUp
                ? 'Join us and start your sweet journey'
                : 'Sign in to access your account'}
            </motion.p>
          </div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isSignUp && (
              <motion.div 
                className="space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={`h-12 rounded-xl ${errors.fullName ? 'border-destructive' : ''}`}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`h-12 rounded-xl ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`h-12 rounded-xl ${errors.password ? 'border-destructive' : ''}`}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="candy"
                size="lg"
                className="w-full h-12 rounded-xl"
                disabled={loading}
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </motion.div>
          </motion.form>

          {/* Toggle */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-semibold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="fixed -top-32 -right-32 w-96 h-96 bg-candy-pink/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="fixed -bottom-32 -left-32 w-96 h-96 bg-candy-mint/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.3, 1], rotate: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 10, delay: 1 }}
      />
      <motion.div
        className="fixed top-1/4 left-10 w-20 h-20 bg-candy-orange/20 rounded-full blur-xl pointer-events-none"
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
    </motion.div>
  );
}
