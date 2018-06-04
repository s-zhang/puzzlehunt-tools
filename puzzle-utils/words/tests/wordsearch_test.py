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
    assert wordsearch_reduce_sentence(grid, words) == 'SEELETTERSATINTERSECTIONSORENDSDRAWLINESBETWEENGUIDEDBYNONSENSEDRAWNEWLETTERSSPELLNEWWORD'

def assert_wordsearch_results(expectedResults, actualResults):
    for expectedResult in expectedResults:
        actualResult = next((x for x in actualResults if x.word == expectedResult.word), None)
        assert actualResult != None, expectedResult.word
        assert expectedResult.row == actualResult.row, expectedResult.word
        assert expectedResult.column == actualResult.column, expectedResult.word
        assert expectedResult.direction == actualResult.direction, expectedResult.word