import React, { useState } from "react";

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
        // Simulated search results for demonstration purposes
        const results = [
            { id: 1, name: "The Food Place", category: "Italian", rating: 4.5 },
            { id: 2, name: "Vegan Delight", category: "Vegan", rating: 4.0 },
        ];
        const filteredResults = results.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    return (
        <div className="p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to MunchMap</h1>
            <p className="text-lg mb-8">
                Explore restaurants, manage listings, and provide feedback all in one place!
            </p>

            {/* Search Bar */}
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

            {/* Search Results */}
            <div>
                {searchResults.length > 0 ? (
                    <ul className="text-left max-w-md mx-auto">
                        {searchResults.map((restaurant) => (
                            <li key={restaurant.id} className="mb-4 border p-4 rounded">
                                <h3 className="text-lg font-bold">{restaurant.name}</h3>
                                <p>Category: {restaurant.category}</p>
                                <p>Rating: {restaurant.rating}</p>
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

export default HomePage;
