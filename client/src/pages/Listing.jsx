import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import { FaBath, FaChair, FaMapMarkerAlt, FaShare, FaBed, FaParking, FaPhone, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation, Pagination]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-16">
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-slate-600">Loading property details...</p>
        </div>
      )}
      {error && (
        <div className="max-w-md mx-auto text-center py-24 px-6 bg-white rounded-3xl shadow-sm border border-slate-100 mt-12 space-y-4">
          <p className="text-2xl font-bold text-slate-800">Something went wrong!</p>
          <p className="text-slate-500">We couldn't retrieve the details for this property.</p>
          <Link to="/" className="inline-block bg-blue-650 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all">
            Back to Home
          </Link>
        </div>
      )}
      
      {listing && !loading && !error && (
        <div>
          {/* Swiper Gallery */}
          <div className="max-w-6xl mx-auto px-4 mt-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 bg-white">
              <Swiper navigation pagination={{ clickable: true }} modules={[Navigation, Pagination]}>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div 
                      className="h-[350px] sm:h-[500px] w-full" 
                      style={{ background: `url(${url}) center no-repeat`, backgroundSize: "cover" }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Share Floating Button */}
              <div 
                className="absolute top-4 right-4 z-10 w-11 h-11 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center cursor-pointer shadow-md border border-slate-200 transition-all hover:scale-105 backdrop-blur-sm"
                onClick={copyLink}
              >
                <FaShare className="w-4 h-4 text-slate-600" />
              </div>
              
              {copied && (
                <p className="absolute top-4 right-16 z-10 rounded-xl bg-slate-900/90 text-white text-xs font-semibold py-2.5 px-4 shadow-lg backdrop-blur-sm transition-all duration-200">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </div>

          {/* Details Content Layout */}
          <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Main Section - Details & Amenities */}
            <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
              
              {/* Title, Badges and Address */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${listing.type === 'rent' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                    For {listing.type === 'rent' ? 'Rent' : 'Sale'}
                  </span>
                  {listing.offer && (
                    <span className="bg-rose-50 text-rose-600 border border-rose-100 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Special Offer
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {listing.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-1">
                  <a
                    className="flex items-center gap-2 hover:text-blue-600 hover:underline font-medium transition-all"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaMapMarkerAlt className="text-blue-600 w-4 h-4"/>
                    <span>{listing.address}</span>
                  </a>
                  {listing.contactNumber && (
                    <span className="flex items-center gap-2 font-medium">
                      <FaPhone className="text-blue-600 w-4 h-4"/>
                      <a href={`tel:${listing.contactNumber}`} className="hover:underline">{listing.contactNumber}</a>
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">About this property</h2>
                <p className="text-slate-650 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              <hr className="border-slate-100" />

              {/* Key Features / Amenities */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">What this place offers</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Beds */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
                    <FaBed className="text-blue-600 w-6 h-6" />
                    <span className="text-xs font-semibold text-slate-500">Bedrooms</span>
                    <span className="text-sm font-bold text-slate-850">{listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}</span>
                  </div>
                  {/* Baths */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
                    <FaBath className="text-blue-600 w-6 h-6" />
                    <span className="text-xs font-semibold text-slate-500">Bathrooms</span>
                    <span className="text-sm font-bold text-slate-850">{listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}</span>
                  </div>
                  {/* Parking */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
                    <FaParking className="text-blue-600 w-6 h-6" />
                    <span className="text-xs font-semibold text-slate-500">Parking</span>
                    <span className="text-sm font-bold text-slate-850 inline-flex items-center gap-1">
                      {listing.parking ? <><FaCheckCircle className="text-emerald-500 w-3.5 h-3.5" /> Yes</> : <><FaTimesCircle className="text-rose-500 w-3.5 h-3.5" /> No</>}
                    </span>
                  </div>
                  {/* Furnished */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1">
                    <FaChair className="text-blue-600 w-6 h-6" />
                    <span className="text-xs font-semibold text-slate-500">Furnishing</span>
                    <span className="text-sm font-bold text-slate-850 inline-flex items-center gap-1">
                      {listing.furnished ? <><FaCheckCircle className="text-emerald-500 w-3.5 h-3.5" /> Yes</> : <><FaTimesCircle className="text-rose-500 w-3.5 h-3.5" /> No</>}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sticky Card - Booking & Landlord Actions */}
            <div className="w-full sticky top-6 space-y-4">
              <div className="bg-white border border-slate-100 shadow-lg rounded-3xl p-6 space-y-6">
                
                {/* Price Display */}
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Price</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    </span>
                    {listing.type === 'rent' && (
                      <span className="text-sm font-semibold text-slate-500">/ month</span>
                    )}
                  </div>
                  
                  {listing.offer && (
                    <div className="flex gap-2 items-center mt-2">
                      <span className="text-sm line-through text-slate-400">
                        ${listing.regularPrice.toLocaleString('en-US')}
                      </span>
                      <span className="bg-emerald-50 text-emerald-600 text-xs font-bold py-0.5 px-2 rounded-md">
                        Save ${(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')}
                      </span>
                    </div>
                  )}
                </div>

                <hr className="border-slate-100" />

                {/* Actions */}
                {currentUser && listing.userRef === currentUser._id ? (
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-700">You own this listing</p>
                    <Link 
                      to={`/update-listing/${listing._id}`} 
                      className="inline-block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-center text-sm transition-all"
                    >
                      Edit Listing
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Booking Route Link */}
                    {(!currentUser || listing.userRef !== currentUser._id) && (
                      <div className="grid grid-cols-1 gap-3">
                        <Link 
                          to={`/booking/${listing._id}`}
                          className="w-full bg-blue-650 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-blue-500/10 text-center transition-all hover:-translate-y-0.5"
                        >
                          Book Visit / Purchase
                        </Link>
                        
                        {!showContact && (
                          <button 
                            onClick={() => setShowContact(true)}
                            className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3.5 px-6 rounded-xl text-center transition-all"
                          >
                            Contact Landlord
                          </button>
                        )}
                      </div>
                    )}

                    {showContact && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                        <Contact listing={listing} />
                      </div>
                    )}
                  </div>
                )}
                
                {!currentUser && (
                  <p className="text-xs text-center text-slate-400 pt-2">
                    Please <Link to="/signin" className="text-blue-650 underline font-semibold">sign in</Link> to contact the landlord or book a visit.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
