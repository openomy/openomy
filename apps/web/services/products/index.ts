import type { Product, ProductsData, ProductFilters, SortOption } from '@/types/product';
import { ProductsDataSchema } from '@/lib/product-schema';

export class ProductService {
  private static productsData: ProductsData | null = null;

  static async loadProducts(): Promise<ProductsData> {
    if (this.productsData) {
      return this.productsData;
    }

    try {
      const response = await fetch('/products/products.json');
      if (!response.ok) {
        throw new Error('Failed to load products data');
      }
      const data: unknown = await response.json();
      const parsed = ProductsDataSchema.safeParse(data);
      if (!parsed.success) {
        console.error('Validation error loading products:', parsed.error.flatten());
        return { products: [] };
      }
      this.productsData = parsed.data;
      return parsed.data;
    } catch (error) {
      console.error('Error loading products:', error);
      return {
        products: []
      };
    }
  }

  static async getAllProducts(): Promise<Product[]> {
    const data = await this.loadProducts();
    return data.products;
  }

  static async getProductById(id: string): Promise<Product | undefined> {
    const data = await this.loadProducts();
    return data.products.find(product => product.id === id);
  }

  static async getFilteredProducts(filters: ProductFilters): Promise<Product[]> {
    const data = await this.loadProducts();
    let filtered = [...data.products];


    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product =>
        filters.tags?.some(tag => product.tags?.includes(tag))
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.productName.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.label?.toLowerCase().includes(query) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  static sortProducts(products: Product[], sortBy: SortOption): Product[] {
    const hasContributorDates = products.some(p => !!p.contributor?.addedDate);
    const sorted = [...products];

    switch (sortBy) {
      case 'newest':
        // If we have contributor dates, sort by them (desc). Otherwise,
        // assume JSON append order and show the latest entries first (reverse).
        if (hasContributorDates) {
          return sorted.sort((a, b) => {
            const da = a.contributor?.addedDate ? Date.parse(a.contributor.addedDate) : 0;
            const db = b.contributor?.addedDate ? Date.parse(b.contributor.addedDate) : 0;
            return db - da;
          });
        }
        return sorted.reverse();
      case 'oldest':
        // If we have contributor dates, sort by them (asc). Otherwise,
        // keep the natural JSON order.
        if (hasContributorDates) {
          return sorted.sort((a, b) => {
            const da = a.contributor?.addedDate ? Date.parse(a.contributor.addedDate) : Number.MAX_SAFE_INTEGER;
            const db = b.contributor?.addedDate ? Date.parse(b.contributor.addedDate) : Number.MAX_SAFE_INTEGER;
            return da - db;
          });
        }
        return sorted;
      case 'name':
        return sorted.sort((a, b) => a.productName.localeCompare(b.productName));
      default:
        return sorted;
    }
  }


  static async getAllTags(): Promise<string[]> {
    const products = await this.getAllProducts();
    const tagsSet = new Set<string>();
    
    products.forEach(product => {
      product.tags?.forEach(tag => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  }


  static async getMetadata() {
    // Derive lightweight metadata from current products list
    const products = await this.getAllProducts();
    const contributorSet = new Set<string>();
    products.forEach(p => {
      const name = p.contributor?.githubUsername?.trim();
      if (name) contributorSet.add(name);
    });
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalProducts: products.length,
      contributors: contributorSet.size,
    };
  }
}
