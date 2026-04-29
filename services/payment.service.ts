import { getFunctions, httpsCallable } from "firebase/functions";
import RazorpayCheckout from "react-native-razorpay";
import { app } from "../firebase.config";

const functions = getFunctions(app);

const RAZORPAY_KEY_ID = "rzp_test_your_key_id"; // USER: Replace with your actual Test Key ID

export const initializePayment = async (
  bookingId: string,
  amount: number,
  user: { name: string; email: string; phone: string },
) => {
  try {
    // 1. Call Cloud Function to create Order
    const createOrder = httpsCallable(functions, "createPaymentOrder");
    const result = await createOrder({ bookingId, amount });
    const { orderId } = result.data as { orderId: string };

    // 2. Configure Razorpay Options
    const options = {
      description: "Turf Arena Booking",
      image: "https://your-logo-url.com/logo.png",
      currency: "INR",
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100),
      name: "Turf Arena",
      order_id: orderId,
      prefill: {
        email: user.email || "test@example.com",
        contact: user.phone || "9999999999",
        name: user.name || "Customer",
      },
      theme: { color: "#10B981" }, // Sports green
    };

    // 3. Open Razorpay Checkout
    const data = await RazorpayCheckout.open(options);

    // 4. Verify Payment on Backend
    const verifyPayment = httpsCallable(functions, "verifyPayment");
    const verificationResult = await verifyPayment({
      bookingId,
      razorpay_order_id: orderId,
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_signature: data.razorpay_signature,
    });

    return verificationResult.data;
  } catch (error: any) {
    console.error("Payment failed", error);
    throw error;
  }
};
