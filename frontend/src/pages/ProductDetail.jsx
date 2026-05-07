import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import ImageGallery from '../components/products/ImageGallery'
import ProductAccordion from '../components/products/ProductAccordion'
import RelatedProducts from '../components/products/RelatedProducts'
import ReviewForm from '../components/products/ReviewForm'
import ReviewCard from '../components/products/ReviewCard'
import productService from '../services/productService'
import reviewService from '../services/reviewService'
import orderService from '../services/orderService'

function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [quantity, setQuantity] = useState(1)
  const [cartAdded, setCartAdded] = useState(false)
  const [product, setProduct] = useState(products.find((p) => p._id === id) || null)
  const [productLoading, setProductLoading] = useState(!products.find((p) => p._id === id))
  const [reviews, setReviews] = useState([])
  const [reviewLoading, setReviewLoading] = useState(true)
  const [reviewError, setReviewError] = useState(null)
  const [canReview, setCanReview] = useState(false)

  const relatedProducts = useMemo(
    () => (products || []).filter((p) => p._id !== id).slice(0, 4),
    [products, id]
  )

  const loadProduct = async () => {
    if (!id) return

    const cached = products.find((p) => p._id === id)
    if (cached) {
      setProduct(cached)
      setProductLoading(false)
      return
    }

    try {
      setProductLoading(true)
      const data = await productService.getProductById(id)
      setProduct(data.product)
    } catch {
      setProduct(null)
    } finally {
      setProductLoading(false)
    }
  }

  const loadReviews = async () => {
    if (!id) return

    try {
      setReviewLoading(true)
      const data = await reviewService.getProductReviews(id, 1, 20)
      setReviews(data.reviews || [])
      setReviewError(null)
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to load reviews')
    } finally {
      setReviewLoading(false)
    }
  }

  const checkVerifiedPurchase = async () => {
    if (!isAuthenticated || !id) {
      setCanReview(false)
      return
    }

    try {
      const data = await orderService.getUserOrders()
      const purchased = (data.orders || []).some((order) => {
        const delivered = ['shipped', 'delivered'].includes(order.orderStatus)
        return delivered && order.items?.some((item) => item.productId === id || item.productId?._id === id)
      })

      setCanReview(purchased)
    } catch {
      setCanReview(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProduct()
      void loadReviews()
      void checkVerifiedPurchase()
    }, 0)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, products, isAuthenticated])

  const handleAddToCart = () => {
    if (!product) return

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      })
    )

    setCartAdded(true)
    setTimeout(() => setCartAdded(false), 2000)
  }

  const refreshReviews = async () => {
    await loadReviews()
  }

  const ratingAverage = useMemo(() => {
    if (!reviews.length) return product?.rating || 0
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  }, [reviews, product])

  const ratingCount = reviews.length || product?.numReviews || 0

  const ratingBreakdown = useMemo(() => {
    const counts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((review) => Math.round(review.rating) === star).length,
    }))
    const max = Math.max(...counts.map((item) => item.count), 1)
    return counts.map((item) => ({
      ...item,
      width: `${(item.count / max) * 100}%`,
    }))
  }, [reviews])

  if (productLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-neutral-600 mb-4">Product not found</p>
          <Link to="/products" className="btn-primary">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  const productImages = [product.image, product.image, product.image, product.image].filter(Boolean)
  const rating = product.rating || ratingAverage || 0
  const reviewsLabel = ratingCount === 1 ? 'review' : 'reviews'
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="bg-white">
      <div className="container-fluid">
        <div className="py-4 text-xs uppercase tracking-[0.25em] text-neutral-500 flex flex-wrap gap-2 border-b border-neutral-200 mb-8 sm:mb-12">
          <Link to="/" className="hover:text-neutral-950 transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-neutral-950 transition">
            Shop
          </Link>
          <span>/</span>
          <span className="text-neutral-950 font-medium">{product.name}</span>
        </div>

        <section className="grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <div>
            <ImageGallery images={productImages} />
          </div>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-sm text-neutral-600 mb-5">
              <div className="flex gap-1 text-base">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < fullStars
                        ? 'text-neutral-950'
                        : i === fullStars && hasHalfStar
                        ? 'text-neutral-950/50'
                        : 'text-neutral-300'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <a href="#reviews" className="hover:text-neutral-950 underline underline-offset-4">
                {ratingCount} {reviewsLabel}
              </a>
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-950">
              {product.name}
            </h1>
            <p className="mt-5 text-3xl font-semibold text-neutral-950">৳{product.price.toFixed(2)}</p>

            <p className="mt-6 max-w-xl text-neutral-600 leading-7">{product.description}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-base text-neutral-600 hover:text-neutral-950"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 border-0 text-center text-sm font-semibold text-neutral-950 outline-none"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-base text-neutral-600 hover:text-neutral-950"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn-primary flex-1 ${cartAdded ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              >
                {cartAdded ? 'Added to cart' : 'Add to cart'}
              </button>
            </div>

            <div className="mt-10 space-y-0 border-t border-neutral-200 pt-4">
              <ProductAccordion title="Benefits">
                <p>{product.benefits || 'Built for everyday wellness with a clean, simple ingredient profile.'}</p>
              </ProductAccordion>

              <ProductAccordion title="Ingredients & usage">
                <div className="space-y-3">
                  <div>
                    <p className="mb-2 font-semibold text-neutral-950">Ingredients</p>
                    <p>{product.ingredients || 'Organic plant-based ingredients selected for quality and purity.'}</p>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-neutral-950">Usage</p>
                    <p>{product.usage || 'Take as directed and include in your daily routine.'}</p>
                  </div>
                </div>
              </ProductAccordion>

              <ProductAccordion title="Shipping & returns">
                <p>
                  {product.shipping ||
                    'Standard shipping is free on selected orders. Returns are available within 30 days.'}
                </p>
              </ProductAccordion>
            </div>
          </div>
        </section>

        <section id="reviews" className="border-t border-neutral-200 bg-neutral-50 py-12">
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500 mb-3">
                Customer Reviews
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-950">
                What customers think
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
              <div className="bg-white border border-neutral-200 rounded-lg p-6 h-fit">
                <h3 className="text-sm font-semibold text-neutral-950 mb-6">Overall Rating</h3>
                <div className="mt-6 flex items-end gap-3">
                  <div className="text-5xl font-semibold text-neutral-950">
                    {rating ? rating.toFixed(1) : '0.0'}
                  </div>
                  <div className="pb-1 text-sm text-neutral-500">
                    / 5 from {ratingCount} {reviewsLabel}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {ratingBreakdown.map((item) => (
                    <div key={item.star} className="flex items-center gap-3 text-sm">
                      <span className="w-5 text-neutral-500">{item.star}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                        <div className="h-full rounded-full bg-neutral-950" style={{ width: item.width }} />
                      </div>
                      <span className="w-5 text-right text-neutral-500">{item.count}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
                  Verified purchases only. That keeps the rating signal grounded in real orders.
                </div>
              </div>

              <div className="space-y-8">
                {isAuthenticated ? (
                  canReview ? (
                    <ReviewForm productId={id} onReviewSubmitted={refreshReviews} />
                  ) : (
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                      <p className="text-sm font-semibold text-neutral-950 mb-3">Write a Review</p>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        Only verified purchasers can submit a review. Once your order is shipped or delivered, you&apos;ll be able to leave a review here.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <p className="text-sm font-semibold text-neutral-950 mb-3">Write a Review</p>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                      Sign in to read and write verified-purchase reviews.
                    </p>
                    <Link to="/login" className="btn-primary inline-block">
                      Sign In
                    </Link>
                  </div>
                )}

                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <h3 className="text-lg font-semibold text-neutral-950">All Reviews</h3>
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-[0.25em]">
                      {reviews.length} total
                    </span>
                  </div>

                  {reviewError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                      {reviewError}
                    </div>
                  )}

                  <div className="space-y-5">
                    {reviewLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-6 h-6 border-3 border-neutral-200 border-t-neutral-950 rounded-full mx-auto mb-3" />
                        <p className="text-sm text-neutral-600">Loading reviews...</p>
                      </div>
                    ) : reviews.length > 0 ? (
                      reviews.map((review) => <ReviewCard key={review._id} review={review} />)
                    ) : (
                      <p className="text-center py-8 text-sm text-neutral-600">
                        No reviews yet. Be the first verified buyer to share your experience!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
    </div>
  )
}

export default ProductDetail
