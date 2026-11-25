
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(4);

      if (!error && data) {
        setProducts(data);
      }

      setLoading(false);
    }

    getProducts();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#eee8df]">
        <div className="container h-20 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold tracking-[5px] text-[#b08d57]">
            BALIKA
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#b08d57]">Home</Link>
            <a href="#products" className="hover:text-[#b08d57]">Shop</a>
            <a href="#story" className="hover:text-[#b08d57]">About</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center bg-[#f1e9dd] overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-8 items-center py-16">
          <div>
            <p className="uppercase tracking-[4px] text-sm text-[#947344] mb-5">
              Elegance in Every Detail
            </p>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
              Discover Your <br /> Unique Style
            </h1>
            <p className="text-[#77716a] leading-7 mb-8 max-w-md">
              Explore beautiful jewellery and accessories designed to make
              every moment special.
            </p>
            <a href="#products" className="primary-button">
              Explore Collection
            </a>
          </div>

          <div className="relative h-[320px] md:h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200"
              alt="Elegant jewellery collection"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 text-center">
        <div>
          <h3 className="font-semibold mb-2">Premium Quality</h3>
          <p className="text-sm text-[#77716a]">Beautifully selected products</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Elegant Designs</h3>
          <p className="text-sm text-[#77716a]">Style for every occasion</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Customer Care</h3>
          <p className="text-sm text-[#77716a]">Here to help you</p>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[3px] text-[#b08d57] mb-3">
              Our Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-serif">
              Featured Products
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-[#77716a]">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-[#77716a]">
              No products available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative h-72 bg-[#f5f1eb] rounded-xl overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name || "BALIKA product"}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-[#947344]">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium mt-4">{product.name}</h3>
                  <p className="text-[#b08d57] font-semibold mt-2">
                    ৳{product.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="container py-20 text-center">
        <p className="text-sm uppercase tracking-[3px] text-[#b08d57] mb-4">
          About BALIKA
        </p>
        <h2 className="text-3xl md:text-4xl font-serif mb-5">
          Beauty Meets Elegance
        </h2>
        <p className="max-w-2xl mx-auto text-[#77716a] leading-7">
          BALIKA brings you thoughtfully selected jewellery and accessories
          that celebrate your individuality and personal style.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#29251f] text-white py-10">
        <div className="container text-center">
          <h2 className="text-2xl tracking-[5px] mb-4">BALIKA</h2>
          <p className="text-sm text-gray-300">
            Elegance in Every Detail
          </p>
          <p className="text-xs text-gray-400 mt-6">
           © 2026 BALIKA. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
