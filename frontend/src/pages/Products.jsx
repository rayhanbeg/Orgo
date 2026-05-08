import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import categoryService from '../services/categoryService'
import productService from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const itemsPerPage = 9

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data.categories || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load categories')
      }
    }

    void loadCategories()
  }, [])

  useEffect(() => {
    const selectedCategoryData = categories.find((category) => category.key === selectedCategory)

    if (selectedCategory !== 'all' && !selectedCategoryData) {
      setSelectedCategory('all')
      setSelectedSubcategory('all')
      setCurrentPage(1)
      return
    }

    if (selectedCategoryData && selectedSubcategory !== 'all') {
      const hasSubcategory = (selectedCategoryData.subcategories || []).includes(selectedSubcategory)
      if (!hasSubcategory) {
        setSelectedSubcategory('all')
        setCurrentPage(1)
      }
    }
  }, [categories, selectedCategory, selectedSubcategory])

  useEffect(() => {
    setLoading(true)

    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts(
          selectedCategory,
          searchQuery,
          sortBy,
          selectedSubcategory,
        )
        setProducts(data.products || [])
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      void fetchProducts()
    }, 250)

    return () => clearTimeout(timer)
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy])

  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (selectedSubcategory !== 'all') params.set('subcategory', selectedSubcategory)
    if (sortBy !== 'recommended') params.set('sort', sortBy)
    if (currentPage > 1) params.set('page', String(currentPage))
    if (searchQuery) params.set('search', searchQuery)

    setSearchParams(params, { replace: true })
  }, [selectedCategory, selectedSubcategory, sortBy, currentPage, searchQuery, setSearchParams])

  const selectedCategoryData = useMemo(
    () => categories.find((category) => category.key === selectedCategory),
    [categories, selectedCategory]
  )

  const availableSubcategories = selectedCategoryData?.subcategories || []

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSelectedSubcategory('all')
    setCurrentPage(1)
  }

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory)
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

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage))
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
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
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          <aside id="categories" className="order-2 h-fit lg:sticky lg:top-24 lg:order-1 lg:col-span-1">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-6">
              <div className="mb-8 pb-6" style={{ borderBottomColor: 'var(--color-border)' }}>
                <h3
                  className="mb-5 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-text)' }}
                >
                  Category
                </h3>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('all')}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedCategory === 'all' ? 'font-semibold' : ''
                    }`}
                    style={{
                      color: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      backgroundColor: selectedCategory === 'all' ? 'rgba(45,124,95,0.08)' : 'transparent',
                    }}
                  >
                    All Categories
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => handleCategoryChange(category.key)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                        selectedCategory === category.key ? 'font-semibold' : ''
                      }`}
                      style={{
                        color: selectedCategory === category.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        backgroundColor: selectedCategory === category.key ? 'rgba(45,124,95,0.08)' : 'transparent',
                      }}
                    >
                      <span className="block">{category.name}</span>
                      {category.productCount !== undefined && (
                        <span className="block text-[11px] opacity-70">{category.productCount} items</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8 pb-6" style={{ borderBottomColor: 'var(--color-border)' }}>
                <h3
                  className="mb-5 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-text)' }}
                >
                  Subcategory
                </h3>

                {selectedCategory === 'all' || availableSubcategories.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Select a category to see subcategories.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-3">
                    <button
                      type="button"
                      onClick={() => handleSubcategoryChange('all')}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                        selectedSubcategory === 'all' ? 'font-semibold' : ''
                      }`}
                      style={{
                        color: selectedSubcategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        backgroundColor: selectedSubcategory === 'all' ? 'rgba(45,124,95,0.08)' : 'transparent',
                      }}
                    >
                      All Subcategories
                    </button>

                    {availableSubcategories.map((subCategory) => (
                      <button
                        key={subCategory}
                        type="button"
                        onClick={() => handleSubcategoryChange(subCategory)}
                        className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                          selectedSubcategory === subCategory ? 'font-semibold' : ''
                        }`}
                        style={{
                          color:
                            selectedSubcategory === subCategory
                              ? 'var(--color-primary)'
                              : 'var(--color-text-muted)',
                          backgroundColor:
                            selectedSubcategory === subCategory ? 'rgba(45,124,95,0.08)' : 'transparent',
                        }}
                      >
                        {subCategory}
                      </button>
                    ))}
                  </div>
                )}
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
                    Under à§³20
                  </button>
                  <button className="block transition hover:underline" style={{ color: 'inherit' }}>
                    à§³20 - à§³50
                  </button>
                  <button className="block transition hover:underline" style={{ color: 'inherit' }}>
                    Over à§³50
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

            {!loading && products.length === 0 && (
              <p className="py-12 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                No products found
              </p>
            )}

            {!loading && products.length > 0 && (
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
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 min-w-24 items-center justify-center rounded px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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
