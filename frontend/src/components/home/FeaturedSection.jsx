import { Link } from 'react-router-dom'
import ProductCard from '../products/ProductCard'
import ProductCardSkeleton from '../skeletons/ProductCardSkeleton'

function FeaturedSection({ products = [], loading = false }) {
  const featuredProducts = products.slice(0, 4)

  return (
    <section className="container-fluid py-20 sm:py-24">
      <div className="mb-12 flex items-end justify-between">
        <h2 className="text-4xl font-bold" style={{ color: '#1a1a1a' }}>
          Featured Essentials
        </h2>
        <Link 
          to="/products" 
          className="text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
          style={{ color: '#2d7c5f' }}
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCardSkeleton count={4} />
        </div>
      ) : featuredProducts && featuredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] py-12 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No products available
          </p>
        </div>
      )}
    </section>
  )
}

export default FeaturedSection
