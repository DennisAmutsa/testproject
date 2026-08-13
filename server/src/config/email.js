import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a back-in-stock notification email
 * @param {string} to - recipient email
 * @param {object} product - { name, category, totalStock }
 */
export async function sendRestockEmail(to, product) {
  await transporter.sendMail({
    from: `"Northstar Retail Co." <${process.env.EMAIL_USER}>`,
    to,
    subject: `✅ Back in Stock: ${product.name}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #0a0e1a; padding: 28px 32px; text-align: center;">
          <h1 style="color: #f5c518; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">⭐ Northstar Retail Co.</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 800; margin: 0 0 8px;">Great news — it''s back!</h2>
          <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">A product you requested is now back in stock.</p>

          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #92400e; font-size: 13px; font-weight: 700; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.05em;">Product</p>
            <p style="color: #1e293b; font-size: 18px; font-weight: 900; margin: 0 0 6px;">${product.name}</p>
            <p style="color: #64748b; font-size: 13px; margin: 0 0 6px;">${product.category}</p>
            <span style="background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; border: 1px solid #bbf7d0;">✓ In Stock — ${product.totalStock} units available</span>
          </div>

          <p style="color: #64748b; font-size: 13px; margin: 0 0 24px;">Hurry — stock can sell out fast. Visit the store to grab yours before it''s gone again.</p>

          <a href="${process.env.CLIENT_URL}/stock" style="display: inline-block; background: #f5c518; color: #0a0e1a; font-weight: 900; font-size: 14px; padding: 14px 28px; border-radius: 10px; text-decoration: none;">Shop Now →</a>
        </div>
        <div style="background: #f8fafc; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">You received this because you requested a restock alert. <br/>© 2026 Northstar Retail Co.</p>
        </div>
      </div>
    `,
  });
/**
 * Send new order confirmation email to customer & notification to admin
 */
export async function sendNewOrderEmail(order) {
  const itemsListHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 12px 0; font-size: 13px; font-weight: 700; color: #1e293b;">${item.name} (${item.size || 'Standard'})</td>
      <td style="padding: 12px 0; font-size: 13px; font-weight: 700; color: #1e293b; text-align: center;">x${item.quantity || 1}</td>
      <td style="padding: 12px 0; font-size: 13px; font-weight: 800; color: #1e293b; text-align: right;">KES ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
    </tr>
  `).join('');

  const totalAmount = order.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: #0a0e1a; padding: 28px 32px; text-align: center;">
        <h1 style="color: #f5c518; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">⭐ Northstar Retail Co.</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #1e293b; font-size: 20px; font-weight: 800; margin: 0 0 8px;">Order Confirmation</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0 0 20px;">Thank you for your order, <strong>${order.customerName}</strong>!</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px; text-align: center;">
          <p style="color: #64748b; font-size: 12px; margin: 0 0 4px; font-weight: 700; text-transform: uppercase;">Order Tracking Number</p>
          <p style="color: #0a0e1a; font-size: 22px; font-weight: 900; margin: 0; letter-spacing: 1px;">${order.orderId}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
              <th style="padding-bottom: 8px; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Item</th>
              <th style="padding-bottom: 8px; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; text-align: center;">Qty</th>
              <th style="padding-bottom: 8px; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>

        <div style="border-top: 2px solid #0a0e1a; padding-top: 12px; text-align: right; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 16px; font-weight: 900; color: #0a0e1a;">Grand Total: KES ${totalAmount.toLocaleString()}</p>
        </div>

        <a href="${process.env.CLIENT_URL}/dashboard/orders" style="display: inline-block; background: #f5c518; color: #0a0e1a; font-weight: 900; font-size: 14px; padding: 14px 28px; border-radius: 10px; text-decoration: none;">Track Order Status →</a>
      </div>
      <div style="background: #f8fafc; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">© 2026 Northstar Retail Co. All rights reserved.</p>
      </div>
    </div>
  `;

  // 1. Send confirmation receipt to Customer
  await transporter.sendMail({
    from: `"Northstar Retail Co." <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `🛍️ Order Received: ${order.orderId}`,
    html: emailHtml
  }).catch(err => console.error("Customer order email error:", err.message));

  // 2. Send notification to Admin (if different from customer)
  if (process.env.EMAIL_USER && order.customerEmail.toLowerCase() !== process.env.EMAIL_USER.toLowerCase()) {
    await transporter.sendMail({
      from: `"Northstar System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🚨 NEW ORDER RECEIVED: ${order.orderId} - KES ${totalAmount.toLocaleString()}`,
      html: emailHtml
    }).catch(err => console.error("Admin order notification error:", err.message));
  }
}

