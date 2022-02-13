import axios from 'axios';


// KEYS
const oddsapi_key = '4ed26f8e3bce7e9ad4eb08d980ba079f';

// ENDPOINTS
const oddsapi_host = 'https://api.the-odds-api.com';
const oddsapi_allsports = '/v3/sports';
const oddsapi_odds = '/v3/odds';

const BASE_URI = oddsapi_host;

const client = axios.create({
    baseURL: BASE_URI,
    json: true,
});

class OddsApiClient {
    constructor(accessToken) {
        this.accessToken = (accessToken ? accessToken : oddsapi_key);
    }

    async makeCall (method, resource, params) {
        if (params) {
            params['apiKey'] = oddsapi_key;
        } else {
            params = {apiKey: oddsapi_key};
        }

        return client({
            method,
            url: resource,
            params: params,
        }).then(resp => {
            return resp.data ? resp.data : [];
        })
    }

    getInSeasonSports() {
        return this.makeCall('get', oddsapi_allsports)
    }
    /*
    {
      "sport_key": "esports_lol",
      "sport_nice": "League of Legends",
      "teams": [
        "100 Thieves",
        "Team Liquid"
      ],
      "commence_time": 1592524800,
      "home_team": "100 Thieves",
      "sites": [
        {
          "site_key": "bookmaker",
          "site_nice": "Bookmaker",
          "last_update": 1592520857,
          "odds": {
            "h2h": [
              1.47,
              2.68
            ]
          }
        }
      ],
      "sites_count": 1
    }

     */

    getOddsFromSportKey(sportKey) {
        const data = {sport: sportKey, region: 'us', mkt: 'h2h'};
        console.log(data);
        return this.makeCall('get', oddsapi_odds, data);
    }

    getOddsFromSportKeyDate(sportKey, date) {
        // TODO
    }


}

export default OddsApiClient;