import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the list of restaurants from the backend
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL; // Retrieve API URL from .env
      const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage
      const response = await axios.get(`${apiUrl}/api/restaurants/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRestaurants(response.data); // Update state with fetched data
    } catch (error) {
      console.error("Fetched Restaurants:", error.response?.data || error.message);
      alert("Failed to load restaurants. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle restaurant deletion
  const deleteRestaurant = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL; // Retrieve API URL from .env
      const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage
      await axios.delete(`${apiUrl}/api/restaurants/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Restaurant deleted successfully!");
      // Remove the deleted restaurant from the list
      setRestaurants((prevRestaurants) =>
          prevRestaurants.filter((restaurant) => restaurant.id !== id)
      );
    } catch (error) {
      console.error("Error deleting restaurant:", error.response?.data || error.message);
      alert("Failed to delete the restaurant. Please try again.");
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>

        {loading ? (
            <p>Loading restaurants...</p>
        ) : (
            <table className="table-auto border-collapse border border-gray-400 w-full">
              <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Serial No.</th>
                <th className="border border-gray-400 px-4 py-2">Name</th>
                <th className="border border-gray-400 px-4 py-2">Address (with Pincode)</th>
                <th className="border border-gray-400 px-4 py-2">Actions</th>
              </tr>
              </thead>
              <tbody>
              {restaurants.map((restaurant, index) => (
                  <tr key={restaurant.id}>
                    <td className="border border-gray-400 px-4 py-2">{index + 1}</td> {/* Serial No. */}
                    <td className="border border-gray-400 px-4 py-2">{restaurant.name}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      {restaurant.address}, {restaurant.pincode}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      <button
                          onClick={() => deleteRestaurant(restaurant.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete Listing
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
};

export default AdminDashboard;
