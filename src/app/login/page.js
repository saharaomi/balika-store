"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    if (profile.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/customer";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf7f2] p-5">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-2xl shadow space-y-5">
        <h1 className="text-3xl font-bold text-center text-[#b08d57]">BALIKA</h1>
        <h2 className="text-xl text-center font-semibold">Welcome Back</h2>

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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-[#b08d57] text-white p-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="text-sm text-center text-red-600">{message}</p>}

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#b08d57] font-semibold">Sign Up</a>
        </p>
      </form>
    </main>
  );
}
