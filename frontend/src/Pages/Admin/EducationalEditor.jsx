import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function EducationalEditor() {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const title = { fontSize: "2rem", fontWeight: "600", marginBottom: "1.5rem" };
  const row = { display: "flex", marginTop: "1.5rem" };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
  };

  const publishTopicBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
    marginLeft: "1rem",
  };

  const addQsBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#987554",
    borderRadius: "0.5rem",
  };

  const editDltBtn = {
    color: "#574e44"
  };

  const [topics, setTopics] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [image, setImage] = useState(null);
  const [titles, setTitles] = useState([{ title: "", content: "" }]);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editTitles, setEditTitles] = useState([]);
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = () => {
    axios
      .get("http://localhost:3001/educationals")
      .then((response) => setTopics(response.data))
      .catch((error) => console.error(error));
  };

  const handlePublishTopic = () => {
    if (!image) {
      alert("Image is required");
      return;
    }

    axios
      .post("http://localhost:3001/educationals", {
        topicTitle: newTopicTitle,
        image,
        titles,
      })
      .then(() => {
        setNewTopicTitle("");
        setImage(null);
        setTitles([{ title: "", content: "" }]);
        fetchTopics();
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteTopic = (topicId) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      axios
        .delete(`http://localhost:3001/educational/${topicId}`)
        .then(() => fetchTopics())
        .catch((error) => console.error(error));
    }
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic._id);
    setEditTitles(topic.titles);
    setEditImage(topic.image);
  };

  const handleSaveEdit = (topicId) => {
    axios
      .put(`http://localhost:3001/educational/${topicId}`, {
        titles: editTitles,
        image: editImage,
      })
      .then(() => {
        setEditingTopic(null);
        fetchTopics();
      })
      .catch((error) => console.error(error));
  };

  const handleAddTitle = () => {
    setTitles([...titles, { title: "", content: "" }]);
  };

  const handleRemoveTitle = (index) => {
    if (window.confirm("Are you sure you want to delete this title?")) {
      const newTitles = [...titles];
      newTitles.splice(index, 1);
      setTitles(newTitles);
    }
  };

  const handleTitleChange = (index, event) => {
    const newTitles = [...titles];
    newTitles[index][event.target.name] = event.target.value;
    setTitles(newTitles);
  };

  const handleEditTitleChange = (index, event) => {
    const newTitles = [...editTitles];
    newTitles[index][event.target.name] = event.target.value;
    setEditTitles(newTitles);
  };

  const handleRemoveEditTitle = (index) => {
    if (window.confirm("Are you sure you want to delete this title?")) {
      const newTitles = [...editTitles];
      newTitles.splice(index, 1);
      setEditTitles(newTitles);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setEditImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography style={heading}>Educational Dashboard</Typography>
        <Link to="/educational" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={buttonStyle}>
            View
          </Button>
        </Link>
      </Grid>
      <Divider style={{ margin: "2rem 0" }} />
      <Typography style={title}>ADD NEW TOPIC</Typography>
      <TextField
        InputProps={{
          style: { fontWeight: "bold" },
        }}
        label="New Topic Title"
        value={newTopicTitle}
        onChange={(e) => setNewTopicTitle(e.target.value)}
        fullWidth
      />
      <TextField
        type="file"
        onChange={handleImageUpload}
        fullWidth
        style={{ marginBottom: "1rem" }}
        inputProps={{ accept: "image/*" }}
        required
      />
      {titles.map((q, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <TextField
            label="Title"
            name="title"
            value={q.title}
            onChange={(e) => handleTitleChange(index, e)}
            style={row}
            InputProps={{
              style: { fontWeight: "bold" },
            }}
            fullWidth
          />
          <TextField
            label="Content"
            name="content"
            value={q.content}
            onChange={(e) => handleTitleChange(index, e)}
            style={row}
            fullWidth
            multiline
            rows={10}
            inputProps={{ style: { overflowWrap: "break-word" } }}
          />
          <IconButton onClick={() => handleRemoveTitle(index)}>
            <DeleteIcon variant="contained" style={editDltBtn} />
          </IconButton>
        </div>
      ))}
      <Button
        onClick={handleAddTitle}
        variant="contained"
        startIcon={<AddIcon />}
        style={addQsBtn}
      >
        Title
      </Button>
      <Button
        onClick={handlePublishTopic}
        variant="contained"
        style={publishTopicBtn}
      >
        Publish
      </Button>
      <Divider style={{ margin: "2rem 0" }} />
      <Typography style={title}>EXISTING TOPICS</Typography>
      {topics.map((topic) => (
        <Paper key={topic._id} style={{ padding: "1rem", marginBottom: "2rem" }}>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {topic.topicTitle}
          </Typography>
          {editingTopic === topic._id ? (
            <div>
              <TextField
                type="file"
                onChange={handleEditImageUpload}
                fullWidth
                style={{ marginBottom: "1rem" }}
                inputProps={{ accept: "image/*" }}
              />
              {editImage && (
                <img
                  src={editImage}
                  alt={topic.topicTitle}
                  style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
                />
              )}
            </div>
          ) : (
            topic.image && (
              <img
                src={topic.image}
                alt={topic.topicTitle}
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
              />
            )
          )}
          <Divider style={{ margin: "1rem 0" }} />
          {editingTopic === topic._id ? (
            editTitles.map((q, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <TextField
                  label="Title"
                  name="title"
                  value={q.title}
                  onChange={(e) => handleEditTitleChange(index, e)}
                  style={row}
                  InputProps={{
                    style: { fontWeight: "bold" },
                  }}
                  fullWidth
                />
                <TextField
                  label="Content"
                  name="content"
                  value={q.content}
                  onChange={(e) => handleEditTitleChange(index, e)}
                  style={row}
                  fullWidth
                  multiline
                  rows={10}
                  inputProps={{ style: { overflowWrap: "break-word" } }}
                />
                <IconButton onClick={() => handleRemoveEditTitle(index)}>
                  <DeleteIcon variant="contained" style={editDltBtn} />
                </IconButton>
              </div>
            ))
          ) : (
            <div>
              {topic.titles.map((q, index) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    {q.title}
                  </Typography>
                  <Typography>{q.content}</Typography>
                </div>
              ))}
            </div>
          )}
          {editingTopic === topic._id ? (
            <Button
              onClick={() => handleSaveEdit(topic._id)}
              variant="contained"
              style={publishTopicBtn}
            >
              Save
            </Button>
          ) : (
            <div>
              <IconButton onClick={() => handleEditTopic(topic)}>
                <EditIcon variant="contained" style={editDltBtn} />
              </IconButton>
              <IconButton onClick={() => handleDeleteTopic(topic._id)}>
                <DeleteIcon variant="contained" style={editDltBtn} />
              </IconButton>
            </div>
          )}
        </Paper>
      ))}
    </Container>
  );
}

export default EducationalEditor;
