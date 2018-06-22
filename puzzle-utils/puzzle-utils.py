from words.utils.dictionary import set_current_dictionary, PETER_NORVIG_IN_COLLINS, COLLINS_SCRABBLE_WORDS_2015, GOOGLE_10000_ENGLISH_USA
from words.anagram import anagram, anagram_multi
from words.crossword_clue import crossword_clue, crossword_clue_multi
from words.search import search
from words.wordsearch import wordsearch_find, wordsearch_brute, wordsearch_reduce, wordsearch_reduce_sentence
from words.dropquote import dropquote, dropquote_apply_word
from encoders.semaphore import semaphore, semaphore_multi
from encoders.caesar import independent_caesar, brute_caesar, caesar

# Sets up tab completion
import rlcompleter, readline
readline.parse_and_bind('tab:complete')

# Recommend to use this interactively by running
# >pipenv run python -i puzzle-utils.py

def main():
	"""
		Examples:
		>>> set_current_dictionary(GOOGLE_10000_ENGLISH_USA)
		>>> anagram("qi??")
		['ipaq', 'iraq', 'quit', 'quiz']
		>>> set_current_dictionary(PETER_NORVIG_IN_COLLINS)
		>>> anagram("qi??")
		['qadi', 'quai', 'cinq', 'quid', 'fiqh', 'quim', 'quin', 'quip', 'quit', 'quiz']
		>>> set_current_dictionary(COLLINS_SCRABBLE_WORDS_2015)
		>>> anagram("qi??")
		['qaid', 'qadi', 'quai', 'cinq', 'quid', 'fiqh', 'quim', 'qins', 'quin', 'quip', 'quit', 'quiz']
		>>> search("^t.st$")
		['test', 'tost']
		>>> anagram_multi("irobot")
		...
	"""
	return

if __name__ == '__main__':
	main()
