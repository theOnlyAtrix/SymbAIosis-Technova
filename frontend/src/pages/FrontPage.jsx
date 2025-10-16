// FrontPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function FrontPage() {
    const navigate = useNavigate();

    const handleCTA = () => {
        navigate("/login"); // redirect to login/signup
    };

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <section style={styles.heroSection}>
                <h1 style={styles.heroTitle}>Welcome to SymbAIosis</h1>
                <p style={styles.heroSubtitle}>
                    Connect companies. Exchange resources. Build sustainable collaborations.
                </p>
                <button style={styles.ctaButton} onClick={handleCTA}>
                    Get Started
                </button>
            </section>

            {/* Features Section */}
            <section style={styles.featuresSection}>
                <div style={styles.featureCard}>
                    <h3>Smart Matching</h3>
                    <p>Automatically find companies whose resources complement yours.</p>
                </div>
                <div style={styles.featureCard}>
                    <h3>Blueprint Generation</h3>
                    <p>Create actionable plans for collaborations and waste exchange.</p>
                </div>
                <div style={styles.featureCard}>
                    <h3>Visual Insights</h3>
                    <p>Explore interactive nodal maps to understand company networks.</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <p>&copy; {new Date().getFullYear()} symbAIosis. All rights reserved.</p>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(135deg, #8d068b, #6e4abf)",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    heroSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "80px 20px",
    },
    heroTitle: {
        fontSize: "3rem",
        fontWeight: "700",
        marginBottom: "20px",
        letterSpacing: "1px",
    },
    heroSubtitle: {
        fontSize: "1.25rem",
        marginBottom: "40px",
        maxWidth: "600px",
        lineHeight: "1.5",
    },
    ctaButton: {
        padding: "15px 30px",
        fontSize: "1rem",
        fontWeight: "600",
        borderRadius: "8px",
        border: "none",
        background: "#ff4dab", // subtle dark pink accent
        color: "#fff",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    featuresSection: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "30px",
        padding: "50px 20px",
    },
    featureCard: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "12px",
        padding: "20px",
        maxWidth: "250px",
        textAlign: "center",
        transition: "all 0.3s ease",
    },
    footer: {
        textAlign: "center",
        padding: "20px",
        fontSize: "0.9rem",
        borderTop: "1px solid rgba(255,255,255,0.2)",
    },
};