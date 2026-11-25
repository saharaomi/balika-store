
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      window.location.href = "/login";
      return;
    }

    setUserId(data.user.id);
    setCustomerName(data.user.user_metadata?.full_name || "");

    await loadProducts();
    await loadCategories();
    setLoading(false);
  }

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setProducts(data || []);
    }
  }

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  }

  function addToCart(product) {
    if (Number(product.stock) <= 0) return;

    setCart((previous) => {
      const existing = previous.find(
        (item) => item.id === product.id
      );

      if (existing) {
        if (existing.quantity >= Number(product.stock)) {
          alert("Maximum available stock reached!");
          return previous;
        }

        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });

    setMessage("");
  }

  function updateQuantity(id, amount) {
    setCart((previous) =>
      previous
        .map((item) => {
          if (item.id !== id) return item;

          const newQuantity = item.quantity + amount;

          if (newQuantity > Number(item.stock)) {
            return item;
          }

          return { ...item, quantity: newQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const deliveryCharge =
    deliveryArea === "inside" ? 90 :
    deliveryArea === "outside" ? 120 : 0;

  const grandTotal = totalAmount + deliveryCharge;

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            String(product.category_id) === selectedCategory
        );

  async function placeOrder(e) {
    e.preventDefault();

    if (!cart.length) {
      setMessage("Your cart is empty!");
      return;
    }

    if (!deliveryArea) {
      setMessage("Please select your delivery area!");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const orderItems = cart.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        image_url: item.image_url,
      }));

      const { error } = await supabase.from("orders").insert({
        user_id: userId,
        customer_name: customerName,
        phone,
        address: `${deliveryArea === "inside" ? "Inside Dhaka" : "Outside Dhaka"} - ${address}`,
        items: orderItems,
        total_amount: grandTotal,
        payment_method: "COD",
        status: "Pending",
      });

      if (error) throw error;

      setCart([]);
      setPhone("");
      setAddress("");
      setMessage(
        "Order placed successfully! Payment method: Cash on Delivery."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setMessage("Order failed: " + error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        Loading BALIKA...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <header className="bg-white shadow-sm px-6 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#b08d57]">
          BALIKA
        </h1>

        <div className="flex items-center gap-4">
          <a href="#cart" className="font-semibold">
            Cart ({totalItems})
          </a>

          <button
            onClick={logout}
            className="bg-[#b08d57] text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="text-center py-14 px-4">
        <h2 className="text-4xl font-bold text-gray-800">
          Discover Your Elegance
        </h2>
        <p className="text-gray-600 mt-3">
          Beautiful Jewellery for Every Occasion
        </p>
      </section>

      {message && (
        <div className="max-w-7xl mx-auto px-5 mb-6">
          <p className="bg-white border border-[#b08d57] text-[#8a6a3c] p-4 rounded-lg">
            {message}
          </p>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-5 pb-12">
        <h2 className="text-2xl font-bold mb-6">
          Our Collection
        </h2>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-5 py-2 rounded-full ${
              selectedCategory === "All"
                ? "bg-[#b08d57] text-white"
                : "bg-white"
            }`}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(String(category.id))
              }
              className={`px-5 py-2 rounded-full ${
                selectedCategory === String(category.id)
                  ? "bg-[#b08d57] text-white"
                  : "bg-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="h-64 bg-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg">
                    {product.name}
                  </h3>

                  <p className="text-[#b08d57] font-bold text-xl mt-2">
                    ৳{Number(product.price).toLocaleString("en-BD")}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    {product.description}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    Stock: {product.stock}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={Number(product.stock) <= 0}
                    className="w-full mt-4 bg-[#b08d57] text-white py-3 rounded-lg disabled:bg-gray-400"
                  >
                    {Number(product.stock) > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        id="cart"
        className="max-w-4xl mx-auto px-5 py-12"
      >
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">
            Shopping Cart ({totalItems})
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty. Add some jewellery!
            </p>
          ) : (
            <>
              <div className="space-y-5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center gap-4 border-b pb-5"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1 min-w-28">
                      <h3 className="font-semibold">
                        {item.name}
                      </h3>
                      <p className="text-[#b08d57]">
                        ৳{Number(item.price).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="border rounded px-3 py-1"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="border rounded px-3 py-1"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-right mt-6 space-y-2">
                <p className="text-gray-600">
                  Product Subtotal: ৳{totalAmount.toLocaleString("en-BD")}
                </p>
                <p className="text-gray-600">
                  Delivery Charge: {deliveryArea === "inside" ? "৳90" : deliveryArea === "outside" ? "৳120" : "Select location"}
                </p>
                <p className="text-2xl font-bold text-[#b08d57]">
                  Grand Total: ৳{grandTotal.toLocaleString("en-BD")}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2">
            Checkout
          </h2>

          <p className="text-gray-500 mb-6">
            Enter your delivery information.
          </p>

          <form onSubmit={placeOrder} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full border rounded-lg p-3"
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="w-full border rounded-lg p-3"
                placeholder="House, Road, Area, District"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Delivery Location
              </label>
              <select
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                required
                className="w-full border rounded-lg p-3 bg-white"
              >
                <option value="">Select Delivery Location</option>
                <option value="inside">Inside Dhaka - ৳90</option>
                <option value="outside">Outside Dhaka - ৳120</option>
              </select>
            </div>

            <div className="bg-[#faf7f2] p-4 rounded-lg">
              <p className="font-semibold">
                Payment Method: Cash on Delivery
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Pay when your jewellery is delivered.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="w-full bg-[#b08d57] text-white py-4 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {submitting
                ? "Placing Order..."
                : `Place Order - ৳${grandTotal.toLocaleString("en-BD")}`}
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-white text-center py-6 text-gray-500">
        © 2026 BALIKA. All Rights Reserved.
      </footer>
    </main>
  );
}
