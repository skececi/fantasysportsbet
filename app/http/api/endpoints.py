from .middlewares import login_required
from flask import Flask, json, g, request
from app.fantasybet.userservice import UserService
from app.fantasybet.schema import *
from flask_cors import CORS
from marshmallow import ValidationError
import dateutil.parser
import uuid

app = Flask(__name__)
CORS(app)


# TODO v1: logic to remove or add money from the overall 'cash balance'
# that will require a new table / 'collection'


def json_response(payload, status=200):
    return json.dumps(payload), status, {'content-type': 'application/json'}


@app.route('/bets', methods=['GET'])
@login_required
def find_all_bets():
    # TODO: sort? would do it in the userservice file
    return json_response(UserService(g.user).find_all_bets())


@app.route('/bets/active', methods=['GET'])
@login_required
def find_all_active_bets():
    return json_response(UserService(g.user).find_all_bets_active(active=True))


@app.route('/bets/inactive', methods=['GET'])
@login_required
def find_all_inactive_bets():
    return json_response(UserService(g.user).find_all_bets_active(active=False))


# request data must match BetSchema
@app.route('/bets', methods=['POST'])
@login_required
def create_bet():
    try:
        data = json.loads(request.data)
        if data['draw_odds'] == '-':
            data['draw_odds'] = -1
        data['start_time'] = str(dateutil.parser.parse(data['start_time']))
        print(type(data['start_time']))
        data['bet_id'] = uuid.uuid1()

        created_bet = BetSchema().load(data)
    # TODO: check validation errors
    except ValidationError as e:
        return json_response({'error': e.messages}, 422)
    db_insert = UserService(g.user).create_bet(created_bet)
    return json_response(db_insert)


@app.route('/bets/<int:bet_id>', methods=['GET'])
@login_required
def show_bet_info(bet_id):
    bet = UserService(g.user).find_bet(bet_id)
    if bet:
        return json_response(bet)
    else:
        return json_response({'error': 'bet not found'}, 404)


@app.route('/bets/<int:bet_id>', methods=['PUT'])
@login_required
def update_bet(bet_id):
    try:
        new_bet = BetSchema().load(json.loads(request.data))
    except ValidationError as e:
        return json_response({'error': e.messages}, 422)

    userservice = UserService(g.user)
    if userservice.update_bet(bet_id, new_bet):
        return json_response(new_bet)
    else:
        return json_response({'error': 'bet not found.'}, 404)


@app.route('/bet/<int:bet_id>', methods=['DELETE'])
@login_required
def delete_bet(bet_id):
    userservice = UserService(g.user)
    if userservice.delete_bet(bet_id):
        return json_response({})
    else:
        return json_response({'error': 'bet not found'}, 404)


@app.route('/groups/', methods=['GET'])
@login_required
def find_all_groups():
    # TODO
    return json_response({'error': 'not implemented'}, 501)
    pass
