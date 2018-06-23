from ..dropquote import dropquote
from ..utils import dictionary
from ..utils.dictionary import Dictionary
import pytest

@pytest.yield_fixture(autouse=True)
def test_wrapper():
    dictionary.CURRENT_DICTIONARY = Dictionary("Collins Scrabble Words (2015)")
    yield

def test_dropquote():
    grid = ['    -', '  -  ', '     ']
    letters = ['gor', 'afo', 'mn', 'ete', 'hs']
    snapshots = dropquote(grid, letters)

    assert len(snapshots) == 3

    assert snapshots[0].grid == ['    -', '  -  ', '     ']
    assert snapshots[0].letters == ['gor', 'afo', 'mn', 'ete', 'hs']
    assert len(snapshots[0].words) == 3
    assert snapshots[0].words[2].letters == ['ete', 'hs', 'gor', 'afo', 'mn', 'ete', 'hs']
    assert snapshots[0].words[2].words == ['thrones']

    assert snapshots[1].grid == ['    -', '  -th', 'rones']
    assert snapshots[1].letters == ['go', 'af', 'm', 'e', '']
    assert len(snapshots[1].words) == 2
    assert snapshots[1].words[0].letters == ['go', 'af', 'm', 'e']
    assert snapshots[1].words[0].words == ['game']
    assert snapshots[1].words[1].letters == ['go', 'af']
    assert snapshots[1].words[1].words == ['of']

    assert snapshots[2].grid == ['game-', 'of-th', 'rones']
    assert snapshots[2].letters == ['', '', '', '', '']
    assert len(snapshots[2].words) == 0