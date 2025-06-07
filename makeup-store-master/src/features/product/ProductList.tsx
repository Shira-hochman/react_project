import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { addToCart } from "../../pages/cartSlice";
import "bootstrap/dist/css/bootstrap.min.css";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  buyCount: number;
}

const ProductsList = () => {
  const user = useSelector((state: RootState) => state.cart.user);
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // איפוס בעת שינוי חיפוש או קטגוריה
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search, category]);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/products", {
        params: {
          q: search || undefined,
          category: category || undefined,
          _limit: 20,
          _page: page,
          _sort: "id",
          _order: "asc",
        },
      });

      const data = res.data;
      setProducts((prev) => [...prev, ...data]);

      if (data.length < 20) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("שגיאה בטעינת מוצרים", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("שגיאה במחיקת מוצר", err);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 }));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="container py-4">
      {showSuccess && (
        <div className="alert alert-success text-center" role="alert">
          ✅ המוצר נוסף לסל בהצלחה!
        </div>
      )}
      <h2 className="mb-4">המוצרים שלנו</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="חפש לפי שם"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">כל הקטגוריות</option>
            <option value="שפתיים">שפתיים</option>
            <option value="עיניים">עיניים</option>
            <option value="פנים">פנים</option>
            <option value="ציפורניים">ציפורניים</option>
            <option value="טיפוח">טיפוח</option>
            <option value="אקססוריז">אקססוריז</option>
          </select>
        </div>
      </div>

      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm position-relative">
              <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: 200, objectFit: "cover" }}
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.price} ₪</p>
                <Link to={`/product/${product.id}`} className="btn btn-link">פרטי מוצר</Link>
              </div>
              {!user?.isAdmin && (
                <div className="d-flex justify-content-between p-2">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleAddToCart(product)}
                  >
                    הוסף לסל 🛒
                  </button>
                </div>
              )}
              {user?.isAdmin && (
                <button
                  className="btn btn-danger position-absolute"
                  style={{ top: 10, right: 10 }}
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && hasMore && (
        <div className="text-center mt-3">
          <button className="btn btn-primary" onClick={() => setPage((prev) => prev + 1)}>
            טען עוד
          </button>
        </div>
      )}
      {!hasMore && !loading && <p className="text-center text-muted">אין מוצרים נוספים</p>}
      {loading && <p className="text-center">טוען...</p>}
    </div>
  );
};

export default ProductsList;
