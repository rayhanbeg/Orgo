export const getOrderConfirmationEmail = (order, isCOD = false) => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('')

  const paymentNote = isCOD
    ? '<p style="color: #059669; font-weight: bold; background-color: #f0fdf4; padding: 12px; border-radius: 4px; margin: 15px 0;">Payment method: Cash on Delivery (Pay at delivery)</p>'
    : ''

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
      <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Order Confirmation</h1>
      </div>

      <div style="padding: 30px; background-color: #ffffff;">
        <p>Dear ${order.shippingAddress.firstName},</p>
        
        <p>Thank you for your order! We&apos;re excited to process and ship it to you.</p>
        
        <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #059669; margin: 20px 0;">
          <p style="margin: 0;"><strong>Order ID:</strong> ${order._id}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Processing</span></p>
        </div>

        ${paymentNote}

        <h3 style="color: #1f2937; margin-top: 20px; border-bottom: 2px solid #059669; padding-bottom: 10px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 8px; text-align: left; font-weight: bold;">Product</th>
              <th style="padding: 8px; text-align: left; font-weight: bold;">Price</th>
              <th style="padding: 8px; text-align: left; font-weight: bold;">Qty</th>
              <th style="padding: 8px; text-align: left; font-weight: bold;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 15px;">
          <p style="font-size: 18px; font-weight: bold; color: #059669; margin: 10px 0;">
            Total Amount: $${order.totalAmount.toFixed(2)}
          </p>
        </div>

        <h3 style="color: #1f2937; margin-top: 20px; border-bottom: 2px solid #059669; padding-bottom: 10px;">Delivery Address</h3>
        <p style="background-color: #f9fafb; padding: 12px; border-radius: 4px;">
          <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong><br>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
          ${order.shippingAddress.country}<br>
          <strong>Phone:</strong> ${order.shippingAddress.phone}
        </p>

        <div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #1f2937;">What&apos;s Next?</h4>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Your order is being prepared for shipment</li>
            <li>You&apos;ll receive a shipping notification with tracking details</li>
            <li>Expected delivery: 3-5 business days</li>
          </ul>
        </div>

        <p style="margin-top: 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you have any questions about your order, please don&apos;t hesitate to contact us at <strong>support@organic-store.com</strong> or reply to this email.
        </p>
      </div>

      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
        <p style="margin: 5px 0;">Organic Store - Fresh & Healthy Products</p>
        <p style="margin: 5px 0;">© 2024 All rights reserved.</p>
      </div>
    </div>
  `
}

export const getOrderStatusEmail = (order, newStatus) => {
  const statusMessages = {
    processing: {
      title: 'Your Order is Being Processed',
      message: 'Your order is being prepared for shipment.',
      emoji: '📦',
    },
    shipped: {
      title: 'Your Order Has Shipped!',
      message: `Your order has been shipped! You can track your package using tracking number: ${order.trackingNumber || 'Coming soon'}`,
      emoji: '🚚',
    },
    delivered: {
      title: 'Your Order Has Been Delivered',
      message: 'Your order has been successfully delivered. Thank you for your purchase!',
      emoji: '✓',
    },
    cancelled: {
      title: 'Your Order Has Been Cancelled',
      message: 'Your order has been cancelled. If you did not request this, please contact us immediately.',
      emoji: '✗',
    },
  }

  const status = statusMessages[newStatus] || { title: 'Order Update', message: 'Your order status has been updated', emoji: '📧' }

  const isCOD = order.paymentMethod === 'cod'
  const codNote = newStatus === 'delivered' && isCOD
    ? '<p style="color: #059669; font-weight: bold; background-color: #f0fdf4; padding: 12px; border-radius: 4px; margin: 15px 0;">Payment received. Thank you for paying on delivery!</p>'
    : ''

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
      <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">${status.emoji} ${status.title}</h1>
      </div>

      <div style="padding: 30px; background-color: #ffffff;">
        <p>Dear ${order.shippingAddress.firstName},</p>
        
        <p style="font-size: 16px; line-height: 1.6;">${status.message}</p>

        <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #059669; margin: 20px 0;">
          <p style="margin: 0;"><strong>Order ID:</strong> ${order._id}</p>
          <p style="margin: 5px 0;"><strong>Order Status:</strong> <span style="color: #059669; font-weight: bold; text-transform: uppercase;">${newStatus}</span></p>
          <p style="margin: 5px 0;"><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        ${codNote}

        ${newStatus === 'delivered' ? `
          <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #1f2937;">Share Your Feedback</h4>
            <p>We'd love to hear your experience with our products and delivery! Your reviews help us improve.</p>
          </div>
        ` : ''}

        <h4 style="color: #1f2937; margin-top: 20px;">Order Summary</h4>
        <div style="background-color: #f9fafb; padding: 12px; border-radius: 4px;">
          <p style="margin: 5px 0;"><strong>Total Items:</strong> ${order.items.length}</p>
          <p style="margin: 5px 0;"><strong>Order Total:</strong> $${order.totalAmount.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.paymentStatus === 'completed' ? '✓ Completed' : 'Pending'}</p>
        </div>

        <p style="margin-top: 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you have any questions, please contact us at <strong>support@organic-store.com</strong>
        </p>
      </div>

      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
        <p style="margin: 5px 0;">Organic Store - Fresh & Healthy Products</p>
        <p style="margin: 5px 0;">© 2024 All rights reserved.</p>
      </div>
    </div>
  `
}

export const getReviewInvitationEmail = (order, customerName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
      <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">We'd Love Your Feedback!</h1>
      </div>

      <div style="padding: 30px; background-color: #ffffff;">
        <p>Dear ${customerName},</p>
        
        <p>Your order has been delivered! We hope you&apos;re happy with your purchase.</p>
        
        <p style="font-size: 16px; line-height: 1.6;">We would greatly appreciate your feedback on the products you received. Your reviews help us understand what you loved and how we can improve.</p>

        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center;">
          <a href="https://organic-store.com/orders/${order._id}/reviews" style="display: inline-block; background-color: #059669; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold;">
            Leave a Review
          </a>
        </div>

        <h4 style="color: #1f2937; margin-top: 20px;">What We&apos;d Like to Know:</h4>
        <ul style="line-height: 1.8;">
          <li>How fresh were the products?</li>
          <li>How would you rate the quality?</li>
          <li>Was the delivery timely?</li>
          <li>Would you recommend us to friends?</li>
        </ul>

        <p style="margin-top: 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
          Thank you for choosing Organic Store. Your feedback means everything to us!
        </p>
      </div>

      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
        <p style="margin: 5px 0;">Organic Store - Fresh & Healthy Products</p>
        <p style="margin: 5px 0;">© 2024 All rights reserved.</p>
      </div>
    </div>
  `
}
