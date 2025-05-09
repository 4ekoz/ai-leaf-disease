import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEnvelope } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import styles from "./Login.module.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
          "Please enter a valid email ending with @gmail.com"
        )
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://green-world-vert.vercel.app/auth/forget-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "Reset code sent successfully!");
          navigate("/verifycode", { state: { email: values.email } });
        } else {
          toast.error(data.message || "Failed to send reset code. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to send reset code. Please try again.");
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
        <h2 className={styles.loginTitle}>Forgot Password</h2>
        <p className={styles.welcomeText}>Enter your email to reset password</p>

        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              autoComplete="new-email"
            />
            <FaEnvelope className={styles.inputIcon} />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className={styles.errorText}>{formik.errors.email}</div>
          )}

          <button
            type="submit"
            className={styles.btnLogin}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <div className={styles.forgetPasswordContainer}>
          <Link to="/login" className={styles.forgetPasswordLink}>Back to Login</Link>
        </div>
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
