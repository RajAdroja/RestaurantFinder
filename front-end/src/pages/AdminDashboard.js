import React, { useState } from "react";

function AdminDashboard({ listings }) {
  const [restaurants, setRestaurants] = useState(listings);

  const handleResolveDuplicate = (id) => {
    const updatedRestaurants = restaurants.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, duplicate: false } : restaurant
    );
    setRestaurants(updatedRestaurants);
  };

  const handleRemoveListing = (id) => {
    const filteredRestaurants = restaurants.filter(
        (restaurant) => restaurant.id !== id
    );
    setRestaurants(filteredRestaurants);
  };

  return (
      <div className="p-6">
        <ul>
          {restaurants.map((restaurant) => (
              <li key={restaurant.id} className="mb-2">
                <div className="border p-4 rounded">
                  <h3 className="text-lg font-bold">{restaurant.name}</h3>
                  {restaurant.duplicate ? (
                      <p className="text-red-500">Duplicate Entry</p>
                  ) : (
                      <p className="text-green-500">No Issues</p>
                  )}
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
                  <button
                      onClick={() => handleResolveDuplicate(restaurant.id)}
                      className="bg-yellow-500 text-white p-2 mr-2 rounded"
                  >
                    Resolve Duplicate
                  </button>
                  <button
                      onClick={() => handleRemoveListing(restaurant.id)}
                      className="bg-red-500 text-white p-2 rounded"
                  >
                    Remove Listing
                  </button>
                </div>
              </li>
          ))}
        </ul>
      </div>
  );
}

export default AdminDashboard;
