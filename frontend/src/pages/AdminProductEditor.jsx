import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import categoryService from '../services/categoryService'
import productService from '../services/productService'
import uploadService from '../services/uploadService'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'fruits',
  subcategory: '',
  stock: '',
  certified: false,
  tags: '',
  benefits: '',
  ingredients: '',
  usage: '',
  shipping: '',
  image: '',
  imagePublicId: '',
}

function AdminProductEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const [formData, setFormData] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        const categoryList = data.categories || []
        setCategories(categoryList)

        if (!isEditMode && categoryList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: prev.category || categoryList[0].key,
          }))
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load categories')
      }
    }

    void loadCategories()
  }, [isEditMode])

  useEffect(() => {
    if (categories.length === 0) return

    const hasSelectedCategory = categories.some((category) => category.key === formData.category)
    if (!hasSelectedCategory) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0].key,
        subcategory: '',
      }))
    }
  }, [categories, formData.category])

  const loadProduct = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await productService.getProductById(id)
      const product = data.product

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        category: product.category || 'fruits',
        subcategory: product.subcategory || '',
        stock: product.stock ?? '',
        certified: !!product.certified,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        benefits: product.benefits || '',
        ingredients: product.ingredients || '',
        usage: product.usage || '',
        shipping: product.shipping || '',
        image: product.image || '',
        imagePublicId: product.imagePublicId || '',
      })
      setPreviewUrl(product.image || '')
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!isEditMode) return undefined

    const timer = setTimeout(() => {
      void loadProduct()
    }, 0)

    return () => clearTimeout(timer)
  }, [isEditMode, loadProduct])

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'category' ? { subcategory: '' } : {}),
    }))
  }

  const selectedCategory = categories.find((category) => category.key === formData.category)
  const availableSubcategories = selectedCategory?.subcategories || []

  const pickFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    setError(null)
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(URL.createObjectURL(file))
    setImageFile(file)
  }

  const handleFileChange = (e) => {
    pickFile(e.target.files?.[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      let image = formData.image
      let imagePublicId = formData.imagePublicId

      if (imageFile) {
        const uploaded = await uploadService.uploadProductImage(imageFile)
        image = uploaded.imageUrl
        imagePublicId = uploaded.publicId
      }

      if (!image) {
        throw new Error('Product image is required')
      }

      const payload = {
        ...formData,
        image,
        imagePublicId,
        price: Number(formData.price),
        stock: Number(formData.stock),
      }

      if (isEditMode) {
        await productService.updateProduct(id, payload)
      } else {
        await productService.createProduct(payload)
      }

      navigate('/admin?tab=products')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const clearImage = () => {
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setImageFile(null)
    setPreviewUrl(formData.image || '')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
        <p className="text-sm tracking-[0.35em] uppercase text-neutral-400">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f3ea_0%,_#ffffff_55%,_#f4f7f2_100%)]">
      <div className="container-fluid py-8 sm:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-neutral-500 mb-3">
              Admin / Products
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-950">
              {isEditMode ? 'Edit product' : 'Add product'}
            </h1>
            <p className="text-neutral-500 mt-3 max-w-2xl">
              Keep the layout quiet and functional. Add the details, upload the image, and publish.
            </p>
          </div>
          <Link
            to="/admin?tab=products"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-neutral-950 hover:text-neutral-950 transition"
          >
            Back to dashboard
          </Link>
        </div>

        {error && <div className="form-error mb-6">{error}</div>}

        <form
          id="product-editor-form"
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]"
        >
          <div className="space-y-6">
            <section className="form-shell">
              <div className="form-shell-inner">
                <div className="form-grid">
                  <div className="sm:col-span-2">
                    <label className="form-label">Product name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Organic Honey"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Price</label>
                    <input
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="9.99"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Stock</label>
                    <input
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      type="number"
                      className="form-input"
                      placeholder="25"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select"
                    >
                      {categories.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Subcategory</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="form-select"
                      disabled={availableSubcategories.length === 0}
                    >
                      <option value="">No subcategory</option>
                      {availableSubcategories.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 sm:self-end">
                    <input
                      type="checkbox"
                      name="certified"
                      checked={formData.certified}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Certified organic
                  </label>

                  <div className="sm:col-span-2">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Short product description"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="form-label">Tags</label>
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="organic, natural, honey"
                    />
                    <p className="form-help">Comma separated tags keep the catalog searchable.</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="form-label">Benefits</label>
                    <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="What does it do for the customer?"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="form-label">Ingredients</label>
                    <textarea
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Ingredient list"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="form-label">Usage</label>
                    <textarea
                      name="usage"
                      value={formData.usage}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="How to use this product"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="form-label">Shipping</label>
                    <textarea
                      name="shipping"
                      value={formData.shipping}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Shipping details"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-24 h-fit">
            <section className="form-shell">
              <div className="form-shell-inner">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                      Image
                    </h2>
                    <p className="form-help mt-1">Upload one clean product image.</p>
                  </div>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 hover:text-neutral-950 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`form-dropzone ${dragActive ? 'form-dropzone-active' : ''}`}
                >
                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <label htmlFor="product-image" className="block cursor-pointer">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Product preview"
                          className="mx-auto max-h-56 w-full rounded-2xl object-cover"
                        />
                        <p className="text-sm text-neutral-600">
                          Click to replace the current image.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-neutral-200 bg-white text-neutral-500">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16.5A4.5 4.5 0 018.5 12H9a6 6 0 1111.2 2.18A4.5 4.5 0 0118.5 21H8a4 4 0 01-4-4.5z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 12v7m0-7l-3 3m3-3l3 3"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-950">Drop image here</h3>
                          <p className="form-help">PNG, JPG, WebP, or GIF.</p>
                        </div>
                        <span className="inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-700">
                          Choose file
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </section>

            <section className="form-shell">
              <div className="form-shell-inner space-y-4">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-2">
                    Preview
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Simple live preview for the name, price, and image.
                  </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 aspect-square">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-neutral-400 text-sm">
                      No image yet
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-neutral-950">
                    {formData.name || 'Untitled product'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <span>৳{Number(formData.price || 0).toFixed(2)}</span>
                    <span>{formData.stock || 0} in stock</span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-6">
                    {formData.description || 'Product description will appear here.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="form-shell">
              <div className="form-shell-inner space-y-3">
                <button
                  type="submit"
                  form="product-editor-form"
                  disabled={saving}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Create product'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin?tab=products')}
                  className="btn-secondary w-full"
                >
                  Cancel
                </button>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default AdminProductEditor
