import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/product/cartSlice";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("כתובת מייל לא תקינה").required("מייל חובה"),
      password: Yup.string().min(6, "לפחות 6 תווים").required("סיסמה חובה"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users?email=${encodeURIComponent(values.email)}&password=${encodeURIComponent(values.password)}`
        );

        if (response.data.length > 0) {
          dispatch(setUser(response.data[0]));
          setErrorMessage("");
          alert("התחברת בהצלחה!");
          navigate("/");
        } else {
          setErrorMessage("אימייל או סיסמה שגויים");
        }
      } catch (error) {
        console.error("שגיאת התחברות:", error);
        setErrorMessage("שגיאה בשרת, נסה שוב מאוחר יותר");
      }
    },
  });

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>כניסה למערכת</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>אימייל</label>
          <input
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            style={{ width: "100%", padding: 8 }}
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
            style={{ width: "100%", padding: 8 }}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          )}
        </div>

        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

        <button type="submit" style={{ marginTop: 10 }}>
          התחברות
        </button>

        <Link to="/register">
          <button type="button" style={{ marginTop: 10, marginRight: 10 }}>
            אין לך חשבון? להרשמה
          </button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
