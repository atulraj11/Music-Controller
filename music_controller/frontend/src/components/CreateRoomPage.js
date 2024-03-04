import React, { useState } from "react";
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
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

const CreateRoomPage = (props) => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
 

  const handleVotesChange = (e) => {
    setVotes(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    // console.log(e.target.value)
    setGuestCanPause(e.target.value == "true" ? true : false);
  };

  
  const handleCreateRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votes,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => navigate("/room/" + data.code))
      .catch((error) => console.error("Error during fetch:", error));
  };

    const CreateButton = () => {
    return (
      <>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleCreateRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          {/* we can also use navigate to route */}
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </>
    );
  };

  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Create a Room page
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component={"fieldset"}>
          <FormHelperText>
            <div align="center">Guest control of playback state</div>
          </FormHelperText>
          <RadioGroup
            row
            // value={guestCanPause.toString()}
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
      <CreateButton/>
    </Grid>
  );
};

export default CreateRoomPage;
