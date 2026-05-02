import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToCart } from '../../redux/slices/cartSlice'

function ProductCard({ product }) {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover hover:opacity-80 transition"
        />
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-bold text-dark hover:text-primary transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2 my-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          {product.certified && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Certified</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <Link
            to={`/products/${product._id}`}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-green-50 transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
