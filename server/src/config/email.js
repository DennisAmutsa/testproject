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
}
