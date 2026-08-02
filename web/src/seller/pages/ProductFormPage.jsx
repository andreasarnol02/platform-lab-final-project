import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import client from "../api/client";
import { Spinner } from "../components/states";
import ProductImage from "../../components/ProductImage";
import { formatIDRInput } from "../utils/format";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: "",
};

const CATEGORY_OPTIONS = [
  "Elektronik",
  "Fashion",
  "Kecantikan",
  "Makanan",
  "Rumah",
  "Hobi",
  "Lainnya",
];

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    client
      .get(`/seller/products/${id}`)
      .then(({ data }) => {
        const p = data.data;
        setForm({
          name: p.name,
          description: p.description || "",
          price: p.price,
          stock: p.stock,
          category: p.category,
          imageUrl: p.imageUrl || p.images?.[0] || "",
        });
      })
      .catch(() => setError("Produk tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category.trim(),
      imageUrl: form.imageUrl.trim(),
    };

    try {
      if (isEdit) {
        await client.put(`/products/${id}`, payload);
      } else {
        await client.post("/products", payload);
      }
      navigate("/seller/products");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan produk.");
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="form-page">
      <div className="page-head">
        <h1>{isEdit ? "Edit Produk" : "Tambah Produk"}</h1>
      </div>

      <form className="panel form-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span>Nama produk *</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Contoh: Laptop Pro 14"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Deskripsi *</span>
          <textarea
            name="description"
            rows={3}
            required
            placeholder="Jelaskan produkmu"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <div className="form-row">
          <label className="field">
            <span>Harga jual *</span>
            <span className="currency-field">
              <b>Rp</b>
              <input
              type="text"
              inputMode="numeric"
              pattern="[0-9.]*"
                name="price"
                required
                min={0}
                placeholder="1500000"
              value={formatIDRInput(form.price)}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value.replace(/\D/g, "") })
              }
              />
            </span>
          </label>

          <label className="field">
            <span>Stok *</span>
            <input
              type="number"
              inputMode="numeric"
              name="stock"
              required
              min={0}
              placeholder="10"
              value={form.stock}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className="field">
          <span>Kategori *</span>
          <select name="category" required value={form.category} onChange={handleChange}>
            <option value="" disabled>Pilih kategori</option>
            {form.category && !CATEGORY_OPTIONS.includes(form.category) && (
              <option value={form.category}>{form.category}</option>
            )}
            {CATEGORY_OPTIONS.map((category) => (
              <option value={category} key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>URL Gambar *</span>
          <input
            type="url"
            name="imageUrl"
            required
            aria-describedby="image-url-help"
            placeholder="https://contoh.com/foto-produk.jpg"
            value={form.imageUrl}
            onChange={handleChange}
          />
          <em id="image-url-help" className="field-help">Wajib diisi dengan URL publik langsung ke file gambar produk. Upload file belum tersedia.</em>
        </label>

        {form.imageUrl && (
          <div className="form-preview">
            <ProductImage src={form.imageUrl} alt="Pratinjau gambar produk" />
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
             onClick={() => navigate("/seller/products")}
          >
            Batal
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Terbitkan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
