import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  buyCount: number;
};

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // טען מחדש עמוד 1 כשמחפשים או בוחרים קטגוריה
    setPage(1);
    setHasMore(true);
  }, [search, category]);

  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  const fetchProducts = async () => {
    if (!hasMore && page !== 1) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/products", {
        params: {
          q: search || undefined,
          category: category || undefined,
          _limit: 20,
          _page: page,
        },
      });

      const data = res.data;
      if (data.length < 20) setHasMore(false);

      setProducts((prev) => (page === 1 ? data : [...prev, ...data]));
    } catch (err) {
      console.error("שגיאה בטעינת מוצרים", err);
    }
    setLoading(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setProducts([]);
    setHasMore(true);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setProducts([]);
    setHasMore(true);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>המוצרים שלנו</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="חפש לפי שם"
          value={search}
          onChange={handleSearchChange}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">כל הקטגוריות</option>
          <option value="שפתיים">שפתיים</option>
          <option value="עיניים">עיניים</option>
          <option value="פנים">פנים</option>
          <option value="ציפורניים">ציפורניים</option>
          <option value="טיפוח">טיפוח</option>
          <option value="אקססוריז">אקססוריז</option>
        </select>
      </div>

      {products.length === 0 && !loading && <p>אין מוצרים להצגה</p>}

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            borderBottom: "1px solid #ccc",
            marginBottom: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <Link to={`/product/${product.id}`}>
            <h3>{product.name}</h3>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: 150, height: "auto" }}
            />
            <p>מחיר: {product.price} ₪</p>
          </Link>
        </div>
      ))}

      {hasMore && !loading && products.length > 0 && (
        <button onClick={() => setPage((prev) => prev + 1)}>טען עוד</button>
      )}
      {loading && <p>טוען...</p>}
    </div>
  );
};

export default ProductsList;
