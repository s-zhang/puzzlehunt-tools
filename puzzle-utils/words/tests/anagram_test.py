from ..anagram import anagram, anagram_multi
from ..utils import dictionary
from ..utils.dictionary import Dictionary
import pytest

@pytest.yield_fixture(autouse=True)
def test_wrapper():
	dictionary.CURRENT_DICTIONARY = Dictionary("google-10000-english-usa")
	yield

def test_anagram_with_wildcard():
	assert anagram("qi??") == ['ipaq', 'iraq', 'quit', 'quiz']

def test_anagram_multi():
	multi_anagrams = anagram_multi("irobot")
	assert ["robot", "i"] in multi_anagrams
	assert ["i", "robot"] not in multi_anagrams