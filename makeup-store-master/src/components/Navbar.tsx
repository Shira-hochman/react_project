import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>חנות האיפור שלי</h2>
      <div style={styles.links}>
        <Link to="/">בית</Link>
        <Link to="/cart">הסל שלי</Link>
        <Link to="/profile">הפרופיל שלי</Link>
        <Link to="/login">התחברות</Link>
        <Link to="/products">רשימת מוצרים</Link>
    
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f7c1e0",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "1rem",
  },
};

export default Navbar;
