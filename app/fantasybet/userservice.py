from ..database import Database
from ..database.mongo import MongoDatabase
from .schema import *


class UserService:
    def __init__(self, user_id, db_client=Database(adapter=MongoDatabase)):
        self.db_client = db_client
        self.user_id = user_id
        if not user_id:
            raise TypeError('no user_id!')

    def dump(self, data):
        return UserBetSchema().dump(data)

    # adds the user_id field to a given schema payload
    def append_user_id(self, payload):
        user_payload = payload
        user_payload['user_id'] = self.user_id
        return user_payload

    def find_all_bets(self):
        bets = self.db_client.find_all({'user_id': self.user_id})
        return [self.dump(bet) for bet in bets]

    def find_all_bets_active(self, active=True):
        active_bets = self.db_client.find_all({'user_id': self.user_id, 'active': active})
        # TODO: something about this line below is broken
        return [self.dump(bet) for bet in active_bets]

    def find_bet(self, bet_id):
        bets = self.db_client.find_all({'user_id': self.user_id, 'bet_id': bet_id})
        return [self.dump(bet) for bet in bets]

    def create_bet(self, bet):
        user_bet = self.append_user_id(bet)
        self.db_client.create(user_bet)

    def update_bet(self, bet_id, new_bet):
        user_new_bet = self.append_user_id(new_bet)
        records_updated = self.db_client.update({'user_id': self.user_id, 'match_id': bet_id}, user_new_bet)
        return records_updated > 0

    def delete_bet(self, bet_id):
        records_deleted = self.db_client.delete({'user_id': self.user_id, 'match_id': bet_id})
        return records_deleted > 0

    def find_all_groups(self):
        # TODO v2
        pass




