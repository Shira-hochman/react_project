import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("שם חובה"),
      email: Yup.string().email("כתובת מייל לא תקינה").required("מייל חובה"),
      password: Yup.string()
        .required("סיסמה חובה")
        .min(6, "לפחות 6 תווים")
        .matches(/[A-Z]/, "חייבת לכלול אות גדולה")
        .matches(/[a-z]/, "חייבת לכלול אות קטנה")
        .matches(/[0-9]/, "חייבת לכלול ספרה")
        .matches(/[@$!%*?&]/, "חייבת לכלול תו מיוחד"),
    }),
    onSubmit: async (values) => {
      try {
        // האם המשתמש כבר קיים?
        const existing = await axios.get(
          `http://localhost:3001/users?email=${encodeURIComponent(values.email)}`
        );

        if (existing.data.length > 0) {
          alert("משתמש כבר קיים במערכת");
          return;
        }

        await axios.post("http://localhost:3001/users", {
          ...values,
          isAdmin: false,
        });

        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error("שגיאה ביצירת משתמש", err);
        alert("שגיאה בשמירה, נסה שוב");
      }
    },
  });

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>הרשמה</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>שם מלא</label>
          <input
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div style={{ color: "red" }}>{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label>אימייל</label>
          <input
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div style={{ color: "red" }}>{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label>סיסמה</label>
          <input
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" style={{ marginTop: 10 }}>
          הרשמה
        </button>
      </form>

      {success && (
        <div style={{ color: "green", marginTop: 10 }}>
          ההרשמה הצליחה! תועברי למסך התחברות...
        </div>
      )}
    </div>
  );
};

export default Register;
