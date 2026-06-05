require('dotenv').config({ path: require('path').resolve(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Helper to log to server.log
const logToFile = (message) => {
  try {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(path.join(__dirname, 'server.log'), logMessage);
  } catch (err) {
    console.error('Failed to write to log file:', err.message);
  }
};

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  logToFile(`${req.method} ${req.url}`);
  next();
});

// Send transactional email helper using Brevo REST API (native fetch)
const sendOrderConfirmationEmail = async (buyerEmail, buyerName, orderDetails) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey === 'your_brevo_api_key_here' || apiKey.startsWith('your_')) {
    logToFile('⚠️ BREVO_API_KEY is not configured in .env. Email service running in MOCK mode.');
    
    logToFile('======= 📧 MOCK EMAIL LOG (BREVO KEY NOT SET) =======');
    logToFile(`To: ${buyerEmail} (${buyerName})`);
    logToFile(`Subject: Order Confirmed #${orderDetails.orderId}`);
    logToFile(`Grand Total: ₹${orderDetails.totalAmount}`);
    logToFile('=====================================================');
    return { mock: true, message: 'Email logged in mock mode.' };
  }

  let senderEmail = process.env.SENDER_EMAIL;
  if (!senderEmail || senderEmail.startsWith('your_') || senderEmail.includes('example.com')) {
    senderEmail = 'diwakarrawat2003@gmail.com';
  }
  const senderName = process.env.SENDER_NAME || 'Artisan Marketplace';
  
  logToFile(`Preparing email for ${buyerEmail} from sender ${senderEmail}`);

  // Format items table for email
  const formattedItems = orderDetails.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ede0c8; color: #2d1502; font-family: sans-serif;">
        <strong>${item.productName || 'Handcrafted Item'}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ede0c8; text-align: center; color: #2d1502; font-family: sans-serif;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ede0c8; text-align: right; color: #2d1502; font-family: sans-serif;">
        ₹${item.price.toLocaleString('en-IN')}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ede0c8; text-align: right; color: #2d1502; font-family: sans-serif;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  // Rich HTML template with artisan palette (cream, chocolate, brown)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed - Artisan Marketplace</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5e6c8; font-family: sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5e6c8; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(92, 46, 10, 0.1);">
              <!-- Header Section -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #5c2e0a 0%, #8B4513 100%); padding: 40px 20px; color: #ffffff;">
                  <div style="font-size: 30px; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px;">Artisan Marketplace</div>
                  <div style="font-size: 14px; color: #ede0c8; text-transform: uppercase; letter-spacing: 2px;">Thank you for supporting authentic craft</div>
                </td>
              </tr>
              
              <!-- Success Banner -->
              <tr>
                <td align="center" style="padding: 30px 30px 10px 30px;">
                  <div style="width: 64px; height: 64px; background-color: #e8f5e9; border-radius: 50%; display: inline-block; text-align: center; line-height: 68px; margin-bottom: 20px;">
                    <span style="color: #4caf50; font-size: 32px; font-weight: bold;">✓</span>
                  </div>
                  <h1 style="color: #5c2e0a; margin: 0; font-size: 24px; font-weight: 700;">Order Confirmed!</h1>
                  <p style="color: #665544; font-size: 16px; line-height: 1.5; margin-top: 10px;">
                    Hi <strong>${buyerName}</strong>, your purchase is complete! The artisan has been notified and will begin preparing your order.
                  </p>
                </td>
              </tr>

              <!-- Details Summary -->
              <tr>
                <td style="padding: 20px 30px;">
                  <div style="background-color: #FFF8DC; border-radius: 12px; padding: 20px; border: 1px solid #ede0c8;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #665544;">Order ID:</td>
                        <td style="padding-bottom: 8px; font-size: 14px; font-weight: bold; color: #5c2e0a; text-align: right;">#${orderDetails.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #665544;">Shipping To:</td>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #5c2e0a; text-align: right;"><strong>${orderDetails.shippingAddress.fullName}</strong></td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #665544; vertical-align: top;">Address:</td>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #5c2e0a; text-align: right; max-width: 250px;">
                          ${orderDetails.shippingAddress.street},<br>
                          ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} - ${orderDetails.shippingAddress.pincode}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #665544;">Payment Method:</td>
                        <td style="font-size: 14px; color: #5c2e0a; text-align: right; text-transform: uppercase;">${orderDetails.paymentMethod}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Items List -->
              <tr>
                <td style="padding: 10px 30px;">
                  <h3 style="color: #5c2e0a; margin-bottom: 10px; font-size: 16px; border-bottom: 2px solid #8B4513; padding-bottom: 6px;">Purchase Summary</h3>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #ede0c8;">
                        <th align="left" style="padding: 10px; font-size: 12px; text-transform: uppercase; color: #5c2e0a;">Item</th>
                        <th align="center" style="padding: 10px; font-size: 12px; text-transform: uppercase; color: #5c2e0a;">Qty</th>
                        <th align="right" style="padding: 10px; font-size: 12px; text-transform: uppercase; color: #5c2e0a;">Price</th>
                        <th align="right" style="padding: 10px; font-size: 12px; text-transform: uppercase; color: #5c2e0a;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${formattedItems}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Price Calculations -->
              <tr>
                <td style="padding: 20px 30px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px; margin-left: auto;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #665544;">Subtotal:</td>
                      <td align="right" style="padding: 6px 0; font-size: 14px; color: #2d1502;">₹${orderDetails.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #665544;">Shipping:</td>
                      <td align="right" style="padding: 6px 0; font-size: 14px; color: #2d1502;">${orderDetails.shipping === 0 ? 'FREE' : '₹' + orderDetails.shipping.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #665544;">Tax (18% GST):</td>
                      <td align="right" style="padding: 6px 0; font-size: 14px; color: #2d1502;">₹${orderDetails.tax.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="border-top: 1px solid #ede0c8;">
                      <td style="padding: 12px 0; font-size: 16px; font-weight: bold; color: #5c2e0a;">Grand Total:</td>
                      <td align="right" style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #8B4513;">₹${orderDetails.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer section -->
              <tr>
                <td align="center" style="background-color: #fdfaf2; padding: 30px; border-top: 1px solid #f5e6c8; color: #887766; font-size: 12px; line-height: 1.6;">
                  <p style="margin: 0 0 10px 0;">You are receiving this email because you made a purchase at Artisan Marketplace.</p>
                  <p style="margin: 0;">&copy; 2026 Artisan Marketplace. Handmade with love.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Payload structure for Brevo API v3 HTTP POST
  const payload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      {
        email: buyerEmail,
        name: buyerName
      }
    ],
    subject: `Order Confirmed! #${orderDetails.orderId}`,
    htmlContent: htmlContent
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send email via Brevo REST API");
    }

    logToFile(`✅ Email sent successfully via Brevo REST API to ${buyerEmail}. Message ID: ${data.messageId || 'unknown'}`);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    logToFile(`❌ Brevo email sending failed to ${buyerEmail}: ${error.message}`);
    throw error;
  }
};

