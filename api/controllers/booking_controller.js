import Booking from "../models/booking_model.js";
import Listing from "../models/listing_model.js";

export const uploadIdProof = (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const url = `/uploads/${req.file.filename}`;
  return res.status(200).json({ url });
};

export const createBooking = async (req, res, next) => {
  try {
    const { listingId, customerName, phone, address, idProofUrl, amount, currency } = req.body;
    if (!listingId || !customerName || !phone || !address || !idProofUrl || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

    const booking = await Booking.create({
      listingRef: listingId,
      userRef: req.user.id,
      customerName,
      phone,
      address,
      idProofUrl,
      amount,
      currency: currency || "USD",
      status: "draft",
    });
    return res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("listingRef");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (String(booking.userRef) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    return res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ success: false, message: "bookingId required" });
    const booking = await Booking.findById(bookingId).populate("listingRef");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (String(booking.userRef) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET;
    if (!secretKey) {
      return res.status(501).json({ success: false, message: "Stripe not configured" });
    }

    let stripe;
    try {
      const stripeModule = await import('stripe');
      stripe = new stripeModule.default(secretKey);
    } catch (e) {
      return res.status(500).json({ success: false, message: "Stripe SDK not installed" });
    }

    const amountCents = Math.round(Number(booking.amount) * 100);
    const productName = booking.listingRef?.name || 'Property Booking';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: booking.currency || 'USD',
            product_data: { name: productName },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/booking/success?bookingId=${booking._id}`,
      cancel_url: `${frontendUrl}/booking/cancel?bookingId=${booking._id}`,
      metadata: { bookingId: String(booking._id) },
    });

    // Move status to payment_pending
    booking.status = 'payment_pending';
    await booking.save();

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
