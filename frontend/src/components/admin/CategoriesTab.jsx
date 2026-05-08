import AdminTable from './AdminTable'
import CategoryModal from './CategoryModal'

function CategoriesTab({
  categories,
  isModalOpen,
  onModalOpen,
  onModalClose,
  onSave,
  onDelete,
  savingCategory,
  editingCategory = null,
}) {
  const categoryColumns = [
    { key: 'name', label: 'CATEGORY', render: (val, row) => val || row?.key || 'N/A' },
    { key: 'key', label: 'KEY', render: (val) => val || 'N/A' },
    { key: 'sortOrder', label: 'SORT', render: (val) => val ?? 0 },
    {
      key: 'subcategories',
      label: 'SUBCATEGORIES',
      render: (val) => (Array.isArray(val) && val.length > 0 ? val.join(', ') : 'None'),
    },
    { key: 'productCount', label: 'PRODUCTS', render: (val) => val ?? 0 },
  ]

  return (
    <div className="space-y-6 bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
      <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">
              CATEGORIES
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Categories are sorted by sortOrder, then by name.
            </p>
          </div>
          <button
            type="button"
            onClick={onModalOpen}
            disabled={savingCategory}
            className="rounded border border-[#e5ddd2] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-[#f5f2ed] disabled:opacity-50"
          >
            New Category
          </button>
        </div>
        <AdminTable
          columns={categoryColumns}
          data={categories}
          actions={(category) => (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onModalOpen(category)}
                className="rounded border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)]"
              >
                EDIT
              </button>
              <button
                type="button"
                onClick={() => onDelete(category)}
                className="rounded border border-[var(--color-danger-light)] px-3 py-1 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]"
              >
                DELETE
              </button>
            </div>
          )}
        />
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        onSave={onSave}
        savingCategory={savingCategory}
        editingCategory={editingCategory}
      />
    </div>
  )
}

export default CategoriesTab
