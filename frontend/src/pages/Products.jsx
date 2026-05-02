import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts, setLoading, setError, setFilters } from '../redux/slices/productsSlice'
import productService from '../services/productService'
import ProductCard from '../components/products/ProductCard'

function Products() {
  const dispatch = useDispatch()
  const { filteredProducts, loading, error, filters } = useSelector((state) => state.products)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true))
      try {
        const data = await productService.getAllProducts(selectedCategory, searchTerm, sortBy)
        dispatch(setProducts(data.products))
      } catch (err) {
        dispatch(setError('Failed to load products'))
      }
    }

    fetchProducts()
  }, [dispatch, selectedCategory, searchTerm, sortBy])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSort = (e) => {
    setSortBy(e.target.value)
  }

  const categories = ['all', 'fruits', 'vegetables', 'grains', 'dairy', 'oils', 'snacks', 'beverages', 'spices']

  return (
    <div className="bg-light py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-dark mb-8">Our Products</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-lg font-bold text-dark mb-4">Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-dark mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition capitalize ${
                      selectedCategory === cat
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-dark hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <h3 className="font-bold text-dark mb-3">Search</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Sort */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">{filteredProducts.length} products found</p>
              <select
                value={sortBy}
                onChange={handleSort}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {loading && <p className="text-center text-gray-600">Loading products...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {filteredProducts.length === 0 && !loading && (
              <p className="text-center text-gray-600">No products found</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
