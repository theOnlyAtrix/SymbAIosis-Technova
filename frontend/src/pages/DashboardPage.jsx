import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Dashboard from "../components/Dashboard";
import { useNavigate } from "react-router-dom";
import {ReactFlowProvider} from "reactflow";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [currentCompany, setCurrentCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) setUser(firebaseUser);
            else navigate("/");
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchCompanies = async () => {
            if (!user) return;
            try {
                const snapshot = await getDocs(collection(db, "companies"));
                const companyList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setCompanies(companyList);
                const ownCompany = companyList.find((c) => c.email === user.email);
                setCurrentCompany(ownCompany || null);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCompanies();
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Redirecting...</p>;

    return (
        <ReactFlowProvider>
            <Dashboard
            user={user}
            companies={companies}
            currentCompany={currentCompany}
        />
        </ReactFlowProvider>

    );
}