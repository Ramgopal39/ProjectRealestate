import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SignInSuccess } from "../../redux/user/userSlice"; // ✅ import Redux action

export default function Profile() {
  const fileRef = useRef();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(
    currentUser?.photoURL || currentUser?.avatar || "/default-avatar.png"
  );
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
  });

  // ✅ Update preview instantly
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [file]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ Update Redux store so Header updates too
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an updated user object
    const updatedUser = {
      ...currentUser,
      username: formData.username,
      email: formData.email,
      photoURL: imagePreview, // ✅ new image
    };

    // Update Redux (and thus Header)
    dispatch(SignInSuccess(updatedUser));

    alert("Profile updated successfully!");
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Image Preview */}
        <img
          onClick={() => fileRef.current.click()}
          src={imagePreview}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {/* Form Inputs */}
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
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
