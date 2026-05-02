import transporter from '../config/email.js'
import {
  getOrderConfirmationEmail,
  getOrderStatusEmail,
  getReviewInvitationEmail,
} from './emailTemplates.js'

export const sendOrderConfirmationEmail = async (order) => {
  try {
    if (!order.shippingAddress || !order.shippingAddress.email) {
      console.error('Missing email address in order')
      return false
    }

    const isCOD = order.paymentMethod === 'cod'
    const htmlContent = getOrderConfirmationEmail(order, isCOD)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.shippingAddress.email,
      subject: `Order Confirmation #${order._id} - Organic Store`,
      html: htmlContent,
    })

    console.log(`Order confirmation email sent to ${order.shippingAddress.email}`)
    return true
  } catch (error) {
    console.error('Error sending order confirmation email:', error.message)
    return false
  }
}

export const sendOrderStatusUpdateEmail = async (order, newStatus) => {
  try {
    if (!order.shippingAddress || !order.shippingAddress.email) {
      console.error('Missing email address in order')
      return false
    }

    const htmlContent = getOrderStatusEmail(order, newStatus)

    const subjectMap = {
      processing: 'Order Processing',
      shipped: 'Order Shipped!',
      delivered: 'Order Delivered!',
      cancelled: 'Order Cancelled',
    }

    const subject = subjectMap[newStatus] || 'Order Status Update'

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.shippingAddress.email,
      subject: `${subject} - Organic Store`,
      html: htmlContent,
    })

    console.log(`Order status update email sent to ${order.shippingAddress.email}`)
    return true
  } catch (error) {
    console.error('Error sending order status email:', error.message)
    return false
  }
}

export const sendReviewInvitationEmail = async (order, customerName) => {
  try {
    if (!order.shippingAddress || !order.shippingAddress.email) {
      console.error('Missing email address in order')
      return false
    }

    const htmlContent = getReviewInvitationEmail(order, customerName)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.shippingAddress.email,
      subject: 'We would love your feedback - Organic Store',
      html: htmlContent,
    })

    console.log(`Review invitation email sent to ${order.shippingAddress.email}`)
    return true
  } catch (error) {
    console.error('Error sending review invitation email:', error.message)
    return false
  }
}

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Welcome to Organic Store!</h1>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <p>Hello ${userName},</p>
          
          <p>Welcome to Organic Store! We&apos;re thrilled to have you join our community of health-conscious shoppers.</p>
          
          <p style="font-size: 16px; line-height: 1.6;">At Organic Store, we believe in providing the freshest, highest-quality organic products directly to your doorstep. Our mission is to make healthy eating accessible to everyone.</p>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #059669;">Why Shop with Us?</h3>
            <ul style="line-height: 1.8; margin: 10px 0;">
              <li>100% Certified Organic Products</li>
              <li>Farm Fresh Delivery</li>
              <li>Free Shipping on All Orders</li>
              <li>30-Day Money Back Guarantee</li>
              <li>Dedicated Customer Support</li>
            </ul>
          </div>

          <p style="text-align: center;">
            <a href="https://organic-store.com/products" style="display: inline-block; background-color: #059669; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold;">
              Start Shopping
            </a>
          </p>

          <p style="margin-top: 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
            If you have any questions, feel free to reach out to our support team at <strong>support@organic-store.com</strong>
          </p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
          <p style="margin: 5px 0;">Organic Store - Fresh & Healthy Products</p>
          <p style="margin: 5px 0;">© 2024 All rights reserved.</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to Organic Store!',
      html: htmlContent,
    })

    console.log(`Welcome email sent to ${userEmail}`)
    return true
  } catch (error) {
    console.error('Error sending welcome email:', error.message)
    return false
  }
}
