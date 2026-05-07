import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { setProducts, setLoading, setError } from '../redux/slices/productsSlice'
import productService from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton'

function Products() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { filteredProducts, loading, error } = useSelector((state) => state.products)

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Recommended')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const itemsPerPage = 9

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true))
      try {
        const data = await productService.getAllProducts()
        dispatch(setProducts(data.products))
      } catch {
        dispatch(setError('Failed to load products'))
      }
    }

    fetchProducts()
  }, [dispatch])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory !== 'All') params.set('category', selectedCategory)
    if (sortBy !== 'Recommended') params.set('sort', sortBy)
    if (currentPage > 1) params.set('page', currentPage)
    if (searchQuery) params.set('search', searchQuery)

    setSearchParams(params)
  }, [selectedCategory, sortBy, currentPage, searchQuery, setSearchParams])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSort = (e) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const filteredBySearch = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const paginatedProducts = filteredBySearch.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredBySearch.length / itemsPerPage)

  const categories = ['All', 'Superfoods', 'Supplements', 'Pantry', 'Tea & Coffee']

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }} className="min-h-screen">
      <div className="container-fluid py-8 sm:py-10 lg:py-12">
        <div className="mb-8 flex flex-col gap-4">
          <div className="space-y-1">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Shop
            </p>
            <p className="max-w-2xl text-sm leading-6" style={{ color: 'var(--color-text-muted)' }}>
              Browse the collection, filter by category, and sort with a cleaner responsive layout.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full">
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded border px-4 py-2 text-sm transition focus:outline-none"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-card-bg)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-sm" style={{ color: 'var(--color-text)' }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={handleSort}
              className="w-full rounded border px-4 py-2 text-sm font-medium transition sm:w-auto"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-card-bg)',
                color: 'var(--color-text)',
              }}
            >
              <option value="Recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          <aside className="order-2 h-fit lg:sticky lg:top-24 lg:order-1 lg:col-span-1">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-6">
              <div className="mb-8 pb-6" style={{ borderBottomColor: 'var(--color-border)' }}>
                <h3
                  className="mb-5 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-text)' }}
                >
                  Category
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                        selectedCategory === cat ? 'font-semibold' : ''
                      }`}
                      style={{
                        color: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        backgroundColor: selectedCategory === cat ? 'rgba(45,124,95,0.08)' : 'transparent',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3
                  className="mb-5 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-text)' }}
                >
                  Price
                </h3>
                <div className="space-y-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <button className="block transition hover:underline" style={{ color: 'inherit' }}>
                    Under ৳20
                  </button>
                  <button className="block transition hover:underline" style={{ color: 'inherit' }}>
                    ৳20 - ৳50
                  </button>
                  <button className="block transition hover:underline" style={{ color: 'inherit' }}>
                    Over ৳50
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="order-1 lg:order-2 lg:col-span-3">
            {loading && (
              <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <ProductCardSkeleton count={9} />
              </div>
            )}

            {error && (
              <p className="py-12 text-center text-sm" style={{ color: 'var(--color-danger)' }}>
                {error}
              </p>
            )}

            {!loading && filteredBySearch.length === 0 && (
              <p className="py-12 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                No products found
              </p>
            )}

            {!loading && filteredBySearch.length > 0 && (
              <>
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div
                    className="flex flex-wrap items-center justify-center gap-2 pt-8"
                    style={{ borderTopColor: 'var(--color-border)' }}
                  >
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 min-w-24 items-center justify-center rounded px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="flex h-10 w-10 items-center justify-center rounded border text-sm font-medium transition"
                        style={{
                          backgroundColor: currentPage === page ? 'var(--color-primary)' : 'transparent',
                          color: currentPage === page ? 'white' : 'var(--color-text)',
                          borderColor: currentPage === page ? 'var(--color-primary)' : 'var(--color-border)',
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex h-10 min-w-24 items-center justify-center rounded px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Products
