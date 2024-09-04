import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function StaffPets({ userName }) {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "1.5rem" };
  const title = {
    fontSize: "1.5rem",
    fontWeight: "600",
    textTransform: "uppercase",
    margin: "20px 0",
  };
  const petName = {
    fontSize: "1.5rem",
    fontWeight: "600",
    textTransform: "uppercase",
  };
  const breedName = {
    fontSize: "1.2rem",
    fontWeight: "100",
    color: "grey",
  };
  const editDltBtn = {
    color: "#574e44",
    marginRight: "10px",
  };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
    marginRight: "10px",
  };

  const addBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#987554",
    borderRadius: "0.5rem",
    margin: "20px 0",
  };

  const adoptBtn = {
    fontSize: "0.8rem",
    fontWeight: "600",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
    margin: "20px 10px",
  };

  const saveBtn = {
    fontSize: "1rem",
    fontWeight: "600",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
  };

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPet, setEditingPet] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const fetchPets = async () => {
    if (userName) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/pet/staff/${userName}`
        );
        setPets(response.data);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setError("Failed to fetch pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPets();
  }, [userName]);

  const handleEditPet = (pet) => {
    setEditingPet(pet._id);
    setEditFormData({ ...pet });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleSaveEdit = (petId) => {
    const formData = new FormData();

    // Append all form data fields
    Object.keys(editFormData).forEach((key) => {
      if (editFormData[key]) {
        formData.append(key, editFormData[key]);
      }
    });

    // Append image if present
    if (image) {
      formData.append("image", image);
    }

    axios
      .put(`http://localhost:3001/pet/${petId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        // Reset state after successful update
        setEditingPet(null);
        setImage(null);
        setImagePreview("");
        setEditFormData({});

        // Fetch pets again to update the list
        fetchPets();
      })
      .catch((error) => {
        console.error("Failed to update pet:", error);
        setError("Failed to update pet. Please try again.");
      });
  };

  const handleDeletePet = (petId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (isConfirmed) {
      axios
        .delete(`http://localhost:3001/pet/${petId}`, {
          data: { uploadedBy: userName },
        })
        .then(() => {
          setPets(pets.filter((pet) => pet._id !== petId));
        })
        .catch((err) => {
          console.error("Failed to delete pet:", err);
          setError("Failed to delete pet. Please try again.");
        });
    }
  };

  const handleAddPet = () => {
    navigate("/add-pet");
  };

  const handleAdoptPet = (petId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this pet as adopted?"
    );

    if (isConfirmed) {
      axios
        .put(`http://localhost:3001/pet/adopt/${petId}`, { isAdopted: true })
        .then(() => {
          setPets(
            pets.map((pet) =>
              pet._id === petId ? { ...pet, isAdopted: true } : pet
            )
          );
        })
        .catch((err) => {
          console.error("Failed to mark pet as adopted:", err);
          setError("Failed to mark pet as adopted. Please try again.");
        });
    }
  };

  const truncateContent = (content, charLimit) => {
    if (content.length <= charLimit) return content;
    return content.slice(0, charLimit) + "...";
  };

  const adoptedPets = pets.filter((pet) => pet.isAdopted);
  const availablePets = pets.filter((pet) => !pet.isAdopted);

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography style={heading}>Your Pets</Typography>
        <Link to="/pets" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={buttonStyle}>
            View
          </Button>
        </Link>
      </Grid>
      <Divider style={{ margin: "1rem 0" }} />

      {error && <Typography color="error">{error}</Typography>}
      {availablePets.length === 0 && adoptedPets.length === 0 ? (
        <Typography>No pets uploaded yet.</Typography>
      ) : (
        <>
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography style={title}>Available Pets</Typography>
            <Button
              variant="contained"
              style={addBtn}
              onClick={handleAddPet}
              startIcon={<AddIcon />}
            >
              Add Pet
            </Button>
          </Grid>
          <Grid container spacing={2}>
            {availablePets.map((pet) => (
              <Grid item xs={12} md={6} key={pet._id}>
                <Paper style={{ padding: "1rem", marginBottom: "1rem" }}>
                  {pet.images && pet.images.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      {pet.images.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:3001/${image}`}
                          alt={`${pet.name} ${index}`}
                          style={{ maxWidth: "100%", objectFit: "cover" }}
                        />
                      ))}
                    </div>
                  )}
                  {editingPet === pet._id ? (
                    <Grid>
                      <Grid style={row}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          style={{ marginRight: "20px" }}
                          value={editFormData.name || ""}
                          onChange={handleEditChange}
                        />
                        <TextField
                          fullWidth
                          label="Breed"
                          name="breed"
                          value={editFormData.breed || ""}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid style={row}>
                        <TextField
                          fullWidth
                          label="Age"
                          name="age"
                          style={{ marginRight: "20px" }}
                          type="number"
                          value={editFormData.age || ""}
                          onChange={handleEditChange}
                        />
                        <TextField
                          fullWidth
                          label="Gender"
                          name="gender"
                          value={editFormData.gender || ""}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid style={row}>
                        <TextField
                          fullWidth
                          label="Shelter"
                          name="shelter"
                          value={editFormData.shelter || ""}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid style={row}>
                        <TextField
                          fullWidth
                          multiline
                          rows={10}
                          label="Description"
                          name="description"
                          value={editFormData.description || ""}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid style={row}>
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: "200px", marginTop: "10px" }}
                          />
                        )}
                      </Grid>
                      <Grid style={row}>
                        <Button
                          variant="contained"
                          style={addBtn}
                          component="label"
                        >
                          {image ? "Change Image" : "Upload Image"}
                          <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                          />
                        </Button>
                      </Grid>
                      <Grid style={row}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={saveBtn}
                          onClick={() => handleSaveEdit(pet._id)}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <Typography style={petName}>{pet.name}</Typography>
                      <Typography style={breedName}>{pet.breed}</Typography>
                      <Typography variant="subtitle1">
                        <strong>Age: </strong> {pet.age}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Gender: </strong> {pet.gender}
                      </Typography>
                      <Typography>
                        <strong>Description: </strong>{" "}
                        {truncateContent(pet.description, 150)}
                      </Typography>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <IconButton
                            variant="contained"
                            style={editDltBtn}
                            onClick={() => handleEditPet(pet)}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            variant="contained"
                            style={editDltBtn}
                            onClick={() => handleDeletePet(pet._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            style={adoptBtn}
                            onClick={() => handleAdoptPet(pet._id)}
                          >
                            Adopted
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Divider style={{ margin: "2rem 0" }} />
          {adoptedPets.length > 0 && (
            <>
              <Typography style={title}>Adopted Pets</Typography>
              <Grid container spacing={2}>
                {adoptedPets.map((pet) => (
                  <Grid item xs={12} md={6} key={pet._id}>
                    <Paper style={{ padding: "1rem", marginBottom: "1rem" }}>
                      {pet.images && pet.images.length > 0 && (
                        <div style={{ marginBottom: "1rem" }}>
                          {pet.images.map((image, index) => (
                            <img
                              key={index}
                              src={`http://localhost:3001/${image}`}
                              alt={`${pet.name} ${index}`}
                              style={{ maxWidth: "100%", objectFit: "cover" }}
                            />
                          ))}
                        </div>
                      )}
                      <Typography style={title}>{pet.name}</Typography>
                      <Typography style={breedName}>{pet.breed}</Typography>
                      <Typography variant="subtitle1">
                        <strong>Age: </strong> {pet.age}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Gender: </strong> {pet.gender}
                      </Typography>
                      <Typography>
                        <strong>Description: </strong>
                        {truncateContent(pet.description, 150)}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default StaffPets;
