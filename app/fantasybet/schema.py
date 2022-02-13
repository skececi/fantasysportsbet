from marshmallow import Schema, fields


class MatchSchema(Schema):
    match_id = fields.Int()
    sport = fields.Str()
    team1 = fields.Str()
    team2 = fields.Str()
    start_time = fields.DateTime()
    team1_odds = fields.Decimal()
    team2_odds = fields.Decimal()
    draw_odds = fields.Decimal()
    result = fields.Str()


class BetSchema(MatchSchema):
    bet_id = fields.Int(required=True)
    active = fields.Boolean()
    side_chosen = fields.Str()
    bet_amount = fields.Decimal()
    potential_payout = fields.Decimal()


class UserBetSchema(BetSchema):
    user_id = fields.Email(required=True)




