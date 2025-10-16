import React, { useEffect, useState } from "react";

export default function Blueprints({ currentCompany, targetCompany, onClose }) {
    const [blueprintText, setBlueprintText] = useState("Generating blueprint...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentCompany?.email || !targetCompany?.email) {
            setBlueprintText("Cannot generate blueprint: missing company data.");
            setLoading(false);
            return;
        }

        const generateBlueprint = async () => {
            try {
                const res = await fetch("http://localhost:5000/generateBlueprint", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        companyEmail: currentCompany.email,
                        targetCompanyEmail: targetCompany.email
                    }),
                });

                const data = await res.json();
                if (res.ok) setBlueprintText(data.blueprint);
                else setBlueprintText(`Failed: ${data.error}`);
            } catch (err) {
                setBlueprintText("Failed to generate blueprint");
            } finally {
                setLoading(false);
            }
        };

        generateBlueprint();
    }, [currentCompany, targetCompany]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto p-6 relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    X
                </button>
                <h3 className="text-xl font-semibold mb-4">
                    Blueprint for {targetCompany?.name || targetCompany?.email}
                </h3>
                <pre className="whitespace-pre-wrap">{loading ? "Loading..." : blueprintText}</pre>
            </div>
        </div>
    );
}