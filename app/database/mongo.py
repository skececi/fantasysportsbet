import os
from pymongo import MongoClient
from app import config

COLLECTION_NAME = 'fantasybets'

# TODO: different tables (e.g. groups) -> collections:
# https://www.tutorialspoint.com/python_data_access/python_mongodb_create_collection.htm
class MongoDatabase():
    def __init__(self):
        mongo_url = os.environ.get('MONGO_URL')
        # TODO: figure out how to set and access MongoURL when hosted
        self.db = MongoClient(mongo_url, username=config.mongo_username, password=config.mongo_password).fantasybets

    # selector dict is in the form of what you want to search for
    # e.g. {'fieldX' : 'valueX'} would find you where fieldX = valueX
    def find_all(self, selector_dict):
        return self.db.fantasybets.find(selector_dict)

    def find(self, selector_dict):
        return self.db.fantasybets.find_one(selector_dict)

    def create(self, fantasybet):
        return self.db.fantasybets.insert_one(fantasybet)

    def update(self, selector_dict, fantasybet):
        return self.db.fantasybets.replace_one(selector_dict, fantasybet).modified_count

    def delete(self, selector_dict):
        return self.db.fantasybets.delete_one(selector_dict).deleted_count


