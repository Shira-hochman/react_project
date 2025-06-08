import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CheckOutPage = () => {
  const cartItems: CartItem[] = useSelector((state: RootState) => state.cart.items);
  const [form, setForm] = useState({
    fullName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const total = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // ניקוי שגיאה בזמן הקלדה
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    };

    if (!form.fullName.trim().includes(" ")) {
      newErrors.fullName = "יש להזין שם מלא (לפחות שם פרטי ושם משפחה)";
    }

    if (!/^\d{16}$/.test(form.cardNumber)) {
      newErrors.cardNumber = "מספר הכרטיס חייב להכיל 16 ספרות";
    }

    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = "תוקף חייב להיות בפורמט MM/YY";
    } else {
      const [mm, yy] = form.expiry.split("/").map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;
      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        newErrors.expiry = "תוקף הכרטיס פג";
      }
    }

    if (!/^\d{3}$/.test(form.cvv)) {
      newErrors.cvv = "CVV חייב להכיל 3 ספרות";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((val) => val === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      // כאן אפשר להוסיף שליחת נתונים לשרת
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold">לתשלום</h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-warning text-center">
          העגלה ריקה. <Link to="/">חזרה לחנות</Link>
        </div>
      ) : submitted ? (
        <div className="alert alert-success text-center">
          ✅ התשלום עבר בהצלחה! תודה על הרכישה.
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit} className="shadow p-4 rounded-4">
              <h5 className="mb-3">פרטי אשראי</h5>

              <div className="mb-3">
                <label className="form-label">שם מלא</label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-control ${errors.fullName && "is-invalid"}`}
                  value={form.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">מספר כרטיס</label>
                <input
                  type="text"
                  name="cardNumber"
                  maxLength={16}
                  className={`form-control ${errors.cardNumber && "is-invalid"}`}
                  value={form.cardNumber}
                  onChange={handleChange}
                />
                {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
              </div>

              <div className="mb-3 row">
                <div className="col">
                  <label className="form-label">תוקף</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    className={`form-control ${errors.expiry && "is-invalid"}`}
                    value={form.expiry}
                    onChange={handleChange}
                  />
                  {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
                </div>
                <div className="col">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    maxLength={3}
                    className={`form-control ${errors.cvv && "is-invalid"}`}
                    value={form.cvv}
                    onChange={handleChange}
                  />
                  {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                </div>
              </div>

              <h5 className="mt-4 mb-3">סיכום הזמנה</h5>
              <ul className="list-group mb-3">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {item.name} × {item.quantity}
                    <span>₪ {item.price * item.quantity}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between fw-bold">
                  סה"כ:
                  <span>₪ {total.toFixed(2)}</span>
                </li>
              </ul>

              <button type="submit" className="btn btn-success w-100 rounded-pill mt-3">
                שלם עכשיו
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutPage;
