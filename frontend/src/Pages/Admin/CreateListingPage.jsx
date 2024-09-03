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

    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('breed', formData.breed);
        formDataObj.append('size', formData.size);
        formDataObj.append('age', formData.age);
        formDataObj.append('gender', formData.gender);
        formDataObj.append('shelter', formData.shelter);
        formDataObj.append('description', formData.description);

        for (let i = 0; i < images.length; i++) {
            formDataObj.append('images', images[i]);
        }
        
        axios
            .post("http://localhost:3001/admin/create-listing", formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((result) => {
                if (result.status === 201) {
                    navigate("/admin/listing-page");
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

    // Styles object
    const styles = {
        container: {
            maxWidth: '600px',
            margin: '50px auto',
            padding: '100px',
            backgroundColor: '#f9f9f9',
            borderRadius: '40px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'left',
        },
        heading: {
            textAlign: 'center',
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        label: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#444',
        },
        input: {
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginTop: '5px',
            width: '100%',
        },
        textarea: {
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginTop: '5px',
            width: '100%',
            resize: 'vertical',
            height: '100px',
        },
        button: {
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            alignSelf: 'center',
            width: '100%',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Create a New Pet Listing</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Breed:
                    <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Size:
                    <select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </label>
                <label style={styles.label}>
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Gender:
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>
                <label style={styles.label}>
                    Shelter:
                    <input
                        type="text"
                        name="shelter"
                        value={formData.shelter}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={styles.textarea}
                    />
                </label>
                <label style={styles.label}>
                    Images:
                    <input
                        type="file"
                        name="images"
                        onChange={handleImageChange}
                        multiple
                        required
                        style={styles.input}
                    />
                </label>
                <button type="submit" style={styles.button}>Submit</button>
            </form>
        </div>
    );
};

export default CreateListingPage;