import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setProducts, setError } from '../redux/slices/productsSlice'
import productService from '../services/productService'
import HeroSection from '../components/home/HeroSection'
import FeaturedSection from '../components/home/FeaturedSection'
import BenefitsSection from '../components/home/BenefitsSection'
import NewsletterSection from '../components/home/NewsletterSection'

function Home() {
  const dispatch = useDispatch()
  const { filteredProducts: products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch(setLoading(true))
        const data = await productService.getAllProducts()
        dispatch(setProducts(data.products || []))
      } catch (error) {
        console.error('[v0] Error loading products:', error)
        dispatch(setError(error.message || 'Failed to load products'))
      }
    }

    loadProducts()
  }, [dispatch])

  return (
    <div>
      <HeroSection />
      <FeaturedSection products={products || []} loading={loading} />
      <BenefitsSection />
      <NewsletterSection />
    </div>
  )
}

export default Home
