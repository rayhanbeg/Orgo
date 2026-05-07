import ProductCard from './ProductCard'

function RelatedProducts({ products = [], title = 'PAIRS WELL WITH' }) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="border-t border-gray-200 py-12">
      <div className="container-fluid">
        <h2 className="text-2xl font-bold text-black mb-8 tracking-wide">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts
