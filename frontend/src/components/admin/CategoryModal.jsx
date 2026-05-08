import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { X, Loader } from 'lucide-react'

const emptyCategoryForm = {
  key: '',
  name: '',
  description: '',
  sortOrder: 0,
  subcategories: '',
}

function CategoryModal({ isOpen, onClose, onSave, savingCategory, editingCategory = null }) {
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm)
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    await onSave(categoryForm, editingCategoryId)
    resetForm()
  }

  const resetForm = () => {
    setCategoryForm(emptyCategoryForm)
    setEditingCategoryId(null)
    onClose()
  }

  useEffect(() => {
    if (isOpen && editingCategory) {
      setEditingCategoryId(editingCategory._id)
      setCategoryForm({
        key: editingCategory.key || '',
        name: editingCategory.name || '',
        description: editingCategory.description || '',
        sortOrder: editingCategory.sortOrder ?? 0,
        subcategories: Array.isArray(editingCategory.subcategories)
          ? editingCategory.subcategories.join(', ')
          : '',
      })
    } else if (isOpen) {
      setCategoryForm(emptyCategoryForm)
      setEditingCategoryId(null)
    }
  }, [isOpen, editingCategory])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={resetForm}
      className="outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      contentLabel={editingCategoryId ? 'Edit Category' : 'Add Category'}
      ariaHideApp={false}
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 sm:p-8 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {editingCategoryId ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            onClick={resetForm}
            disabled={savingCategory}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              Key
            </label>
            <input
              name="key"
              value={categoryForm.key}
              onChange={handleChange}
              className="w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2d7c5f] focus:outline-none disabled:bg-gray-50"
              placeholder="organic-snacks"
              disabled={Boolean(editingCategoryId)}
              required={!editingCategoryId}
            />
            <p className="mt-1 text-xs text-gray-500">
              The key is what products use internally. Keep it stable after products are assigned.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              Name
            </label>
            <input
              name="name"
              value={categoryForm.name}
              onChange={handleChange}
              className="w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2d7c5f] focus:outline-none"
              placeholder="Organic Snacks"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              Sort Order
            </label>
            <input
              name="sortOrder"
              value={categoryForm.sortOrder}
              onChange={handleChange}
              type="number"
              className="w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2d7c5f] focus:outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              Subcategories
            </label>
            <textarea
              name="subcategories"
              value={categoryForm.subcategories}
              onChange={handleChange}
              className="min-h-24 w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2d7c5f] focus:outline-none"
              placeholder="Citrus, Berries, Tropical"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={categoryForm.description}
              onChange={handleChange}
              className="min-h-24 w-full rounded border border-[#e5ddd2] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2d7c5f] focus:outline-none"
              placeholder="Short category description"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              type="submit"
              disabled={savingCategory}
              className="flex items-center gap-2 rounded bg-[#2d7c5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#235844] disabled:opacity-50"
            >
              {savingCategory ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingCategoryId ? (
                'Save Category'
              ) : (
                'Create Category'
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={savingCategory}
              className="rounded border border-[#e5ddd2] px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-[#f5f2ed] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default CategoryModal
