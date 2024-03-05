import React, { useState, useEffect, useRef  } from "react";
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
import { Alert } from '@mui/material';


const UpdateRoomPage = (props) => {
  const [votes, setVotes] = useState(props.votesToSkip);
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
  // const [error, setError] = useState("");
  const [updateStatus, setUpdateStatus] = useState("success");  const [show, setShow] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false)

//   const updateButtonClickedRef = useRef(false); 
  
  // useEffect(() => {
  //     if(success!=""){
  //       const timer = setTimeout(() => {
  //       setSuccess("");
  //     }, 5000); // Clear success message after 5 seconds
  //     return () => clearTimeout(timer);
  //   }
  // }, [success]);


  const handleVotesChange = (e) => {
    setVotes(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true" ? true : false);
  };

  //because i need to click on update room button two time (don't know the reason)
    // useEffect(()=>{
    //     console.log("adjnd",show)
    //      handleUpdateRoomButtonPressed();  
    // },[show]);

  // const handleUpdateButtonClick = () =>{
  //   setShow((show)=>(!show));
  // }
  
  const handleUpdateRoomButtonPressed = async () => {
      console.log("Updating Room...");
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          votes_to_skip: votes,
          guest_can_pause: guestCanPause,
          code: props.roomCode,
        }),
      };

      const response = await fetch("/api/update-room", requestOptions);

      if (response.ok) {
        setUpdateStatus("success")
    } else {
        setUpdateStatus("error")
    }
    setShowUpdateStatus(true)
      // else {
        // console.log("initial",initial)
        // if(initial)
        // {
        // setSuccess("Room Updated Successfully");
        //   // props.updateCallback();
        // }
        // setInitial(false);
    // }
      // window.location.reload(false);
  };
  
  const UpdateButton = () => {
    return (
      <>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateRoomButtonPressed}
          >
            Update Room
          </Button>
        </Grid>
      </>
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
      <Collapse in={showUpdateStatus}>
                    <Alert severity={updateStatus} onClose={() => {setShowUpdateStatus(false)}}>
                        {updateStatus == "success" ? 
                            "Updated room successfully!" : "Failed to update room!"
                        }
                    </Alert>
                </Collapse>
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
            defaultValue={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              defaultValue=""
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              defaultValue=""
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
            onChange={handleVotesChange}
            defaultValue={votes}
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
