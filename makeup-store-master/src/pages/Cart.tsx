// ✅ קובץ: src/pages/Cart.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "./cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container py-4">
      <h2 className="mb-4">העגלה שלי</h2>
      {items.length === 0 ? (
        <p>העגלה ריקה</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <h5>{item.name}</h5>
                <p>{item.price} ₪ × {item.quantity}</p>
              </div>
              <div>
                <button className="btn btn-secondary mx-1" onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
                <button className="btn btn-secondary mx-1" onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                <button className="btn btn-danger mx-1" onClick={() => dispatch(removeFromCart(item.id))}>🗑️</button>
              </div>
            </div>
          ))}
          <h4 className="mt-4">סך הכול לתשלום: {total} ₪</h4>
        </div>
      )}
       <button> <Link to="/CheckOutPage">לתשלום</Link></button>
    </div>
  );
};

export default Cart;