import React, { useState } from 'react';

const CreateListingPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        size: '',
        age: '',
        gender: '',
        shelter: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would send the formData to your server/database
        console.log('Form submitted:', formData);
    };

    return (
        <div>
            <h1>Create a New Pet Listing</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Breed:
                    <input type="text" name="breed" value={formData.breed} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Size:
                    <input type="text" name="size" value={formData.size} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Age:
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Gender:
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
                <br />
                <label>
                    Shelter:
                    <input type="text" name="shelter" value={formData.shelter} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Description:
                    <textarea name="description" value={formData.description} onChange={handleChange} required />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateListingPage;