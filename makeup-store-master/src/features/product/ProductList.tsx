import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { addToCart } from "../../pages/cartSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductList.css"; // נניח שנוסיף קובץ CSS מותאם

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

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/products");
      setAllProducts(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת כל המוצרים", err);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setVisibleCount(20);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setVisibleCount(20);
  };

  const filteredProducts = allProducts.filter((product) => {
    return (
      (!search || product.name.includes(search)) &&
      (!category || product.category === category)
    );
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 }));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      setAllProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("שגיאה במחיקת מוצר", err);
    }
  };

  return (
    <div className="product-page">
      {showSuccess && (
        <div className="alert alert-success text-center fixed-top mt-3 mx-auto w-50 rounded-pill" role="alert">
          ✅ המוצר נוסף לסל בהצלחה!
        </div>
      )}
      <h2 className="text-center fw-bold my-5 display-6">מבחר מוצרים</h2>
      <div className="container mb-4">
        <div className="row g-3 justify-content-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control shadow-sm rounded-pill text-center"
              placeholder="חפש מוצר..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-5">
            <select
              className="form-select shadow-sm rounded-pill text-center"
              value={category}
              onChange={handleCategoryChange}
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
      </div>

      <div className="container">
        <div className="row g-4">
          {visibleProducts.map((product) => (
            <div className="col-6 col-md-4 col-lg-3" key={product.id}>
              <div className="product-card shadow-sm rounded-4 p-2">
                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                  {product.image ? (
                    <img
                      src={product.image}
                      className="img-fluid rounded-4 mb-2"
                      alt={product.name}
                      style={{ height: 220, objectFit: "cover", width: "100%" }}
                    />
                  ) : (
                    <div
                      className="bg-light rounded-4 d-flex align-items-center justify-content-center mb-2"
                      style={{ height: 220 }}
                    >
                      אין תמונה
                    </div>
                  )}
                </Link>
                <div className="text-center">
                  <h6 className="fw-bold text-truncate">{product.name}</h6>
                  <div className="text-muted small">₪ {product.price}</div>
                  <div className="mt-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-outline-dark btn-sm rounded-pill me-1"
                    >
                      פרטי מוצר
                    </Link>
                    {!user?.isAdmin && (
                      <button
                        className="btn btn-dark btn-sm rounded-pill"
                        onClick={() => handleAddToCart(product)}
                      >
                        🛒 הוסף לסל
                      </button>
                    )}
                    {user?.isAdmin && (
                      <button
                        className="btn btn-danger btn-sm mt-2 rounded-pill w-100"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️ מחק מוצר
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < filteredProducts.length && (
          <div className="text-center my-4">
            <button
              className="btn btn-dark px-4 py-2 rounded-pill"
              onClick={() => setVisibleCount((prev) => prev + 20)}
            >
              הצג עוד
            </button>
          </div>
        )}
        {visibleCount >= filteredProducts.length && (
          <p className="text-center text-muted mt-4">אין מוצרים נוספים</p>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
