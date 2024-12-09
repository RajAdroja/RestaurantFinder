import React, { useState } from "react";

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [filters, setFilters] = useState({
        cuisine: "",
        foodType: "",
        priceRange: "",
        rating: "",
    });

    const handleSearch = () => {
        // Simulated search results for demonstration purposes
        const results = [
            { id: 1, name: "The Food Place", category: "Italian", rating: 4.5 },
            { id: 2, name: "Vegan Delight", category: "Vegan", rating: 4.0 },
        ];
        const filteredResults = results.filter((restaurant) => {
            return (
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (filters.cuisine ? restaurant.category === filters.cuisine : true) &&
                (filters.foodType ? restaurant.foodType === filters.foodType : true) &&
                (filters.priceRange ? restaurant.price === filters.priceRange : true) &&
                (filters.rating ? Math.floor(restaurant.rating) >= parseInt(filters.rating) : true)
            );
        });
        setSearchResults(filteredResults);
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

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-4">
                <select name="cuisine" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Indian">Indian</option>
                </select>
                <select name="foodType" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Food Type</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
                <select name="priceRange" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Price Range</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
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


            {/* Search Results */}
            <div>
                {searchResults.length > 0 ? (
                    <ul className="text-left max-w-md mx-auto">
                        {searchResults.map((restaurant) => (
                            <li key={restaurant.id} className="mb-4 border p-4 rounded">
                                <h3 className="text-lg font-bold">{restaurant.name}</h3>
                                <p>Category: {restaurant.category}</p>
                                <p>Rating: {restaurant.rating}</p>
                                <p>Price: {restaurant.price}</p>
                                <p>Food Type: {restaurant.foodType}</p>
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
