import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/Create_listing";
import Listing from "./pages/Listing";
import UpdateListing from "./pages/UpdateListing";
import Search from "./pages/Search";
import ListingItem from "./components/ListingItem";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancel from "./pages/BookingCancel";
export default function App() {
    return <BrowserRouter>
    <Header/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/listing/:listingId" element={<Listing/>}/>
            <Route path="/booking/:listingId" element={<Booking/>}/>
            <Route path="/booking/success" element={<BookingSuccess/>}/>
            <Route path="/booking/cancel" element={<BookingCancel/>}/>
            <Route element={<PrivateRoute/>}>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/create-listing" element={<CreateListing/>}/>
              <Route path="/update-listing/:listingId" element={<UpdateListing/>}/>
            </Route>
        </Routes>
    </BrowserRouter>;
}