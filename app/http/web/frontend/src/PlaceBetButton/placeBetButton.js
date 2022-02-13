import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import BackendApiClient from "../backendApiClient";
import {useOktaAuth} from "@okta/okta-react";
import Alert from "@material-ui/lab/Alert";



const gridStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: 20,
        color: theme.palette.text.primary,
    },
}));

function roundNum(num) {
    return num.toFixed(2);
}

function calculatePayoutProfit(odds, stake) {
    if (odds && stake && odds !== '-') return {totalPayout: roundNum(odds*stake), profit: roundNum((odds-1)*stake)};
    else return {totalPayout: null, profit: null};
}

export default function PlaceBetButton(props) {
    const { authState } = useOktaAuth();

    const [open, setOpen] = useState(false);
    const [teamChosen, setTeamChosen] = useState(null);
    const [betAmount, setBetAmount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [totalPayout, setTotalPayout] = useState(null);
    const [profit, setProfit] = useState(null);
    const classes = gridStyles();

    const handleTeamChosen = (event, newAlignment) => {
        setTeamChosen(newAlignment);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const odds = chosenOdds();
        const {totalPayout, profit } = calculatePayoutProfit(odds, betAmount);
        setTotalPayout(totalPayout);
        setProfit(profit);
    }, [teamChosen, betAmount]);

    const handleSubmit = () => {
        if (betAmount === null || teamChosen === null) {
            setErrorMessage('incomplete bet!');
        }
        else if (authState.isAuthenticated) {
            const betData = {
                ...props.data,
                active: true,
                side_chosen: teamChosen,
                bet_amount: betAmount,
                potential_payout: totalPayout,
            };
            delete betData.button;
            console.log(betData);
            const {accessToken} = authState;
            const apiClient = new BackendApiClient(accessToken);
            apiClient.createBet(betData).then(() => handleClose());
            handleClose();
        }
    };

    const chosenOdds = () => {
        if (teamChosen==='team1') {
            return props.data.team1_odds;
        } else if (teamChosen==='team2') {
            return props.data.team2_odds;
        } else if (teamChosen==='draw') {
            return props.data.draw_odds;
        }
    };


    // TODO: load user's bet amount and validate that the input is less than or equal to balance.
    console.log(props.data);
    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                Place Bet
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Place Bet</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Verify bet details, select side and bet amount, and confirm your bet.
                    </DialogContentText>
                    {errorMessage !== null && <Alert severity="error">{errorMessage}</Alert>}
                    <div>
                        <TableContainer component={Paper}>
                            <Table aria-label="a dense table">
                                <TableBody>
                                    <TableRow key='match_start'>
                                        <TableCell component="th" scope="row">Match Start</TableCell>
                                        <TableCell align="right">{props.data.start_time}</TableCell>
                                    </TableRow>
                                    <TableRow style={teamChosen==='team1' ?{backgroundColor:'#f9c8d9'}:{backgroundColor:'white'}} key='team1'>
                                        <TableCell component="th" scope="row">Team 1</TableCell>
                                        <TableCell align="right">{props.data.team1}</TableCell>
                                    </TableRow>
                                    <TableRow style={teamChosen==='team1' ?{backgroundColor:'#f9c8d9'}:{backgroundColor:'white'}} key='team1Odds'>
                                        <TableCell component="th" scope="row">Team 1 Odds</TableCell>
                                        <TableCell align="right">{props.data.team1_odds}</TableCell>
                                    </TableRow>
                                    <TableRow style={teamChosen==='team2' ?{backgroundColor:'#f9c8d9'}:{backgroundColor:'white'}} key='team2'>
                                        <TableCell component="th" scope="row">Team 2</TableCell>
                                        <TableCell align="right">{props.data.team2}</TableCell>
                                    </TableRow>
                                    <TableRow style={teamChosen==='team2' ?{backgroundColor:'#f9c8d9'}:{backgroundColor:'white'}} key='team2Odds'>
                                        <TableCell component="th" scope="row">Team 2 Odds</TableCell>
                                        <TableCell align="right">{props.data.team2_odds}</TableCell>
                                    </TableRow>
                                    <TableRow style={teamChosen==='draw' ?{backgroundColor:'#f9c8d9'}:{backgroundColor:'white'}} key='drawOdds'>
                                        <TableCell component="th" scope="row">Draw Odds</TableCell>
                                        <TableCell align="right">{props.data.draw_odds}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <br/>
                    <br/>
                    <ToggleButtonGroup
                        value={teamChosen}
                        exclusive
                        onChange={handleTeamChosen}
                        aria-label="team chosen"
                    >
                        <ToggleButton value="team1" aria-label="left aligned">
                            {props.data.team1}
                        </ToggleButton>
                        <ToggleButton value="team2" aria-label="centered">
                            {props.data.team2}
                        </ToggleButton>
                        {props.data.draw_odds !== '-' && <ToggleButton value="draw" aria-label="centered">
                            Draw
                            </ToggleButton>}
                    </ToggleButtonGroup>
                    <br/>
                    <br/>
                    <CurrencyTextField
                        label="Enter bet amount"
                        variant="outlined"
                        value={betAmount}
                        currencySymbol="$"
                        minimumValue="0"
                        outputFormat="string"
                        decimalCharacter="."
                        digitGroupSeparator=","
                        onChange={(event, value)=> setBetAmount(value)}
                    />
                    <br/>
                    <br/>
                    Potential Total Payout: {totalPayout}
                    <br/>
                    Potential Profit: {profit}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}