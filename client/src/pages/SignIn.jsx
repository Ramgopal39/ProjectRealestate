import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SignInStart, SignInSuccess, SignInFailure } from "../../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(SignInStart());
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                dispatch(SignInFailure(data.message));
                return;
            }
            dispatch(SignInSuccess(data));
            navigate("/");
        } catch (err) {
            dispatch(SignInFailure(err.message));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="email"
                    className="border p-3 rounded-lg"
                    id="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    className="border p-3 rounded-lg"
                    id="password"
                    onChange={handleChange}
                />
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                    {loading ? "Loading..." : "Sign In"}
                </button>
                <OAuth/>
            </form>
            <div className="flex gap-2 justify-center mt-4">
                <p>Don’t have an account?</p>
                <Link to={"/signup"}>
                    <span className="text-blue-700">Sign up</span>
                </Link>
            </div>
        </div>
    );
}
