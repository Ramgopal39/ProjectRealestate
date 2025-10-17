import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "ram",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUpLoading] = useState(false);
  const {currentUser} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = async (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setUpLoading(true);

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setImageUploadError(false);
          setUpLoading(false);
        })
        .catch((err) => {
          console.error("Image upload failed:", err);
          setImageUploadError(err?.message || "Image upload failed");
          setUpLoading(false);
        });
    } else {
      setImageUploadError("You can upload only 6 images");
      setUpLoading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "").trim();
        const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UNSIGNED_UPLOAD_PRESET || "").trim();
        const folder = (import.meta.env.VITE_CLOUDINARY_FOLDER || "").trim();

        if (!cloudName || !uploadPreset) {
          throw new Error(
            "Missing Cloudinary config. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UNSIGNED_UPLOAD_PRESET"
          );
        }

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", uploadPreset);
        if (folder) fd.append("folder", folder);

        const res = await fetch(url, {
          method: "POST",
          body: fd,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        resolve(data.secure_url || data.url);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };
  const handleChange = (e) => {
    if(e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      }) 
    }
    if(e.target.id === "parking" || e.target.id === "furnished") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      })
    }
    if(e.target.id === "offer"){
      const nextOffer = e.target.checked;
      setFormData({
        ...formData,
        offer: nextOffer,
        discountPrice: nextOffer ? formData.discountPrice : 0,
      })
    }
    if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea"){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      })
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1){
        return setError("Please upload at least one image");
      }
      if (formData.offer && +formData.regularPrice < +formData.discountPrice){
        return setError("Discount price cannot be greater than regular price");
      }
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json(); 
      setLoading(false);
      if(data.success === false){
        setError(data.message);
      }
      navigate(`/listings/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type === "sale"}/>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type === "rent"}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"onChange={handleChange} checked={formData.parking}/>
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished}/>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={formData.offer}/>
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="border p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="border p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="border p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <p>Regular Price</p>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                  required={formData.offer}
                  className="border p-3 border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p>Discount Price</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="border p-3 rounded-lg"
                type="file"
                id="images"
                multiple
                accept="image/*"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {imageUploadError && (
              <p className="text-red-700 text-sm">{imageUploadError}</p>
            )}

            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div key={url} className="flex justify-between p-3 border items-center">
                  <img
                    src={url}
                    alt="listing"
                    className="w-40 h-40 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>

          <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
