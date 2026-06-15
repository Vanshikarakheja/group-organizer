"use client";

import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const signInWithGoogle = async () => {
    console.log("Google button clicked");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:"http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-4">Group Organizer</h1>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white text-black py-3 rounded-lg"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}