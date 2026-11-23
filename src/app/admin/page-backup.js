"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      setMessage("Access denied. Admin only.");
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadData();
    setLoading(false);
  }

  async function loadData() {
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    const { data: categoryData } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (productError) {
      setMessage("Products could not load: " + productError.message);
    } else {
      setProducts(productData || []);
    }

    setCategories(categoryData || []);
  }

  async function addProduct(e) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.from("products").insert({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image_url: imageUrl || null,
      category_id: categoryId ? Number(categoryId) : null,
    });

    if (error) {
      setMessage("Could not add product: " + error.message);
      return;
    }

    setMessage("Product added successfully!");
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setImageUrl("");
    setCategoryId("");
    await loadData();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return <main className="p-10 text-center">Loading Admin Dashboard...</main>;
  }

  if (!authorized) {
    return <main className="p-10 text-center text-red-700">{message || "Access denied."}</main>;
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] p-5 md:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#b08d57]">BALIKA</h1>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>
        <button onClick={logout} className="rounded-lg bg-gray-900 px-5 py-2 text-white">
          Logout
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold">{products.length}</h2>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500">Categories</p>
          <h2 className="text-3xl font-bold">{categories.length}</h2>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500">Workspace</p>
          <h2 className="text-xl font-bold text-[#b08d57]">Admin</h2>
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-5">Add New Product</h2>

        <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-3"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="border rounded-lg p-3"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price (BDT)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            className="border rounded-lg p-3"
            type="number"
            min="0"
            step="1"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />

          <select
            className="border rounded-lg p-3 bg-white"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Choose Category (optional)</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            className="border rounded-lg p-3 md:col-span-2"
            placeholder="Product Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <textarea
            className="border rounded-lg p-3 md:col-span-2"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="md:col-span-2 rounded-lg bg-[#b08d57] p-3 font-semibold text-white hover:bg-[#967447]">
            Add Product
          </button>
        </form>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">All Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="p-3">ID</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3">{product.id}</td>
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3">৳{product.price}</td>
                    <td className="p-3">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
