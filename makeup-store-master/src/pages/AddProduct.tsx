import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>הוספת מוצר חדש</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>שם המוצר:</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.touched.name && formik.errors.name && (
            <div style={{ color: "red" }}>{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label>מחיר:</label>
          <input
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
          />
          {formik.touched.price && formik.errors.price && (
            <div style={{ color: "red" }}>{formik.errors.price}</div>
          )}
        </div>

        <div>
          <label>קטגוריה:</label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
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
            <div style={{ color: "red" }}>{formik.errors.category}</div>
          )}
        </div>

        <div>
          <label>קישור לתמונה ראשית:</label>
          <input
            type="text"
            name="image"
            value={formik.values.image}
            onChange={formik.handleChange}
          />
          {formik.touched.image && formik.errors.image && (
            <div style={{ color: "red" }}>{formik.errors.image}</div>
          )}
        </div>

        <div>
          <label>תמונה נוספת 1:</label>
          <input
            type="text"
            name="image2"
            value={formik.values.image2}
            onChange={formik.handleChange}
          />
        </div>

        <div>
          <label>תמונה נוספת 2:</label>
          <input
            type="text"
            name="image3"
            value={formik.values.image3}
            onChange={formik.handleChange}
          />
        </div>

        <div>
          <label>תיאור:</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
          {formik.touched.description && formik.errors.description && (
            <div style={{ color: "red" }}>{formik.errors.description}</div>
          )}
        </div>

        <button type="submit">הוסף מוצר</button>
      </form>
    </div>
  );
}

export default AddProduct;
