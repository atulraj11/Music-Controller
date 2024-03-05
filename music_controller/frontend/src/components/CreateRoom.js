import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link, useNavigate } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import { Alert } from '@mui/material';


function CreateRoom({  propVotesToSkip=2,  propGuestCanPause=true, update=false, roomCode=null }) {
    let navigate = useNavigate();
    const [guestCanPause, setGuestCanPause] = useState( propGuestCanPause);
    const [votesToSkip, setVotesToSkip] = useState( propVotesToSkip);
    const [updateStatus, setUpdateStatus] = useState("success");
    const [showUpdateStatus, setShowUpdateStatus] = useState(false)

    const handleVotesChange = e => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestCanPauseChange = e => {
        setGuestCanPause(e.target.value)
    };

    const handleCreateRoomPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            })
        };

        fetch("/api/create-room", requestOptions)
        .then(response => response.json())
        .then(data => navigate("/room/" + data.code));
    };

    const handleUpdateRoomPressed = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code : roomCode
            })
        };

        fetch("/api/update-room", requestOptions)
        .then((response) => {
            if (response.ok) {
                setUpdateStatus("success")
            } else {
                setUpdateStatus("error")
            }
            setShowUpdateStatus(true)
        });
    };

    const createButtons = 
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleCreateRoomPressed}> 
                    Create A Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}> 
                    Back
                </Button>
            </Grid>
        </Grid>;

    const updateButton = 
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleUpdateRoomPressed}>
                    Update room
                </Button>
            </Grid>
        </Grid>

    return (
         <Grid container spacing={1}>
            <Grid item xs = {12} align="center">
                <Collapse in={showUpdateStatus}>
                    <Alert severity={updateStatus} onClose={() => {setShowUpdateStatus(false)}}>
                        {updateStatus == "success" ? 
                            "Updated room successfully!" : "Failed to update room!"
                        }
                    </Alert>
                </Collapse>
            </Grid>
            <Grid item xs = {12} align="center">
                <Typography component='h4' variant='h4'>
                    {update ? "Room Settings": "Create a Room"}
                </Typography>
            </Grid>
            <Grid item xs = {12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align='center'>
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup 
                        row 
                        defaultValue={guestCanPause.toString()}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel 
                            value='true' 
                            control={<Radio color="primary" />} 
                            label="Play/Pause" 
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value='false' 
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
                            style: {textAlign: "center"},
                        }}
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes Required To Skip Song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {update ? updateButton : createButtons}
        </Grid>
    );
};

export default CreateRoom;