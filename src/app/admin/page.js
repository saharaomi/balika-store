"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
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

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategoryId("");
    setImageFile(null);
    setImageUrl("");
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadImage() {
    if (!imageFile) return imageUrl || null;

    if (!imageFile.type.startsWith("image/")) {
      throw new Error("Please select an image file.");
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error("Image must be smaller than 5 MB.");
    }

    const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `products/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (error) throw error;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function saveProduct(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const uploadedImageUrl = await uploadImage();

      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image_url: uploadedImageUrl,
        category_id: categoryId ? Number(categoryId) : null,
      };

      let error;

      if (editingId !== null) {
        ({ error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId));
      } else {
        ({ error } = await supabase
          .from("products")
          .insert(productData));
      }

      if (error) throw error;

      setMessage(
        editingId !== null
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      await loadData();
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  function editProduct(product) {
    setEditingId(product.id);
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(String(product.price ?? ""));
    setStock(String(product.stock ?? ""));
    setCategoryId(product.category_id ? String(product.category_id) : "");
    setImageUrl(product.image_url || "");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage("Editing: " + product.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setMessage("Could not delete product: " + error.message);
      return;
    }

    if (editingId === product.id) {
      resetForm();
    }

    setMessage("Product deleted successfully!");
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
    return (
      <main className="p-10 text-center text-red-700">
        {message || "Access denied."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] p-5 md:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#b08d57]">BALIKA</h1>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>

        <button
          onClick={logout}
          className="rounded-lg bg-gray-900 px-5 py-2 text-white"
        >
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
        <h2 className="text-xl font-bold mb-5">
          {editingId !== null ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-gray-700">
              Upload Jewellery Image (Maximum 5 MB)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="w-full border rounded-lg p-3"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />

            {imageUrl && !imageFile && (
              <p className="mt-2 text-sm text-green-700">
                Existing product image will be kept if you don't select a new one.
              </p>
            )}

            {imageFile && (
              <p className="mt-2 text-sm text-green-700">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          <textarea
            className="border rounded-lg p-3 md:col-span-2"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 rounded-lg bg-[#b08d57] p-3 font-semibold text-white hover:bg-[#967447] disabled:opacity-50"
          >
            {saving
              ? "Please wait..."
              : editingId !== null
                ? "Update Product"
                : "Add Product"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="md:col-span-2 rounded-lg border p-3"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {message && (
          <p className="mt-4 text-sm break-words" role="status">
            {message}
          </p>
        )}
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
                  <th className="p-3">Image</th>
                  <th className="p-3">ID</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>

                    <td className="p-3">{product.id}</td>
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3">৳{product.price}</td>
                    <td className="p-3">{product.stock}</td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editProduct(product)}
                          className="rounded bg-blue-600 px-3 py-2 text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product)}
                          className="rounded bg-red-600 px-3 py-2 text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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
