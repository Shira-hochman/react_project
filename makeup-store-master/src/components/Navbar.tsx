import { Link } from "react-router-dom";
import "./Navbar.css";
import Register from "../pages/Register";

function Navbar() {
  return (
    <div className="navbar-wrapper">
      {/* שורת עליונה */}
      <div className="navbar-top-banner">משלוח עד הבית חינם בכל הזמנה</div>

      {/* תפריט עליון */}
      <nav className="navbar-main">
        <div className="navbar-icons">
       <span>
  <Link to="/Register" style={{ color: "gray", textDecoration: "none" }}>הרשמה</Link>
        </span>
        </div>
        <h1 className="navbar-logo">ADAH</h1>
        <div className="navbar-search">חיפוש 🔍</div>
      </nav>

      {/* תפריט קטגוריות */}
      <div className="navbar-categories">
        <Link to="/">בית</Link>
        <Link to="/cart">הסל שלי</Link>
        <Link to="/profile">הפרופיל שלי</Link>
        <Link to="/login">התחברות</Link>
        <Link to="/products">רשימת מוצרים</Link>
    
      </div>
    </div>
  );
}

export default Navbar;
