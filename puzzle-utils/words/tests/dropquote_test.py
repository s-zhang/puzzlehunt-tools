from ..dropquote import DropQuoteSolver
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
    solver = DropQuoteSolver(grid, letters)
    solver.solve()
    snapshots = solver.snapshots

    assert len(snapshots) == 6

    assert snapshots[0].grid == ['....-', '..-..', '.....']
    assert snapshots[0].letters == ['gor', 'afo', 'mn', 'ete', 'hs']
    assert len(snapshots[0].words) == 3
    assert snapshots[0].words[2].letters == ['ete', 'hs', 'gor', 'afo', 'mn', 'ete', 'hs']
    assert snapshots[0].words[2].possibilities == ['thrones']

    assert snapshots[2].grid == ['....-', '..-th', 'rones']
    assert snapshots[2].letters == ['go', 'af', 'm', 'e', '']
    assert snapshots[2].words[0].letters == ['go', 'af', 'm', 'e']
    assert snapshots[2].words[0].possibilities == ['game']
    assert snapshots[2].words[1].letters == ['go', 'af']
    assert snapshots[2].words[1].possibilities == ['of']

    assert snapshots[5].grid == ['game-', 'of-th', 'rones']
    assert snapshots[5].letters == ['', '', '', '', '']

def test_dropquote_double_dash():
    grid = ['.....-', '-.....']
    letters = ['h', 'ew', 'lo', 'lr', 'ol', 'd']
    solver = DropQuoteSolver(grid, letters)
    solver.solve()
    snapshots = solver.snapshots

    assert len(snapshots) == 4

    assert len(snapshots[0].words) == 2
    assert snapshots[0].words[0].index == 0
    assert snapshots[0].words[0].possibilities == ['hello']
    assert snapshots[0].words[1].index == 1
    assert snapshots[0].words[1].possibilities == ['world']

def test_dropquote_start_dash():
    grid = ['-.....-', '.....--']
    letters = ['w', 'ho', 'er', 'll', 'ld', 'o', '']
    solver = DropQuoteSolver(grid, letters)
    solver.solve()
    snapshots = solver.snapshots

    assert len(snapshots) == 4

    assert len(snapshots[0].words) == 2
    assert snapshots[0].words[0].index == 0
    assert snapshots[0].words[0].possibilities == ['hello']
    assert snapshots[0].words[1].index == 1
    assert snapshots[0].words[1].possibilities == ['world']

    assert snapshots[3].grid == ['-hello-', 'world--']
    assert snapshots[3].words[0].index == 0
    assert snapshots[3].words[0].word == 'hello'
    assert snapshots[3].words[1].index == 1
    assert snapshots[3].words[1].word == 'world'

def test_dropquote_existing_word():
    grid = ['hello-', '.....-']
    letters = ['w', 'o', 'r', 'l', 'd', '']
    solver = DropQuoteSolver(grid, letters)
    solver.solve()
    snapshots = solver.snapshots

    assert len(snapshots) == 3

    assert snapshots[2].grid == ['hello-', 'world-']
    assert len(snapshots[2].words) == 2
    assert snapshots[2].words[0].index == 0
    assert snapshots[2].words[0].word == 'hello'
    assert snapshots[2].words[1].index == 1
    assert snapshots[2].words[1].word == 'world'

def test_dropquote_existing_letters():
    grid = ['....-', '..-..', 'r...s']
    letters = ['go', 'afo', 'mn', 'ete', 'h']
    solver = DropQuoteSolver(grid, letters)
    solver.apply_word('thrones', 2)

    assert solver.grid == ['....-', '..-th', 'rones']
    assert solver.letters == [['g', 'o'], ['a', 'f'], ['m'], ['e'], []]