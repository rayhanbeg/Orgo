import React from 'react'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="bg-neutral-200 rounded-lg overflow-hidden mb-4 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:opacity-90 transition duration-300"
        />
      </div>
      <h3 className="font-semibold text-neutral-950 text-sm mb-2 group-hover:text-[#2d7c5f] transition">
        {product.name}
      </h3>
      <p className="text-neutral-600 text-sm">৳{product.price.toFixed(2)}</p>
    </Link>
  )
}

export default ProductCard
