import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export default function ListingItem({ listing }) {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg
        w-full sm:w-[330px]'>
            <Link to={`/listing/${listing.id}`}><img src={listing.imageUrls[0] || "https://imgs.search.brave.com/yc_K_4Iu8Hb2a3-bYU-6xLFPytxHCu9pqa84qLnTUfA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQw/OTI5ODk1My9waG90/by9yZWFsLWVzdGF0/ZS1hZ2VudHMtc2hh/a2UtaGFuZHMtYWZ0/ZXItdGhlLXNpZ25p/bmctb2YtdGhlLWNv/bnRyYWN0LWFncmVl/bWVudC1pcy1jb21w/bGV0ZS5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9U0Z5YmJw/R01CMHdJb0kwdEpv/dEZxcHR6QVlLX21J/Q1ZJVE5kUUlYcW55/Yz0"} 
            alt="listing cover" className='h-[320px] w-full object-cover sm:h-[200px] hover:scale-105 transition-scale duration-300' />
            <div className='p-3 flex flex-col gap-2 w-full'>
                <p className='text-lg font-semibold text-slate-700'>{listing.name}</p>
                <div className='flex items-center gap-1'>
                    <MdLocationOn className='text-green-700 h-4 w-4'/>
                    <p className='text-grey-600 text-sm truncate w-full'>{listing.address}</p>
                </div>
                <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
                <p className='text-slate-500 mt-2 font-semibold'> 
                    ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && '/month'}
                </p>
                <div className='text-slate-700 flex gap-4'>
                    <div className='font-bold text-xs'>
                        <FaBed className='text-lg'/>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bed` : `${listing.bedrooms} bed`}
                    </div>
                    <div className='font-bold text-xs'>
                        <FaBath className='text-lg'/>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bath` : `${listing.bathrooms} bath`}
                    </div>
                </div>
            </div>
            </Link>
        </div>
    );
} 