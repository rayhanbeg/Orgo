import { Link } from 'react-router-dom'

function CategoriesSection() {
  const categories = [
    {
      id: 1,
      title: 'Fresh Produce',
      description: 'Seasonal fruits and vegetables',
      icon: '🥕',
      color: '#ff6b6b'
    },
    {
      id: 2,
      title: 'Dairy & Eggs',
      description: 'Farm-fresh dairy products',
      icon: '🥛',
      color: '#4ecdc4'
    },
    {
      id: 3,
      title: 'Grains & Seeds',
      description: 'Organic grains and nuts',
      icon: '🌾',
      color: '#ffe66d'
    },
    {
      id: 4,
      title: 'Pantry Staples',
      description: 'Essential organic items',
      icon: '🍯',
      color: '#a8e6cf'
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-fluid">
        <div className="mb-12 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Shop by category
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            Browse Our Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/products"
              className="group relative overflow-hidden rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2"
              style={{ 
                backgroundColor: 'var(--color-card-bg)',
                borderColor: 'var(--color-border)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" style={{ backgroundColor: category.color }} />
              
              <div className="relative">
                <div className="mb-4 text-4xl">{category.icon}</div>
                <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  {category.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  {category.description}
                </p>
                <span 
                  className="inline-flex items-center text-sm font-semibold transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection
