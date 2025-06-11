import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../features/product/cartSlice";
import { Link } from "react-router-dom";
import "./Cart.css"; // ← נוסיף קובץ CSS

const Cart = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">העגלה שלי</h2>

      {items.length === 0 ? (
        <p className="empty-cart">העגלה ריקה</p>
      ) : (
        <div className="cart-list">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-details">
                <h5>{item.name}</h5>
                <p>{item.price} ₪ × {item.quantity}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
                <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                <button onClick={() => dispatch(removeFromCart(item.id))}>🗑️</button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <h4>סך הכול לתשלום: {total.toFixed(2)} ₪</h4>
            <Link to="/CheckOutPage" className="checkout-button">לתשלום</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
