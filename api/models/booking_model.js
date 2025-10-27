import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    listingRef: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true, match: [/^\d{10}$/, "Phone must be exactly 10 digits"] },
    address: { type: String, required: true },
    idProofUrl: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["draft", "payment_pending", "paid", "canceled"], default: "draft" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
