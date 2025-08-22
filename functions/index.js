// functions/index.js
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Keep secrets inline as requested (note: for prod, use secrets)
const GMAIL_USER = "firebase.cyg@gmail.com";
const GMAIL_PASS = "xiks jshd qgvr ilvk";

// Global runtime config (keeps 1 warm instance)
setGlobalOptions({
  region: "us-central1", // pick your region; us-central1 if you prefer
  timeoutSeconds: 120,
  memory: "256MiB",
  minInstances: 1, // <-- keeps it warm (Blaze plan)
});

// Preload templates once per instance
const chickenTemplate = handlebars.compile(
    fs.readFileSync(
        path.join(__dirname, "templates", "emailTemplate.html"),
        "utf-8",
    ),
);
const muttonTemplate = handlebars.compile(
    fs.readFileSync(
        path.join(__dirname, "templates", "muttonEmailTemplate.html"),
        "utf-8",
    ),
);

console.log("Templates set");

// Reuse transporter (pooling helps on warm instances)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {user: GMAIL_USER, pass: GMAIL_PASS},
  pool: true,
  maxConnections: 2,
  maxMessages: 50,
  rateDelta: 1000,
  rateLimit: 5,
});

console.log("transporter set");

exports.sendNewOrderEmail = onRequest(async (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    console.log(
        "Request started at",
        new Date().toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}),
    );
    console.log("req.body");
    console.log(req.body);

    const {
      userName,
      userPhoneNumber,
      userAddress,
      landmark,
      meatRequirements,
      totalBill,
      scheduledDeliveryDate,
      orderType,
      orderedDate,
    } = req.body || {};

    const missing = [];
    if (!userName) missing.push("userName");
    if (!userPhoneNumber) missing.push("userPhoneNumber");
    if (!userAddress) missing.push("userAddress");
    if (!meatRequirements) missing.push("meatRequirements");
    if (!totalBill) missing.push("totalBill");
    if (!scheduledDeliveryDate) missing.push("scheduledDeliveryDate");
    if (!orderType) missing.push("orderType");
    if (!orderedDate) missing.push("orderedDate");
    if (missing.length) {
      console.log("Missing fields", missing);
      return res.status(400).json({error: "Missing fields", missing});
    }

    const formattedOrderedDate = new Date(orderedDate).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    const templateInputs = {
      userName,
      userPhoneNumber,
      userAddress,
      landmark,
      meatRequirements,
      totalBill,
      scheduledDeliveryDate,
      orderType,
      formattedOrderedDate,
    };

    console.log("formattedOrderedDate,templateInputs");
    console.log(formattedOrderedDate, templateInputs);

    const emailHtml =
      orderType === "chicken" ?
        chickenTemplate(templateInputs) :
        muttonTemplate(templateInputs);

    const mailOptions = {
      from: GMAIL_USER,
      to: [
        "matamvamshikrishna@gmail.com",
        "manoj.prince16@gmail.com",
        "suryasai42@gmail.com",
      ],
      subject: `True Meat ${orderType} Order`,
      html: emailHtml,
    };

    // tiny retry for transient hiccups
    let sent;
    let lastErr;
    for (let i = 1; i <= 2; i++) {
      try {
        sent = await transporter.sendMail(mailOptions);
        break;
      } catch (e) {
        lastErr = e;
        console.log("Retrying");
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    if (!sent) throw lastErr || new Error("sendMail failed");

    console.log("Email sent");
    return res.status(200).send("Email sent successfully!");
  } catch (err) {
    console.error("sendNewOrderEmail error:", err);
    return res.status(500).send("Failed to send email.");
  }
});
