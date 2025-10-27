import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function BookingSuccess() {
  const params = new URLSearchParams(useLocation().search);
  const bookingId = params.get("bookingId");
  return (
    <main className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-semibold mb-4">Payment Successful</h1>
      <p className="mb-2">Thank you! Your booking has been paid.</p>
      {bookingId && <p className="text-slate-600 mb-6">Booking ID: {bookingId}</p>}
      <Link to="/" className="bg-green-700 text-white rounded-lg uppercase hover:opacity-95 p-3 inline-block">Go to Home</Link>
    </main>
  );
}
