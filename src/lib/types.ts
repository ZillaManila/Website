export interface ProductColor {
  name: string;
  key: string;
  hex: string;
  stock: number;
  image: string;
}

export interface ProductOption {
  label: string;
  price: number;
  shipping: number;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  size: string;
  sizeLabel: string;
  price: number;
  priceFrom: boolean;
  shipping?: number;
  specialOrder: boolean;
  featured: boolean;
  published: boolean;
  order: number;
  kind: 'gummikin' | 'keychain' | 'nest' | 'blanket' | 'none';
  materials: string[];
  feel: { softness: number; squish: number; weight: number; texture: string; notes: string };
  care: string;
  options?: ProductOption[];
  colors: ProductColor[];
  gallery: string[];
  description: string;
}
