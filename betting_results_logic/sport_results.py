import sports


all_matches = sports.all_matches()

match = sports.get_match(sports.BASEBALL, 'Uni Lions', 'Rakuten Monkies')

def find_result(sport, team1, team2):
    pass

print(match.home_team, match.home_score)

# TODO: every hour, some task searches all scores and updates existing bets
# verify that match date is the same