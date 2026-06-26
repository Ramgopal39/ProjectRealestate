import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineOfficeBuilding, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineSparkles, HiArrowRight } from "react-icons/hi";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white py-24 px-6 sm:px-12 lg:px-24">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <HiOutlineSparkles className="w-3.5 h-3.5" /> Redefining Real Estate
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
              We Connect <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Dreams</span> With Addresses
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">
              At Ram Estate, we believe finding a home is more than a transaction—it's the beginning of a new chapter. We combine cutting-edge technology with unmatched personal expertise to deliver a seamless real estate experience.
            </p>
            <div className="flex gap-4">
              <Link to="/search" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                Explore Properties <HiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 blur-lg"></div>
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" 
              alt="Premium Living" 
              className="relative rounded-2xl shadow-2xl object-cover w-full h-[400px] border border-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto -mt-12 px-6 relative z-25">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-blue-600">$4B+</h3>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Transaction Volume</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-blue-600">12k+</h3>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Happy Families</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-blue-600">500+</h3>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Premium Listings</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-blue-600">99.8%</h3>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Satisfaction Rate</p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-6xl mx-auto py-24 px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Our Core Principles</h2>
          <p className="text-slate-600 text-lg">
            Our reputation is built on trust, transparency, and a commitment to delivering stellar service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <HiOutlineShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-950">Absolute Integrity</h3>
            <p className="text-slate-600 leading-relaxed">
              We hold ourselves to the highest ethical standards. Honest guidance and transparent negotiations are the foundations of everything we do.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <HiOutlineOfficeBuilding className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-950">Unmatched Expertise</h3>
            <p className="text-slate-600 leading-relaxed">
              Our seasoned agents possess deep, localized market knowledge, helping you confidently make the best financial decisions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <HiOutlineUserGroup className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-950">Client-First Approach</h3>
            <p className="text-slate-600 leading-relaxed">
              We tailor our services to align with your personal lifestyle and long-term goals. Your happiness and success are our priorities.
            </p>
          </div>
        </div>
      </div>

      {/* Beautiful Story Section */}
      <div className="bg-white border-y border-slate-200 py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob delay-2000"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=80" 
                alt="Modern Living Room" 
                className="rounded-2xl shadow-md w-full h-48 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80" 
                alt="House exterior" 
                className="rounded-2xl shadow-md w-full h-48 object-cover mt-8"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">How We Started</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Founded in 2018, Ram Estate began with a simple observation: the real estate market was fragmented, and client experience was often neglected.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We set out to create a unified brokerage model where technology amplifies human skill. We built specialized systems to streamline property search, match listings with buyer preferences automatically, and provide direct connection channels to top real estate experts.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Today, Ram Estate stands as a premier destination for buyers, sellers, and renters alike, helping thousands secure their dream properties with absolute confidence.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto py-24 px-6 sm:px-12">
        <div className="relative rounded-3xl bg-slate-950 text-white overflow-hidden p-8 sm:p-16 text-center space-y-6">
          <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-slate-950"></div>
          
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to Find Your New Address?</h2>
            <p className="text-slate-300 text-lg">
              Browse through our beautiful handpicked selection of properties for rent and sale.
            </p>
            <div className="pt-4">
              <Link to="/search" className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                Start Searching <HiArrowRight className="w-5 h-5 text-slate-900" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}