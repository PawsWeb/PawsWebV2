import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

import {
  Container,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Pets() {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const title = {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
  };

  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
    color: "white",
  };

  const likeBtn = {
    color: "#b99976",
    marginTop: "20px",
  };

  const subtitle = {
    color: "grey",
    fontSize: "0.9rem",
    fontWeight: "100",
    marginTop: "10px",
    marginBottom: "40px",
  };

  const backBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
    color: "white",
    margin: "20px 0",
  };

  const { userRole, userName } = useContext(UserContext);

  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ breed: [], size: [], gender: [] });
  const [allBreeds, setAllBreeds] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [allGenders, setAllGenders] = useState(["Male", "Female"]);
  const [selectedPet, setSelectedPet] = useState(null); // New state for selected pet
  const [likedPets, setLikedPets] = useState(new Set()); // State to track liked pets

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:3001/pet");
        setPets(response.data);

        const breeds = [...new Set(response.data.map((pet) => pet.breed))];
        const sizes = [...new Set(response.data.map((pet) => pet.size))];

        setAllBreeds(breeds);
        setAllSizes(sizes);

        // Initially filter pets and sort to push adopted pets to the end
        filterAndSortPets(response.data);
      } catch (err) {
        setError("Failed to fetch pets");
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  useEffect(() => {
    filterAndSortPets(pets);
  }, [filters, pets]);

  useEffect(() => {
    const fetchLikedPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/pet/liked-pets/${userName}`
        );
        const likedPetsFromServer = new Set(
          response.data.map((pet) => pet._id)
        );
        setLikedPets(likedPetsFromServer);
      } catch (err) {
        console.error("Error fetching liked pets:", err);
      }
    };

    fetchLikedPets();
  }, [userName]);

  const filterAndSortPets = (petsData) => {
    const { breed, size, gender } = filters;
    let results = petsData;

    if (breed.length > 0) {
      results = results.filter((pet) => breed.includes(pet.breed));
    }

    if (size.length > 0) {
      results = results.filter((pet) => size.includes(pet.size));
    }

    if (gender.length > 0) {
      results = results.filter((pet) => gender.includes(pet.gender));
    }

    // Sort: push adopted pets to the end
    results.sort((a, b) => (a.isAdopted ? 1 : -1));

    setFilteredPets(results);
  };

  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(
          (item) => item !== value
        );
      } else {
        newFilters[category].push(value);
      }
      return newFilters;
    });
  };

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
  };

  const handleBackToPets = () => {
    setSelectedPet(null);
  };

  const handleLikeToggle = async (petId) => {
    try {
      const action = likedPets.has(petId) ? "unlike" : "like";
      await axios.post(
        `http://localhost:3001/pet/${action}/${userName}/${petId}`
      );

      setLikedPets((prevLikedPets) => {
        const updatedLikes = new Set(prevLikedPets);
        if (updatedLikes.has(petId)) {
          updatedLikes.delete(petId);
        } else {
          updatedLikes.add(petId);
        }
        return updatedLikes;
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const truncateContent = (content, charLimit) => {
    if (content.length <= charLimit) return content;
    return content.slice(0, charLimit) + "...";
  };

  if (loading) {
    return (
      <Container style={{ textAlign: "center", paddingTop: "5rem" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ textAlign: "center", paddingTop: "5rem" }}>
        {error}
      </Container>
    );
  }

  if (selectedPet) {
    return (
      <Container style={{ paddingTop: "5rem", width: "80%" }}>
        <Button onClick={handleBackToPets} style={backBtn}>
          Back
        </Button>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper
              style={{
                padding: "1rem",
                textAlign: "center",
                height: "auto",
                overflow: "auto",
                position: "relative",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                {selectedPet.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:3001/${image}`}
                    alt={selectedPet.name}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
              {selectedPet.isAdopted && (
                <Typography
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    position: "center",
                    margin: "10px 0",
                  }}
                >
                  Adopted
                </Typography>
              )}
              <Typography
                variant="h6"
                style={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {selectedPet.name}
              </Typography>
              <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
              <Grid textAlign={"left"}>
                <Typography variant="body1">
                  <strong>Breed:</strong> {selectedPet.breed}
                </Typography>
                <Typography variant="body1">
                  <strong>Size:</strong> {selectedPet.size}
                </Typography>
                <Typography variant="body1">
                  <strong>Age:</strong> {selectedPet.age}
                </Typography>
                <Typography variant="body1">
                  <strong>Gender:</strong> {selectedPet.gender}
                </Typography>
                <Typography variant="body1">
                  <strong>Shelter:</strong> {selectedPet.shelter}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {selectedPet.description}
                </Typography>
                {userRole === "adopter" && (
                  <IconButton
                    onClick={() => handleLikeToggle(selectedPet._id)}
                    style={likeBtn}
                  >
                    {likedPets.has(selectedPet._id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography style={heading}>Our Pets</Typography>
        </Grid>
        {userRole === "adopter" && (
          <Grid item>
            <Link to="/adopter/liked-pets" style={{ textDecoration: "none" }}>
              <IconButton variant="contained" style={buttonStyle}>
                <FavoriteIcon />
              </IconButton>
            </Link>
          </Grid>
        )}

        {userRole === "staff" && (
          <Grid item>
            <Link to="/staff/pets" style={{ textDecoration: "none" }}>
              <Button variant="contained" style={buttonStyle}>
                Your Pets
              </Button>
            </Link>
          </Grid>
        )}

        {userRole === "admin" && (
          <Grid item>
            <Link to="/admin/pets" style={{ textDecoration: "none" }}>
              <Button variant="contained" style={buttonStyle}>
                Pets Dashboard
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
      <Typography style={subtitle}>
        Click on the Pet's Image for more details
      </Typography>
      <Divider style={{ margin: "2rem 0" }} />

      {/* Filter Section */}
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <Typography style={title}>Filter Pets</Typography>
        <Divider style={{ marginTop: "-1rem", marginBottom: "1rem" }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormGroup>
              <Typography style={{ fontWeight: "bold" }}>Breed</Typography>
              {allBreeds.map((breed, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={filters.breed.includes(breed)}
                      onChange={() => handleFilterChange("breed", breed)}
                    />
                  }
                  label={breed}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormGroup>
              <Typography style={{ fontWeight: "bold" }}>Size</Typography>
              {allSizes.map((size, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={filters.size.includes(size)}
                      onChange={() => handleFilterChange("size", size)}
                    />
                  }
                  label={size}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormGroup>
              <Typography style={{ fontWeight: "bold" }}>Gender</Typography>
              {allGenders.map((gender, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={filters.gender.includes(gender)}
                      onChange={() => handleFilterChange("gender", gender)}
                    />
                  }
                  label={gender}
                />
              ))}
            </FormGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Pet Listings */}
      <Grid container spacing={2}>
        {filteredPets.length > 0 ? (
          filteredPets.map((pet, index) => (
            <Grid item xs={12} sm={12} md={6} key={index}>
              <Paper
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  height: "600px",
                  overflow: "auto",
                  position: "relative",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  {pet.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:3001/${image}`}
                      onClick={() => handlePetClick(pet)}
                      alt={pet.name}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ))}
                </div>
                {pet.isAdopted && (
                  <Typography
                    style={{
                      color: "white",
                      backgroundColor: "red",
                      borderRadius: "8px",
                      padding: "0.5rem",
                      position: "center",
                      margin: "10px 0",
                    }}
                  >
                    Adopted
                  </Typography>
                )}
                <Typography
                  variant="h6"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {pet.name}
                </Typography>
                <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
                <Grid textAlign={"left"}>
                  <Typography variant="body1">
                    <strong>Breed:</strong> {pet.breed}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Size:</strong> {pet.size}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Age:</strong> {pet.age}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {pet.gender}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Shelter:</strong> {pet.shelter}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Description:</strong>{" "}
                    {truncateContent(pet.description, 100)}
                  </Typography>
                  {userRole === "adopter" && (
                    <IconButton
                      onClick={() => handleLikeToggle(pet._id)}
                      style={likeBtn}
                    >
                      {likedPets.has(pet._id) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  )}
                </Grid>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography style={{ margin: "2rem auto" }}>
            No pets available.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Pets;
