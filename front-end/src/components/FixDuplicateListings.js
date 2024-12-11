import React, { useState, useEffect } from "react";
import axios from "axios";

const FixDuplicateListings = () => {
    const [duplicates, setDuplicates] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch duplicate restaurants
    const fetchDuplicates = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get(`${apiUrl}/api/restaurants/duplicates`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDuplicates(response.data);
        } catch (error) {
            console.error("Fetched Duplicates", error.response?.data || error.message);
            alert("Failed to load duplicate listings. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Handle deleting the latest duplicate
    const deleteDuplicate = async (name, address) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`${apiUrl}/api/restaurants/duplicates`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { name, address }
            });
            alert("Duplicate listing deleted successfully!");
            fetchDuplicates(); // Refresh the duplicates list
        } catch (error) {
            console.error("Error deleting duplicate:", error.response?.data || error.message);
            alert("Failed to delete the duplicate listing. Please try again.");
        }
    };

    useEffect(() => {
        fetchDuplicates();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">Fix Duplicate Listings</h1>

            {loading ? (
                <p>Loading duplicate listings...</p>
            ) : (
                <div className="space-y-4">
                    {loading ? (
                                    <p>Loading duplicate listings...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {Object.entries(duplicates).map(([key, group]) => (
                                            <div key={key} className="border border-gray-400 p-4 rounded">
                                                <h3 className="text-lg font-bold">
                                                    {group[0].name} ({group[0].address})
                                                </h3>
                                                <p>Duplicates Count: {group.length-1}</p>
                                                <button
                                                    onClick={() => deleteDuplicate(group[0].name, group[0].address)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                                                >
                                                    Remove Newest Duplicates
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                </div>
            )}
        </div>
    );
};

export default FixDuplicateListings;
