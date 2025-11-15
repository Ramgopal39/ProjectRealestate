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
    
    // Validate required fields
    const requiredFields = { listingId, customerName, phone, address, idProofUrl, amount };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: "The property you're trying to book was not found" 
      });
    }

    // Validate amount is a number
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid booking amount" 
      });
    }

    // Create the booking
    const booking = await Booking.create({
      listingRef: listingId,
      userRef: req.user.id,
      customerName: customerName.trim(),
      phone: phone.toString().trim(),
      address: address.trim(),
      idProofUrl: idProofUrl,
      amount: Number(amount),
      currency: (currency || 'USD').toUpperCase(),
      status: 'draft',
    });

    // Populate the listingRef for the response
    const populatedBooking = await Booking.findById(booking._id).populate('listingRef');

    return res.status(201).json({
      success: true,
      booking: populatedBooking,
      message: 'Booking created successfully'
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A booking already exists for this property',
        error: err.message
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    // Pass other errors to the error handler
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
    
    // First find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    
    // Verify ownership
    if (String(booking.userRef) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Get listing details separately to ensure we have the data
    let listing;
    try {
      listing = await Listing.findById(booking.listingRef).lean();
      console.log('Fetched listing:', listing); // Debug log
      
      if (!listing) {
        console.error('Listing not found for booking:', booking._id);
        return res.status(404).json({ 
          success: false, 
          message: "Associated listing not found" 
        });
      }
    } catch (err) {
      console.error('Error fetching listing:', err);
      return res.status(500).json({ 
        success: false, 
        message: "Error retrieving property details" 
      });
    }

    // Validate required fields
    if (!booking.amount || isNaN(booking.amount)) {
      console.error('Invalid amount in booking:', booking.amount);
      return res.status(400).json({ 
        success: false, 
        message: "Invalid booking amount" 
      });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET;
    if (!secretKey) {
      console.error('Stripe secret key not configured');
      return res.status(501).json({ 
        success: false, 
        message: "Payment processing is not configured" 
      });
    }

    // Initialize Stripe
    let stripe;
    try {
      const stripeModule = await import('stripe');
      stripe = new stripeModule.default(secretKey);
    } catch (e) {
      console.error('Stripe initialization error:', e);
      return res.status(500).json({ 
        success: false, 
        message: "Payment processing is currently unavailable" 
      });
    }

    // Calculate amount and prepare product name
    const amountCents = Math.round(Number(booking.amount) * 100);
    const productName = (listing && listing.name) 
      ? listing.name 
      : `Property Booking #${booking._id.toString().slice(-6)}`;
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
