import requests
import json

import api_config


def odds_api_get_request(endpoint, params=None):
    odds_response = requests.get(endpoint, params)
    odds_json = json.loads(odds_response.text)
    if not odds_json['success']:
        print(
            'There was a problem with the odds request:',
            odds_json['msg']
        )
    else:
        return odds_json['data']


def in_season_sports():
    return odds_api_get_request(api_config.oddsapi_allsports, params={
        'api_key': api_config.oddsapi_key
    })


def get_odds(sport, region='us', mkt='h2h'):
    return odds_api_get_request(api_config.oddsapi_odds, params={
        'api_key': api_config.oddsapi_key,
        'sport': sport,
        'region': region,  # uk | us | eu | au
        'mkt': mkt  # h2h | spreads | totals
    })


def upcoming_events():
    return get_odds('upcoming', 'us', 'h2h')


# for displaying sports leagues only
def in_season_sports_names():
    return [sport['title'] for sport in in_season_sports()]


def sport_name_to_sport_dict(sport_name):
    sports_dicts = in_season_sports()
    sport_dict = next((item for item in sports_dicts if item['title'] == sport_name), None)
    return sport_dict


# print(in_season_sports())
print(sport_name_to_sport_dict('EPL')['key'])
print(sport_name_to_sport_dict('League of Legends')['key'])
print(get_odds(sport_name_to_sport_dict('League of Legends')['key']))
