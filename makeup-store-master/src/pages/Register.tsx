// Register.tsx - דף הרשמה עם ולידציות וסיסמה חזקה
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("כתובת מייל לא תקינה")
        .required("שדה חובה"),
      password: Yup.string()
        .required("שדה חובה")
        .min(8, "לפחות 8 תווים")
        .matches(/[A-Z]/, "חייב להכיל אות גדולה")
        .matches(/[a-z]/, "חייב להכיל אות קטנה")
        .matches(/[0-9]/, "חייב להכיל מספר")
        .matches(/[@$!%*?&]/, "חייב להכיל תו מיוחד"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"),], "הסיסמאות לא תואמות")
        .required("אישור סיסמה חובה"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post("http://localhost:3001/users", {
          email: values.email,
          password: values.password,
        });

        setMessage("נרשמת בהצלחה! ניתן להתחבר כאן.");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setMessage("שגיאה ברישום, נסה שוב");
      }
    },
  });

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>הרשמה</h2>
      <form onSubmit={formik.handleSubmit}>
        <label>אימייל</label>
        <input
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          style={{ width: "100%", padding: 8 }}
        />
        {formik.touched.email && formik.errors.email && (
          <div style={{ color: "red" }}>{formik.errors.email}</div>
        )}

        <label>סיסמה</label>
        <input
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          style={{ width: "100%", padding: 8 }}
        />
        {formik.touched.password && formik.errors.password && (
          <div style={{ color: "red" }}>{formik.errors.password}</div>
        )}

        <label>אישור סיסמה</label>
        <input
          name="confirmPassword"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          style={{ width: "100%", padding: 8 }}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div style={{ color: "red" }}>{formik.errors.confirmPassword}</div>
        )}

        <button type="submit" style={{ marginTop: 10 }}>הרשמה</button>
      </form>
      {message && <div style={{ marginTop: 10, color: "green" }}>{message}</div>}
      <div style={{ marginTop: 10 }}>
        <Link to="/login">כבר רשומים? התחברו כאן</Link>
      </div>
    </div>
  );
};

export default Register;