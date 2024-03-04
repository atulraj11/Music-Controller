import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
// import {PlayArrowIcon, SkipNextIcon, PauseIcon} from "@material-ui/icons"
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";

// here songs details from Room is passed in props 
const MusicPlayer = (props) => {
  const songprogress = (props.time / props.duration) * 100;
  
  const pauseSong = () =>{
    const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/spotify/pause", requestOptions);
  }

  const playSong = () =>{
    const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/spotify/play", requestOptions);
      
  }

  const skipSong = ()=> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip", requestOptions)
  }

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img
            src={props.image_url}
            alt="album_cover"
            height="100%"
            width="100%"
          />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {props.title}
          </Typography>
          <Typography component="h5" variant="h5">
            {props.artist}
          </Typography>
          <div>
            <IconButton onClick={props.is_playing? pauseSong : playSong}>
              {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={skipSong}>
              <SkipNextIcon /> {props.votes}/{props.votes_required}
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songprogress} />
    </Card>
  );
};

export default MusicPlayer;
