// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import "../index.css";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import NodalGraph from "./NodalGraph";

const Dashboard = ({ user }) => {
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [currentUserCompany, setCurrentUserCompany] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [blueprint, setBlueprint] = useState("");

    useEffect(() => {
        if (user) setCurrentUserEmail(user.email);
    }, [user]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const snapshot = await getDocs(collection(db, "companies"));
                const companyList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setCompanies(companyList);

                const ownCompany = companyList.find((c) => c.email === currentUserEmail);
                setCurrentUserCompany(ownCompany || null);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setError("Failed to load companies.");
            }
        };

        if (currentUserEmail) fetchCompanies();
    }, [currentUserEmail]);

    const hasCorrelation = (companyA, companyB) => {
        if (!companyA || !companyB) return false;

        const aProduces = Array.isArray(companyA.produces) ? companyA.produces : [];
        const aNeeds = Array.isArray(companyA.needs) ? companyA.needs : [];
        const bProduces = Array.isArray(companyB.produces) ? companyB.produces : [];
        const bNeeds = Array.isArray(companyB.needs) ? companyB.needs : [];

        return aProduces.some((item) => bNeeds.includes(item)) || bProduces.some((item) => aNeeds.includes(item));
    };

    const handleGenerateBlueprint = async (targetCompany) => {
        if (!currentUserCompany || !targetCompany) {
            setError("Missing company information.");
            return;
        }

        setLoading(true);
        setError("");
        setBlueprint("");

        try {
            const response = await fetch("/api/generateBlueprint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: targetCompany.name || targetCompany.email.split("@")[0],
                    description: `Collaboration between ${currentUserCompany.name} and ${targetCompany.name}`,
                    goals: `Exchange waste and resources between ${currentUserCompany.name} and ${targetCompany.name}`,
                    companyEmails: [currentUserCompany.email, targetCompany.email],
                }),
            });

            const data = await response.json();

            if (!response.ok) setError(data.error || "Failed to generate blueprint.");
            else if (data.blueprint) setBlueprint(data.blueprint);
            else setError("Blueprint generation failed: No content returned.");
        } catch (err) {
            console.error("Error generating blueprint:", err);
            setError("Network or server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUserEmail) return <p>Please sign in to view dashboard.</p>;

    return (
        <div className="dashboard-container" style={{ padding: "20px" }}>
            <style>{`
                .dashboard-container {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #8d068b, #6e4ab0);
                    color: #fff;
                    min-height: 100vh;
                }

                .dashboard-container h1 {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 2.5rem;
                    color: #ff66b3;
                    text-shadow: 0 0 10px rgba(255, 51, 153, 0.6);
                }

                .dashboard-nodal h2 {
                    text-align: center;
                    margin-bottom: 15px;
                    color: #ffd6f5;
                }

                .company-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(6px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }

                .company-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 20px rgba(255, 51, 153, 0.3);
                }

                .company-card h3 {
                    color: #ff66b3;
                }

                .company-card p {
                    color: #000000;
                }

                .enabled {
                    background-color: #ff3399 !important;
                    transition: all 0.3s ease;
                }

                .enabled:hover:enabled {
                    background-color: #ff66b3 !important;
                    transform: scale(1.05);
                }

                .blueprint-box {
                    background-color: rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    box-shadow: 0 0 10px rgba(255, 51, 153, 0.2);
                }

                @media (max-width: 768px) {
                    .dashboard-container {
                        padding: 10px;
                    }

                    .company-card {
                        width: 100%;
                    }

                    .dashboard-container h1 {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <h1>Dashboard</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="dashboard-nodal" style={{ marginTop: "30px" }}>
                <h2>Company Nodal Map</h2>
                <div style={{ width: "100%", height: "80vh" }}>
                    <NodalGraph companies={companies} currentUserEmail={currentUserEmail} />
                </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "30px" }}>
                {companies
                    .filter((c) => c.email !== currentUserEmail)
                    .map((company) => {
                        const enabled = hasCorrelation(currentUserCompany, company);
                        return (
                            <div
                                className="company-card"
                                key={company.id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    width: "250px",
                                    backgroundColor: enabled ? "#fff" : "#f5f5f5",
                                }}
                            >
                                <h3>{company.name}</h3>
                                <p>Email: {company.email}</p>
                                <button
                                    onClick={() => handleGenerateBlueprint(company)}
                                    disabled={loading || !enabled}
                                    className="enabled"
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "5px",
                                        backgroundColor: enabled ? "#4caf50" : "#999",
                                        color: "#fff",
                                        border: "none",
                                        cursor: loading || !enabled ? "not-allowed" : "pointer",
                                        opacity: loading || !enabled ? 0.5 : 1,
                                    }}
                                >
                                    {loading ? "Generating..." : "Generate Blueprint"}
                                </button>
                                {!enabled && (
                                    <p style={{ fontSize: "12px", color: "#555" }}>
                                        No matching resources/waste to exchange.
                                    </p>
                                )}
                            </div>
                        );
                    })}
            </div>

            {blueprint && (
                <div
                    className="blueprint-box"
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        border: "1px solid #aaa",
                        borderRadius: "10px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        backgroundColor: "#f9f9f9",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    <h2>Generated Blueprint</h2>
                    <pre>{blueprint}</pre>
                </div>
            )}
        </div>
    );
};

export default Dashboard;