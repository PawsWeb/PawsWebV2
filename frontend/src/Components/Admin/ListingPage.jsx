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

  // Define inline styles
  const styles = {
    listingPage: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '33vh auto',
    },
    createListingButton: {
      position: 'absolute',
      top: '120px',
      right: '60px',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: '16px',
    },
    createListingButtonHover: {
      backgroundColor: '#0056b3',
    },
    petListings: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'flex-start',
    },
    petCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      transition: 'transform 0.2s',
      flex: '1 1 calc(33% - 20px)',
      boxSizing: 'border-box',
      position: 'relative',
    },
    petCardHover: {
      transform: 'translateY(-5px)',
    },
    petCardTitle: {
      marginTop: '0',
      color: '#333333',
    },
    petCardText: {
      margin: '5px 0',
      color: '#666666',
    },
    imageContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '10px',
    },
    image: {
      width: '200px',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    editButton: {
      marginTop: '10px',
      padding: '8px 15px',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: '14px',
      position: 'flex',
      bottom: '20px',
      backgroundColor: '#28a745',
      right: '120px',
    },
    editButtonHover: {
      backgroundColor: '#218838',
    },
    deleteButton: {
      marginTop: '10px',
      padding: '8px 15px',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: '14px',
      position: 'flex',
      bottom: '20px',
      backgroundColor: '#dc3545',
      right: '20px',
    },
    deleteButtonHover: {
      backgroundColor: '#c82333',
    },

  };

  return (
    <div style={styles.listingPage}>
      <Link to="/admin/create-listing">
        <button style={styles.createListingButton}>Create New Listing</button>
      </Link>
      <h1>Pet Listings</h1>
      <div style={styles.petListings}>
        {pets.length > 0 ? (
          pets.map((pet, index) => (
            <div key={index} style={styles.petCard}>
              <div style={styles.imageContainer}>
                {pet.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3001/backend/uploads/${image}`}
                    alt={pet.name}
                    style={styles.image}
                  />
                ))}
              </div>
              <h2 style={styles.petCardTitle}>{pet.name}</h2>
              <p style={styles.petCardText}><strong>Breed:</strong> {pet.breed}</p>
              <p style={styles.petCardText}><strong>Size:</strong> {pet.size}</p>
              <p style={styles.petCardText}><strong>Age:</strong> {pet.age}</p>
              <p style={styles.petCardText}><strong>Gender:</strong> {pet.gender}</p>
              <p style={styles.petCardText}><strong>Shelter:</strong> {pet.shelter}</p>
              <p style={styles.petCardText}><strong>Description:</strong> {pet.description}</p>
              <Link
                to={`/admin/edit-listing/${pet._id}`}
                style={styles.editButton}
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(pet._id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
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