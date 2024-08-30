import React from 'react';

const PetCard = ({ pet }) => {
    return (
        <div className="pet-card">
            <h2>{pet.name}</h2>
            <p><strong>Breed:</strong> {pet.breed}</p>
            <p><strong>Size:</strong> {pet.size}</p>
            <p><strong>Age:</strong> {pet.age} years</p>
            <p><strong>Gender:</strong> {pet.gender}</p>
            <p><strong>Shelter:</strong> {pet.shelter}</p>
            <p><strong>Description:</strong> {pet.description}</p>
        </div>
    );
};

export default PetCard;