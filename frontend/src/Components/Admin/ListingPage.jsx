import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '/src/PetCard.jsx';
import axios from 'axios'; // Import axios for making HTTP requests

const ListingPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/getPets'); // Make an API call
        setPets(response.data); // Set the retrieved pets to state
      } catch (err) {
        setError('Failed to fetch pets');
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Display error if fetching fails
  }

  return (
    <div>
      <h1>Pet Listings</h1>
      <div className="pet-listings">
        {pets.length > 0 ? (
          pets.map((pet, index) => (
            <PetCard key={index} pet={pet} />
          ))
        ) : (
          <p>No pets found</p> // Message if no pets are available
        )}
      </div>
      <Link to="/admin/create-listing">
        <button>Create New Listing</button>
      </Link>
    </div>
  );
};

export default ListingPage;
