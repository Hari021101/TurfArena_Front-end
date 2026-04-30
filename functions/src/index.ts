import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import Razorpay from "razorpay";

admin.initializeApp();

const db = admin.firestore();

/**
 * Creates a Razorpay Order for a booking.
 */
export const createPaymentOrder = functions.https.onCall(
  async (data, context) => {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be logged in.",
      );
    }

    const { bookingId, amount } = data;

    if (!bookingId || !amount) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing bookingId or amount.",
      );
    }

    try {
      // 1. Get Razorpay keys from environment
      const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
      const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

      if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Razorpay keys not configured on server.",
        );
      }

      const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });

      // 2. Create Razorpay Order
      // Amount is in paise (₹1 = 100 paise)
      const options = {
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: bookingId,
      };

      const order = await razorpay.orders.create(options);

      // 3. Update Firestore booking with order ID
      await db.collection("bookings").doc(bookingId).update({
        razorpay_order_id: order.id,
        status: "pending_payment",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    } catch (error: any) {
      console.error("Error creating payment order:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to create payment order.",
      );
    }
  },
);

/**
 * Verifies a Razorpay Payment signature.
 */
export const verifyPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in.",
    );
  }

  const {
    bookingId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = data;

  try {
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    // Verify signature logic
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      // Payment Verified
      await db.collection("bookings").doc(bookingId).update({
        status: "confirmed",
        payment_status: "completed",
        razorpay_payment_id,
        razorpay_signature,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { status: "success" };
    } else {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid payment signature.",
      );
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Failed to verify payment.",
    );
  }
});
