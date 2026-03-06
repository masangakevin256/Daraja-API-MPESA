# 🇰🇪 M-Pesa Daraja API Integration

A robust and premium Node.js integration for Safaricom's **Daraja API (MPESA)**. This project provides a ready-to-use server for handling STK Push, C2B (Customer to Business), and B2C (Business to Customer) transactions.

---

## 🚀 Features

- **⚡ STK Push (Lipa na M-Pesa Online):** Initiate payment requests directly to a user's phone.
- **🏢 C2B Register URL:** Register confirmation and validation URLs for till/paybill payments.
- **💸 B2C Payments:** Automate withdrawals from your business account to customers.
- **🔗 Webhook Callbacks:** Pre-configured endpoints to handle transaction results from Safaricom.
- **🛡️ Secure Authentication:** Automatic OAuth2 token generation and management.
- **🔄 Dynamic Configuration:** Fully configurable via environment variables.

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PNPM](https://pnpm.io/)
- [Ngrok](https://ngrok.com/) (for local testing of callbacks)
- [Daraja Developer Account](https://developer.safaricom.co.ke/)

---

## 🛠️ Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/masangakevin256/Daraja-API-MPESA.git
   cd Daraja-API-MPESA
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (see [Configuration](#-configuration) below).

4. **Run the server:**
   ```bash
   # Development mode (with nodemon)
   pnpm run dev
   
   # Production mode
   pnpm start
   ```

---

## 🔑 Configuration

Create a `.env` file and populate it with your Daraja credentials:

```ini
# Server Configuration
PORT=3000

# Daraja API Credentials
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_lipa_na_mpesa_passkey
MPESA_SHORTCODE=your_shortcode

# Callback & Ngrok Configuration
NGROK_URL=https://your-ngrok-id.ngrok-free.dev
MPESA_CALLBACK_URL=https://your-ngrok-id.ngrok-free.dev/api/mpesa/callback

# B2C configuration
MPESA_SECURITY_CREDENTIALS=your_security_credential
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/stkpush` | Initiates an STK Push payment request. |
| `GET` | `/register_url` | Registers C2B validation and confirmation URLs. |
| `GET` | `/b2c/url_request` | Initiates a Business to Customer payment. |
| `POST` | `/confirmation` | Webhook for C2B Confirmation. |
| `POST` | `/validation` | Webhook for C2B Validation. |
| `POST` | `/api/mpesa/callback` | Webhook for STK Push results. |


---

# MPESA Callback Flow (Simple Explanation)

This document explains **how MPESA communicates with your server** when someone makes a payment using your **Paybill or Till Number**.

---

## 1. User Initiates Payment

A customer goes to **M-PESA** and enters:

- Paybill Number (e.g., `600996`)
- Account Number
- Amount
- M-PESA PIN

Then they press **Send**.

At this point, the request is handled by **Safaricom's MPESA servers**.

---

## 2. Safaricom Processes the Payment

Safaricom:

1. Validates the transaction
2. Deducts the money from the user's account
3. Confirms the transaction internally

After that, Safaricom needs to **notify your system** about the transaction.

---

## 3. Safaricom Sends Data to Your Server

Safaricom sends an **HTTP POST request** to the callback URL you registered.

Example callback URL:

```
https://yourdomain.com/mpesa/callback
```

Safaricom sends transaction details like:

- Transaction ID
- Amount
- Phone number
- Paybill
- Account reference
- Transaction time

Example JSON sent to your server:

```json
{
  "TransactionType": "Pay Bill",
  "TransID": "RKTQDM7W6S",
  "TransTime": "20260306123045",
  "TransAmount": "1000",
  "BusinessShortCode": "600996",
  "BillRefNumber": "INV001",
  "MSISDN": "254712345678"
}
```

---

## 4. Your Server Receives the Callback

Your backend must have an endpoint to receive the request.

Example (Node.js + Express):

```javascript
app.post("/mpesa/callback", (req, res) => {
    console.log("MPESA Callback:", req.body);

    // Save transaction to database
    // Update user wallet
    // Confirm order

    res.status(200).json({ message: "Callback received successfully" });
});
```

---

## 5. Your System Processes the Payment

After receiving the callback, your system can:

- Save the transaction
- Activate a wallet
- Confirm a purchase
- Update a database
- Send a receipt

This is where **your business logic happens**.

---

## 6. Important: Registering the Callback URL

Safaricom must know **where to send the payment data**.

You register your callback URL using the **Register URL API**.

Example:

```
POST /mpesa/c2b/v1/registerurl
```

You provide:

- Confirmation URL
- Validation URL
- Shortcode

Example:

```json
{
  "ShortCode": "600996",
  "ResponseType": "Completed",
  "ConfirmationURL": "https://yourdomain.com/mpesa/confirmation",
  "ValidationURL": "https://yourdomain.com/mpesa/validation"
}
```

---

## 7. Summary (Full Flow)

1. User pays using MPESA
2. Safaricom processes payment
3. Safaricom calls your **callback URL**
4. Your server receives transaction data
5. Your system processes the payment

Flow diagram:

```
User Phone
    │
    ▼
MPESA (Safaricom)
    │
    ▼
Your Registered Callback URL
    │
    ▼
Your Backend Server
    │
    ▼
Database / Business Logic
```

---

## 8. Development Tip

During development, your local server is not public.

You can use **ngrok** to expose it:

```
ngrok http 3000
```

Example public URL:

```
https://abc123.ngrok.io/mpesa/callback
```

Safaricom can now reach your local server.

---

## 9. Production Setup

In production, you should use:

- A real domain
- HTTPS
- A hosted server (VPS / cloud)

Example production URL:

```
https://api.yourdomain.com/mpesa/callback
```

---

## Key Idea

MPESA **does not wait for you to ask for the payment details**.

Instead:

> Safaricom **pushes the payment information to your server automatically** using the callback URL you registered.

```
Safaricom → Your Server → Your Database
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the integration.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `package.json` for details.

---

### 💡 Pro Tip
When testing in **Sandbox**, always remember:
- Use Test Shortcode: `174379` for STK Push.
- Use Test Shortcode: `600996` for C2B Register URL.
- Test Phone Number: `254708374149` (or any valid Safaricom number subscribed to sandbox).

---
*Developed with ❤️ by Masanga Kevin*
