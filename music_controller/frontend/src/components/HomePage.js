import React, { useEffect, useState } from 'react'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import Room from './Room'
import { Grid,Button,ButtonGroup,Typography } from '@material-ui/core'
import {BrowserRouter as Router,Routes,Route, Link, Navigate} from "react-router-dom"

const HomePage = () => {

  const [roomCode,setRoomCode] = useState(null);

  useEffect(()=>{
    const autoEnter = async() =>{
      const response = await fetch('/api/user-in-room');

      if(response.statusText=="No Content"){
        setRoomCode(null);
      }
      else{
        try {
          // Attempt to parse the JSON data only if the response status is OK
          const data = await response.json();
          setRoomCode(data.code);
        } catch (error) {
          // Handle parsing error
          console.error('Error parsing JSON:', error);
          setRoomCode(null);
        }
      }
    };
    autoEnter(); 
  },[])

  const clearRoomCode = () => setRoomCode(null);

  const HomeParty = () =>{
    return (
      <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <Typography variant="h3" compact="h3">
              House Party
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/join" component={Link}>
                Join a Room
              </Button>
              <Button color="secondary" to="/create" component={Link}>
                Create a Room
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
    )
  };
  
  return (
    <Router>
        <Routes>
            <Route path = '/' element={roomCode != null ? (<Navigate to={`/room/${roomCode}`} />) :<HomeParty/>} ></Route>
            <Route path = '/join' element={<RoomJoinPage/>}></Route>
            <Route path = '/create' element={<CreateRoomPage/>}></Route>
            <Route path = '/room/:roomCode' element={<Room leaveRoomCallback= {clearRoomCode} />}></Route>
        </Routes>
    </Router>
  )
}

export default HomePage