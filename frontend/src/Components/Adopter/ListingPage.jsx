import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListingPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getPets');
        setPets(response.data);
      } catch (err) {
        setError('Failed to fetch pets');
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="listing-page">
      <style>
        {`
          .listing-page {
            padding: 20px;
            max-width: 1200px;
            margin: 33vh;
          }

          .pet-listings {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: flex-start;
          }

          .pet-card {
             background-color: #ffffff;
             border-radius: 8px;
             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
             padding: 20px;
             transition: transform 0.2s;
             flex: 1 1 calc(33% - 20px); 
             box-sizing: border-box;
          }

          .pet-card:hover {
            transform: translateY(-5px);
          }

          .pet-card h2 {
            margin-top: 0;
            color: #333333;
          }

          .pet-card p {
            margin: 5px 0;
            color: #666666;
          }

          .create-listing-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-size: 16px;
          }

          .create-listing-button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
      <h1>Pet Listings</h1>
      <div className="pet-listings">
        {pets.length > 0 ? (
          pets.map((pet, index) => (
            <div key={index} className="pet-card">
              <h2>{pet.name}</h2>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Size:</strong> {pet.size}</p>
              <p><strong>Age:</strong> {pet.age}</p>
              <p><strong>Gender:</strong> {pet.gender}</p>
              <p><strong>Shelter:</strong> {pet.shelter}</p>
              <p><strong>Description:</strong> {pet.description}</p>
            </div>
          ))
        ) : (
          <p>No pets found</p>
        )}
      </div>
    </div>
  );
};

export default ListingPage;