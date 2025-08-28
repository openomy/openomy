import { Product } from '@/components/product-card';
import { ProductService } from '@/services/products';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProductsDataSchema } from '@/lib/product-schema';
import type { Product as ProductType } from '@/types/product';
import productsJson from '@/public/products/products.json';

export default function ProductDemoPage() {
  const parsed = ProductsDataSchema.safeParse(productsJson);
  const products: ProductType[] = parsed.success ? parsed.data.products : [];
  const filteredProducts = ProductService.sortProducts(products, 'newest');

  const getProductHref = (product: ProductType) => {
    return product.links?.website || product.links?.github;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Openexpo
            </h1>
            <p className="text-base text-white/60 max-w-2xl mb-2">
              Of the dev, by the dev, for the dev.
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-800 bg-black/40 backdrop-blur-sm p-4 md:max-w-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-100 whitespace-nowrap">Show your repo or product?</h3>
                <p className="text-sm text-gray-400 whitespace-nowrap">
                  Just add it to the JSON file!
                </p>
              </div>
              <a
                href="https://github.com/openomy/openomy/blob/main/apps/web/public/products/products.json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Edit products.json
              </a>
            </div>
          </div>
        </div>

        {/*
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-white/10 text-white placeholder-white/40 rounded-lg border border-white/10 focus:border-white/30 focus:outline-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/10 focus:border-white/30 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
        */}
        
        {filteredProducts.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                {getProductHref(product) ? (
                  <a
                    href={getProductHref(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Product
                      image={product.image}
                      label={product.label}
                      productName={product.productName}
                      description={product.description}
                    />
                  </a>
                ) : (
                  <Product
                    image={product.image}
                    label={product.label}
                    productName={product.productName}
                    description={product.description}
                  />
                )}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-white/5 text-white/50 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8 py-6">
        <Footer />
      </div>
    </div>
  );
}