// POST Order Endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    logToFile(`New order placement request received. Payment method: ${paymentMethod}`);

    // Validate inputs
    if (!items || items.length === 0 || !shippingAddress) {
      logToFile('❌ Validation failed: Missing order items or shipping address');
      return res.status(400).json({ message: 'Missing order items or shipping address.' });
    }

    // Generate a quick random Order ID if not provided
    const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);

    // Retrieve buyer email & name from request body
    const buyerEmail = req.body.buyerEmail || req.headers['x-buyer-email'] || 'buyer-test@example.com';
    const buyerName = req.body.buyerName || shippingAddress.fullName || 'Valued Customer';

    logToFile(`Buyer resolved to Name: "${buyerName}", Email: "${buyerEmail}"`);

    // Pricing calculation
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 100;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const calculatedTotal = subtotal + shipping + tax;

    // Prepare details for email
    const orderDetails = {
      orderId,
      shippingAddress,
      paymentMethod,
      items: items.map(item => ({
        productName: item.productName || item.product?.name || 'Handcrafted Craft Item',
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      shipping,
      tax,
      totalAmount: totalAmount || calculatedTotal
    };

    // Trigger email send (doesn't block response to avoid delay)
    sendOrderConfirmationEmail(buyerEmail, buyerName, orderDetails)
      .catch(err => logToFile(`Background email dispatch failed: ${err.message}`));

    // Return success response to frontend matching the structure it expects
    res.status(201).json({
      _id: orderId,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      totalAmount: orderDetails.totalAmount,
      shippingAddress,
      items: orderDetails.items,
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    logToFile(`❌ Order placement route error: ${error.message}`);
    res.status(500).json({ message: 'Order processing failed.', error: error.message });
  }
});

// Dummy Add to Cart Route (to prevent frontend errors and support local storage fallback)
app.post('/api/cart/add', (req, res) => {
  logToFile(`Add to cart request received for Product ID: ${req.body.productId}`);
  res.status(200).json({ success: true, message: 'Item added to cart' });
});

// Simple Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Artisan Email Backend API' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logToFile(`🚀 Single Server running on port ${PORT}`);
  console.log(`🚀 Single Server running on port ${PORT}`);
  console.log(`📋 POST Endpoint: http://localhost:${PORT}/api/orders`);
});
