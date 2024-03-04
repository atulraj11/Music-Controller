import React, { useState } from 'react'
import { Grid,Button,Typography,TextField } from '@material-ui/core'
import { Link, useNavigate } from 'react-router-dom'

const RoomJoinPage = () => {
  const navigate = useNavigate();
  
  const[roomCode,setroomCode] = useState('');
  const[error,seterror] = useState('');


  const handleTextFieldChange = (e) => {
    setroomCode(e.target.value);
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: roomCode,
    }),
  };

  const roomButtonPressed = async() => { 
    
    try{
      const response = await fetch("/api/join-room", requestOptions);
      if(response.ok && roomCode!=''){
        navigate(`/room/${roomCode}`)
      }
      else {
        roomCode!=''?seterror("Room not found"):seterror("Enter Room Code");
      }
    }
    catch(error){
        console.log(error);
    }
     
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room baby
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={roomButtonPressed}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

export default RoomJoinPage