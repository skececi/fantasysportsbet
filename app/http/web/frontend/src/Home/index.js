import React from 'react'
import {Link} from "react-router-dom";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'fontsource-roboto';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';

import TopBar from "../TopBar/TopBar";
import BetTable from "../BetTable/BetTable";
import {useOktaAuth} from "@okta/okta-react";
import CircularProgress from "@material-ui/core/CircularProgress";


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
            contrastText: '#474f97',
        },
        // error: will use the default color
    },
});

const mainBodyStyle = {
    padding: "30px",
};
// const Home = () => {
//     const { authState, authService } = useOktaAuth();
//
//     const login = async () => {
//         // Redirect to '/' after login
//         authService.login('/');
//     }
//
//     const logout = async () => {
//         // Redirect to '/' after logout
//         authService.logout('/');
//     }
//
//     if (authState.isPending) {
//         return <div>Loading...</div>;
//     }
//
//     return authState.isAuthenticated ?
//         <button onClick={logout}>Logout</button> :
//         <button onClick={login}>Login</button>;
// };


const Home = () => {
    const { authState, authService } = useOktaAuth();

    if (authState.isPending) {
        return (<div> <CircularProgress /> </div>)
    }

    return (
            <ThemeProvider theme={theme}>
                <div><TopBar/></div>
                <div style={mainBodyStyle}>
                    <br/>
                    <div>
                        <Button variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                component={Link}
                                to={'/create_bet'}>
                            Place a bet
                        </Button>
                    </div>
                    <br/>
                    <div>
                        <div><h3>Active Bets</h3></div>
                        <div><BetTable active={true}/></div>
                        <br/>
                        <div><h3>Expired Bets</h3></div>
                        <BetTable active={false}/>
                    </div>
                </div>
            </ThemeProvider>

        );
    };


export default Home;