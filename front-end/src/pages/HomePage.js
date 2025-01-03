import React, { useState } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [filters, setFilters] = useState({
        cuisine: "",
        foodType: "",
        priceRange: "",
        rating: "",
    });

    const handleSearch = async () => {
        try {
            let response;
            if (/^\d{5}$/.test(searchQuery)) {
                // Hit the pincode API if input is a 5-digit pincode
                response = await fetch(`${apiUrl}/api/search/pincode/${searchQuery}`);
            } else {
                // Construct query parameters for regular search
                const queryParams = new URLSearchParams({
                    name: searchQuery,
                    cuisine: filters.cuisine,
                    foodType: filters.foodType,
                    priceRange: filters.priceRange,
                    averageRating: filters.rating,
                });
    
                // Hit the regular search API
                response = await fetch(`${apiUrl}/api/restaurants/search?${queryParams}`);
            }
    
            if (!response.ok) {
                throw new Error("Failed to fetch search results");
            }
    
            const results = await response.json();
            setSearchResults(results);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]); // Clear results on error
        }
    };
    

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    return (
        <div className="p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to MunchMap</h1>
            <p className="text-lg mb-8">
                Explore restaurants, manage listings, and provide feedback all in one place!
            </p>

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

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-4">
                <select name="cuisine" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Cuisine</option>
                    <option value="CHINESE">CHINESE</option>
                    <option value="ITALIAN">ITALIAN</option>
                    <option value="INDIAN">INDIAN</option>
                    <option value="MEXICAN">MEXICAN</option>
                    <option value="AMERICAN">AMERICAN</option>
                </select>
                <select name="foodType" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Food Type</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                </select>
                <select name="priceRange" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Price Range</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
                <select name="rating" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
            </div>

            <div>
                {searchResults.length > 0 ? (
                    <ul className="text-left max-w-md mx-auto">
                        {searchResults.map((restaurant) => (
                            <li key={restaurant.id} className="mb-4 border p-4 rounded">
                                <h3 className="text-lg font-bold">{restaurant.name}</h3>
                                {restaurant.address && <p className="text-gray-700">{restaurant.address}</p>}
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
