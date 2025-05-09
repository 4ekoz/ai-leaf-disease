import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import styles from "./Login.module.css";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post("https://green-world-vert.vercel.app/auth/login", values);
                if (response.data.message === "login successfully") {
                    const token = response.data.token;
                    localStorage.setItem("token", token);
                    axios.defaults.headers.common["token"] = token;
                    toast.success("Login successful!");
                    setTimeout(() => navigate("/plant-check"), 1500);
                } else {
                    toast.error(response.data.message || "Invalid credentials");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Invalid credentials");
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
                <h2 className={styles.loginTitle}>Admin Login</h2>
                <p className={styles.welcomeText}>Welcome to the admin Detect Leaf Disease</p>

                <form onSubmit={formik.handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter admin email"
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

                    <div className={styles.inputGroup}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter admin password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            autoComplete="new-password"
                        />
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.inputIcon}
                            style={{ cursor: 'pointer' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <div className={styles.errorText}>{formik.errors.password}</div>
                    )}

                    <button
                        type="submit"
                        className={styles.btnLogin}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
            </motion.div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}