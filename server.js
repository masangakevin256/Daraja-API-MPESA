import express from "express";
import moment from "moment";
import request from "request";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and log requests
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// STK PUSH - Initiate Paybill payment

app.get("/stkpush", async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = "Bearer " + accessToken;
    const timestamp = moment().format("YYYYMMDDHHmmss");

    // Generate base64 encoded password
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString("base64");

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,   // Paybill/Till number
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",        // STK Push type
      Amount: 1,
      PartyA: "254793786072",                          // Sender's phone
      PartyB: process.env.MPESA_SHORTCODE,             // Recipient shortcode
      PhoneNumber: "254793786072",                     // Sender's phone
      CallBackURL: process.env.MPESA_CALLBACK_URL,    // Your callback URL
      AccountReference: "Daraja api test",            // Account reference
      TransactionDesc: "Testing Api"                  // Description
    };

    request(
      {
        url,
        method: "POST",
        headers: { Authorization: auth },
        json: payload
      },
      (error, response, body) => {
        if (error) {
          console.error("STK Push Request Error:", error);
          return res.status(500).json({ error: "STK Push failed", details: error.message });
        }
        console.log("STK Push response received. Status:", response.statusCode);
        console.log("Response Body:", body);
        res.status(response.statusCode).json(body);
      }
    );

  } catch (err) {
    console.error("Error getting access token:", err.message);
    res.status(500).json({ error: "Authentication failed", details: err.message });
  }
});


// REGISTER URL for C2B (Customer-to-Business)

app.get("/register_url", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const token = accessToken.trim();

    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    const auth = "Bearer " + token;

    const payload = {
      ShortCode: "600996", // MUST use 600996 for C2B Register URL in Sandbox
      ResponseType: "Completed",
      ConfirmationURL: process.env.NGROK_URL + "/confirmation",
      ValidationURL: process.env.NGROK_URL + "/validation"
    };

    console.log("Registering C2B URL...");
    console.log("Token:", token);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    request(
      {
        url,
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        json: payload
      },
      (error, response, body) => {
        if (error) {
          console.error("Register URL Error:", error);
          return res.status(500).json({ error: "Register URL failed", details: error.message });
        }
        console.log("Register URL Status:", response.statusCode);
        console.log("Response Body:", body);
        res.status(response.statusCode).json(body);
      }
    );

  } catch (err) {
    console.error("Error in /register_url:", err.message);
    res.status(500).json({ error: "Authentication failed", details: err.message });
  }
});


// C2B Confirmation callback

app.post("/confirmation", (req, res) => {
  console.log("MPESA CONFIRMATION RECEIVED:", req.body);
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
});


// C2B Validation callback

app.post("/validation", (req, res) => {
  console.log("MPESA VALIDATION RECEIVED:", req.body);
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
});


// STK Push Callback

app.post("/api/mpesa/callback", (req, res) => {
  console.log("MPESA CALLBACK RECEIVED:", req.body);
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
});
//B2C ROUTE OR AUTO-WITHDRAWAL
app.get("/b2c/url_request", async (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      const securityCredential = process.env.MPESA_SECURITY_CREDENTIALS;
      const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest";
      const auth = "Bearer " + accessToken;

      request({
        url,
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        json: {
          InitiatorName: "testapi",
          OriginatorConversationID: "f6978aaa-ee73-4831-8da4-5dd9287e4202",                          //conversion id
          SecurityCredential: securityCredential,
          CommandID: "BusinessPayment",
          Amount: 1,
          PartyA: process.env.MPESA_SHORTCODE,
          PartyB: "254793786072",
          PhoneNumber: "254793786072",
          Remarks: "Test B2C Payment",
          Occasion: "Test",
          QueueTimeOutURL: process.env.NGROK_URL + "/queue_timeout",
          ResultURL: process.env.NGROK_URL + "/result",
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: "Daraja api test",
          TransactionDesc: "Testing Api"
        }
      },
        (error, response, body) => {
          if (error) {
            console.error("B2C Request Error:", error);
            return res.status(500).json({ error: "B2C Request failed", details: error.message });
          }
          console.log("B2C Request Status:", response.statusCode);
          console.log("Response Body:", body);
          res.status(response.statusCode).json(body);
        }
      )
    })
})

// Start Server

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Function: Get fresh access token

async function getAccessToken() {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");

  return new Promise((resolve, reject) => {
    request(
      { url, headers: { Authorization: "Basic " + auth } },
      (error, response, body) => {
        if (error) return reject(error);
        try {
          const data = JSON.parse(body);
          if (data.access_token) resolve(data.access_token);
          else reject(new Error("Access token not found"));
        } catch (parseError) {
          reject(new Error("Invalid response from Safaricom API"));
        }
      }
    );
  });
}
