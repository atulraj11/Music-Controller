import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import UpdateRoomPage from "./UpdateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = ({ leaveRoomCallback }) => {
  const navigate = useNavigate();
  const [votes, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [show, setShow] = useState(false);
  // const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [shouldCallGetCurrentSong, setShouldCallGetCurrentSong] = useState(true);
  const [song,setSong] = useState({});
  let { roomCode } = useParams();

  // The useParams hook from react-router-dom is used to extract the roomCode parameter from the URL.

  useEffect(()=>{
    const timer= setInterval(()=>{
      // console.log(shouldCallGetCurrentSong)
      if(shouldCallGetCurrentSong){
        getCurrentSong();
      }
      
    },1000);
    return () => clearInterval(timer);
  },[])
  
  useEffect(() => {
    console.log("getroomdtaongsd")
    getRoomDetails();
  }, [roomCode]);

  const getRoomDetails = useCallback (async()=>{
      console.log("getroomdetails")
      try {
        const response = await fetch(`/api/get-room?code=${roomCode}`);
        if (!response.ok) {
          leaveRoomCallback();
          navigate("/");
        }
        const data = await response.json();
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
        // setShow(()=>!show);
  
        if (data.is_host) {
          authenticateSpotify();
        }
      } catch (error) {
        alert("Error fetching room details:", error);
      }
    },)

  const authenticateSpotify = async() => {
    console.log("authenticate spotify")
    await fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        // setSpotifyAuthenticated(data.status);
        console.log(data)
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const getCurrentSong =() =>{
    fetch('/spotify/current-song').then((response)=>{
        if(!response.ok){
        // console.log(shouldCallGetCurrentSong)
        // setShouldCallGetCurrentSong(()=>false);
        console.log("Response")
      }
      else{
        if(response.status!="204")
        return response.json();
        throw new Error('Please Start Spotify');
      }
    }).then((data)=>{
      setSong(data);
    }).catch((error)=>{
      // console.log(error)
      if(error.message==='Please Start Spotify')
      setShouldCallGetCurrentSong(false)

      alert(error.message)
    })
  }

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions);
    leaveRoomCallback();
    navigate("/");
  };

  const Settings = () => {
    return (
      <Grid container align='center' spacing={1}>
        <Grid item xs={12} align="center">
          <UpdateRoomPage
            votesToSkip={votes}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={()=> setShow(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const SettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={()=> setShow(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const updateShowSettings = () => {
    // console.log(show)
    setShow((show)=>!show);
    
  };

  if (show) {
    console.log("aoom",show)
    return <Settings />;
    // setShow(()=>!show);
  }
  return (
    <Grid container align='center' spacing={2}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      {/* <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {votes}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {isHost.toString()}
        </Typography>
      </Grid>  */}

      <MusicPlayer {...song}/>

      {isHost ? <SettingsButton /> : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};
export default Room;
