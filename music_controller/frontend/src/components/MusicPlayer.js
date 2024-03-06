import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
// import {PlayArrowIcon, SkipNextIcon, PauseIcon} from "@material-ui/icons"
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Collapse } from "@material-ui/core";
import { Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  customAlert: {
    // height: '10rem',
    width: 'auto',
    // fontSize: '40px',
    alignItems:'center',
    justifyContent: 'center',
  },
  customAlertText: {
    fontSize: '2.5rem',
  },
}));

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

  const MusicContent = () =>{
     return (<Grid container alignItems="center">
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
          <Typography color="textSecondary" variant="subtitle1">
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
     );
  }

  const CustomAlert = () => {
    // const classes = useStyles();
    return(
      // <Collapse in>
            <Alert  icon={false} sx={{
              width: 'auto',
              fontSize: '2.8rem',
              alignItems:'center',
              justifyContent: 'center',
            }} severity="info">
              <span>No Music is Playing on Spotify</span>
            </Alert>
      // </Collapse>
    );
  }
  const NoMusicContent = () =>{
    return (
      <Grid container alignItems="center">
      <Grid item align="center" xs={4}>
        <img
          src={"https://wp.hindi.scoopwhoop.com/wp-content/uploads/2022/06/62a86beea7547a0001e08b08_f3b62a81-4a12-4ec3-a883-b11d820a0e8b.gif"}
          alt="album_cover"
          height="100%"
          width="100%"
        />
      </Grid>
      <Grid item align="center" xs={8}>
         <CustomAlert/>
        {/* <Typography color="textSecondary" variant="subtitle1">
          {props.artist}
        </Typography> */}
        {/* <div>
          <IconButton onClick={props.is_playing? pauseSong : playSong}>
            {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={skipSong}>
            <SkipNextIcon /> 0/0
          </IconButton>
        </div> */}
      </Grid>
    </Grid>
    );
  }
     

  return (
    <Card>
      {props.error?<NoMusicContent/> : <MusicContent/>}
      <LinearProgress variant="determinate" value={songprogress} />
    </Card>
  );
};

export default MusicPlayer;
