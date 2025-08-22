// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const cors = require("cors")({origin: true});

// Read the email template from the templates directory
let templatePath = path.join(__dirname, "templates", "emailTemplate.html");
let templateSource = fs.readFileSync(templatePath, "utf-8");
const chickenTemplate = handlebars.compile(templateSource);

templatePath = path.join(__dirname, "templates", "muttonEmailTemplate.html");
templateSource = fs.readFileSync(templatePath, "utf-8");
const muttonTemplate = handlebars.compile(templateSource);

// Firebase function
exports.sendNewOrderEmail = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      console.log(
          "Request start at ",
          new Date().toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}),
      );
      console.log("Request body");
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
      } = req.body;

      // Validate required fields
      if (
        !userName ||
        !userPhoneNumber ||
        !userAddress ||
        !meatRequirements ||
        !totalBill ||
        !scheduledDeliveryDate ||
        !orderType ||
        !orderedDate
      ) {
        console.log("Missing required fields.");
        return res.status(400).send("Missing required fields.");
      }

      const formattedOrderedDate = new Date(orderedDate).toLocaleString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          },
      );

      const tempateInputs = {
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

      console.log("formattedOrderedDate,tempateInputs");
      console.log(formattedOrderedDate, tempateInputs);

      let emailHtml = "";

      // Render the HTML template with dynamic data
      if (orderType == "chicken") {
        emailHtml = chickenTemplate(tempateInputs);
      } else {
        emailHtml = muttonTemplate(tempateInputs);
      }

      console.log("Template selected");

      // Configure nodemailer with Gmail service
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "firebase.cyg@gmail.com",
          pass: "xiks jshd qgvr ilvk",
        },
      });

      console.log("Transported created");

      // Email options
      const mailOptions = {
        from: "firebase.cyg@gmail.com", // Sender email
        to: [
          "matamvamshikrishna@gmail.com",
          "manoj.prince16@gmail.com",
          // "suryatejasriram@gmail.com",
          // "ganeshrathod412@gmail.com",
          "suryasai42@gmail.com",
        ],
        subject: `True Meat ${orderType} Order`,
        html: emailHtml,
      };

      console.log("mailOptions created");

      // Send the email
      await transporter.sendMail(mailOptions);

      console.log("Mail sent");

      // Success response
      res.status(200).send("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Failed to send email.");
    }
  });
});
