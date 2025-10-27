import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Booking() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((s) => s.user);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    idProofUrl: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/get/${listingId}`);
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          setError(data.message || "Failed to load listing");
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError("");
        setForm((prev) => ({
          ...prev,
          customerName: currentUser?.username || prev.customerName,
          address: data.address || prev.address,
        }));
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId, currentUser]);

  const amount = useMemo(() => {
    if (!listing) return 0;
    return listing.offer ? Number(listing.discountPrice) : Number(listing.regularPrice);
  }, [listing]);

  const onChange = (e) => {
    const { id, value } = e.target;
    if (id === 'phone') {
      const digits = value.replace(/\D+/g, '').slice(0, 10);
      setForm({ ...form, phone: digits });
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("idProof", file);
      const res = await fetch(`/api/bookings/upload-id`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || data?.success === false || !data.url) {
        setError(data.message || "Failed to upload ID proof");
      } else {
        setForm((prev) => ({ ...prev, idProofUrl: data.url }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const [bookingId, setBookingId] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone must be exactly 10 digits");
      return;
    }
    if (!form.idProofUrl) {
      setError("Please upload ID proof image");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          listingId,
          customerName: form.customerName,
          phone: form.phone,
          address: form.address,
          idProofUrl: form.idProofUrl,
          amount,
          currency: "USD",
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setError(data.message || `Failed to create booking (${res.status})`);
        setSubmitting(false);
        return;
      }
      const createdId = data._id || data.id || data.booking?._id || data.booking?.id;
      if (!createdId) {
        setError("Booking created but id missing in response");
        setSubmitting(false);
        return;
      }
      setBookingId(createdId);
      setSubmitting(false);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const onContinueAndPay = async () => {
    if (!bookingId) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/bookings/checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        setError(data.message || "Failed to initialize payment");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Booking</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-700 mb-3">{error}</p>}
      {listing && (
        <div className="border rounded-lg p-4 mb-4">
          <p className="text-lg font-semibold">{listing.name}</p>
          <p className="text-slate-600 text-sm">{listing.address}</p>
          <p className="mt-2">Amount: <span className="font-semibold">${amount.toLocaleString("en-US")}</span> USD</p>
        </div>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input id="customerName" type="text" className="border p-3 rounded-lg" placeholder="Full Name" value={form.customerName} onChange={onChange} required />
        <input id="phone" type="tel" inputMode="numeric" className="border p-3 rounded-lg" placeholder="10-digit Phone" value={form.phone} onChange={onChange} required pattern="\\d{10}" maxLength={10} />
        <input id="address" type="text" className="border p-3 rounded-lg" placeholder="Your Address" value={form.address} onChange={onChange} required />

        <div className="flex items-center gap-3">
          <input id="idProof" type="file" accept="image/*" onChange={onFileChange} />
          {uploading && <span className="text-sm">Uploading...</span>}
          {form.idProofUrl && <a href={form.idProofUrl} target="_blank" rel="noreferrer" className="text-green-700 underline text-sm">View uploaded ID</a>}
        </div>

        <div className="flex gap-3 mt-2">
          <button disabled={submitting || uploading} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 disabled:opacity-60">Save Booking</button>
          <button type="button" disabled={!bookingId || submitting} onClick={onContinueAndPay} className="bg-green-700 text-white rounded-lg uppercase hover:opacity-95 p-3 disabled:opacity-60">Continue and Pay</button>
        </div>
      </form>
    </main>
  );
}
