import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Listing() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/${id}`);
        const json = await res.json();
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to load listing");
        }
        if (alive) {
          setData(json);
          setError(null);
        }
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <main className="p-3 max-w-4xl mx-auto">Loading...</main>;
  if (error) return <main className="p-3 max-w-4xl mx-auto text-red-700">{error}</main>;
  if (!data) return null;

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-4">{data.name}</h1>
      <p className="text-gray-700 mb-2">{data.address}</p>
      <div className="flex flex-wrap gap-3 mb-4">
        {(data.imageUrls || []).map((url) => (
          <img key={url} src={url} alt={data.name} className="w-48 h-48 object-cover rounded" />
        ))}
      </div>
      <p className="mb-4">{data.description}</p>
      <div className="font-semibold">
        <span className="mr-2">Regular: {data.regularPrice}</span>
        {data.offer && <span>Discount: {data.discountPrice}</span>}
      </div>
    </main>
  );
}
