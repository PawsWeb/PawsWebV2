import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Grid, Typography, Container, Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { UserRoleContext } from "../../App";

function Faq() {
  const { userRole } = useContext(UserRoleContext);
  const [faqs, setFaqs] = useState([]);

  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const subtitle = {
    color: "grey",
    fontSize: "0.9rem",
    fontWeight: "100",
    marginBottom: "40px",
  };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
  };

  const faqContainerStyle = {
    marginBottom: "2.5rem",
    overflowWrap: "break-word",
  };

  const questionStyle = {
    fontWeight: "600",
    overflowWrap: "break-word",
  };

  const answerStyle = {
    marginBottom: "1rem",
    overflowWrap: "break-word",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/faqs")
      .then((response) => setFaqs(response.data))
      .catch((error) => console.error("Error fetching FAQs:", error));
  }, []);

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography style={heading}>FAQ</Typography>
        </Grid>
        {userRole === "admin" && (
          <Grid item>
            <Link to="/admin/faq" style={{ textDecoration: "none" }}>
              <Button variant="contained" style={buttonStyle}>
                FAQ Dashboard
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
      <Typography style={subtitle}>
        Welcome to our FAQ section! Here, we've compiled a range of helpful
        questions and answers to assist pet caregivers in finding quick
        solutions and understanding essential topics about pet care. Whether
        you're a seasoned pet parent or new to the world of pets, you'll find
        practical tips and advice to ensure your furry, feathered, or scaly
        friends are happy and healthy!
      </Typography>
      {faqs.length === 0 ? (
        <Typography variant="h6" align="center">
          No FAQs available.
        </Typography>
      ) : (
        faqs.map((faq) => (
          <div key={faq._id} style={faqContainerStyle}>
            <Typography
              variant="h5"
              style={{
                fontWeight: "600",
                textTransform: "uppercase",
                overflowWrap: "break-word",
              }}
            >
              {faq.blogTitle}
            </Typography>
            {faq.questions.map((q, index) => (
              <div key={index}>
                <Typography variant="h6" style={questionStyle}>
                  {q.question}
                </Typography>
                <Typography variant="body1" style={answerStyle}>
                  {q.answer}
                </Typography>
              </div>
            ))}
          </div>
        ))
      )}
    </Container>
  );
}

export default Faq;
