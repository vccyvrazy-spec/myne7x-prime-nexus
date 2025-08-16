import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Download, Eye, DollarSign, Gift } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
  onDownload: (product: Product) => void;
  onPreview: (product: Product) => void;
  userHasAccess?: boolean;
}

export const ProductCard = ({ 
  product, 
  onDownload, 
  onPreview, 
  userHasAccess = false 
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
        <CardHeader className="p-0">
          {/* Image Gallery */}
          <div className="relative h-48 bg-muted/30 overflow-hidden">
            {hasImages ? (
              <div className="relative w-full h-full">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      →
                    </button>
                    
                    {/* Image indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex 
                              ? 'bg-primary' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-card">
                <div className="text-4xl text-neon-primary">M7</div>
              </div>
            )}

            {/* Product Type Badge */}
            <div className="absolute top-3 left-3">
              <Badge 
                variant={product.product_type === 'free' ? 'secondary' : 'default'}
                className={`${
                  product.product_type === 'free' 
                    ? 'bg-gradient-secondary text-secondary-foreground' 
                    : 'bg-gradient-primary text-primary-foreground'
                } font-bold shadow-lg`}
              >
                {product.product_type === 'free' ? (
                  <>
                    <Gift className="w-3 h-3 mr-1" />
                    FREE
                  </>
                ) : (
                  <>
                    <DollarSign className="w-3 h-3 mr-1" />
                    ${product.price}
                  </>
                )}
              </Badge>
            </div>

            {/* Access Badge */}
            {userHasAccess && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-accent text-accent-foreground">
                  OWNED
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          {product.description && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{product.downloads_count} downloads</span>
            <span>{new Date(product.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(product)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button
            variant={userHasAccess ? "download" : product.product_type === 'free' ? "neon" : "gold"}
            size="sm"
            onClick={() => onDownload(product)}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {userHasAccess ? 'Download' : product.product_type === 'free' ? 'Get Free' : 'Request'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};