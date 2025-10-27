import React, { useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { SignInSuccess, SignInFailure } from "../../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const auth = getAuth(app);
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult && redirectResult.user) {
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: redirectResult.user.displayName,
              email: redirectResult.user.email,
              photoURL: redirectResult.user.photoURL,
            }),
          });
          const data = await res.json();
          dispatch(SignInSuccess(data));
          navigate("/");
        }
      } catch (error) {
        console.warn("Redirect handling error:", error);
      }
    })();
  }, [dispatch, navigate]);

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      provider.setCustomParameters({
        prompt: "select_account",
      });

      try {
        // ✅ Use popup for sign-in
        const result = await signInWithPopup(auth, provider);

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          }),
        });

        const data = await res.json();
        dispatch(SignInSuccess(data));
        navigate("/");
      } catch (popupError) {
        console.warn(
          "Popup blocked or COOP issue detected, falling back to redirect..."
        );
        // ✅ Fallback when popup fails (COOP or popup blocker)
        await signInWithRedirect(auth, provider);
      }
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      dispatch(SignInFailure(error.message || "Google sign-in failed"));
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-full"
    >
      Continue with Google
    </button>
  );
}
