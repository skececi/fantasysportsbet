import React, {useEffect, useState} from 'react';
import OddsApiClient from "../oddsApiClient";
import BackendApiClient from "../backendApiClient";

import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import DataTable from "../DataTable/DataTable";
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';

import PlaceBetButton from "../PlaceBetButton/placeBetButton";
import {useOktaAuth} from "@okta/okta-react";
import TopBar from "../TopBar/TopBar";

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#1a237e',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#ffffff',
            main: '#f48fb1',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffffff',
        },
        // error: will use the default color
    },
});


const mainBodyStyle = {
    padding: "30px",
};

function findSportKey(sportName, sportList){
    for (let i=0; i < sportList.length; i++) {
        if (sportList[i].title === sportName) {
            return sportList[i].key;
        }
    }
}

function convertUnixEpoch(unix_timestamp) {
    var dateFormat = require('dateformat');
    const convDate = new Date(unix_timestamp * 1000);
    return dateFormat(convDate, "ddd mmm d, yyyy, h:MM TT");
}


export default function CreateABetForm() {
    const { authState } = useOktaAuth();

    const [sportInput, setSportInput] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [betRows, setBetRows] = useState([]);
    const [allSports, setAllSports] = useState([]);
    const [sportsListKeys, setSportsListKeys] = useState([]);


    // triggers on load
    useEffect( () => {
        const oddsApiClient = new OddsApiClient();
        oddsApiClient.getInSeasonSports().then((data) => {
            console.log(data.data);
            setSportsListKeys(data.data.map((sport) => {
                const { title, key } = sport;
                return { title, key }
            }));
            setAllSports(data.data.map((sport) => sport.title));
        });
    }, []);



    const placeBetButton = (data) => {
        return (<PlaceBetButton data={data} />)
    };

    // returns list of [commence_time, home_team, away_team, home_odds, away_odds, draw_odds]
    function parseOddsRows(sport, data) {
        console.log(data.data);
        return data.data.map((matchDetails) => {
            console.log(matchDetails);
            const startTime = convertUnixEpoch(matchDetails["commence_time"]);
            const matchOdds = (matchDetails["sites"].length > 0) ? matchDetails["sites"][0]["odds"]["h2h"] : ['-', '-'];
            const draw_odds = (matchOdds && matchOdds.length === 3) ? matchOdds[2] : '-';
            const data = {
                sport: sport,
                start_time: startTime,
                team1: matchDetails["teams"][0],
                team2: matchDetails["teams"][1],
                team1_odds: matchOdds[0],
                team2_odds: matchOdds[1],
                draw_odds: draw_odds,
            };
            data["button"] = placeBetButton(data);
            return data;
        })
    }

    const searchForOdds = () => {
        const oddsApiClient = new OddsApiClient();
        console.log(sportsListKeys);
        const sportsKey = findSportKey(sportInput,sportsListKeys);
        oddsApiClient.getOddsFromSportKey(sportsKey).then((data) => {
            setBetRows(parseOddsRows(sportInput, data));
            console.log(data);
        });
    };

    const resultsTable = () => {
        const headers = ['Sport/League', 'Match Start', 'Team 1', 'Team 2', 'Team 1 Odds', 'Team 2 Odds', 'Draw Odds', ''];
        // const data = [{sport: 'MLB', game: 'yanks vs sox'}, {sport: 'MLB', game: 'braves vs stros'}];
        return (<DataTable headers={headers} rows={betRows} />)
    };


    return (
        <ThemeProvider theme={theme}>
            <div>
                <TopBar/>
            </div>
            <div style={mainBodyStyle}>
                <div>{`sport: ${sportInput !== null ? `${sportInput}` : 'null'}`}</div>
                <div>{`date: ${selectedDate !== null ? `${selectedDate}` : 'null'}`}</div>
                <br/>
                <div>
                    <Autocomplete
                        id="combo-box-demo"
                        options={allSports}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Select a Sport/League" variant="outlined"/>}
                        value={sportInput}
                        onChange={(event, newValue) => {
                            setSportInput(newValue);
                        }}
                    />
                </div>
                <div>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            inputVariant="outlined"
                            style={{ width: 300 }}
                            format="MM/DD/yyyy"
                            minDate={new Date()}
                            margin="normal"
                            id="date-picker-inline"
                            label="Select a Date (Optional)"
                            value={selectedDate}
                            onChange={setSelectedDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <br/>
                <div>
                    <Button variant="contained"
                            color="primary"
                            startIcon={<SearchIcon />}
                            onClick={searchForOdds}
                        >
                        Find matches
                    </Button>
                </div>
                <br/>
                <div>
                    <h3>Matches:</h3>
                    {resultsTable()}
                </div>
            </div>
        </ThemeProvider>
    );
}

// Date picker, then button for loading matches on that date (renders table with odds)
// -- the table has a button to place a bet that then prompts user for amount of money and side chosen
// If no results -- show table with 'no results for that search
// once selected, create bet through API call

