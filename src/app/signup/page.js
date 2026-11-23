"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created! Please check your email for confirmation.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf7f2] p-5">
      <form onSubmit={handleSignup} className="w-full max-w-md bg-white p-8 rounded-2xl shadow space-y-5">
        <h1 className="text-3xl font-bold text-center text-[#b08d57]">BALIKA</h1>
        <h2 className="text-xl text-center font-semibold">Create Your Account</h2>

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full border p-3 rounded-lg"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border p-3 rounded-lg"
          type="password"
          placeholder="Password (at least 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button
          className="w-full bg-[#b08d57] text-white p-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {message && <p className="text-sm text-center">{message}</p>}

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-[#b08d57] font-semibold">Login</a>
        </p>
      </form>
    </main>
  );
}
