import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setOrders, setLoading, setError } from '../redux/slices/ordersSlice'
import orderService from '../services/orderService'

function OrderHistory() {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(setLoading(true))
      try {
        const data = await orderService.getUserOrders()
        dispatch(setOrders(data.orders))
      } catch (err) {
        dispatch(setError('Failed to load orders'))
      }
    }

    fetchOrders()
  }, [dispatch])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-light py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-dark mb-8">Order History</h1>

        {loading && <p className="text-center text-gray-600">Loading orders...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {orders.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet</p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row">
                  <div>
                    <h3 className="text-lg font-bold text-dark">Order #{order._id?.slice(-8).toUpperCase()}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 md:mt-0 ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600">Items: {order.items?.length}</p>
                  <div className="mt-2 space-y-1">
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {item.name} x {item.quantity}
                      </p>
                    ))}
                    {order.items?.length > 2 && (
                      <p className="text-sm text-gray-600">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-dark">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory
