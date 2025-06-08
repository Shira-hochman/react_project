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
<img src="https://sdmntprwestus.oaiusercontent.com/files/00000000-aa58-6230-9729-e14f30f2ca04/raw?se=2025-06-08T03%3A49%3A39Z&sp=r&sv=2024-08-04&sr=b&scid=1559b9f6-2dbe-5673-9faf-385fb0328ee0&skoid=ea0c7534-f237-4ccd-b7ea-766c4ed977ad&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-08T01%3A19%3A10Z&ske=2025-06-09T01%3A19%3A10Z&sks=b&skv=2024-08-04&sig=u0mecicVkEHeWzGydhqNMNObfgUCguk7RhagtDlVZRM%3D" alt="" />
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