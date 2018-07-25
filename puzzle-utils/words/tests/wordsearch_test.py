from ..wordsearch import wordsearch_find, wordsearch_brute, wordsearch_reduce_sentence, WordSearchResult
from ..utils import dictionary
from ..utils.dictionary import Dictionary
import pytest

@pytest.yield_fixture(autouse=True)
def test_wrapper():
    dictionary.CURRENT_DICTIONARY = Dictionary("Collins Scrabble Words (2015)")
    yield

grid = [
    'MESSAGESEEL',
    'EATTERSATIN',
    'TENRSECTION',
    'SORIENDSDRA',
    'WLNIFNESBEL',
    'TTWEEENGUEL',
    'OIDEDBSYTNI',
    'OPNSENSTEDF',
    'RAEWNEEWILE',
    'TTENRRSSPNE',
    'LLNESWWORDG'
]
words = ['opens', 'message', 'manifesting', 'into', 'fill', 'letters']

expectedResults = [
    WordSearchResult('opens', 6, 0, 'se'),
    WordSearchResult('message', 0, 0, 'e'),
    WordSearchResult('manifesting', 0, 0, 'se'),
    WordSearchResult('into', 3, 3, 'sw'),
    WordSearchResult('fill', 7, 10, 'n'),
    WordSearchResult('letters', 4, 10, 'sw'),
]

def test_wordsearch_find():
    actualResults = wordsearch_find(grid, words)
    assert len(expectedResults) == len(actualResults)
    assert_wordsearch_results(expectedResults, actualResults)

def test_wordsearch_brute():
    assert_wordsearch_results(expectedResults, wordsearch_brute(grid, 4))
    
def test_wordsearch_reduce_sentence():
    assert wordsearch_reduce_sentence(grid, words) == 'seelettersatintersectionsorendsdrawlinesbetweenguidedbynonsensedrawnewlettersspellnewword'

def test_wordsearch_irregular():
    grid = [
        ['P',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','CAT'],
        ['E','L',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','CAT','E'],
        ['S','A','CAT',' ',' ',' ',' ',' ',' ',' ',' ',' ','I','T','CAT'],
        ['CAT','R','S','CAT',' ','T','CAT','H','CAT','CAT',' ','CAT','R','E','I'],
        ['A','D','E','O','CAT','CAT','C','E','L','A','S','O','CAT','C','D'],
        ['R','E','CAT','P','CAT','K','I','CAT','N','CAT','L','U','T','H','N'],
        ['I','H','CAT','A','I','CAT','E','U','G','M','O','L','P','R','I'],
        ['A','CAT','N','CAT','P','Z','CAT','D','O','I','N','CAT','O','E','G'],
        ['N','B','CAT','CAT','A','U','Z','E','L','CAT','N','D','T','CAT','H'],
        ['E','I','F','O','CAT','O','L','I','A','D','CAT','B','O','I','E'],
        ['CAT','F','W','CAT','L','CAT','CAT','T','CAT','I','CAT','CAT','CAT','L','CAT'],
        ['CAT','U','CAT','H','S','E','CAT','E','CAT','O','V','D','A','P','M'],
        ['P','R','V','A','CAT','I','O','N','N','O','L','H','CAT','E','D'],
        [' ','CAT','T','R','Y','CAT','H','T','S','Y','L','A','CAT','R'],
        [' ','E','CAT','S','CAT','CAT','E','CAT','I','D','E','D','U','CAT'],
        [' ',' ','CAT','I','M','CAT','A','N','CAT','W','CAT','A','K'],
        [' ',' ',' ','S','CAT','B','M','O','C','A','CAT','E'],
        [' ',' ',' ',' ',' ','CAT','CAT','U','P','CAT']
    ]

    words = [
        'pescatarian',
        'allocate',
        'catapult',
        'pizzicato',
        'indicate',
        'cathedral',
        'bifurcate',
        'educate',
        'catharsis',
        'catalog',
        'advocate',
        'vacation',
        'decathlon',
        'catalyst',
        'replicate',
        'dedicate',
        'catacomb',
        'catsup'
    ]

    result = wordsearch_reduce_sentence(grid, words)
    result = result.replace('cat', '')
    assert 'itsthreeoclockinthemorningandthefoodbowlisemptyhumanwakeup' == result


def assert_wordsearch_results(expectedResults, actualResults):
    for expectedResult in expectedResults:
        actualResult = next((x for x in actualResults if x.word == expectedResult.word), None)
        assert actualResult != None, expectedResult.word
        assert expectedResult.row == actualResult.row, expectedResult.word
        assert expectedResult.column == actualResult.column, expectedResult.word
        assert expectedResult.direction == actualResult.direction, expectedResult.word