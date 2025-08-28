export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductLinks {
  website?: string;
  github?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  productName: string;
  label?: string;
  description: string;
  image: ProductImage;
  category: string;
  links?: ProductLinks;
  tags?: string[];
  contributor?: {
    githubUsername: string;
    addedDate: string; // YYYY-MM-DD
  };
}

export interface ProductsData {
  products: Product[];
}

export interface ProductFilters {
  tags?: string[];
  searchQuery?: string;
}

export type SortOption = 'newest' | 'oldest' | 'name';
