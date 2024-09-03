import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListingPage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ breed: [], size: [], gender: [] });
  const [allBreeds, setAllBreeds] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [allGenders, setAllGenders] = useState(['Male', 'Female', 'Unknown']);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getPets');
        setPets(response.data);
        setFilteredPets(response.data);

        // Extract unique breeds and sizes from the data
        const breeds = [...new Set(response.data.map(pet => pet.breed))];
        const sizes = [...new Set(response.data.map(pet => pet.size))];

        setAllBreeds(breeds);
        setAllSizes(sizes);
      } catch (err) {
        setError('Failed to fetch pets');
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const { breed, size, gender } = filters;
      let results = pets;

      if (breed.length > 0) {
        results = results.filter(pet => breed.includes(pet.breed));
      }

      if (size.length > 0) {
        results = results.filter(pet => size.includes(pet.size));
      }

      if (gender.length > 0) {
        results = results.filter(pet => gender.includes(pet.gender));
      }

      setFilteredPets(results);
    };

    applyFilters();
  }, [filters, pets]);

  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      } else {
        newFilters[category].push(value);
      }
      return newFilters;
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
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
      position: 'relative',
      minHeight: '80vh',
    },
    createListingButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '10px 20px',
      backgroundColor: '#f4e3d3',
      color: '#453a2f',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: '16px',
      zIndex: 1000,
    },
    petListings: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', // Three equal-width columns
      gap: '20px',
    },
    petCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      transition: 'transform 0.2s',
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
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
      marginBottom: '10px',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    filterContainer: {
      marginBottom: '20px',
      paddingTop: '60px',
    },
    dropdown: {
      position: 'relative',
      display: 'inline-block',
    },
    dropdownButton: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    dropdownContent: {
      display: dropdownOpen ? 'block' : 'none',
      position: 'absolute',
      backgroundColor: '#f9f9f9',
      minWidth: '240px',
      boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
      zIndex: 1,
      padding: '10px',
    },
    dropdownOption: {
      padding: '8px 10px',
      cursor: 'pointer',
    },
    checkbox: {
      marginRight: '10px',
    },
  };
  

  return (
    <div style={styles.listingPage}>
      <Link to="/admin/create-listing">
        <button style={styles.createListingButton}>Create New Listing</button>
      </Link>
      <h1>Pet Listings</h1>

      {/* Combined Filter Dropdown */}
      <div style={styles.filterContainer}>
        <div style={styles.dropdown}>
          <button onClick={toggleDropdown} style={styles.dropdownButton}>
            Filter Options
          </button>
          <div style={styles.dropdownContent}>
            {/* Breed Filters */}
            <div>
              <h4>Breed</h4>
              {allBreeds.map((breed, index) => (
                <div
                  key={index}
                  style={styles.dropdownOption}
                >
                  <input
                    type="checkbox"
                    id={`breed-${index}`}
                    style={styles.checkbox}
                    checked={filters.breed.includes(breed)}
                    onChange={() => handleFilterChange('breed', breed)}
                  />
                  <label htmlFor={`breed-${index}`}>{breed}</label>
                </div>
              ))}
            </div>

            {/* Size Filters */}
            <div>
              <h4>Size</h4>
              {allSizes.map((size, index) => (
                <div
                  key={index}
                  style={styles.dropdownOption}
                >
                  <input
                    type="checkbox"
                    id={`size-${index}`}
                    style={styles.checkbox}
                    checked={filters.size.includes(size)}
                    onChange={() => handleFilterChange('size', size)}
                  />
                  <label htmlFor={`size-${index}`}>{size}</label>
                </div>
              ))}
            </div>

            {/* Gender Filters */}
            <div>
              <h4>Gender</h4>
              {allGenders.map((gender, index) => (
                <div
                  key={index}
                  style={styles.dropdownOption}
                >
                  <input
                    type="checkbox"
                    id={`gender-${index}`}
                    style={styles.checkbox}
                    checked={filters.gender.includes(gender)}
                    onChange={() => handleFilterChange('gender', gender)}
                  />
                  <label htmlFor={`gender-${index}`}>{gender}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.petListings}>
        {filteredPets.length > 0 ? (
          filteredPets.map((pet, index) => (
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