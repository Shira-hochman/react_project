// ✅ קובץ: src/pages/ProductDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/product/cartSlice";
import { RootState } from "../store";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.cart.user);

  useEffect(() => {
    axios.get(`http://localhost:3001/products/${id}`).then(res => {
      setProduct(res.data);
    });
  }, [id]);

  if (!product) return <p className="text-center">טוען פרטי מוצר...</p>;

  return (
    <div className="container py-4">
      <h2>{product.name}</h2>
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid mb-2" />
          <div className="d-flex gap-2">
            <img src="https://via.placeholder.com/100" alt="תמונה נוספת 1" />
            <img src="https://via.placeholder.com/100" alt="תמונה נוספת 2" />
          </div>
        </div>
        <div className="col-md-6">
          <p><strong>קטגוריה:</strong> {product.category}</p>
          <p><strong>תיאור:</strong> {product.description}</p>
          <p><strong>כמות קניות:</strong> {product.buyCount}</p>
          <p><strong>מחיר:</strong> {product.price} ₪</p>
          {!user?.isAdmin && (
            <button className="btn btn-success" onClick={() => dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 }))}>
              הוסף לסל 🛒
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;