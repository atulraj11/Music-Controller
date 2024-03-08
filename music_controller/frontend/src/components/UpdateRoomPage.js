import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Button,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
} from "@material-ui/core";
import { Alert } from "@mui/material";

const UpdateRoomPage = ({
  propVotesToSkip = 2,
  propGuestCanPause = true,
  roomCode = null,
}) => {
  const [guestCanPause, setGuestCanPause] = useState(propGuestCanPause);
  const [votesToSkip, setVotesToSkip] = useState(propVotesToSkip);
  const [updateStatus, setUpdateStatus] = useState("success");
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);

  //To remove showing updatestatus after 5 second
  // useEffect(()=>{
  //   if(showUpdateStatus)
  //   {
  //     const timer = setTimeout(setUpdateStatus(''),5000);

  //     return () => clearTimeout(timer);
  //   }
  // },[showUpdateStatus]);

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value);
  };

  const handleUpdateRoomButtonPressed = async () => {
    console.log("Updating Room...");
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };

    await fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setUpdateStatus("success");
      } else {
        setUpdateStatus("error");
      }
      setShowUpdateStatus(true);
    });
  };

  const UpdateButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateRoomButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={showUpdateStatus}>
          <Alert
            severity={updateStatus}
            onClose={() => {
              setShowUpdateStatus(false);
            }}
          >
            {updateStatus == "success"
              ? "Updated room successfully!"
              : "Failed to update room!"}
          </Alert>
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Update room
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <FormControl component={"fieldset"}>
          <FormHelperText>
            <div align="center">Guest control of playback state</div>
          </FormHelperText>
          <RadioGroup
            row
            value={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            defaultValue={votesToSkip}
            onChange={handleVotesChange}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <UpdateButton />
    </Grid>
  );
};

export default UpdateRoomPage;
