import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Home = () => {
  const user = useSelector((state: RootState) => state.cart.user);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>ברוכים הבאים למסך הבית</h2>
      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link to="/products">
          <button>המוצרים שלנו</button>
        </Link>

        <Link to="/profile">
          <button>הפרטים שלי</button>
        </Link>

        {user?.isAdmin && (
          <Link to="/add-product">
            <button>הוספת מוצר חדש</button>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Home;
