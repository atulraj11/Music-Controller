import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoom from './CreateRoom';
import MusicPlayer from './MusicPlayer'

function Room2({leaveRoomCall}) {
    let navigate = useNavigate();
    // let interval = null;
    const [roomSettings, setRoomSettings] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    // const [stopApiCALL, setSpotifyAuthenticated] = useState(false);
    const [error,setError] = useState('');
    const [song, setSong] = useState({});
    const { roomCode } = useParams();

    // Should use websockets instaed of polling but spotify API does not support it.
    useEffect(() => {
        // console.log(spotifyAuthenticated)
        // if (spotifyAuthenticated) {
        const interval = setInterval(getCurrentSong, 1000);
        // }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, []);

    useEffect(() => {
         fetch(`/api/get-room?code=${roomCode}`)
         
        .then(response => {
            console.log(response)
            if (!response.ok) {
                leaveRoomCall();
                navigate("/");
            };
            
            return response.json()
        })
        .then(data => {       
            setRoomSettings({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
            if (!spotifyAuthenticated && data.is_host) {
                authenticateSpotify();
            };
        });
    }, [showSettings]);

    const getCurrentSong = () => {
         fetch('/spotify/current-song')
        .then(response => {
            // console.log(response.ok)
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
        })
        .then(data => {
            setSong(data)
        });
    }

    const authenticateSpotify = async() => {
        await fetch("/spotify/is-authenticated")
        .then(response => response.json())
        .then(data => {
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                fetch("/spotify/get-auth-url")
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    window.location.replace(data.url);
                });
            };
        })
    };

    const handleLeaveButtonPressed = async() => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };

        await fetch("/api/leave-room", requestOptions)
        .then((response) => { 
            leaveRoomCall();
            navigate("/"); 
            window.location.reload();
        });
    };

    const handleShowSettings = () => {
        setShowSettings(!showSettings)
    };

    const settingsButton = <Button variant="contained" color="primary" onClick={handleShowSettings}>Settings</Button>;

    if (!showSettings) {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...song} error={error} />
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={handleLeaveButtonPressed}>
                        Leave Room
                    </Button>
                    {roomSettings.isHost ? settingsButton : null}
                </Grid>
            </Grid>
        );
    } else {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoom 
                        propVotesToSkip={roomSettings.votesToSkip} 
                        propGuestCanPause={roomSettings.guestCanPause}
                        update={true} 
                        roomCode={roomCode}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant='contained' color='secondary' onClick={handleShowSettings}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };
};

export default Room2;