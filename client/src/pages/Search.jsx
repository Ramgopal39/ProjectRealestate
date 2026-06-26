import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { HiOutlineSearch, HiOutlineAdjustments, HiOutlineSelector } from "react-icons/hi";

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "createdAt",
        order: "desc"
    });
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc'
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listings/get?${searchQuery}`);
            const data = await res.json().catch(() => []);
            if(data.length > 8){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };
        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if(e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale"){
            setSidebarData({...sidebarData, type: e.target.id})
        }
        if(e.target.id === "searchTerm"){
            setSidebarData({...sidebarData, searchTerm: e.target.value})
        }
        if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setSidebarData({...sidebarData, [e.target.id]: e.target.checked})
        }
        if (e.target.id === "sort_order") {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({...sidebarData, sort, order});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listings/get?${searchQuery}`);
        const data = await res.json().catch(() => []);
        if(data.length < 9) { 
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar - Filters */}
                <div className="w-full lg:w-96 shrink-0">
                    <div className="sticky top-6 bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                            <HiOutlineAdjustments className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-800">Filter Properties</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Search Term */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Search Term</label>
                                <div className="relative">
                                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        id="searchTerm" 
                                        placeholder="Search by name..." 
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-850" 
                                        value={sidebarData.searchTerm}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-600 block">Property Type</label>
                                <div className="grid grid-cols-1 gap-2.5">
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all">
                                        <input 
                                            type="checkbox" 
                                            id="all" 
                                            className="w-5 h-5 rounded-md border-slate-350 text-blue-650 focus:ring-blue-500"
                                            onChange={handleChange}
                                            checked={sidebarData.type === "all"}
                                        />
                                        <span className="text-sm font-medium text-slate-700">Rent & Sale</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all">
                                        <input 
                                            type="checkbox" 
                                            id="rent" 
                                            className="w-5 h-5 rounded-md border-slate-350 text-blue-650 focus:ring-blue-500"
                                            onChange={handleChange}
                                            checked={sidebarData.type === "rent"}
                                        />
                                        <span className="text-sm font-medium text-slate-700">For Rent</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all">
                                        <input 
                                            type="checkbox" 
                                            id="sale" 
                                            className="w-5 h-5 rounded-md border-slate-350 text-blue-650 focus:ring-blue-500"
                                            onChange={handleChange}
                                            checked={sidebarData.type === "sale"}
                                        />
                                        <span className="text-sm font-medium text-slate-700">For Sale</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all">
                                        <input 
                                            type="checkbox" 
                                            id="offer" 
                                            className="w-5 h-5 rounded-md border-slate-350 text-blue-650 focus:ring-blue-500"
                                            onChange={handleChange}
                                            checked={sidebarData.offer}
                                        />
                                        <span className="text-sm font-medium text-slate-700">Has Special Offer</span>
                                    </label>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-600 block">Amenities</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all">
                                        <input 
                                            type="checkbox" 
                                            id="parking" 
                                            className="w-4.5 h-4.5 rounded border-slate-350 text-blue-650 focus:ring-blue-500"
                                            onChange={handleChange}
                                            checked={sidebarData.parking}
                                        />
                                        <span className="text-xs font-semibold text-slate-700">Parking</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all">
                                        <input 
                                            type="checkbox" 
                                            id="furnished" 
                                            className="w-4.5 h-4.5 rounded border-slate-350 text-blue-650 focus:ring-blue-500"
                                            onChange={handleChange}
                                            checked={sidebarData.furnished}
                                        />
                                        <span className="text-xs font-semibold text-slate-700">Furnished</span>
                                    </label>
                                </div>
                            </div>

                            {/* Sorting */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Sort By</label>
                                <div className="relative">
                                    <select 
                                        id="sort_order" 
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                                        onChange={handleChange}
                                        defaultValue={'createdAt_desc'}
                                    >
                                        <option value='createdAt_desc'>Latest Listings</option>
                                        <option value='createdAt_asc'>Oldest Listings</option>
                                        <option value='regularPrice_desc'>Price: High to Low</option>
                                        <option value='regularPrice_asc'>Price: Low to High</option>
                                    </select>
                                    <HiOutlineSelector className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>

                            {/* Submit */}
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all">
                                Apply Filters
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side - Results */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Listing Results
                        </h1>
                        {!loading && (
                            <span className="bg-slate-200/80 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                {listings.length} {listings.length === 1 ? "listing" : "listings"} found
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {!loading && listings.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                                <p className="text-lg font-semibold text-slate-500">No properties match your filters.</p>
                                <p className="text-sm text-slate-400 mt-1">Try broadening your search criteria.</p>
                            </div>
                        )}
                        {loading && (
                            <div className="col-span-full py-16 text-center">
                                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-medium text-slate-500 mt-3">Loading properties...</p>
                            </div>
                        )}
                        {!loading && listings && listings.map((listing) => (
                            <div className="hover:scale-[1.01] transition-all" key={listing._id || listing.id}>
                                <ListingItem listing={listing} />
                            </div>
                        ))}
                    </div>

                    {showMore && (
                        <div className="text-center pt-8">
                            <button 
                                className="bg-white hover:bg-slate-50 text-blue-650 border border-slate-200 font-bold py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                                onClick={onShowMoreClick}
                            >
                                Show More Properties
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}