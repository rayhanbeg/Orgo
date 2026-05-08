import { useNavigate } from 'react-router-dom'
import AdminTable from './AdminTable'

function ProductsTab({
  products,
  categories,
  sortProductsBy,
  onSortChange,
  onDelete,
}) {
  const navigate = useNavigate()

  const getSortedProducts = () => {
    const sorted = [...products]
    if (sortProductsBy === 'name') {
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortProductsBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortProductsBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sortProductsBy === 'stock-asc') {
      sorted.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    } else if (sortProductsBy === 'stock-desc') {
      sorted.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0))
    }
    return sorted
  }

  const productColumns = [
    { key: 'name', label: 'PRODUCT', render: (val) => val || 'N/A' },
    { key: 'price', label: 'PRICE', render: (val) => `৳${Number(val || 0).toFixed(2)}` },
    {
      key: 'category',
      label: 'CATEGORY',
      render: (val, row) => {
        const categoryLabel = categories.find((category) => category.key === val)?.name || val || 'Uncategorized'
        const subcategoryLabel = row?.subcategory ? ` / ${row.subcategory}` : ''
        return `${categoryLabel}${subcategoryLabel}`
      },
    },
    { key: 'stock', label: 'STOCK', render: (val) => val ?? 0 },
  ]

  return (
    <div className="space-y-6 bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
      <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">PRODUCTS</h2>
          <select
            value={sortProductsBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-[#2d7c5f] focus:outline-none"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>
        </div>
        <AdminTable
          columns={productColumns}
          data={getSortedProducts()}
          actions={(product) => (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                className="rounded border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)]"
              >
                EDIT
              </button>
              <button
                type="button"
                onClick={() => onDelete(product._id)}
                className="rounded border border-[var(--color-danger-light)] px-3 py-1 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
              >
                DELETE
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default ProductsTab
