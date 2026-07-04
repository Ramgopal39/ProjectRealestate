import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';

export default function ListingItem({ listing }) {
    return (
        <div className='bg-white shadow-sm border border-slate-150/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden rounded-2xl flex flex-col h-full w-full'>
            <Link to={`/listing/${listing._id || listing.id}`} className="flex flex-col h-full">
                {/* Image Section with Overlay Badge */}
                <div className="relative overflow-hidden shrink-0 aspect-[4/3]">
                    <img 
                        src={listing.imageUrls[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80"} 
                        alt="property cover" 
                        className='h-full w-full object-cover hover:scale-105 transition-transform duration-500' 
                        loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm text-white ${listing.type === 'rent' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </span>
                        {listing.offer && (
                            <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                Offer
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className='p-4 flex flex-col gap-3 flex-1 justify-between'>
                    <div className="space-y-2">
                        {/* Title */}
                        <h3 className='text-base font-bold text-slate-850 line-clamp-1 group-hover:text-blue-600 transition-colors'>
                            {listing.name}
                        </h3>

                        {/* Address */}
                        <div className='flex items-center gap-1 text-slate-500'>
                            <MdLocationOn className='text-blue-500 h-4 w-4 shrink-0'/>
                            <span className='text-xs font-semibold truncate'>{listing.address}</span>
                        </div>

                        {/* Description */}
                        <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed'>
                            {listing.description}
                        </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        {/* Price */}
                        <p className='text-lg font-extrabold text-slate-900'> 
                            ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && <span className="text-xs font-normal text-slate-500">/mo</span>}
                        </p>

                        {/* Amenities */}
                        <div className='flex flex-wrap items-center gap-3 text-slate-550 text-xs font-bold'>
                            <span className='inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100'>
                                <FaBed className='text-blue-500 w-3.5 h-3.5'/>
                                {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
                            </span>
                            <span className='inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100'>
                                <FaBath className='text-blue-500 w-3.5 h-3.5'/>
                                {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
                            </span>
                            {listing.parking && (
                                <span className='inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100' title="Parking available">
                                    <FaParking className='text-blue-500 w-3 h-3'/> Yes
                                </span>
                            )}
                            {listing.furnished && (
                                <span className='inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100' title="Furnished">
                                    <FaChair className='text-blue-500 w-3 h-3'/> Yes
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}