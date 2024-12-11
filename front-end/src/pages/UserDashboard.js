import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const UserDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [filters, setFilters] = useState({
        cuisineType: "",
        foodType: "",
        priceLevel: "",
        averageRating: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch restaurants based on search and filters
    const handleSearch = async () => {
        setLoading(true);
    
        try {
            let response;
            if (/^\d{5}$/.test(searchQuery)) {
                // Hit the pincode API if input is a 5-digit pincode
                response = await fetch(`${apiUrl}/api/search/pincode/${searchQuery}`);
    
                if (!response.ok) {
                    throw new Error("Failed to fetch search results");
                }
    
                const data = await response.json();
                setSearchResults(data); // Set the results to the JSON response
            } else {
                // Construct query parameters
                const queryParams = new URLSearchParams({
                    name: searchQuery,
                    cuisineType: filters.cuisineType,
                    foodType: filters.foodType,
                    priceLevel: filters.priceLevel,
                    averageRating: filters.averageRating,
                });
    
                // Make API request
                response = await fetch(`${apiUrl}/api/restaurants/search?${queryParams}`);
    
                if (!response.ok) {
                    throw new Error("Failed to fetch search results");
                }
    
                const data = await response.json();
                setSearchResults(data); // Set the results
            }
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Navigate to restaurant details
    const openRestaurantDetails = (restaurant) => {
        navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } });
    };

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
    
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
    
            {/* Filters */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-4">
                <select name="cuisineType" className="border p-2" onChange={handleFilterChange}>
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
                <select name="priceLevel" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Price Range</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
                <select name="averageRating" className="border p-2" onChange={handleFilterChange}>
                    <option value="">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
            </div>
    
            {/* Restaurant List */}
            {loading ? (
                <p>Loading...</p>
            ) : searchResults.length > 0 ? (
                <ul className="text-left max-w-md mx-auto">
                    {searchResults.map((restaurant, index) => (
                        <li
                            key={index} // Use index for unique key as `id` might be missing for pincode API data
                            className="mb-4 border p-4 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                                restaurant.id ? openRestaurantDetails(restaurant) : null // Open details only if `id` is present
                            }
                        >
                            <h3 className="text-lg font-bold">{restaurant.name}</h3>
                            {restaurant.address && <p>Address: {restaurant.address}</p>}
                            {restaurant.cuisineType && <p>Cuisine Type: {restaurant.cuisineType}</p>}
                            {restaurant.foodType && <p>Food Type: {restaurant.foodType}</p>}
                            {restaurant.priceLevel && <p>Price Level: {restaurant.priceLevel}</p>}
                            {restaurant.averageRating && <p>Average Rating: {restaurant.averageRating}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found. Try a different search.</p>
            )}
        </div>
    );
};

export default UserDashboard;
