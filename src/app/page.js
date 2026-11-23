
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false })
        .limit(4);

      if (!error) setProducts(data || []);
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#faf7f2] text-[#29251f]">

      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-5 flex justify-between items-center">
        <a href="/" className="text-3xl font-bold tracking-widest text-[#b08d57]">
          BALIKA
        </a>

        <div className="flex gap-5 items-center">
          <a href="/" className="hidden sm:block">Home</a>
          <a href="/customer">Shop</a>
          <a href="/login" className="bg-[#b08d57] text-white px-5 py-2 rounded-full">
            Account
          </a>
        </div>
      </nav>

      {/* HERO BANNER */}
      <section className="relative min-h-[550px] flex items-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600"
          alt="BALIKA Jewellery"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 px-8 md:px-20 text-white max-w-3xl py-24">
          <p className="uppercase tracking-[5px] mb-5">
            Elegance in Every Detail
          </p>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            Beauty That
            <br />
            Speaks For You
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            Discover timeless jewellery designed to make
            every moment beautiful.
          </p>

          <a
            href="/customer"
            className="inline-block mt-8 bg-[#b08d57] px-9 py-4 rounded-full text-white"
          >
            Explore Collection →
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-10 grid grid-cols-1 md:grid-cols-3 text-center gap-8">
        <div>
          <h3 className="font-bold text-lg">Timeless Designs</h3>
          <p className="text-gray-500">Beautiful Jewellery</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Premium Collections</h3>
          <p className="text-gray-500">Style for Every Occasion</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Cash on Delivery</h3>
          <p className="text-gray-500">Pay When You Receive</p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[#b08d57] tracking-widest">
            DISCOVER BALIKA
          </p>
          <h2 className="text-4xl font-serif mt-3">
            Featured Products
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    No Image
                  </div>
                )}

                <div className="p-5 text-center">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-[#b08d57] font-bold mt-2">
                    ৳{Number(product.price).toLocaleString("en-BD")}
                  </p>
                  <a href="/customer" className="inline-block mt-4 border border-[#b08d57] px-6 py-2 rounded-full text-[#b08d57]">
                    View Product
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a href="/customer" className="bg-[#b08d57] text-white px-8 py-3 rounded-full inline-block">
            Shop All Products →
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-20 px-6 text-center">
        <p className="text-[#b08d57] tracking-widest">OUR STORY</p>
        <h2 className="text-4xl font-serif mt-4">
          Jewellery That Celebrates You
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 mt-5 leading-8">
          At BALIKA, we believe every woman deserves to feel
          beautiful and confident. Discover elegant jewellery
          for your special moments.
        </p>
        <a href="/customer" className="inline-block mt-7 bg-[#b08d57] text-white px-8 py-3 rounded-full">
          Discover BALIKA
        </a>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#29251f] text-white text-center py-12">
        <h2 className="text-3xl font-bold tracking-widest text-[#c6a36a]">
          BALIKA
        </h2>
        <p className="text-gray-400 mt-4">
          Elegance in Every Detail.
        </p>
        <p className="text-gray-500 text-sm mt-8">
          © 2026 BALIKA. All Rights Reserved.
        </p>
      </footer>

    </main>
  );
}
