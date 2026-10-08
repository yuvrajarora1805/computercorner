import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,   // mail.omvky.com
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // false for port 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // allow self-signed certs on custom mail servers
  },
});

/**
 * Send order confirmation email to the customer
 */
export async function sendOrderConfirmationEmail({ to, name, orderId, items, totalAmount, shippingAddress }) {
  const itemRows = items
    .map(item => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #222;">${item.name}</td>
        <td style="padding:10px;border-bottom:1px solid #222;text-align:center;">${item.cartQuantity || 1}</td>
        <td style="padding:10px;border-bottom:1px solid #222;text-align:right;">₹${(Number(String(item.price).replace(/,/g,'')) * (item.cartQuantity || 1)).toLocaleString()}</td>
      </tr>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#ffffff;">
  <div style="max-width:640px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#EAB308;padding:28px 32px;">
      <h1 style="margin:0;font-size:22px;color:#000;font-weight:800;">⚡ The Computer Corner</h1>
      <p style="margin:4px 0 0;font-size:13px;color:#000;opacity:0.7;">Order Confirmation</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="font-size:20px;margin-top:0;color:#fff;">Hi ${name}, your order is confirmed! 🎉</h2>
      <p style="color:#aaa;font-size:14px;">Thank you for your purchase. We've received your order and it's being processed.</p>

      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:13px;color:#888;">Order ID</p>
        <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#EAB308;letter-spacing:1px;">${orderId}</p>
      </div>

      <!-- Order Items Table -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#1a1a1a;">
            <th style="padding:10px;text-align:left;font-size:12px;color:#888;text-transform:uppercase;">Product</th>
            <th style="padding:10px;text-align:center;font-size:12px;color:#888;text-transform:uppercase;">Qty</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#888;text-transform:uppercase;">Price</th>
          </tr>
        </thead>
        <tbody style="font-size:14px;">
          ${itemRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:14px 10px;font-weight:700;font-size:16px;">Total</td>
            <td style="padding:14px 10px;font-weight:800;font-size:18px;color:#EAB308;text-align:right;">₹${Number(totalAmount).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Shipping Address -->
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 6px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Shipping To</p>
        <p style="margin:0;font-size:14px;color:#ddd;line-height:1.6;">${shippingAddress}</p>
      </div>

      <p style="font-size:13px;color:#666;">We'll send you another email when your order ships. If you have any questions, reply to this email.</p>
    </div>

    <!-- Footer -->
    <div style="background:#0a0a0a;padding:20px 32px;text-align:center;border-top:1px solid #222;">
      <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} The Computer Corner · noreply@thecomputercorner.org</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"The Computer Corner" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Order Confirmed ✅ — ${orderId}`,
    html,
  });
}

/**
 * Send order status update email to the customer
 */
export async function sendOrderStatusEmail({ to, name, orderId, newStatus }) {
  const statusColor = {
    'Processing': '#3B82F6',
    'Shipped': '#8B5CF6',
    'Delivered': '#22C55E',
    'Cancelled': '#EF4444',
  }[newStatus] || '#EAB308';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
    <div style="background:#EAB308;padding:24px 32px;">
      <h1 style="margin:0;font-size:20px;color:#000;font-weight:800;">⚡ The Computer Corner</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="margin-top:0;">Order Update for ${name}</h2>
      <p style="color:#aaa;">Your order status has been updated.</p>
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:20px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#888;">Order ID: <strong style="color:#fff;">${orderId}</strong></p>
        <p style="margin:12px 0 0;font-size:22px;font-weight:800;color:${statusColor};">${newStatus}</p>
      </div>
    </div>
    <div style="background:#0a0a0a;padding:16px 32px;text-align:center;border-top:1px solid #222;">
      <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} The Computer Corner</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"The Computer Corner" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Order ${newStatus} — ${orderId}`,
    html,
  });
}

/**
 * Send password reset email to the user
 */
