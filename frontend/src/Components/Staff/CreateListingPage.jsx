import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const CreateListingPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        size: 'small',
        age: '',
        gender: 'male',
        shelter: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, breed, size, age, gender, shelter, description } = formData;
        
        console.log("gender is" ,name, breed, size, age, gender, shelter, description);
        axios
            .post("http://localhost:3001/admin/create-listing", { name, breed, size, age, gender, shelter, description })
            .then((result) => {
            if (result.status == 201) {
                console.log('Form submitted:', formData);
                navigate("/staff/listing-page");
            }
            })
            .catch((err) => {
            if (err.response && err.response.status === 400) {
                window.alert("Please check input fields again");
            } else {
                console.log(err);
            }
            });
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
                    <select name="size" value={formData.size} onChange={handleChange} required>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
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
                        <option value="male">Male</option>
                        <option value="female">Female</option>
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