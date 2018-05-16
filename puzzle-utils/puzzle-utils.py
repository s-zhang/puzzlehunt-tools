import words.arg_parser
import words.utils.dictionary
from words.utils.dictionary import Dictionary
from words.anagram import anagram, anagram_multi
from words.search import search

# Recommend to use this interactively by running
# >python -i puzzle-utils.py

def main():
	"""
		Examples:
		words.utils.dictionary.CURRENT_DICTIONARY = Dictionary("google-10000-english-usa")
		words.utils.dictionary.CURRENT_DICTIONARY = Dictionary("Peter Norvig in Collins")
		print(anagram("qi??"))
		print(anagram_multi("irobot"))
		print(search("^t.st$"))
	"""
	return

if __name__ == '__main__':
	main()
