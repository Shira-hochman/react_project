import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Home = () => {
  const user = useSelector((state: RootState) => state.cart.user);

  return (
    <div style={{ padding: "1rem" }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link to="/products">
        </Link>
<img src="" alt="" />
        {user ? (
          <p>
            שלום {user.isAdmin ? "למנהל מערכת" : user.name}
          </p>
        ) : (
          <Link to="/login">
            <button>הפרטים שלי</button>
          </Link>
        )}

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