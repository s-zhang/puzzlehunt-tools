from ..crossword_clue import crossword_clue, crossword_clue_multi

def test_crossword_clue():
	assert crossword_clue('largest sea creature', 'WH???') == ['WHALE', 'WHELK']

def test_crossword_clue_multi():
	assert crossword_clue_multi(['largest sea creature', 'the great white north'], ['WH???', '???ADA']) == [['WHALE', 'WHELK'], ['CANADA', 'MASADA']]