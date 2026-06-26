import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import SwiperCore from 'swiper';

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    SwiperCore.use([Navigation]);
    console.log(offerListings);
    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const response = await fetch('/api/listings/get?offer=true&limit=4');
                const data = await response.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchRentListings = async () => {
            try {
                const response = await fetch('/api/listings/get?rent=true&limit=4');
                const data = await response.json();
                setRentListings(data);
                fetchSaleListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchSaleListings = async () => {
            try {
                const response = await fetch('/api/listings/get?sale=true&limit=4');
                const data = await response.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOfferListings();
    }, []);
    return (
        <div className="bg-slate-50">
            {/* top */}
            <div className="relative flex flex-col gap-6 py-24 px-4 max-w-6xl mx-auto text-left z-10">
                <div className="absolute top-10 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>
                <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob delay-2000"></div>

                <span className="inline-flex self-start items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                    ✨ Discover Premium Living Places
                </span>

                <h1 className="text-slate-800 font-extrabold text-4xl lg:text-7xl leading-tight tracking-tight">
                    Find your next home <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">perfectly & effortlessly</span>
                </h1>

                <p className="text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
                    Ram Estate is the premium destination to find your next perfect home. 
                    Explore our extensive list of curated luxury properties for sale and rent.
                </p>

                <div className="flex flex-wrap gap-3 items-center pt-2">
                    <Link to={"/search"} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all hover:scale-[1.02] text-sm">
                        Get Started
                    </Link>
                    <Link to={"/search?offer=true"} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3.5 px-6 rounded-xl transition-all text-sm">
                        View Offers
                    </Link>
                </div>

                <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500 pt-4">
                    <span className="font-semibold text-slate-700">Popular:</span>
                    <Link to="/search?type=rent" className="bg-slate-200/60 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-all">Rentals</Link>
                    <Link to="/search?type=sale" className="bg-slate-200/60 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-all">Sales</Link>
                    <Link to="/search?offer=true" className="bg-slate-200/60 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-all">Special Offers</Link>
                </div>
            </div>

            {/* swiper */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50">
                    <Swiper navigation>
                    {
                        offerListings && offerListings.length > 0 &&
                        offerListings.map((listing) => (
                            <SwiperSlide key={listing._id}>
                                <Link to={`/listing/${listing._id}`}>
                                    <div 
                                        style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} 
                                        className="h-[500px] sm:h-[550px] relative group cursor-pointer"
                                    >
                                        {/* Bottom Dark Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent"></div>
                                        
                                        {/* Info Card inside Swiper Slide */}
                                        <div className="absolute bottom-8 left-8 right-8 text-white space-y-3 max-w-xl">
                                            <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                            </span>
                                            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md group-hover:underline">
                                                {listing.name}
                                            </h2>
                                            <p className="text-slate-200 text-sm sm:text-base drop-shadow line-clamp-2">
                                                {listing.description}
                                            </p>
                                            <p className="text-2xl font-bold text-blue-400 drop-shadow">
                                                ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                                                {listing.type === 'rent' && <span className="text-sm font-normal text-slate-300">/month</span>}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))
                    }
                    </Swiper>
                </div>
            </div>
            {/* listing results for offer, sale and rent */}
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
                {
                    offerListings && offerListings.length > 0 && (
                        <div>
                            <div className="my-3 ">
                                <h2 className="text-slate-700 font-semibold text-2xl">Recent offers</h2>
                                <Link to={"/search?offer=true"} className="text-sm text-blue-800 hover:underline">See all offers</Link>
                            </div> 
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
                                {
                                    offerListings.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id}/>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                {
                    rentListings && rentListings.length > 0 && (
                        <div>
                            <div className="my-3 ">
                                <h2 className="text-slate-700 font-semibold text-2xl">Recent places for rent</h2>
                                <Link to={"/search?type=rent"} className="text-sm text-blue-800 hover:underline">See all places</Link>
                            </div> 
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
                                {
                                    rentListings.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id}/>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                {
                    saleListings && saleListings.length > 0 && (
                        <div>
                            <div className="my-3 ">
                                <h2 className="text-slate-700 font-semibold text-2xl">Recent places for sale</h2>
                                <Link to={"/search?type=sale"} className="text-sm text-blue-800 hover:underline">See all places</Link>
                            </div> 
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
                                {
                                    saleListings.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id}/>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
