import pytest
from ..crossword_clue import crossword_clue_wordplays_extract, crossword_clue_dictionary_extract

def test_crossword_clue_wordplays_extract():
	html = '<!DOCTYPE html><html lang="en"><title>largest sea creature Crossword Clue, Crossword Solver | Wordplays.com</title><div id="content" ><div id=app><div id=app-pad><h1>Crossword Solver</h1><div id=adwrap><table id=adwrap-table><tr><td colspan=3><table id="wordlists" class=\'wp-widget\' cellspacing=0><thead class=\'wp-widget-header\'><tr><th colspan=4><strong>Crossword Answers:largest sea creature</strong></th></tr></thead><tbody class=\'wp-widget-content\'><tr class=subtitle><td>RANK</td><td>ANSWER</td><td>&nbsp;CLUE</td><td>&nbsp;?</td></tr><tr class="odd"><td><div class=stars><div></div><div></div><div></div><div></div></div><div class=clear></div></td><td><a href="/crossword-clues/WHALE">WHALE</a></td><td class=clue>Largest sea mammal</td><td class=deflink-td></td></tr><tr class="even"><td><div class=stars><div></div><div></div><div></div></div><div class=clear></div></td><td><a href="/crossword-clues/WHELK">WHELK</a></td><td class=clue>Spiral-shelled sea creature</td><td class=deflink-td></td></tr></tbody></table></td></tr></table></div></div></div></div></html>'
	results = crossword_clue_wordplays_extract(html)
	assert len(results) == 2
	assert results[0].answer == 'WHALE'
	assert results[0].score == 0.8
	assert results[1].answer == 'WHELK'
	assert results[1].score == 0.6

def test_crossword_clue_dictionary_extract():
	html = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><body class="game-page"><div class="main-container"><div class="row"><div class="left-column"><div><div class="specific-content crossword-solver-results"><div class="inner-border"><h2 class="title">Try these answers for \'largest sea creature\'</h2><div class="result-row result-head"><div class="confidence">Confidence</div><div class="matching-answer">Matching Answer</div></div><div class="result-row"><div class="confidence">60%</div><div class="matching-answer">WHELK</div></div><div class="result-row"><div class="confidence">60%</div><div class="matching-answer">WHALE</div></div></div></div></div></div></div></div></body></html>'
	results = crossword_clue_dictionary_extract(html)
	assert len(results) == 2
	assert results[0].answer == 'WHELK'
	assert results[0].score == 0.6
	assert results[1].answer == 'WHALE'
	assert results[1].score == 0.6