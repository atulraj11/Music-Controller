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
import { Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  customAlert: {
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  customAlertText: {
    fontSize: "2.5rem",
  },
}));

// here songs details from Room is passed in props
const MusicPlayer = (props) => {
  const songprogress = (props.time / props.duration) * 100;

  const pauseSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions);
  };

  const playSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play", requestOptions);
  };

  const skipSong = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip", requestOptions);
  };

  const errorURlMapping = {
    204: ["/static/images/204-image.gif", "No Music is Playing on Spotify"],
    500: ["/static/images/500-image.gif", "No Internet Connection"],
    404: ["/static/images/404-image.gif", "Not Available,Reload the page"],
  };

  const MusicContent = () => {
    return (
      <Grid container alignItems="center">
        <Grid item align="center" xs={5}>
          <img
            src={props.image_url}
            alt="album_cover"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </Grid>
        <Grid
          item
          align="center"
          xs={7}
          style={{
            height: "19rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),url(${props.artist_image_url})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "50% 0",
            textShadow: "0 0 black",
          }}
        >
          <Typography component="h5" variant="h5">
            {props.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.artist}
          </Typography>

          <div>
            <IconButton onClick={props.is_playing ? pauseSong : playSong}>
              {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={skipSong}>
              <SkipNextIcon /> {props.votes}/{props.votes_required}
            </IconButton>
          </div>
        </Grid>
      </Grid>
    );
  };

  const CustomAlert = () => {
    return (
      // <Collapse in>
      <Alert
        icon={false}
        sx={{
          width: "28.8rem",
          height: "15.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem", // Adjust the font size for the span text
        }}
        severity="info"
      >
        <span>{errorURlMapping[props.error][1]}</span>
      </Alert>
      // </Collapse>
    );
  };
  const NoMusicContent = () => {
    return (
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img
            src={errorURlMapping[props.error][0]}
            alt="album_cover"
            style={{
              height: "16.3rem", // Set the height to cover the container
              width: "100%", // Set the width to cover the container
              objectFit: "cover", // Ensure the image covers the container while maintaining its aspect ratio
            }}
          />
        </Grid>
        <Grid item align="center" xs={8}>
          <CustomAlert />
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
  };

  return (
    <Card>
      {props.error ? <NoMusicContent /> : <MusicContent />}
      <LinearProgress variant="determinate" value={songprogress} />
    </Card>
  );
};

export default MusicPlayer;
