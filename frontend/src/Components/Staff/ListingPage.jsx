import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '/src/PetCard.jsx';

const ListingPage = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        // Sample data, replace with API call to fetch pets from MongoDB
        const samplePets = [
            { name: 'Buddy', breed: 'Golden Retriever', size: 'Large', age: 3, gender: 'Male', shelter: 'Happy Tails Shelter', description: 'Friendly and playful dog.' },
            { name: 'Mittens', breed: 'Siamese', size: 'Small', age: 2, gender: 'Female', shelter: 'Cat Haven', description: 'Loves cuddles and naps.' }
        ];
        setPets(samplePets);
    }, []);

    return (
        <div>
            <h1>Pet Listings</h1>
            <div className="pet-listings">
                {pets.map((pet, index) => (
                    <PetCard key={index} pet={pet} />
                ))}
            </div>
            <Link to="/staff/create-listing">
                <button>Create New Listing</button>
            </Link>
        </div>
    );
};

export default ListingPage;