import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#FDFBF7]">
      <div className="container-fluid">
        <div className="max-w-2xl">
          <h1 
            className="mb-8 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
            style={{ color: '#1a1a1a' }}
          >
            Pure Nature,
            <br />
            <span style={{ color: '#2d7c5f' }}>Carefully</span>
            <br />
            Delivered.
          </h1>

          <p 
            className="mb-8 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: '#7a7a7a' }}
          >
            Discover our range of 100% organic products. Minimally processed, ethically sourced, and packed with natural goodness.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link 
              to="/products" 
              className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#2d7c5f' }}
            >
              Shop the Collection
            </Link>
            <Link 
              to="/products" 
              className="inline-block px-6 py-3 font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#1a1a1a' }}
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