export async function sendPasswordResetEmail({ to, name, resetLink }) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
    <div style="background:#EAB308;padding:24px 32px;">
      <h1 style="margin:0;font-size:20px;color:#000;font-weight:800;">⚡ The Computer Corner</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="margin-top:0;">Password Reset Request</h2>
      <p style="color:#aaa;">Hi ${name}, we received a request to reset your password. Click the button below to choose a new one:</p>
      
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetLink}" style="background:#EAB308;color:#000;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:16px;display:inline-block;">Reset Password</a>
      </div>

      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:13px;color:#888;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="margin:8px 0 0;font-size:13px;color:#EAB308;word-break:break-all;">${resetLink}</p>
      </div>
      
      <p style="color:#888;font-size:14px;margin-top:24px;"><strong>Note:</strong> Please check your spam or junk folder if you don't see our emails in the future.</p>
      <p style="color:#555;font-size:13px;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
    <div style="background:#0a0a0a;padding:16px 32px;text-align:center;border-top:1px solid #222;">
      <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} The Computer Corner</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"The Computer Corner" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Password Reset — The Computer Corner`,
    html,
  });
}

/**
 * Send welcome email to a new user
 */
export async function sendWelcomeEmail({ to, name }) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
    <div style="background:#EAB308;padding:24px 32px;">
      <h1 style="margin:0;font-size:20px;color:#000;font-weight:800;">⚡ The Computer Corner</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="margin-top:0;">Welcome, ${name}! 🎉</h2>
      <p style="color:#aaa;font-size:15px;line-height:1.6;">Thank you for creating an account with The Computer Corner! We're thrilled to have you here.</p>
      
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="margin:0;font-size:14px;color:#ddd;line-height:1.6;">With your new account, you can:</p>
        <ul style="color:#EAB308;margin:12px 0 0;padding-left:20px;font-size:14px;line-height:1.8;">
          <li><span style="color:#aaa;">Track your orders in real-time</span></li>
          <li><span style="color:#aaa;">Save your favorite PC builds</span></li>
          <li><span style="color:#aaa;">Checkout faster</span></li>
        </ul>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/products" style="background:#EAB308;color:#000;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:16px;display:inline-block;">Explore Products</a>
      </div>
      
      <p style="color:#555;font-size:13px;margin-top:24px;">If you have any questions, simply reply to this email. We're here to help.</p>
    </div>
    <div style="background:#0a0a0a;padding:16px 32px;text-align:center;border-top:1px solid #222;">
      <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} The Computer Corner</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"The Computer Corner" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Welcome to The Computer Corner! 🎉`,
    html,
  });
}

/**
 * Send custom email to the customer
 */
export async function sendCustomEmail({ to, name, subject, message, orderId }) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
    <div style="background:#EAB308;padding:24px 32px;">
      <h1 style="margin:0;font-size:20px;color:#000;font-weight:800;">⚡ The Computer Corner</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="margin-top:0;">Hello ${name},</h2>
      <p style="color:#aaa;line-height:1.6;white-space:pre-wrap;">${message}</p>
      
      ${orderId ? `
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:20px;margin-top:24px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#888;">Regarding Order ID: <strong style="color:#EAB308;">${orderId}</strong></p>
      </div>` : ''}
    </div>
    <div style="background:#0a0a0a;padding:16px 32px;text-align:center;border-top:1px solid #222;">
      <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} The Computer Corner</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"The Computer Corner" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}

/**
 * Send password change success email to the user
 */
export async function sendPasswordChangeSuccessEmail({ to, name }) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
    <div style="background:#EAB308;padding:24px 32px;">
      <h1 style="margin:0;font-size:20px;color:#000;font-weight:800;">⚡ The Computer Corner</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="margin-top:0;">Password Successfully Changed ✅</h2>
      <p style="color:#aaa;">Hi ${name}, this is a confirmation that the password for your account has been successfully changed.</p>
      
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:13px;color:#888;">If you made this change, you don't need to do anything else!</p>
      </div>
      
      <p style="color:#ef4444;font-size:14px;margin-top:24px;font-weight:bold;">Didn't make this change?</p>
      <p style="color:#555;font-size:13px;">If you did not reset your password, please contact our support team immediately to secure your account.</p>
    </div>
    <div style="background:#0a0a0a;padding:16px 32px;text-align:center;border-top:1px solid #222;">
      <p style="margin:0;font-size:12px;color:#555;">© ${new Date().getFullYear()} The Computer Corner</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"The Computer Corner" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Your Password Was Changed — The Computer Corner`,
    html,
  });
}
