import axios from 'axios';

const BASE_URI = 'http://localhost:4433';

const client = axios.create({
    baseURL: BASE_URI,
    json: true,
});

class BackendApiClient {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    async makeCall (method, resource, data) {
        return client({
            method,
            url: resource,
            data,
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        }).then(resp => {
            return resp.data ? resp.data : [];
        })
    }

    getBets() {
        return this.makeCall('get', '/bets')
    }

    getActiveBets() {
        return this.makeCall('get', '/bets/active')
    }

    getInactiveBets() {
        return this.makeCall('get', '/bets/inactive')
    }

    // takes bet as json 'bet' as data for API call,
    // creates the bet (inserts into DB on backend)
    createBet(bet) {
        return this.makeCall('post', '/bets', bet);
    }

    deleteBet(bet) {
        return this.makeCall('delete', '/bet/${bet.bet_id}')
    }


}

export default BackendApiClient;

