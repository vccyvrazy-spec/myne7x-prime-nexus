import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { MyneLoader } from '@/components/MyneLoader';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, TrendingUp, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type Product = Database['public']['Tables']['products']['Row'];

interface HomeProps {
  user: User | null;
  onAuthClick: () => void;
}

export const Home = ({ user, onAuthClick }: HomeProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');
  const [userDownloads, setUserDownloads] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchUserDownloads();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDownloads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_downloads')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserDownloads(data?.map(d => d.product_id) || []);
    } catch (error) {
      console.error('Error fetching user downloads:', error);
    }
  };

  const handleDownload = async (product: Product) => {
    if (!user) {
      onAuthClick();
      return;
    }

    // Logic will be implemented for handling downloads and payment requests
    toast({
      title: "Feature Coming Soon",
      description: "Download functionality will be implemented next",
    });
  };

  const handlePreview = (product: Product) => {
    // Preview modal will be implemented
    toast({
      title: "Preview",
      description: `Preview for ${product.title}`,
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesFilter = filterType === 'all' || product.product_type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MyneLoader size="lg" text="Loading Myne7x Store..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-neon-primary">Myne7x</span>{' '}
              <span className="text-neon-gold">Store</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Premium templates, websites, and digital products. 
              Built with passion, designed for success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="hero" size="lg" className="min-w-[200px]">
                <Crown className="w-5 h-5 mr-2" />
                Explore Products
              </Button>
              {!user && (
                <Button variant="gold" size="lg" onClick={onAuthClick} className="min-w-[200px]">
                  Get Started Free
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-3xl font-bold text-neon-primary mb-2">100+</div>
                <div className="text-muted-foreground">Premium Templates</div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl font-bold text-neon-gold mb-2">50+</div>
                <div className="text-muted-foreground">Free Resources</div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-3xl font-bold text-neon-primary mb-2">1K+</div>
                <div className="text-muted-foreground">Happy Users</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'neon' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All Products
              </Button>
              <Button
                variant={filterType === 'free' ? 'gold' : 'outline'}
                size="sm"
                onClick={() => setFilterType('free')}
              >
                Free
              </Button>
              <Button
                variant={filterType === 'paid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('paid')}
              >
                Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Our Products
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-primary" />
              <span className="text-sm text-muted-foreground">Trending</span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    onDownload={handleDownload}
                    onPreview={handlePreview}
                    userHasAccess={userDownloads.includes(product.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};