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
- [NPM](https://www.npmjs.com/) or [PNPM](https://pnpm.io/)
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
   npm install
   # OR
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (see [Configuration](#-configuration) below).

4. **Run the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
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
