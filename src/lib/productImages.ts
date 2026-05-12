import tender from "@/assets/product-tender.jpg";
import mature from "@/assets/product-mature.jpg";
import oil from "@/assets/product-oil.jpg";
import flakes from "@/assets/product-flakes.jpg";
import water from "@/assets/product-water.jpg";
import milk from "@/assets/product-milk.jpg";

export const productImages: Record<string, string> = {
  tender, mature, oil, flakes, water, milk,
};

export const getProductImage = (key?: string | null) =>
  (key && productImages[key]) || tender;
