import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css"; // ← קובץ CSS חדש

interface Product {
  id: string;
}

function AddProduct() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "",
      image: "",
      image2: "",
      image3: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("שם המוצר נדרש"),
      price: Yup.number().required("מחיר נדרש"),
      category: Yup.string().required("קטגוריה נדרשת"),
      image: Yup.string().url("קישור לתמונה לא תקין").required("תמונה נדרשת"),
      image2: Yup.string().url("קישור לתמונה לא תקין"),
      image3: Yup.string().url("קישור לתמונה לא תקין"),
      description: Yup.string().required("תיאור נדרש"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.get("http://localhost:3001/products");
        const products: Product[] = res.data;
        const lastId = Math.max(...products.map((p: Product) => parseInt(p.id) || 0), 0);
        const newId = (lastId + 1).toString();

        await axios.post("http://localhost:3001/products", {
          id: newId,
          ...values,
          price: Number(values.price),
          buyCount: 0,
        });
        alert("מוצר נוסף בהצלחה!");
        resetForm();
        navigate("/products");
      } catch (error) {
        alert("אירעה שגיאה בהוספת המוצר");
        console.error(error);
      }
    },
  });

  return (
    <div className="form-container">
      <h2 className="form-title">הוספת מוצר חדש</h2>
      <form onSubmit={formik.handleSubmit} className="product-form">
        {[
          { label: "שם המוצר", name: "name", type: "text" },
          { label: "מחיר", name: "price", type: "number" },
          { label: "קישור לתמונה ראשית", name: "image", type: "text" },
          { label: "תמונה נוספת 1", name: "image2", type: "text" },
          { label: "תמונה נוספת 2", name: "image3", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name} className="form-group">
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={formik.values[name as keyof typeof formik.values]}
              onChange={formik.handleChange}
              className="form-input"
            />
            {formik.touched[name as keyof typeof formik.touched] &&
              formik.errors[name as keyof typeof formik.errors] && (
                <div className="error-message">
                  {formik.errors[name as keyof typeof formik.errors]}
                </div>
              )}
          </div>
        ))}

        <div className="form-group">
          <label>קטגוריה:</label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            className="form-input"
          >
            <option value="">בחר קטגוריה</option>
            <option value="פנים">פנים</option>
            <option value="עיניים">עיניים</option>
            <option value="שפתיים">שפתיים</option>
            <option value="ציפורניים">ציפורניים</option>
            <option value="טיפוח">טיפוח</option>
            <option value="אקססוריז">אקססוריז</option>
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="error-message">{formik.errors.category}</div>
          )}
        </div>

        <div className="form-group">
          <label>תיאור:</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            className="form-input textarea"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="error-message">{formik.errors.description}</div>
          )}
        </div>

        <button type="submit" className="submit-button">הוסף מוצר</button>
      </form>
    </div>
  );
}

export default AddProduct;
