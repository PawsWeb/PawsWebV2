import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

function Contact() {
  const paperStyle = {
    height: "auto",
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "0.5rem",
    border: "1px solid #453a2f",
    boxShadow: "10px 10px 10px #453a2f",
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "1.5rem" };
  const sendBtn = {
    margin: "2rem 0",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:3001/contact', { name, email, message })
      .then(response => {
        if (response.status === 200) {
          setSuccessMessage('Your message has been sent successfully!');
          setName('');
          setEmail('');
          setMessage('');
        }
      })
      .catch(error => {
        setErrorMessage('Failed to send your message. Please try again later.');
        console.error(error);
      });
  };

  return (
    <>
    <Grid align="center">
      <Paper
        style={paperStyle}
        sx={{
          width: {
            xs: "80vw",
            sm: "50vw",
            md: "40vw",
            lg: "30vw",
            xl: "20vw",
          },
          height: "50vh",
        }}
      >
        <Typography style={heading}>Contact Us</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            style={row}
            fullWidth
            margin="normal"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            style={row}
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            style={row}
            fullWidth
            margin="normal"
            label="Message"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button 
            style={sendBtn}
            variant="contained" 
            color="primary" 
            type="submit"
          >
            Send Message
          </Button>
        </form>
        {successMessage && (
          <Typography variant="body1" color="success" style={row}>
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography variant="body1" color="error" style={row}>
            {errorMessage}
          </Typography>
        )}
      </Paper>
    </Grid>
    </>
  )
}

export default Contact