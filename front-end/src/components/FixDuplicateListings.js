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
    const deleteDuplicate = async (id) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`${apiUrl}/api/restaurants/duplicates/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
                    {duplicates.map((duplicate) => (
                        <div
                            key={duplicate.id}
                            className="border border-gray-400 p-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <h3 className="text-lg font-bold">{duplicate.name}</h3>
                                <p>
                                    Duplicates: <strong>{duplicate.duplicateCount}</strong>
                                </p>
                            </div>
                            <button
                                onClick={() => deleteDuplicate(duplicate.latestDuplicateId)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete Duplicate
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FixDuplicateListings;
