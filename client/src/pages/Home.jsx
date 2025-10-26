import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <div>
            {/* top */}
            <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
                <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your next home 
                    <span className="text-slate-500">perfectly</span>
                <br />with our real estate platform</h1>

                <div className="text-gray-400 text-xs sm:text-sm ">
                    Ram Estate is the best place to find your next home perfect place to visit.
                    <br />
                    we have a wide range of properties for sale and rent.
                </div>
                <Link to={"/search"} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">Search now</Link>
            </div>
            {/* swiper */}
            <Swiper navigation>
            {
                offerListings && offerListings.length > 0 &&
                offerListings.map((listing) => (
                    <SwiperSlide >
                        <div style={{background: `url(${listing.imageUrls[0]}) center  no-repeat`, 
                        backgroundSize: 'cover'}} className="h-[550px]" key={listing._id}>
                        </div>
                    </SwiperSlide>
                ))
            }
            </Swiper>
            {/* listing results for offer, sale and rent */}
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
                {
                    offerListings && offerListings.length > 0 && (
                        <div>
                            <div className="my-3 ">
                                <h2 className="text-slate-700 font-semibold text-2xl">Recent offers</h2>
                                <Link to={"/search?offer=true"} className="text-sm text-blue-800 hover:underline">See all offers</Link>
                            </div> 
                            <div className="flexx flex-wrap gap-4"> 
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
                            <div className="flexx flex-wrap gap-4"> 
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
                            <div className="flexx flex-wrap gap-4"> 
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
