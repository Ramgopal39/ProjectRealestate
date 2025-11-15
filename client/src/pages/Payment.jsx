import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((s) => s.user);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  // Get bookingId from URL or location state
  const bookingId = new URLSearchParams(location.search).get('bookingId');

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin', { state: { from: `/payment?bookingId=${bookingId}` } });
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/bookings/${bookingId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch booking details');
        }
        
        setBooking(data);
      } catch (err) {
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      setError('No booking ID provided');
      setLoading(false);
    }
  }, [bookingId, currentUser, navigate]);

  const handlePayment = async (method) => {
    try {
      setProcessing(true);
      
      if (method === 'cash') {
        // Handle cash payment
        const res = await fetch(`/api/bookings/${bookingId}/update-status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: 'pending_payment' }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to update booking status');
        }
        
        navigate(`/booking/success?bookingId=${bookingId}`);
        return;
      }

      // For online payments, create a checkout session
      const res = await fetch('/api/bookings/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();
      
      if (!res.ok || !data?.url) {
        throw new Error(data.message || 'Failed to initialize payment');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md w-full mx-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => window.history.back()} 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Complete Your Payment</h1>
            <p className="text-gray-600 mt-2">Booking ID: {booking?._id}</p>
            <p className="text-2xl font-bold text-blue-600 mt-4">
              ₹{booking?.amount?.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">Select Payment Method</h2>
            
            {/* UPI Payment Option */}
            <button
              onClick={() => handlePayment('upi')}
              disabled={processing}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <span className="ml-4 text-gray-700">UPI (PhonePe, Google Pay, etc.)</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            {/* Card Payment Option */}
            <button
              onClick={() => handlePayment('card')}
              disabled={processing}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <span className="ml-4 text-gray-700">Credit/Debit Card</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            {/* Net Banking Option */}
            <button
              onClick={() => handlePayment('netbanking')}
              disabled={processing}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3.9 1.5m0 0l3.1 8.5m-8.3-8.5h3.9m-3.9 0h-3.9m12.1 0h3.9m-3.9 0l-1.1 3m-6.9-3h6.9m-1.1 3l1.1 3m0 0l1.1-3m-8.3 0l-1.1-3m0 0l1.1-3m6.2 0l1.1-3m-8.3 0l-1.1 3"></path>
                  </svg>
                </div>
                <span className="ml-4 text-gray-700">Net Banking</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            {/* Cash on Delivery Option */}
            <button
              onClick={() => handlePayment('cash')}
              disabled={processing}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <span className="ml-4 text-gray-700">Cash on Delivery</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {processing && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-blue-700 bg-blue-100 rounded-md">
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Processing your request...
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
