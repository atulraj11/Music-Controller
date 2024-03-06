import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import UpdateRoomPage from "./UpdateRoomPage";
import MusicPlayer from "./MusicPlayer";
import CreateRoom from "./CreateRoom";

const Room = ({leaveRoomCall}) => {
  let navigate = useNavigate();
  const [votes, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [error,setError] = useState('');
  const [shouldCallGetCurrentSong, setShouldCallGetCurrentSong] = useState(true);
  const [song,setSong] = useState({});
  let { roomCode } = useParams();

  // The useParams hook from react-router-dom is used to extract the roomCode parameter from the URL.

  useEffect(()=>{
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  },[]);
  
  useEffect(() => {
    getRoomDetails();
  }, [showSettings]);

  const getRoomDetails = async()=>{
      // console.log("getroomdetails")
      try {
        const response =  await fetch(`/api/get-room?code=${roomCode}`);
        if (!response.ok) {
          leaveRoomCall();
          navigate("/");
        }

        const data =  await response.json();
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
        // setShowSettings(()=>!showSettings);
  
        if (!spotifyAuthenticated && data.is_host) {
          authenticateSpotify();
        };
      } catch (error) {
        alert("Error fetching room details:", error);
      }
    };
//   useEffect(async() => {
//     await fetch("/api/get-room" + "?code=" + roomCode)
//     .then(response => {
//         if (!response.ok) {
//             navigate("/");
//         };
        
//         return response.json()
//     })
//     .then(data => {       
//             setVotesToSkip(data.votes_to_skip);
//             setGuestCanPause(data.guest_can_pause);
//             setIsHost(data.is_host);
//             if (!spotifyAuthenticated && data.is_host) {
//                 authenticateSpotify();
//             };
//     });
// }, [showSettings]);

  const authenticateSpotify = async() => {
    console.log("authenticate spotify")
     await fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        // console.log(data)
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const getCurrentSong = async() =>{
    await fetch('/spotify/current-song')
    .then((response)=>{
        if (!response.ok) {
          window.location.reload();
          return {}
        } else {
        if(response.status=="204")
        {
            setError("Play Song in spotify");
            throw new Error('Please Start Spotify');
        }
        return response.json()
      }
    }).then((data)=>{
      setSong(data);
    // }).catch((error)=>{
    //   // console.log(error)
    //   if(error.message==='Please Start Spotify')
    //    alert(error.message)
    });
  }

  const leaveButtonPressed = async() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/api/leave-room", requestOptions)
    .then((response) => { 
      leaveRoomCall();
      navigate("/"); 
    });
  };

  const handleShowSettings = () =>{
    setShowSettings(!showSettings);
  }

  // const Settings = () => {
  //   return (
      
  // };

  const SettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleShowSettings}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const SongContent = () =>{
     return (
      <>
      <Grid item xs={12} align="center">
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
     </Grid>
     </>
     );
  }

  if (showSettings) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <UpdateRoomPage
            propVotesToSkip={votes}
            propGuestCanPause={guestCanPause}
            // update={true}
            roomCode={roomCode}
            // updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleShowSettings}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
    // setShowSettings(()=>!showSettings);
  }
  return (
    <Grid container align='center' spacing={2}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Room ID: {roomCode}
        </Typography>
      </Grid>
      
      {/* <SongContent/> */}
      <MusicPlayer {...song} error={error} />

      <Grid item xs={12}>
        {isHost && SettingsButton()} 
      </Grid>
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
