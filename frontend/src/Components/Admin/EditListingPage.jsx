import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditListingPage = () => {
    const { id } = useParams(); // Get the pet ID from the URL
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        size: 'small',
        age: '',
        gender: 'male',
        shelter: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/getPet/${id}`, { withCredentials: true });
                setFormData(response.data);
            } catch (err) {
                setError('Failed to fetch pet data');
                console.error('Error fetching pet data:', err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPet();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put(`http://localhost:3001/admin/edit-listing/${id}`, formData)
            .then((result) => {
                if (result.status === 200) {
                    console.log('Pet listing updated:', formData);
                    navigate('/admin/listing-page');
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    window.alert("Please check input fields again");
                } else {
                    console.error('Error updating pet listing:', err);
                }
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="edit-listing-page">
            <style>
                {`
                    .edit-listing-page {
                        padding: 20px;
                        max-width: 600px;
                        margin: 33vh auto 0;
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }

                    h1 {
                        text-align: center;
                        color: #333333;
                    }

                    form {
                        display: flex;
                        flex-direction: column;
                    }

                    label {
                        margin-top: 15px;
                        font-weight: bold;
                        color: #555555;
                    }

                    input, select, textarea {
                        padding: 10px;
                        margin-top: 5px;
                        border: 1px solid #cccccc;
                        border-radius: 4px;
                        font-size: 14px;
                    }

                    button {
                        margin-top: 20px;
                        padding: 10px;
                        background-color: #28a745;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    }

                    button:hover {
                        background-color: #218838;
                    }

                    .back-link {
                        display: inline-block;
                        margin-top: 20px;
                        text-decoration: none;
                        color: #007bff;
                        font-size: 16px;
                    }

                    .back-link:hover {
                        text-decoration: underline;
                    }
                `}
            </style>

            <h1>Edit Pet Listing</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Breed:
                    <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Size:
                    <select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        required
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </label>
                <label>
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Gender:
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>
                <label>
                    Shelter:
                    <input
                        type="text"
                        name="shelter"
                        value={formData.shelter}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Update Listing</button>
            </form>
            <Link to="/admin/listing-page" className="back-link">Back to Listings</Link>
        </div>
    );
};

export default EditListingPage;