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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/admin/delete-listing/${id}`);
        setPets(pets.filter(pet => pet._id !== id)); // Remove the deleted pet from the list
        alert('Pet listing deleted successfully');
      } catch (err) {
        console.error('Error deleting pet listing:', err);
        alert('Failed to delete pet listing');
      }
    }
  };

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
            margin: 33vh auto 0;
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
            position: relative;
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

          .pet-card .edit-button, .pet-card .delete-button {
            margin-top: 10px;
            padding: 8px 15px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            position: absolute;
            bottom: 20px;
          }

          .pet-card .edit-button {
            background-color: #28a745;
            right: 120px;
          }

          .pet-card .edit-button:hover {
            background-color: #218838;
          }

          .pet-card .delete-button {
            background-color: #dc3545;
            right: 20px;
          }

          .pet-card .delete-button:hover {
            background-color: #c82333;
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
              <Link to={`/admin/edit-listing/${pet._id}`} className="edit-button">Edit</Link>
              <button onClick={() => handleDelete(pet._id)} className="delete-button">Delete</button>
            </div>
          ))
        ) : (
          <p>No pets found</p>
        )}
      </div>
      <Link to="/admin/create-listing">
        <button className="create-listing-button">Create New Listing</button>
      </Link>
    </div>
  );
};

export default ListingPage;