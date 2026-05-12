const ProductSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-border/40 bg-card">
    <div className="aspect-square skeleton" />
    <div className="p-5 space-y-3">
      <div className="h-5 w-3/4 skeleton rounded" />
      <div className="h-4 w-full skeleton rounded" />
      <div className="h-4 w-2/3 skeleton rounded" />
      <div className="flex items-center justify-between">
        <div className="h-8 w-20 skeleton rounded" />
        <div className="h-9 w-20 skeleton rounded-full" />
      </div>
    </div>
  </div>
);

export default ProductSkeleton;
