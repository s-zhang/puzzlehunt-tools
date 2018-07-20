from ..dropquote import dropquote, dropquote_apply_word
from ..utils import dictionary
from ..utils.dictionary import Dictionary
import pytest

@pytest.yield_fixture(autouse=True)
def test_wrapper():
    dictionary.CURRENT_DICTIONARY = Dictionary("Collins Scrabble Words (2015)")
    yield

def test_dropquote():
    grid = ['....-', '..-..', '.....']
    letters = ['gor', 'afo', 'mn', 'ete', 'hs']
    snapshots = dropquote(grid, letters)

    assert len(snapshots) == 3

    assert snapshots[0].grid == ['....-', '..-..', '.....']
    assert snapshots[0].letters == ['gor', 'afo', 'mn', 'ete', 'hs']
    assert len(snapshots[0].words) == 3
    assert snapshots[0].words[2].letters == ['ete', 'hs', 'gor', 'afo', 'mn', 'ete', 'hs']
    assert snapshots[0].words[2].possibilities == ['thrones']

    assert snapshots[1].grid == ['....-', '..-th', 'rones']
    assert snapshots[1].letters == ['go', 'af', 'm', 'e', '']
    assert snapshots[1].words[0].letters == ['go', 'af', 'm', 'e']
    assert snapshots[1].words[0].possibilities == ['game']
    assert snapshots[1].words[1].letters == ['go', 'af']
    assert snapshots[1].words[1].possibilities == ['of']

    assert snapshots[2].grid == ['game-', 'of-th', 'rones']
    assert snapshots[2].letters == ['', '', '', '', '']

def test_dropquote_double_dash():
    grid = ['.....-', '-.....']
    letters = ['h', 'ew', 'lo', 'lr', 'ol', 'd']
    snapshots = dropquote(grid, letters)

    assert len(snapshots) == 2

    assert len(snapshots[0].words) == 2
    assert snapshots[0].words[0].index == 0
    assert snapshots[0].words[0].possibilities == ['hello']
    assert snapshots[0].words[1].index == 1
    assert snapshots[0].words[1].possibilities == ['world']

def test_dropquote_start_dash():
    grid = ['-.....-', '.....--']
    letters = ['w', 'ho', 'er', 'll', 'ld', 'o', '']
    snapshots = dropquote(grid, letters)

    assert len(snapshots) == 2

    assert len(snapshots[0].words) == 2
    assert snapshots[0].words[0].index == 0
    assert snapshots[0].words[0].possibilities == ['hello']
    assert snapshots[0].words[1].index == 1
    assert snapshots[0].words[1].possibilities == ['world']

    assert snapshots[1].grid == ['-hello-', 'world--']
    assert snapshots[1].words[0].index == 0
    assert snapshots[1].words[0].word == 'hello'
    assert snapshots[1].words[1].index == 1
    assert snapshots[1].words[1].word == 'world'

def test_dropquote_existing_word():
    grid = ['hello-', '.....-']
    letters = ['w', 'o', 'r', 'l', 'd', '']
    snapshots = dropquote(grid, letters)

    assert len(snapshots) == 2

    assert snapshots[1].grid == ['hello-', 'world-']
    assert len(snapshots[1].words) == 2
    assert snapshots[1].words[0].index == 0
    assert snapshots[1].words[0].word == 'hello'
    assert snapshots[1].words[1].index == 1
    assert snapshots[1].words[1].word == 'world'

def test_dropquote_apply_word():
    grid = ['....-', '..-..', '.....']
    letters = ['gor', 'afo', 'mn', 'ete', 'hs']
    grid, letters = dropquote_apply_word(grid, letters, 'thrones', 2)

    assert grid == ['....-', '..-th', 'rones']
    assert letters == ['go', 'af', 'm', 'e', '']

def test_dropquote_apply_word_existing_letters():
    grid = ['....-', '..-..', 'r...s']
    letters = ['go', 'afo', 'mn', 'ete', 'h']
    grid, letters = dropquote_apply_word(grid, letters, 'thrones', 2)

    assert grid == ['....-', '..-th', 'rones']
    assert letters == ['go', 'af', 'm', 'e', '']