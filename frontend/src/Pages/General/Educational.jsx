import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Educational() {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const title = { fontSize: "2rem", fontWeight: "600", marginBottom: "1rem" };
  const description = { fontSize: "1.2rem", marginBottom: "1rem" };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
  };

  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = () => {
    axios
      .get("http://localhost:3001/educationals")
      .then((response) => setTopics(response.data))
      .catch((error) => console.error(error));
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      {selectedTopic ? (
        <div>
          <Button
            onClick={handleBackToTopics}
            variant="contained"
            style={buttonStyle}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          <Paper style={{ padding: "2rem" }}>
            <Typography style={heading}>{selectedTopic.topicTitle}</Typography>
            {selectedTopic.image && (
              <img
                src={selectedTopic.image}
                alt={selectedTopic.topicTitle}
                style={{ width: "100%", maxHeight: "400px", objectFit: "contain", marginTop: "1rem" }}
              />
            )}
            <Divider style={{ margin: "2rem 0" }} />
            {selectedTopic.titles.map((q, index) => (
              <div key={index} style={{ marginBottom: "2rem" }}>
                <Typography style={title}>{q.title}</Typography>
                <Typography style={description}>{q.content}</Typography>
              </div>
            ))}
          </Paper>
        </div>
      ) : (
        <div>
          <Typography style={heading}>Educational Topics</Typography>
          <Divider style={{ margin: "2rem 0" }} />
          <Grid container spacing={4}>
            {topics.map((topic) => (
              <Grid item xs={12} md={6} lg={4} key={topic._id}>
                <Paper
                  style={{
                    padding: "1rem",
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic.image && (
                    <img
                      src={topic.image}
                      alt={topic.topicTitle}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        marginBottom: "1rem",
                      }}
                    />
                  )}
                  <Typography style={title}>{topic.topicTitle}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Container>
  );
}

export default Educational;
