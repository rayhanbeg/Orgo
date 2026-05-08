import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import categoryService from '../services/categoryService';
import productService from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';
import { X, SlidersHorizontal } from 'lucide-react';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load categories');
      }
    };
    void loadCategories();
  }, []);

  useEffect(() => {
    const selectedCategoryData = categories.find((category) => category.key === selectedCategory);
    if (selectedCategory !== 'all' && !selectedCategoryData) {
      setSelectedCategory('all');
      setSelectedSubcategory('all');
      setCurrentPage(1);
      return;
    }
    if (selectedCategoryData && selectedSubcategory !== 'all') {
      const hasSubcategory = (selectedCategoryData.subcategories || []).includes(selectedSubcategory);
      if (!hasSubcategory) {
        setSelectedSubcategory('all');
        setCurrentPage(1);
      }
    }
  }, [categories, selectedCategory, selectedSubcategory]);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts(
          selectedCategory,
          searchQuery,
          sortBy,
          selectedSubcategory,
        );
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => void fetchProducts(), 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedSubcategory !== 'all') params.set('subcategory', selectedSubcategory);
    if (sortBy !== 'recommended') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', String(currentPage));
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedSubcategory, sortBy, currentPage, searchQuery, setSearchParams]);

  const selectedCategoryData = useMemo(
    () => categories.find((category) => category.key === selectedCategory),
    [categories, selectedCategory]
  );
  const availableSubcategories = selectedCategoryData?.subcategories || [];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all');
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const paginatedProducts = useMemo(
    () => products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [products, currentPage, itemsPerPage]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const FilterPanelContent = ({ hideSort = false }) => (
    <div className="space-y-8">
      {/* Sort – only shown on mobile/drawer */}
      {!hideSort && (
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]">
            Sort
          </h3>
          <select
            value={sortBy}
            onChange={handleSort}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]">
          Category
        </h3>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[rgba(45,124,95,0.08)] font-semibold text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:bg-[rgba(45,124,95,0.04)]'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => handleCategoryChange(category.key)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedCategory === category.key
                  ? 'bg-[rgba(45,124,95,0.08)] font-semibold text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[rgba(45,124,95,0.04)]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategories – dropdown */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]">
          Subcategory
        </h3>
        {selectedCategory === 'all' ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            Select a category to see subcategories.
          </p>
        ) : availableSubcategories.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No subcategories available.</p>
        ) : (
          <select
            value={selectedSubcategory}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          >
            <option value="all">All Subcategories</option>
            {availableSubcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Price (placeholder) */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]">
          Price
        </h3>
        <div className="flex flex-col gap-1.5 text-sm text-[var(--color-text-muted)]">
          <button className="rounded-lg px-3 py-1.5 text-left hover:underline">Under ₹20</button>
          <button className="rounded-lg px-3 py-1.5 text-left hover:underline">₹20 – ₹50</button>
          <button className="rounded-lg px-3 py-1.5 text-left hover:underline">Over ₹50</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Shop
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            Browse the collection, filter by category, and sort with a cleaner responsive layout.
          </p>
        </div>

        {/* Search, Sort (lg), and mobile filter toggle */}
        <div className="mb-10 flex items-center justify-between">
          <div className="relative w-full lg:max-w-xl">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 pr-10 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>

          {/* Desktop sort – right side, visible only on lg+ */}
          <div className="ml-6 hidden items-center gap-2 lg:flex">
            <label htmlFor="sort-desktop" className="text-sm font-medium text-[var(--color-text)] whitespace-nowrap">
              Sort by
            </label>
            <select
              id="sort-desktop"
              value={sortBy}
              onChange={handleSort}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="ml-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(45,124,95,0.04)] lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Desktop Sidebar – without the sort (hideSort) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
              <FilterPanelContent hideSort />
            </div>
          </aside>

          {/* Mobile Drawer – includes sort */}
          {filterDrawerOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setFilterDrawerOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <FilterPanelContent />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <section className="lg:col-span-3">
            {loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <ProductCardSkeleton count={9} />
              </div>
            )}

            {error && (
              <div className="py-20 text-center">
                <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-base text-[var(--color-text-muted)]">
                  No products found.
                  <br />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedSubcategory('all');
                      setSortBy('recommended');
                      setCurrentPage(1);
                    }}
                    className="mt-2 text-sm font-medium text-[var(--color-primary)] underline underline-offset-2 hover:no-underline"
                  >
                    Clear all filters
                  </button>
                </p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-12 flex items-center justify-center gap-2 border-t border-[var(--color-border)] pt-8"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(45,124,95,0.04)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition ${
                          currentPage === page
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                            : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-[rgba(45,124,95,0.04)]'
                        }`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(45,124,95,0.04)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Products;