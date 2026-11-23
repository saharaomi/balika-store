
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: productData } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false })
        .limit(4);

      const { data: categoryData } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      setProducts(productData || []);
      setCategories(categoryData || []);
    }

    loadData();
  }, []);

  return (
    <main className="bg-[#faf7f2] text-[#29251f]">

      {/* NAVBAR */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <a href="/" className="text-3xl font-bold tracking-widest text-[#b08d57]">
            BALIKA
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/" className="hover:text-[#b08d57]">Home</a>
            <a href="/customer" className="hover:text-[#b08d57]">Shop</a>
            <a href="#collections" className="hover:text-[#b08d57]">Collections</a>
            <a href="#about" className="hover:text-[#b08d57]">About</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/customer"
              className="border border-[#b08d57] text-[#b08d57] px-4 py-2 rounded-full text-sm hover:bg-[#b08d57] hover:text-white transition"
            >
              Shop Now
            </a>

            <a
              href="/login"
              className="bg-[#b08d57] text-white px-4 py-2 rounded-full text-sm"
            >
              Account
            </a>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      {/* HERO SECTION */}
<section className="relative min-h-[580px] flex items-center overflow-hidden">

  <img
    src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1800"
    alt="BALIKA Jewellery Collection"
    className="absolute inset-0 w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/50"></div>

  <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-24 text-white">

    <p className="uppercase tracking-[5px] text-sm mb-5">
      Elegance in Every Detail
    </p>

    <h1 className="text-5xl md:text-7xl font-serif leading-tight max-w-2xl">
      Beauty That
      <br />
      Speaks For You
    </h1>

    <p className="mt-6 text-lg text-gray-200 max-w-lg">
      Discover timeless jewellery designed to make
      every moment beautiful and unforgettable.
    </p>

    <a
      href="/customer"
      className="inline-block mt-9 bg-[#b08d57] hover:bg-[#967343] text-white px-9 py-4 rounded-full"
    >
      Explore Collection →
    </a>

  </div>
</section>

      {/* PROMISE SECTION */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

          <div>
            <h3 className="font-semibold text-lg">Timeless Designs</h3>
            <p className="text-gray-500 text-sm mt-2">
              Jewellery for every occasion
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Beautiful Collections</h3>
            <p className="text-gray-500 text-sm mt-2">
              Carefully selected styles
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Cash on Delivery</h3>
            <p className="text-gray-500 text-sm mt-2">
              Pay when your order arrives
            </p>
          </div>

        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section id="collections" className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-12">
          <p className="text-[#b08d57] uppercase tracking-widest text-sm">
            Explore BALIKA
          </p>
          <h2 className="text-4xl font-serif mt-3">
            Our Collections
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

          {categories.map((category, index) => {
            const images = [
              "photo-1599643478518-a784e5dc4c8f",
              "photo-1535632066927-ab7c9ab60908",
              "photo-1605100804763-247f67b3557e",
              "photo-1611591437281-460bfbe1220a",
              "photo-1617038220319-276d3cfab638"
            ];

            return (
              <a
                key={category.id}
                href="/customer"
                className="group relative overflow-hidden rounded-xl h-56"
              >
                <img
                  src={`https://images.unsplash.com/${images[index % images.length]}?w=500`}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition flex items-end justify-center pb-6">
                  <h3 className="text-white text-lg font-semibold">
                    {category.name}
                  </h3>
                </div>
              </a>
            );
          })}

        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <p className="text-[#b08d57] uppercase tracking-widest text-sm">
              Handpicked For You
            </p>
            <h2 className="text-4xl font-serif mt-3">
              Featured Products
            </h2>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-gray-500">
              Products will appear here soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-[#faf7f2] rounded-xl overflow-hidden"
                >
                  <div className="h-72 bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-lg">
                      {product.name}
                    </h3>

                    <p className="text-[#b08d57] font-bold mt-2">
                      ৳{Number(product.price).toLocaleString("en-BD")}
                    </p>

                    <a
                      href="/customer"
                      className="inline-block mt-4 border border-[#b08d57] text-[#b08d57] px-6 py-2 rounded-full text-sm hover:bg-[#b08d57] hover:text-white transition"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              ))}

            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/customer"
              className="bg-[#b08d57] text-white px-9 py-4 rounded-full inline-block hover:bg-[#967343] transition"
            >
              View All Products →
            </a>
          </div>

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900"
              alt="BALIKA Jewellery"
              className="rounded-2xl w-full h-[420px] object-cover"
            />
          </div>

          <div>
            <p className="text-[#b08d57] uppercase tracking-widest text-sm">
              Our Story
            </p>

            <h2 className="text-4xl font-serif mt-4 leading-tight">
              Jewellery That
              <br />
              Celebrates You
            </h2>

            <p className="text-gray-600 mt-6 leading-8">
              At BALIKA, we believe every woman deserves to
              feel beautiful and confident. Our collections
              bring together elegance, style and timeless
              beauty for your special moments.
            </p>

            <a
              href="/customer"
              className="inline-block mt-8 bg-[#b08d57] text-white px-8 py-3 rounded-full"
            >
              Discover BALIKA
            </a>
          </div>

        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-[#eee5d8] py-16 px-6 text-center">
        <h2 className="text-3xl font-serif">
          Stay Connected With BALIKA
        </h2>

        <p className="text-gray-600 mt-3">
          Discover beautiful jewellery for every occasion.
        </p>

        <a
          href="/customer"
          className="inline-block mt-7 bg-[#b08d57] text-white px-9 py-3 rounded-full"
        >
          Shop Our Collection
        </a>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#29251f] text-white pt-14 pb-7">

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-3xl font-bold tracking-widest text-[#c6a36a]">
              BALIKA
            </h2>
            <p className="text-gray-400 mt-4 leading-7 text-sm">
              Elegance in every detail. Discover jewellery
              that makes every moment special.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <a href="/" className="hover:text-white">Home</a>
              <a href="/customer" className="hover:text-white">Shop</a>
              <a href="#collections" className="hover:text-white">Collections</a>
              <a href="#about" className="hover:text-white">About Us</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">
              Customer Service
            </h3>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <a href="/login" className="hover:text-white">My Account</a>
              <a href="/customer" className="hover:text-white">Shopping</a>
              <a href="/login" className="hover:text-white">Login</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">
              Payment
            </h3>
            <p className="text-gray-400 text-sm leading-7">
              Cash on Delivery available.
              <br />
              Pay when your order arrives.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          © 2026 BALIKA. All Rights Reserved.
        </div>

      </footer>

    </main>
  );
}
