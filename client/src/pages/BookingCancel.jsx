import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function BookingCancel() {
  const params = new URLSearchParams(useLocation().search);
  const bookingId = params.get("bookingId");
  return (
    <main className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-semibold mb-4">Payment Canceled</h1>
      <p className="mb-2">Your payment was canceled. You can try again anytime.</p>
      {bookingId && <p className="text-slate-600 mb-6">Booking ID: {bookingId}</p>}
      <div className="flex gap-3 justify-center">
        <Link to="/" className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3">Go to Home</Link>
      </div>
    </main>
  );
}
