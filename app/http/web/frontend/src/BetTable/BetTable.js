import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useOktaAuth} from "@okta/okta-react";

import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from "@material-ui/core/TableHead";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import BackendApiClient from "../backendApiClient";


const paginationStyles = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.light,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);


function TablePaginationActions(props) {
    const classes = paginationStyles();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

// TODO: need to check the names of things that are returned from API call (or make API call conform to this)
// TODO: make to be like createInactiveData
function createActiveData(match_date, sport_league, team_1, team_2, team_1_odds, team_2_odds, draw_odds, side_chosen, bet_amount, potential_payout) {
    return { match_date, sport_league, team_1, team_2, team_1_odds, team_2_odds, draw_odds, side_chosen, bet_amount, potential_payout, edit_button: <Button>EDIT</Button> };
}

// this style works (provided that rowData has the same names as specified in this function
function createInactiveData(rowData) {
    const { match_date, sport_league, team_1, team_2, team_1_odds, team_2_odds, draw_odds, side_chosen, result, gain_loss } = rowData;
    return { match_date, sport_league, team_1, team_2, team_1_odds, team_2_odds, draw_odds, side_chosen, result, gain_loss };
}



const tableStyles = makeStyles({
    table: {
        minWidth: 500,
    },
});

export default function BetTable(props) {
    // load oktaAuth to be used for the accessToken in API calls
    const { authState } = useOktaAuth();

    // set inital states
    const classes = tableStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowData, setRowData] = useState([]);


    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    // TODO: store as date
    // TODO: could change to mapping instead of hardcoded
    const rows = [
        createActiveData('June 13, 2020', "German Bundesliga",' Dusseldorf', 'Borussia Dortmund', 1.36, 7.5, 5.25, 'Borussia Dortmund', 100, '+36'),
        createActiveData('June 13, 2020', "German Bundesliga",' Dusseldorf', 'Borussia Dortmund', 1.36, 7.5, 5.25, 'Borussia Dortmund', 100, '+36'),
    ].sort((a, b) => (a.match_date < b.match_date ? -1 : 1));


    // creates BackendApiClient and getsBets
    const loadRowData = () => {
        if (authState.isAuthenticated) {
            const {accessToken} = authState;
            const apiClient = new BackendApiClient(accessToken);
            if (props.active) {
                return apiClient.getActiveBets();
            } else {
                return apiClient.getInactiveBets();
            }
        }
    };

    // triggers on change of authState (login/logout)
    // -- loads rows of bets from backend API
    useEffect(() => {
        // api call returned as [a, b, c]
        // need to set row data as [createActiveData(a), createActiveData(b), ...]
        // apiData.map((betInfo) => createActiveData
        const {accessToken} = authState;
        const apiClient = new BackendApiClient(accessToken);
        apiClient.getActiveBets().then((data) => {
            console.log(data);
        });
        setRowData(/* TODO */);
    }, []);


    // create row data by parsing the API response for what we want
    const createData = (rowData) => {
        return props.active ? createActiveData(rowData) : createInactiveData(rowData);
    };

    const activeColumnHeaders = ['Match Date', 'Sport/League','Team 1', 'Team 2', 'Team 1 Odds', 'Team 2 Odds', 'Draw Odds', 'Side Chosen', 'Bet Amount', 'Potential Payout', ''];
    const expireColumnHeaders = ['Match Date', 'Sport/League','Team 1', 'Team 2', 'Team 1 Odds', 'Team 2 Odds', 'Draw Odds', 'Side Chosen', 'Bet Amount', 'Match Result', 'Gain/Loss'];
    const activeTable = props.active;
    const columnHeaders = (activeTable ? activeColumnHeaders : expireColumnHeaders);
    // match_date, sport_league, team_1, team_2, team_1_odds, team_2_odds, draw_odds, side_chosen, bet_amount, potential_payout
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <StyledTableRow>
                        {columnHeaders.map((header, index) => <StyledTableCell key={"header-"+index}> {header} </StyledTableCell>)}
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                    ).map((row, index) => (
                        <StyledTableRow key={index}>
                            {Object.entries(row).map((key) => (
                                <StyledTableCell key={key[0]}>{key[1]}</StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10]}
                            colSpan={3}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
