// LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Signed in as:", result.user.email);
            navigate("/dashboard");
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h2 style={styles.title}>Welcome Back to symbAIosis</h2>
                <p style={styles.subtitle}>
                    Sign in to manage your company’s collaborations and explore the network.
                </p>
                <button style={styles.googleButton} onClick={handleGoogleSignIn}>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #8d068b, #6e4abf)",
        fontFamily: "'Poppins', sans-serif",
    },
    loginBox: {
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255,255,255,0.2)",
        padding: "50px 30px",
        borderRadius: "12px",
        maxWidth: "400px",
        width: "90%",
        textAlign: "center",
        boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "700",
        color: "#fff",
        marginBottom: "15px",
    },
    subtitle: {
        fontSize: "1rem",
        color: "#eee",
        marginBottom: "30px",
    },
    googleButton: {
        background: "#ff4dab", // dark pink accent
        color: "#fff",
        border: "none",
        padding: "12px 25px",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
};