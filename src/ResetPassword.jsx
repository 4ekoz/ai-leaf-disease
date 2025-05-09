import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import styles from "./Login.module.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = location.state?.email || "";

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم ورمز خاص"
      )
      .required("كلمة المرور مطلوبة"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "كلمات المرور غير متطابقة")
      .required("تأكيد كلمة المرور مطلوب"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://green-world-vert.vercel.app/auth/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              newPassword: values.password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success("تم تغيير كلمة المرور بنجاح!");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast.error(data.message || "فشل تغيير كلمة المرور. الرجاء المحاولة مرة أخرى.");
        }
      } catch (error) {
        toast.error("حدث خطأ. الرجاء المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={styles.loginContainer}>
      <motion.div
        className={styles.loginBox}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h2 className={styles.loginTitle}>إعادة تعيين كلمة المرور</h2>
        <p className={styles.welcomeText}>أدخل كلمة المرور الجديدة</p>

        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="كلمة المرور الجديدة"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              autoComplete="new-password"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className={styles.inputIcon}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className={styles.errorText}>{formik.errors.password}</div>
          )}

          <div className={styles.inputGroup}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="تأكيد كلمة المرور"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              autoComplete="new-password"
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.inputIcon}
              style={{ cursor: "pointer" }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className={styles.errorText}>{formik.errors.confirmPassword}</div>
          )}

          <button
            type="submit"
            className={styles.btnLogin}
            disabled={loading}
          >
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </button>
        </form>
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}