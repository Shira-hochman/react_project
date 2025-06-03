import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("כתובת מייל לא תקינה")
        .required("מייל חובה"),
      password: Yup.string()
        .min(6, "הסיסמה חייבת להיות לפחות 6 תווים")
        .required("סיסמה חובה"),
    }),
    onSubmit: async (values) => {
      try {        
        // קריאת GET לשרת עם מייל וסיסמה
       const response = await axios.get(
            `http://localhost:3001/users?email=${encodeURIComponent(values.email)}&password=${encodeURIComponent(values.password)}`
            //`
        );



        if (response.data.length > 0) {
          // משתמש נמצא - כניסה מוצלחת
          setErrorMessage("");
          alert("התחברת בהצלחה!");
          // כאן תוכלי לשמור את המשתמש ברידקס/לשלוח לדף הבית
        } else {
          // סיסמה או מייל לא נכונים
          setErrorMessage("אימייל או סיסמה שגויים");
        }
      } catch (error: any) {
  if (error.response) {
    // השרת החזיר תגובה עם שגיאה
    console.error("שגיאת שרת:", error.response.data);
  } else if (error.request) {
    // הבקשה יצאה אבל לא התקבלה תגובה
    console.error("אין תגובה מהשרת:", error.request);
  } else {
    // שגיאה בקוד
    console.error("שגיאה בהגדרת הבקשה:", error.message);
  }
  setErrorMessage("שם משתמש או סיסמה שגויים, נסה שוב");
}

    },
  });

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>כניסה למערכת</h2>
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">אימייל</label>
          <br />
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            style={{ width: "100%", padding: 8 }}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={{ color: "red" }}>{formik.errors.email}</div>
          ) : null}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">סיסמה</label>
          <br />
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            style={{ width: "100%", padding: 8 }}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          ) : null}
        </div>

        {errorMessage && <div style={{ color: "red", marginBottom: 12 }}>{errorMessage}</div>}

        <button type="submit" style={{ padding: "8px 16px" }}>
          התחבר
        </button>
        {/* <button type="button" style={{ padding: "8px 16px" }}> */}
          {/* הרשמה */}
        {/* </button> */}
        {/* <Link to="/Register" style={{ padding: "8px 16px" }}>להרשמה מחדש</Link> */}
        <Link to="/Register">
            <button style={{ padding: "8px 16px" }}>
                <p>הרשמה</p>
            </button>
        </Link>
      </form>
      
    </div>
  );
};

export default Login;
