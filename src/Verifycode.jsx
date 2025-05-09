import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VerifyCode.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const VerifyCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [showResendMessage, setShowResendMessage] = useState(false);
    const inputRefs = useRef([]);
    const [errorMessage, setErrorMessage] = useState("");

    const email = location.state?.email || "";
    const isValidCode = code.every((digit) => digit.match(/\d/));

    const handleVerify = async () => {
        if (!isValidCode) {
            setErrorMessage("Please enter a valid 6-digit code.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://green-world-vert.vercel.app/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: code.join("") }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Code verified successfully!");
                navigate("/resetpassword", { state: { email } });
            } else {
                setErrorMessage(data.message || "Invalid code. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResending(true);

        try {
            const response = await fetch("https://green-world-vert.vercel.app/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }), // إرسال نفس الإيميل لإعادة إرسال الكود
            });

            const data = await response.json();

            if (response.ok) {
                setShowResendMessage(true);
                setTimeout(() => setShowResendMessage(false), 3000);
                toast.success("Code Resent Successfully! ✅");
            } else {
                setErrorMessage(data.message || "Failed to resend code. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
            <motion.div
                className="card p-4 shadow-lg position-relative"
                style={{ maxWidth: "500px", width: "90%", borderRadius: "15px" }}
                initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {showResendMessage && (
                    <motion.div
                        className="alert alert-success position-absolute top-0 end-0 mt-3 me-3 d-flex align-items-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5 }}
                        style={{ borderRadius: "10px", padding: "10px 15px", fontWeight: "bold" }}
                    >
                        ✅ Code Resent Successfully
                    </motion.div>
                )}

                <h3 className="text-center" style={{ color: "#2e7d32", fontWeight: "bold" }}>Forget Password?</h3>
                <p className="text-center" style={{ color: "#757575", fontSize: "1rem" }}>
                    Please enter the code that was sent to <strong>{email.substring(0, 1)}********@{email.split('@')[1]}</strong>
                </p>

                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

                <div className="d-flex justify-content-around mb-3">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            className="form-control text-center"
                            maxLength="1"
                            style={{ width: "3rem", height: "3rem", fontSize: "1.5rem" }}
                            value={digit}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => {
                                const newCode = [...code];
                                newCode[index] = e.target.value.replace(/\D/, "");
                                setCode(newCode);
                                if (e.target.value && index < 5) {
                                    inputRefs.current[index + 1]?.focus();
                                }

                                // التحقق من أن جميع الحقول ممتلئة
                                if (newCode.every((digit) => digit.match(/\d/)) && e.key === "Enter") {
                                    handleVerify();
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Backspace" && !code[index] && index > 0) {
                                    inputRefs.current[index - 1]?.focus();
                                }
                                
                                // التحقق من أن جميع الحقول ممتلئة
                                if (code.every((digit) => digit.match(/\d/)) && e.key === "Enter") {
                                    handleVerify();
                                }
                            }}
                        />
                    ))}
                </div>

                <button
                    className="btn btn-success w-100"
                    onClick={handleVerify}
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                <p className="text-center mt-3">
                    Don't receive the code?{" "}
                    <span
                        className="text-success fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={handleResendCode}
                    >
                        {resending ? "Resending Code..." : "Resend code"}
                    </span>
                </p>

                <ToastContainer />
            </motion.div>
        </div>
    );
};

export default VerifyCode;