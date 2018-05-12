from anagram import anagram, anagram_multi
import utils.dictionary as dictionary_utils
from utils.dictionary import Dictionary

dictionary_utils.CURRENT_DICTIONARY = Dictionary("google-10000-english-usa")

def test_anagram_with_wildcard():
	assert anagram("qi??") == ['ipaq', 'iraq', 'quit', 'quiz']

def test_anagram_multi():
	multi_anagrams = anagram_multi("irobot")
	assert ["robot", "i"] in multi_anagrams
	assert ["i", "robot"] not in multi_anagrams