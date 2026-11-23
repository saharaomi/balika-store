"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestSupabase() {
  const [status, setStatus] = useState("Checking connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.auth.getSession();

      if (error) {
        setStatus("Connection failed: " + error.message);
      } else {
        setStatus("Supabase client initialized successfully!");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl font-bold">{status}</h1>
    </main>
  );
}
