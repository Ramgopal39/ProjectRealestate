import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure } from "../../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef();
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);

  // file / preview state
  const [file, setFile] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(
    currentUser?.photoURL || currentUser?.avatar || "/default-avatar.png"
  );
  const [filePerc, setFilePerc] = useState(0);
  const [success, setSuccess] = useState(false);

  // controlled form state initialized from currentUser
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // initialize formData when currentUser becomes available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
      });
      setImagePreview(currentUser.photoURL || currentUser.avatar || "/default-avatar.png");
    }
  }, [currentUser]);

  // create local preview when file selected
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser._id) {
      return alert("No user logged in.");
    }

    // Build multipart/form-data
    const payload = new FormData();
    payload.append("username", formData.username);
    payload.append("email", formData.email);
    if (formData.password) payload.append("password", formData.password);
    if (file) payload.append("photo", file);

    try {
      dispatch(updateUserStart());

      // IMPORTANT: make sure this path matches your backend route
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "POST",
        body: payload,
        credentials: "include", // include cookies if your auth uses httpOnly cookie
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody.message || `Update failed (status ${res.status})`;
        dispatch(updateUserFailure(message));
        setSuccess(false);
        return;
      }

      const data = await res.json();
      dispatch(updateUserSuccess(data));
      setSuccess(true);
      
    } catch (err) {
      console.error("Update failed:", err);
      dispatch(updateUserFailure(err.message || "Update failed"));
      setSuccess(false);
      
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser || !currentUser._id) {
      return alert("No user logged in.");
    }

    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (err) {
      console.error("Delete failed:", err);
      dispatch(deleteUserFailure(err.message || "Delete failed"));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`/api/users/signout`, { credentials: "include" });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (err) {
      console.error("Sign out failed:", err);
      dispatch(signOutFailure(err.message || "Sign out failed"));
    }
  };

  const handleShowListings = async () => {
   try {
    setShowListingsError(false);
    const res = await fetch(`/api/users/listings/${currentUser._id}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setShowListingsError(true);
        return;
      }
      // backend returns array; fallback to data.listings if wrapped
      setUserListings(Array.isArray(data) ? data : (data.listings || []));
   } catch (error) {
     setShowListingsError(true);
   } 
  }
  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
          }}
        />

        {/* image preview */}
        <img
          onClick={() => fileRef.current && fileRef.current.click()}
          src={imagePreview}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {/* form fields (controlled) */}
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-80"
        >
          Update
        </button>
        <Link to="/create-listing" className="bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95 uppercase">Create Listing</Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{success ? "User updated successfully": ""}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p>{showListingsError ? "Error showing listings" : ""}</p>

      {userListings && userListings.length > 0 && 
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
        {userListings.map((listing) => {
          const listingId = listing._id || listing.id;
          const imgSrc = (listing.imageUrls && listing.imageUrls[0]) || "/default-listing.png";
          return (
            <div key={listingId || Math.random()} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              {listingId ? (
                <Link to={`/listings/${listingId}`}>
                  <img src={imgSrc} alt="listingcover" className="h-16 w-16 object-contain"/>
                </Link>
              ) : (
                <img src={imgSrc} alt="listingcover" className="h-16 w-16 object-contain"/>
              )}
              {listingId ? (
                <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listings/${listingId}`}>
                  <p>{listing.name}</p>
                </Link>
              ) : (
                <p className="text-slate-700 font-semibold flex-1 truncate">{listing.name}</p>
              )}
              <div className="flex flex-col items-center">
                <button disabled={!listingId} onClick={() => listingId && handleListingDelete(listingId)} className="text-red-700 uppercase disabled:opacity-60">Delete</button>
                {listingId ? (
                  <Link to={`/update-listing/${listingId}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                ) : (
                  <button disabled className="text-green-700 uppercase opacity-60">Edit</button>
                )}
              </div>
            </div>
          );
        })}
        </div>}
    </div>
  );
}
