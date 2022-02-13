from __future__ import absolute_import, print_function

from app.database.mongo import MongoDatabase
# from app.fantasybet.schema import UserBetSchema
from app.fantasybet.userservice import *

mdb = MongoDatabase()
a = UserService('0@0.com')
print(a.find_all_bets())

bet_schema = UserBetSchema()


bet_data = {'bet_id': 1, 'user_id': '0@0.com', 'active': False}
print(bet_schema.load(bet_data))
# print(mdb.find_all({'user_id': '0@0.com'}))
# print([bet for bet in mdb.find_all({'user_id': '0@0.com'})])


# we need to pass the api call:
# bet_id, sport_league, team1, team2, match_date,
# team1_odds, team2_odds, draw_odds,
# active, side_chosen, bet_amount, potential_payout
