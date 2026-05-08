import { Link } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

function FeaturedSection({ products = [], loading = false }) {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="bg-[#F7F5F0] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between gap-5 sm:mb-14">
          
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#2d7c5f]">
              Curated Collection
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl lg:text-5xl">
              Featured Essentials
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden sm:inline-flex text-sm font-medium text-[#2d7c5f] transition-all duration-300 hover:opacity-70"
          >
            View All
          </Link>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ProductCardSkeleton count={4} />
          </div>
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Mobile Button */}
            <div className="mt-10 flex justify-center sm:hidden">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl border border-[#d7d7d7] bg-white px-6 py-3 text-sm font-medium text-[#1a1a1a] transition-all duration-300 hover:border-[#2d7c5f] hover:text-[#2d7c5f]"
              >
                View All Products
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-[#e7e2d9] bg-white/70 py-14 text-center backdrop-blur">
            <p className="text-sm text-[#777777] sm:text-base">
              No featured products available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedSection;