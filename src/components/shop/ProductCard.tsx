import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { getProductImage } from "@/lib/productImages";
import { Link } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  featured: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  const add = useCart((s) => s.add);
  const handleAdd = () => {
    add({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
    });
    toast.success(`${product.name} added to cart`, {
      description: `₹${product.price.toFixed(2)}`,
    });
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl gradient-card shadow-soft hover:shadow-elegant transition-smooth border border-border/40">
      <Link to={`/products`} className="block aspect-square overflow-hidden bg-muted">
        <img
          src={getProductImage(product.image_url)}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-smooth group-hover:scale-110"
        />
      </Link>
      {product.featured && (
        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 capitalize">
          ✨ Featured
        </Badge>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-semibold leading-tight">{product.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-2xl font-bold text-primary">
              ₹{Number(product.price).toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            size="sm"
            className="rounded-full gap-1.5 shadow-soft hover:shadow-glow transition-smooth"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
