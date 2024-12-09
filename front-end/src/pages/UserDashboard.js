import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = ({ listings }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(listings);
    const navigate = useNavigate();

    const handleSearch = () => {
        const filteredResults = listings.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    const openRestaurantDetails = (restaurant) => {
        navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } });
    };

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for restaurants..."
                    className="border p-2 mr-2 w-1/2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="bg-green-600 text-white p-2 rounded"
                >
                    Search
                </button>
            </div>
            <div>
                {searchResults.length > 0 ? (
                    <ul className="text-left max-w-md mx-auto">
                        {searchResults.map((restaurant) => (
                            <li
                                key={restaurant.id}
                                className="mb-4 border p-4 rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => openRestaurantDetails(restaurant)}
                            >
                                <h3 className="text-lg font-bold">{restaurant.name}</h3>
                                <p>Category: {restaurant.category}</p>
                                <p>Rating: {restaurant.rating}</p>
                                <div className="mt-2">
                                    {restaurant.photos && restaurant.photos.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {restaurant.photos.map((photo, index) => (
                                                <img
                                                    key={index}
                                                    src={photo}
                                                    alt={`Restaurant Photo ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No photos available.</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found. Try a different search.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
